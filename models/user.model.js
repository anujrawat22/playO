const mongoose = require("mongoose");


// userschema 
const UserSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  age: { type: Number },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel };
