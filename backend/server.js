const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));



app.use(express.json());

const SECRET_KEY = 'supersecret123';

// ✅ Simulated user database
const users = [
  {
    id: 1,
    email: 'test@example.com',
    password: bcrypt.hashSync('password123', 10)
  }
];

// ✅ Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email, password });

  const user = users.find((u) => u.email === email);
  if (!user) {
    console.log('❌ User not found');
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const match = bcrypt.compareSync(password, user.password);
  console.log('Password match:', match);

  if (!match) {
    console.log('❌ Password mismatch');
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: '1h'
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email
    }
  });
});

app.get('/api/check-auth', (req, res) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const user = users.find(u => u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      res.json({ user: { id: user.id, email: user.email } });
    } catch (err) {
      console.error('Token verification failed:', err);
      res.status(401).json({ message: 'Invalid token' });
    }
  });
app.listen(5000, () => {
  console.log('Auth server running on http://localhost:5000');
});