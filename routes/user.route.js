const express = require("express");
const { signup, login } = require("../controller/user");
const UserRouter = express.Router();

// user signup
UserRouter.post("/signup", signup);

// User Login
UserRouter.post("/login", login);

module.exports = { UserRouter };
