const express = require("express");
const Todo = require("../models/Todo");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new todo
router.post("/", authMiddleware, async (req, res) => {

  req.body.user = req.user;

  const newTodo = new Todo(req.body);
  await newTodo.save();
  res.status(201).json(newTodo);
});

//Get All
router.get("/", authMiddleware, async (req, res) => {
  const todos = await Todo.find({user: req.user});
  res.json(todos);
});

// Update Todo
router.put("/:id", authMiddleware, async (req, res) => {
  const updateTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true});
  res.json(updateTodo);
});



router.delete("/:id", authMiddleware, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({message: "Delete successfully"});
});

module.exports = router;