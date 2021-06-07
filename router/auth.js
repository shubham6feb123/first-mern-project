const express = require("express");
const router = express.Router();
require("../DB/connection");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("Hello from the server router/auth.js");
});


//Using Promises!!!!!!

// router.post("/register", async(req, res) => {
//   const { name, email, phone, work, password, confirmpassword } = req.body;
//   if (!name || !email || !phone || !work || !password || !confirmpassword) {
//     res.status(422).json({ error: "Please fill the fields properly!!" });
//   }

//   User.findOne({ email: email })
//     .then((userExist) => {
//         // console.log(userExist);
//       if (userExist) {
//         return res.status(422).json({ message: "You have already registered" });
//       } else {
//         const user = new User({
//           name,
//           email,
//           phone,
//           work,
//           password,
//           confirmpassword,
//         });

//         user
//           .save()
//           .then((result) => {
//             res.status(201).json({ message: "User successfully registered!!" });
//             // console.log(result);
//           })
//           .catch((error) => {
//             res.status(500).json({ error: "failed to registered" });
//           });

//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

//using Async-Await
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, confirmpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !confirmpassword) {
    res.status(422).json({ error: "Please fill the fields properly!!" });
  } else {
    try {
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        return res.status(422).json({ message: "You have already registered" });
      } else if (password != confirmpassword) {
        return res.status(422).json({ error: "Password is not matching" });
      } else {
        const user = new User({
          name,
          email,
          phone,
          work,
          password,
          confirmpassword,
        });

        const result = await user.save();
        console.log(result);
        if (result) {
          res.status(201).json({ message: "User successfully registered!!" });
        } else {
          res.status(500).json({ error: "Failed to registered" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
});

//Login Route
router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Invalid Credentials" });
      console.log(email, password);
    } else {
      const userSignIn = await User.findOne({
        email: email,
      });
      // console.log("sign in wala", userSignIn);
      let isPasswordMatch;
      if (userSignIn == null) {
        isPasswordMatch = false;
      } else {
         token = await userSignIn.generateAuthToken();
        console.log(token);
        res.cookie('jwttoken',token,{
          expires:new Date(Date.now()+25892000000),
          httpOnly:true
        })
        isPasswordMatch = await bcrypt.compare(password, userSignIn.password);
      }
      // console.log("password wala", isPasswordMatch);
      if (userSignIn == null) {
        return res.status(400).json({ error: "Invalid Credentials" });
      } else if (userSignIn.email && !isPasswordMatch) {
        return res.status(400).json({ error: "Invalid Credentials" });
      } else if (userSignIn.email && isPasswordMatch) {
        return res.status(200).json({ message: "User SignIn Successfully" });
      } else {
        return res.status(400).json({ error: "Invalid Credentials" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/signin",(req,res)=>{
  res.cookie("jwttoken","shubham").send("hello from signin page");
})
module.exports = router;
