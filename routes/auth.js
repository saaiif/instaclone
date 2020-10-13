const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const { JWT_TOKEN } = require("../config/keys");
const jwt = require("jsonwebtoken");
const requireSignin = require("../middlewares/requireSignin");

router.get("/protected", requireSignin, (req, res) => {
  res.send("Hello User");
});

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please fill the required fields" });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User Already Exist" });
      }
      bcrypt.hash(password, 12).then((hashPassword) => {
        const user = new User({
          email,
          password: hashPassword,
          name,
          pic,
        });
        user
          .save()
          .then(() => {
            return res.status(422).json({ message: "Saved Succesfully" });
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Invalid email or password" });
  }
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((itMatches) => {
        if (itMatches) {
          // res.json({ message: "Successfully SignedIn" });
          const token = jwt.sign({ _id: savedUser._id }, JWT_TOKEN);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.status(422).json({ error: "Invalid email or password" });
        }
      })
      .catch((err) => console.log(err));
  });
});

module.exports = router;
