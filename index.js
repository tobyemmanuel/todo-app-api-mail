require('dotenv').config()
const port = process.env.PORT;
//load all dependencies
const express = require("express");
const nodemailer = require('nodemailer');
const {
  json
} = require("express");
const flights = require("./controllers/todoAppController");
const models = require("./models/TodoApp");
const routes = require("./routes/TodoAppRoute");

const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({
  extended: true
})) // for parsing application/x-www-form-urlencoded

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connect to the database
mongoose.connect('mongodb://localhost:27017/todo-app-api', {
  useNewUrlParser: true
}).then(() => {
  console.log("Successfully connected to the database"); // log connection success message
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err); //log connection error message if it exists
  process.exit(); //close
});

app.use(json());

app.use("/", routes); // initiate routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); //print port and connection success
});