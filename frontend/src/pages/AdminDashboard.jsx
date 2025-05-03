import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch data based on admin role (SDA/PDA/T1)
  useEffect(() => {
    const fetchData = async () => {
      if (user?.role === 'PDA') {
        const res = await axios.get('/api/admin/orders');
        setOrders(res.data.orders);
      }
      if (user?.role === 'SDA') {
        const res = await axios.get('/api/admin/products');
        setProducts(res.data.products);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div>
      {user?.role === 'PDA' && (
        <div>
          <h3>Pending Orders</h3>
          {orders.map(order => (
            <div key={order._id}>
              Order #{order._id} - Status: {order.status}
            </div>
          ))}
        </div>
      )}

      {user?.role === 'SDA' && (
        <div>
          <h3>Product Management</h3>
          {products.map(product => (
            <div key={product._id}>
              {product.name} - ${product.price}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;