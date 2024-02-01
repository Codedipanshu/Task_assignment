import express from "express";
import zod from "zod";
import authMiddleware from "../middleware/authMiddleware.js";
import Task from "../models/taskModel.js";
import SubTask from "../models/subtaskModel.js";
const taskRouter = express.Router();

const newTaskBody = zod.object({
  title: zod.string(),
  description: zod.string(),
  due_date: zod.string(),
});
// create new task
taskRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { success } = newTaskBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({ message: "Incorrect inputs" });
    }

    const { title, description, due_date } = req.body;
    const newTask = new Task({
      title,
      description,
      due_date,
      user_id: req.userId,
    });
    await newTask.save();

    return res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const getTaskBody = zod.object({
  due_date: zod.string().optional(),
  status: zod.string().optional(),
  priority: zod.string().optional(),
  page: zod.number().optional(),
  limit: zod.number().optional(),
});
// get all user task
taskRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const { success } = getTaskBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({ message: "Incorrect inputs" });
    }

    const { due_date, status, priority, page = 1, limit = 10 } = req.body;

    const skip = (page - 1) * limit;
    const updatedFields = { user_id: req.userId, deleted_at: null };

    if (due_date) updatedFields.due_date = due_date;
    if (status) updatedFields.status = status;
    if (priority) updatedFields.priority = priority;

    const tasks = await Task.find(updatedFields)
      .limit(parseInt(limit))
      .skip(skip);

    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "Task not fount for the authenticated user" });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const updateTaskBody = zod.object({
  due_date: zod.string().optional(),
  status: zod.string().optional(),
});
// update task
taskRouter.put("/:taskId", authMiddleware, async (req, res) => {
  try {
    const { success } = updateTaskBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({ message: "Incorrect inputs" });
    }

    const { taskId } = req.params;
    const { due_date, status } = req.body;

    const updatedFields = { user_id: req.userId, updated_at: new Date() };
    if (due_date) updatedFields.due_date = due_date;
    if (status) updatedFields.status = status;

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedFields, {
      new: true,
    });

    // Update subtasks if status is updated
    const statusValue = status === "TODO" ? 0 : 1;
    if (status) {
      await SubTask.updateMany(
        { task_id: taskId },
        { status: statusValue, updated_at: new Date() }
      );
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// delete task
taskRouter.delete("/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;

    // Soft delete task
    await Task.findByIdAndUpdate(taskId, { deleted_at: new Date() });

    // Soft delete associated subtasks
    await SubTask.updateMany({ task_id: taskId }, { deleted_at: new Date() });

    return res.status(200).json({ message: `${taskId} deleted successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default taskRouter;
