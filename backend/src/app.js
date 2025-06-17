const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const listRoutes = require('./routes/listRoutes');

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://todo-frontend-278833805240.us-central1.run.app', // Tu frontend en producción
  'http://localhost:3000'        // Opcional: para pruebas locales
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/lists', listRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API To-Do List funcionando (Node.js)' });
});

module.exports = app; 