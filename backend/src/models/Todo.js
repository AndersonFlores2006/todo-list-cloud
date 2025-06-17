const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  priority: { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
  tags: { type: [String], default: [] }
});

module.exports = mongoose.model('Todo', todoSchema); 