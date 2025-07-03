const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// ➕ Create a todo
router.post('/', async (req, res) => {
  try {
    console.log("Received request body:", req.body); 
    const todo = new Todo({ title: req.body.title });
    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// 📥 Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// ✅ Update todo (toggle completed)
// router.put('/:id', async (req, res) => {
//   try {
//     const updated = await Todo.findByIdAndUpdate(
//       req.params.id,
//       { completed: req.body.completed },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update todo' });
//   }
// });


// ✅ Update todo (title + completed)
router.put('/:id', async (req, res) => {
  try {
    const { title, completed } = req.body;
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});





// ❌ Delete todo
router.delete('/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
