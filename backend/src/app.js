const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const listRoutes = require('./routes/listRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/lists', listRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API To-Do List funcionando (Node.js)' });
});

module.exports = app; 