const express = require("express");
const router = express.Router();
require("../DB/connection");
const User = require("../models/userSchema");

router.get("/", (req, res) => {
  res.send("Hello from the server router/auth.js");
});

router.post("/register", (req, res) => {
  const { name, email, phone, work, password, confirmpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !confirmpassword) {
    res.status(422).json({ error: "Please fill the fields properly!!" });
  }

  User.findOne({ email: email })
    .then((userExist) => {
        // console.log(userExist);
      if (userExist) {
        return res.status(422).json({ message: "You have already registered" });
      } else {
        const user = new User({
          name,
          email,
          phone,
          work,
          password,
          confirmpassword,
        });

        user
          .save()
          .then((result) => {
            res.status(201).json({ message: "User successfully registered!!" });
            // console.log(result);
          })
          .catch((error) => {
            res.status(500).json({ error: "failed to registered" });
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
