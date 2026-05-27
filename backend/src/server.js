require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// IMPORTANT : export seulement
module.exports = app;
