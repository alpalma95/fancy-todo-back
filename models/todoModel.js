const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  uid: {
    type: String,
    unique: [true, 'Ids must be unique'],
  },
  text: {
    type: String,
    minLength: [1, 'Todos cannot be empty'],
  },
  finished: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: String,
  },
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
