const express = require("express");
const { connection } = require("./config/db");
const { eventRouter } = require("./routes/events.route");
const { requestRouter } = require("./routes/request.route");
const { UserRouter } = require("./routes/user.route");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/",(req,res)=>{
  res.send("<h1>Hello There!</h1>")
})
// route for user signup and login
app.use("/user", UserRouter);

// route for event CRUD
app.use("/events",eventRouter)

// route for creating,approving,rejecting requests for an event
app.use("/request",requestRouter)

app.listen(process.env.Port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to DB");
    console.log("error", err);
  }
});
