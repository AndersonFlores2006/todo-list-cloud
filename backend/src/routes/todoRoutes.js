const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const todoController = require('../controllers/todoController');

router.use(auth);

router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router; 