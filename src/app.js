const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

// console.log(path.join(__dirname, "../public"));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors({ origin: "http://localhost:5000", credentials: true }));

mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/auth", require("./routes/authRoutes"));
app.use("/todos", require("./routes/todoRoutes"));

app.listen(5000, () => console.log("Server started on port 5000"));
