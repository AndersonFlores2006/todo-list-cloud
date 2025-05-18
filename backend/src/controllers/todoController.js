const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).populate('list');
  res.json(todos);
};

exports.createTodo = async (req, res) => {
  const { title, list, priority, tags } = req.body;
  const todo = await Todo.create({ user: req.user.id, title, list, priority, tags });
  res.status(201).json(await todo.populate('list'));
};

exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed, list, priority, tags } = req.body;
  const todo = await Todo.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { title, completed, list, priority, tags },
    { new: true }
  ).populate('list');
  if (!todo) return res.status(404).json({ message: 'Tarea no encontrada' });
  res.json(todo);
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findOneAndDelete({ _id: id, user: req.user.id });
  if (!todo) return res.status(404).json({ message: 'Tarea no encontrada' });
  res.json({ message: 'Tarea eliminada' });
}; 