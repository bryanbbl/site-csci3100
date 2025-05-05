const express = require('express');
const bodyParser = require('body-parser');
const data = require('./data');  // Load your demo data

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// API Routes based on your _routes object
// We'll handle /api/* endpoints
app.use('/api', (req, res, next) => {
  const path = req.path;  // e.g., /users
  req.demoData = data;  // Attach data to request for access in routes
  next();
});

// Users Routes
app.get('/users', (req, res) => {
  res.json(req.demoData.users);
});

app.post('/users', (req, res) => {
  const newUser = req.body;  // Expect { id, name, etc. }
  if (!newUser.id || !newUser.name) {
    return res.status(400).json({ error: 'User must have id and name' });
  }
  req.demoData.users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedUser = req.body;
  const index = req.demoData.users.findIndex(user => user.id === id);
  if (index !== -1) {
    req.demoData.users[index] = { ...req.demoData.users[index], ...updatedUser };
    res.json(req.demoData.users[index]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = req.demoData.users.findIndex(user => user.id === id);
  if (index !== -1) {
    req.demoData.users.splice(index, 1);
    res.status(204).send();  // No content
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Products Routes
app.get('/products', (req, res) => {
  res.json(req.demoData.products);
});

app.post('/products', (req, res) => {
  const newProduct = req.body;  // Expect { id, name, price, description, image }
  if (!newProduct.id || !newProduct.name) {
    return res.status(400).json({ error: 'Product must have id and name' });
  }
  req.demoData.products.push(newProduct);
  res.status(201).json(newProduct);
});

// Carts Routes (Simple example)
app.get('/carts', (req, res) => {
  res.json(req.demoData.carts);
});

app.post('/carts', (req, res) => {
  const newCart = req.body;  // Expect an array of product IDs or similar
  req.demoData.carts.push(newCart);
  res.status(201).json(newCart);
});

// Orders Routes
app.get('/orders', (req, res) => {
  res.json(req.demoData.orders);
});

app.post('/orders', (req, res) => {
  const newOrder = req.body;  // Expect { id, products, total, etc. }
  req.demoData.orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Licenses Routes
app.get('/licenses', (req, res) => {
  res.json(req.demoData.licenses);
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
