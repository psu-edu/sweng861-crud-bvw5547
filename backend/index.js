// Entry point for SWENG 861 CRUD project

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World! SWENG 861 CRUD API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
