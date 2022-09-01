const express = require('express');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;

const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const todoRouter = require('./routes/todoRoutes');

const app = express();

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log(err));

// 1) MIDDLEWARES

app.use(express.json()); // This will transform all requests to json so we can access req.body directly
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-type, Accept'
  );
  next();
});

// ROUTERS

app.use('/api/v1/users', userRouter);
app.use('/api/v1/todos', todoRouter);

app.use(globalErrorHandler); // This is handling all the errors we throw from the next() on the middlewares, as well as the catch blocks.

// START THE SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App running on port 3000');
});

module.exports = app;
