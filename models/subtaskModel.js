import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  status: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const SubTask = mongoose.model("SubTask", subtaskSchema);

export default SubTask;
