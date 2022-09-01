const express = require('express');

const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const todoRouter = require('./routes/todoRoutes');

const app = express();

// 1) MIDDLEWARES

app.use(express.json()); // This will transform all requests to json so we can access req.body directly

// ROUTERS

app.use('/api/v1/users', userRouter);
app.use('/api/v1/todos', todoRouter);

app.use(globalErrorHandler); // This is handling all the errors we throw from the next() on the middlewares, as well as the catch blocks.

// START THE SERVER
module.exports = app;
