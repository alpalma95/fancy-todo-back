const Todo = require('../models/todoModel');

exports.getAllTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ owner: req.user._id }); //when user is logged in, we take the id from the request object (that we pass in the protected route) and filter by that field

    res.status(200).json({
      status: 'success',
      results: todos.length,
      data: {
        todos,
      },
    });
  } catch (err) {
    next(new Error(err.message));
  }
};

exports.createTodo = async (req, res, next) => {
  console.log(req.body);
  try {
    const newTodo = await Todo.create({
      uid: req.body.uid,
      text: req.body.text,
      owner: req.user._id,
    });

    res.status(200).json({
      status: 'success',
      data: {
        newTodo,
      },
    });
  } catch (err) {
    next(new Error(err.message));
  }
};

exports.deleteCompleted = async (req, res, next) => {
  try {
    await Todo.deleteMany({ owner: req.user._id, finished: true });

    res.status(204).json({
      status: 'success',
      message: 'Todos deleted',
    });
  } catch (err) {
    next(new Error(err.message));
  }
};

exports.changeFinishedStatus = async (req, res, next) => {
  console.log(req.params);
  try {
    const todo = await Todo.findOneAndUpdate({ uid: req.params.uid }, req.body);
    console.log(todo);

    res.status(200).json({
      status: 'success',
      data: {
        todo,
      },
    });
  } catch (err) {
    next(new Error(err.message));
  }
};
