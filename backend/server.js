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

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: '1h'
  });

  res.json({ token });
});

app.listen(5000, () => {
  console.log('Auth server running on http://localhost:5000');
});