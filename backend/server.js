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
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    passwordHash: bcrypt.hashSync('password123', 10), // hashed password
  },
];

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
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });

  // Return token and user info
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

// Auth check route (used by frontend on initial load)
app.get('/api/check-auth', (req, res) => {
    
  const authHeader = req.headers.authorization;
  console.log('🔐 Auth header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔑 Token:', token);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Decoded JWT:', decoded);
    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/', (req, res) => {
    res.send('API is running 🚀');
  });
// Stanrt server
app.listen(5001, () => {
  console.log(`Server running on http://localhost:5001`);
});