const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const PORT  = process.env.PORT;
// const User = require("./models/userSchema");

app.use(express.json());

//we link the router files to make our route easy
app.use(require('./router/auth'));

//connecting backend to database
require("./DB/connection");

//MiddleWare
const middleware = (res, req, next) => {
  console.log("All about middleware");
  next();
};

app.get("/", (req, res) => {
  res.send("Hello from home page ");
});
app.get("/about", middleware, (req, res) => {
  res.send("Hello from about page");
});
app.get("/contact", (req, res) => {
  res.send("Hello from contact page");
});
app.get("/sign in", (req, res) => {
  res.send("Hello from sign in page");
});
app.get("/sign up", (req, res) => {
  res.send("Hello from sign up page");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
