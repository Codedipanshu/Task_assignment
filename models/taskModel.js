import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  due_date: Date,
  priority: Number,
  status: { type: String, default: "TODO" },
  subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubTask" }],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
