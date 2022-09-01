const express = require('express');
const todoController = require('../controllers/todoController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(todoController.getAllTodos)
  .post(todoController.createTodo)
  .delete(todoController.deleteCompleted);
router
  .route('/:id')
  .patch(authController.protect, todoController.changeFinishedStatus);

module.exports = router;
