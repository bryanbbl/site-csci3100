const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const JWT_SECRET = 'your_jwt_secret_key';

app.use(cors());
app.use(bodyParser.json());

// Mock user database
const users = [
  {
    
    _id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    passwordHash: bcrypt.hashSync('password123', 10), // hashed password
  },
];

const carts = {
    1: [
      { productId: 'abc123', name: 'Product A', quantity: 2 },
      { productId: 'xyz789', name: 'Product B', quantity: 1 },
    ],
  };
  
// LOGIN route
app.post('/api/login', async (req, res) => {
    
  const { email, password } = req.body;

  // Find user by email
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Generate JWT
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });

  // Return token and user info
  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

// Auth check route (used by frontend on initial load)
app.get('/api/check-auth', (req, res) => {
    
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
   
    const user = users.find((u) => u._id === decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});
app.get('/api/cart/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const cart = carts[userId];
  
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
  
    res.json(cart);
  });
app.get('/', (req, res) => {
    res.send('API is running 🚀');
  });
// Stanrt server
app.listen(5001, () => {
  console.log(`Server running on http://localhost:5001`);
});