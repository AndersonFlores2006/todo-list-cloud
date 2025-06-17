const List = require('../models/List');
const Todo = require('../models/Todo');

exports.getLists = async (req, res) => {
  const lists = await List.find({ user: req.user.id });
  res.json(lists);
};

exports.createList = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'El nombre es requerido' });
  const exists = await List.findOne({ user: req.user.id, name });
  if (exists) return res.status(400).json({ message: 'Ya existe una lista con ese nombre' });
  const list = await List.create({ user: req.user.id, name });
  res.status(201).json(list);
};

exports.deleteList = async (req, res) => {
  const { id } = req.params;
  const list = await List.findOneAndDelete({ _id: id, user: req.user.id });
  if (!list) return res.status(404).json({ message: 'Lista no encontrada' });
  // Eliminar todas las tareas asociadas a esta lista
  await Todo.deleteMany({ list: id, user: req.user.id });
  res.json({ message: 'Lista y tareas asociadas eliminadas' });
};

exports.updateList = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'El nombre es requerido' });
  const exists = await List.findOne({ user: req.user.id, name, _id: { $ne: id } });
  if (exists) return res.status(400).json({ message: 'Ya existe una lista con ese nombre' });
  const list = await List.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { name },
    { new: true }
  );
  if (!list) return res.status(404).json({ message: 'Lista no encontrada' });
  res.json(list);
}; 