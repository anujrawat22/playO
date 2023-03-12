const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// user signup route

exports.signup = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    const findUser = await UserModel.findOne({ email });
    if (findUser) {
      return res.status(409).send({ message: "User already exists" });
    } else {
      // hashing password
      bcrypt.hash(password, 5, function (err, hash) {
        if (err) {
          return res.status(400).send({ Error: err });
        } else {
          const user = new UserModel({ name, password: hash, email, age });
          user.save();
          return res.status(201).send({ message: "Signup Sucessfull" });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({email})
    
    if (user) {
      const hashedpassword = user.password;
      bcrypt.compare(password, hashedpassword, (err, result) => {
        if (err) {
          return res.status().send({ Error: err });
        } else {
          if (result) {
            // if password is correct
            const token = jwt.sign(
              { UserId: user._id, username: user.name },
              process.env.TokenKey,
              { expiresIn: 60 * 60 * 24 * 7 }
            );
            const refresh_token = jwt.sign(
              { UserId: user._id, username: user.name },
              process.env.RefreshTokenKey,
              { expiresIn: 60 * 60 * 24 * 30 }
            );

            //   returns token and refresh token
            return res
              .status(200)
              .send({
                message: "Login Sucessful",
                token: token,
                refresh_token: refresh_token,
                user_detail: { name: user.name, email: user.email },
              });
          } else {
            // if password is incorrect
            return res.status(401).send({ message: "Incorrect Password" });
          }
        }
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ Error: err });
  }
};
