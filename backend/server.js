const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'supersecret123';

// Simulated user database
const users = [
  {
    id: 1,
    email: 'test@example.com',
    password: bcrypt.hashSync('password123', 10)
  }
];

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

app.listen(5000, () => {
  console.log('Auth server running on http://localhost:5000');
});