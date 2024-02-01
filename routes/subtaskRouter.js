import express from "express";
import zod from "zod";
import SubTask from "../models/subtaskModel.js";
import Task from "../models/taskModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
const subtaskRouter = express.Router();

// create new subtask
subtaskRouter.post("/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const newSubTask = new SubTask({ task_id: taskId });
    await newSubTask.save();

    // Update the task with the new subtask
    await Task.findByIdAndUpdate(taskId, {
      $push: { subtasks: newSubTask._id },
    });

    return res.status(201).json(newSubTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const getSubTaskBody = zod.object({
  task_Id: zod.string().optional(),
});
// get all user task
subtaskRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const { success } = getSubTaskBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({ message: "Incorrect inputs" });
    }

    const { task_id } = req.body;

    const updatedFields = { user_id: req.userId, deleted_at: null };

    if (task_id) updatedFields._id = task_id;

    const tasks = await Task.find(updatedFields);

    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "Task not fount for the authenticated user" });
    }

    const allSubtaskIds = [].concat(...tasks.map((tasks) => tasks.subtasks));
    const subtasks = await SubTask.find({
      _id: { $in: allSubtaskIds },
      deleted_at: null,
    });

    return res.status(200).json(subtasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const updateSubTaskBody = zod.object({
  status: zod.number(),
});
// update subtask
subtaskRouter.put("/:subtaskId", authMiddleware, async (req, res) => {
  try {
    const { success } = updateSubTaskBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({ message: "Incorrect inputs" });
    }

    const { subtaskId } = req.params;
    const { status } = req.body;

    const updatedSubTask = await SubTask.findOneAndUpdate(
      { _id: subtaskId, deleted_at: null },
      { status, updated_at: new Date() },
      { new: true }
    );

    return res.status(200).json(updatedSubTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// delete subtask
subtaskRouter.delete("/:subtaskId", authMiddleware, async (req, res) => {
  try {
    const { subtaskId } = req.params;

    // Soft delete subtask
    await SubTask.findByIdAndUpdate(subtaskId, { deleted_at: new Date() });

    return res
      .status(200)
      .json({ message: `${subtaskId} deleted successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default subtaskRouter;
