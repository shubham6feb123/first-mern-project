const express = require("express");
const router = express.Router();
require("../DB/connection");
const User = require("../models/userSchema");

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
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Invalid Credentials" });
      console.log(email,password);

    } else {
      const userSignIn = await User.findOne({
        email: email,
        password: password
      });
      if (!userSignIn) {
        res.status(400).json({ error: "You are not registered" });
        
      } else {
        res.status(200).json({ message: "User SignIned Successfully" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
