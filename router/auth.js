const express = require("express");
const router = express.Router();
require("../DB/connection");
const User = require("../models/userSchema");

router.get("/", (req, res) => {
  res.send("Hello from the server router/auth.js");
});
router.post("/register", (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    res.status(422).json({ error: "Please fill the fields properly!!" });
  }

  User.findOne({ email: email }).then((userExist) => {
    if (userExist) {
      return res.status(422).json({ error: "You have already registered" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      user.save().then(() => {
        res.status(201);
      });
    }
  });
  //   console.log(name, email, phone, work, password, cpassword);
  //   res.send("This is my register page");
});

module.exports = router;
