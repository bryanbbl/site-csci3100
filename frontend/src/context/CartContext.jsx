import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Fetch cart on login (Matches FR03.2)
  // useEffect(() => {
  //   if (user) {
  //     const fetchCart = async () => {
  //       const res = await axios.get(`/api/cart/${user._id}`);
  //       setCart(res.data.cart);
  //     };
  //     fetchCart();
  //   }
  // }, [user]);

  // Add to cart (Matches FR03.2.2)
  const addToCart = async (productId, quantity) => {
    try {
      const res = await axios.post('/api/cart/add', {
        userId: user._id, 
        productId, 
        quantity
      });
      setCart(res.data.cart);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to add to cart');
    }
  };

  // Remove from cart (Matches FR03.2.3)
  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete('/api/cart/remove', {
        data: { userId: user._id, productId }
      });
      setCart(res.data.cart);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to remove item');
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);