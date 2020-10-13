const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const { JWT_TOKEN: JWT_SECRET_KEY } = require("../config/keys");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be signed In" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "You must be signed In" });
    }
    const { _id } = payload;
    User.findById(_id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
