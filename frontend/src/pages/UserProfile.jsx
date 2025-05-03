import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function UserProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [licenses, setLicenses] = useState([]);
  const [newLicense, setNewLicense] = useState('');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  // Fetch user data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [licRes, orderRes] = await Promise.all([
          axios.get(`/api/users/${user._id}/licenses`),
          axios.get(`/api/users/${user._id}/orders`)
        ]);
        setLicenses(licRes.data.licenses);
        setOrders(orderRes.data.orders);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    if (user) fetchData();
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${user._id}`, formData);
      alert('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  // Add new license
  const addLicense = async () => {
    if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(newLicense)) {
      return setError('Invalid license format');
    }
    try {
      await axios.post('/api/licenses', {
        userId: user._id,
        licenseKey: newLicense
      });
      setLicenses([...licenses, { key: newLicense, status: 'active' }]);
      setNewLicense('');
    } catch (err) {
      setError(err.response?.data?.error || 'License activation failed');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h2>User Profile</h2>

      {/* Profile Update Form */}
      <form onSubmit={handleProfileUpdate} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Username:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>New Password:</label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            style={{ width: '100%' }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Update Profile</button>
      </form>

      {/* License Management */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>License Keys</h3>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={newLicense}
            onChange={(e) => setNewLicense(e.target.value.toUpperCase())}
            placeholder="Enter new license (AAAA-BBBB-CCCC-DDDD)"
            style={{ flexGrow: 1 }}
          />
          <button onClick={addLicense}>Add License</button>
        </div>
        <ul>
          {licenses.map((license, index) => (
            <li key={index}>
              {license.key} - {license.status}
            </li>
          ))}
        </ul>
      </div>

      {/* Order History */}
      <div>
        <h3>Order History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd' }}>Order ID</th>
              <th style={{ border: '1px solid #ddd' }}>Date</th>
              <th style={{ border: '1px solid #ddd' }}>Total</th>
              <th style={{ border: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={{ border: '1px solid #ddd' }}>{order._id}</td>
                <td style={{ border: '1px solid #ddd' }}>
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td style={{ border: '1px solid #ddd' }}>${order.total}</td>
                <td style={{ border: '1px solid #ddd' }}>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserProfile;