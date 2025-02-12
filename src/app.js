const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// console.log(path.join(__dirname, "../public"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/todos", require("./routes/todoRoutes"));

app.listen(5000, () => console.log("Server started on port 5000"));
