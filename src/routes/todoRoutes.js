const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// Create a new todo
router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save();
  res.status(201).json(newTodo);
});

//Get All
router.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Update Todo
router.put("/:id", async (req, res) => {
  const updateTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updateTodo);
});
