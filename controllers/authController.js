const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = async (req, res, next) => {
  // We need to specify this when creating users (instead of directly passing the req.body as an object) so users can't set themselves as admins. Even if they send the admin role set to true, we won't store this. For setting users as admins, we can do it manually on Compass
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(new Error(err.message));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //1) check if email and password exist
    if (!email || !password) {
      return next(new Error('Please provide email and password!'));
    }
    //2) check if user exists and user is correct
    const user = await User.findOne({ email: email }).select('+password'); //we have to manually select the password field because we set it select: false in the model
    //  check if password and hashed match in the model

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new Error('Incorrect email or password'));
    }
    //3) if everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    next(new Error(err.message));
  }
};

exports.protect = async (req, res, next) => {
  // Add this as a middleware to any protected route
  try {
    let token;
    const auth = req.headers.authorization;
    // 1) Getting token and check if it exists
    if (auth && auth.startsWith('Bearer')) {
      token = auth.split(' ')[1];
    }
    if (!token) {
      return next(
        new Error('You are not logged in. Please log in to get access')
      );
    }
    // 2) Verification of the token (same as the jwt.io verification page)
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //we create a promise with this, remember to require the module at the top
    req.userID = decoded.id; //this will add the user ID to the request, so we can access it from the controller

    // 3) Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) return next(new Error('The user no longer exists!'));
    // 4) Check if user changed password after the token was issued

    if (freshUser.changedPasswordAfter(decoded.iat))
      return next(
        new Error('User recently changed password. Please log in again')
      );

    req.user = freshUser; //this will add the user ID to the request, so we can access it from the controller
    next(); // if all steps exists, next will be executed getting then the tours
  } catch (err) {
    next(new Error(err.message));
  }
};
