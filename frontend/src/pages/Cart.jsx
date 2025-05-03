import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { useState } from 'react';

function Cart() {
  const { cart, setCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

  // Update quantity in cart
  const updateQuantity = async (productId, newQuantity) => {
    try {
      await axios.put('/api/cart/update', {
        userId: user._id,
        productId,
        quantity: newQuantity
      });
      // Refresh cart data
      const res = await axios.get(`/api/cart/${user._id}`);
      setCart(res.data.cart);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update quantity');
    }
  };

  // Calculate total price
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h2>Your Shopping Cart</h2>
      
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item._id} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem',
              borderBottom: '1px solid #eee',
              paddingBottom: '1rem'
            }}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '100px', marginRight: '1rem' }}
              />
              <div style={{ flexGrow: 1 }}>
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span style={{ margin: '0 1rem' }}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.productId)}
                style={{ color: 'red' }}
              >
                Remove
              </button>
            </div>
          ))}

          <div style={{ marginTop: '2rem', textAlign: 'right' }}>
            <h3>Total: ${total.toFixed(2)}</h3>
            <button 
              onClick={() => navigate('/checkout')}
              style={{ padding: '0.5rem 2rem' }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;