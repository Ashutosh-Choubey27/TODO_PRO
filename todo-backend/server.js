const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => console.error("❌ DB connection error:", err));
