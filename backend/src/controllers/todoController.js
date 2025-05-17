const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.json(todos);
};

exports.createTodo = async (req, res) => {
  const { title } = req.body;
  const todo = await Todo.create({ user: req.user.id, title });
  res.status(201).json(todo);
};

exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todo = await Todo.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { title, completed },
    { new: true }
  );
  if (!todo) return res.status(404).json({ message: 'Tarea no encontrada' });
  res.json(todo);
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findOneAndDelete({ _id: id, user: req.user.id });
  if (!todo) return res.status(404).json({ message: 'Tarea no encontrada' });
  res.json({ message: 'Tarea eliminada' });
}; 