const jwt = require("jsonwebtoken");
require("dotenv").config();


// middleware for token authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.TokenKey, (err, decoded) => {
      if (err) {
        return res.status(400).send({ Error: err });
      } else {
        req.UserId = decoded.UserId;
        req.username = decoded.username
        next();
      }
    });
  } else {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

module.exports = { authenticate };
