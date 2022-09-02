const express = require('express');
const todoController = require('../controllers/todoController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, todoController.getAllTodos)
  .post(authController.protect, todoController.createTodo)
  .delete(authController.protect, todoController.deleteCompleted);
router
  .route('/:uid')
  .patch(authController.protect, todoController.changeFinishedStatus);

module.exports = router;
