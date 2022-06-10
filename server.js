//mongodb
require("./config/db");

const express = require("express");
const port = 3001;
//cors
const cors = require("cors");
const app = express();



const UserRouter = require("./api/User");

// For accepting post form data
app.use(cors());
app.use(express.json());
// app.use(express.bodyParser());
app.use(express.urlencoded({ extended: true }));
app.use("/user", UserRouter);

app.listen(port, () => {
  console.log("Server running on port ${port}");
});
