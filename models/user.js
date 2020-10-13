const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  pic:{type:String,default:'https://res.cloudinary.com/saifcs/image/upload/v1602509245/usericon_lfpie0.jpg'},
  followers:[{type:ObjectId,ref:'User'}],
  following:[{type:ObjectId,ref:'User'}],
});

mongoose.model("User", userSchema);
