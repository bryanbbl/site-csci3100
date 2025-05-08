const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Enable CORS for frontend origin BEFORE routes
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// ✅ Handle preflight requests (OPTIONS method)
app.options('/*any', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// ✅ Parse JSON request bodies
app.use(express.json());

// ✅ Sample login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Dummy login logic
  if (email === 'user@example.com' && password === 'password123') {
    return res.json({
      user: { id: 1, name: 'Test User', email },
      token: 'abc123',
    });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

// ✅ Start server
app.listen(5000, () => {
  console.log('✅ Server running at http://localhost:5000');
});