## Initializing express

On the terminal:

npm init
npm i express@4
touch app.js
code app.js

- On app.js, create the express variable **at the very top**:

```javascript
const express = require('express');
```

- Then, create the app variable where we call express

```javascript
const app = express();
```

- At the bottom of app.js, we declare the port and use the express module "app listen", similar as we do with Flask

```javascript
const port = 3000;
app.listen(port, () => {
  console.log('App running on port 3000');
});
```

We can finally initialize the server in the terminal with `nodemon app.js` (which we can install via npm).

## Defining routes:

We can now access the app object for the routes. This is very similar to Flask, where we use `app.route('path', methods) \n def funct()`

- #### Get:

  ```javascript
  app.get('path', (req, res) => {
    //do whatever you want, for instance:
    res.status(200).json({
      object: object,
    }); //this will send the info in json format, similar to jsonify in Flask
  });
  ```

- #### Post:

  - In order to convert the JSON body to a proper JS object, we need to import the express JSON middleware: `app.use(express.json())`

  ```javascript
  app.post('path', (req, res) => {
    // Since we have defined the middleware for dealing with the json format of the request, we can access the body to retrieve the data from the request:

    console.log(req.body); //this should log a proper javascript object. We could even specify req.body["key"] to retrieve a specific value from the body, as we do in Flask

    res.status(200).send('Ok'); //Like in Flask, always "return" a response with status. In the same way we cannot have two returns, we cannot have 2 sends either.
  });
  ```

- #### Patch:

```javascript
app.patch('path/:id', (req, res) => {});
```

- #### Delete:

```javascript
app.delete('path/:id', (req, res) => {});
```

- Mind that it's a better practice to keep those callback functions into separate functions.
- Also, we should define this structure for the routes:
  ```javascript
  app.route('/api/v1/tours').get(function).post(function).delete(function).patch(function)
  ```

## Extracting parameters from url

On the get endpoint, we need to specify the parameter with a colon: "/api/url/:id", almost in the same way that we use <int:id> in Flask (mind that since this is JS we don't need to specify the datatype).

To access them, we access almost in the same way as we do in React Router, by using "params". Then, `req.params` will give us an object with the key value pairs that we can use.

- "/path/:param" = the parameter is mandatory
- "/path/:param?" = the parameter is optional.

  It should look something like this:

```javascript
  {
    id: "id",
    secondParam: "whatever",
    optional: undefined //if we set it to be optional
  }
```

```javascript
app.get('/api/v1/tours/:id', (req, res) => {
  const tour = tours.find((x) => (x.id = req.params.id));

  res.status(200).json({
    status: 'success',
    data: {
      tour, //this is the tour with id number 1
    },
  });
});
```

- ## Middlewares

  It's a function that is executed for processing the request and the response.

  To use middleware, we use `app.use()` with a callback function inside. All middlewares will be executed as they appear in the code; and will later call the next middleware. Hence, we have access to:

  - req (as always)
  - res (as always)
  - next: this will execute the next middleware. If we forget to call it, the next middleware won't be executed, the execution thread will be broken and the user won't get a response.

  In the very last middleware, we send the data to the user.

  Request arrives -> it's processed by all the middlewares with use() -> response gets send with the last middleware we specified in the route.

  In other words, middleware declared with use() will affect **all** requests.

  We can also access the specific request parameters by using

  router.param('param', (req, res, next, val) => {
  //val would be "param"

  - #### Using third party middleware
    We must simply install it with npm (--save-dev if we want it to be a dev dependency) and require it on top of the file. We can then use it following the documentation.
    We can check expressjs.com/en/resources/middleware to see which middlewares are recommended by express.

  ```

  ```

- ## Mounting routers

  In order to avoid repetition of the routes, we can "mount" our routes using the express module.

  - We firstly create a router element:
    ` const myRouter = express.Router();`

  - We can then use it to mount our own routes. We must think of this as a middleware (coz in fact it is a middleware):
    ` app.use('/path/', myRouter)`

    - When the request is received by the server, the program will look at all the middlewares. When it arrives to this one, it will notice that the request url matches the one we have specified in the path parameter of the Router and will call myRouter.

  - In the moment this is read, myRouter will become kind of equal to app, just, for the `.route()` method we only need to specify whether it is the "root" or if it has any additional parameters:

  ```javascript
  app.route('/my/whole/path/');
  ```

  will become

  ```javascript
  myRouter.route('/');
  ```

- ## A better files structure

  - Root folder:
    app.js: everything related to express (middlewares and routers) will be here

    server.js: everything related to the server, including the listening itself, will be here.

    - routes folder:
      - routes.js : here we should have the routes
    - controllers folder:

      - controllers.js : here we should have the functions that are triggered when a specific endpoint is hit

    - #### Recap of the request flow:
      1. Request enters the server from the client
      2. All middlewares specified in app.js will be applied to that request, also the ones that specifies the router it belongs to.
      3. When it hits a specific path, it will look into to the router we've mounted, that we import from routes/myRoute.js
      4. On myRoute.js, the request will look into the route we specified and will see the request method to execute the designated callback function /controller that we've imported from controllers/myrouteController. This will finally send a response to the client.

- ## Env variables:
  - We can access the env variables with process.env
  - In order to configure our own environmental variables, we can actually do it from the same terminal. But the best way of doing it:
    - npm i dotenv
    - in our server.js, require dotenv
      -> we can then access process.env in all the files, even though we just declared it on server.js
    - create a file called config.env, where we can write our own variables
    - we can now use `dotenv.config({path: "./config.env})` on top of the files BEFORE CALLING APP

## Configure ESlint and prettier:

npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-
react

## MONGO DB

- It's document based: stores data in dcoduments (field-value pair data structures like json), instead of in tables
- Built in scalability
- Flexibility: no need to create a document data schema (models in SQLAlchemy)
- We can install it following Microsoft's instructions
- Cheatsheet: https://gist.github.com/codeSTACKr/53fd03c7f75d40d07797b8e4e47d78ec

  - #### Initialize mongodb:

    - New terminal, we type `sudo mongod --dbpath ~/data/db` and keep it open
    - New terminal tab, we just type `mongo`.

  - #### Create database:

    - use dbname (this also works for using an existing db)

  - #### Create a collection:
    - db.dbname.collectionname.insertOne({ javascript: object })

- # User authentication

```javascript
userSchema.pre('save', async function (next) {
  // ONLY RUN THIS FUNCTIONN IF PASSWORD WAS MODIFIED OR CREATED
  if (!this.isModified('password')) return next();

  // hash the password with code 12
  this.password = await bcrypt.hash(this.password, 12); // THIS IS A PROMISE!!
  //delete password confirm field
  this.passwordConfirm = undefined;
  next();
});
```

- so password can be encrypted right before it's saved (created new or patched)
- we use bcrypt, which we install `npm i bcriptjs`

  - ## JWT:
    - npm i jsonwebtoken
    - we use jwt.sign() to create the token:
      jwt.sign({ id: newUser.\_id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      }); -> we can use this line to generate the token on signup.
    - to create token for login:
