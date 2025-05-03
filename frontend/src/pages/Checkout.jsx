import { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

function Checkout() {
  const { cart } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  // Apply discount (Matches FR03.4.2)
  const applyDiscount = async () => {
    try {
      await axios.post('/api/apply-discount', {
        code: discountCode,
        userId: user._id
      });
      alert('Discount applied!');
    } catch (err) {
      alert(err.response?.data?.error || 'Invalid discount code');
    }
  };

  // Submit order (Matches FR03.4)
  const submitOrder = async () => {
    try {
      const res = await axios.post('/api/checkout', {
        userId: user._id,
        cartItems: cart,
        paymentMethod
      });
      alert(`Order placed! ID: ${res.data.orderId}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Checkout failed');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <div className="order-summary">
        {cart.map(item => (
          <div key={item._id}>
            {item.name} x{item.quantity} - ${item.price}
          </div>
        ))}
      </div>

      <input 
        type="text" 
        placeholder="Discount code"
        onChange={(e) => setDiscountCode(e.target.value)}
      />
      <button onClick={applyDiscount}>Apply Discount</button>

      <select onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="credit-card">Credit Card</option>
        <option value="paypal">PayPal</option>
      </select>

      <button onClick={submitOrder}>Place Order</button>
    </div>
  );
}

export default Checkout;