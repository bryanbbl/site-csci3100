import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users
  useEffect(() => {
    if (user) {
      navigate('/products');
    }
  }, [user, navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Gemstone Shopping</h1>
      <p>Your premier destination for rare gemstones</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Get Started</h3>
        <button onClick={() => navigate('/login')} style={{ margin: '0.5rem' }}>
          Login
        </button>
        <button onClick={() => navigate('/register')} style={{ margin: '0.5rem' }}>
          Register
        </button>
      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
        <h4>License Requirement</h4>
        <p>
          To register an account, you must have a valid license code in AAAA-BBBB-CCCC-DDDD format.
          Contact administrators for license acquisition.
        </p>
      </div>
    </div>
  );
}

export default Home;