import cron from "node-cron";
import Task from "../models/taskModel.js";
import SubTask from "../models/subtaskModel.js";

// Implementation for changing task status
const taskStatus = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      // Fetch all tasks
      const tasks = await Task.find({ deleted_at: null });

      // Update task statuses based on subtask completion
      for (const task of tasks) {
        const subtasks = await SubTask.find({
          task_id: task._id,
          deleted_at: null,
        });

        if (subtasks.length === 0) {
          task.status = "TODO";
        } else {
          const isAllSubtasksCompleted = subtasks.every((subtask) => {
            subtask.status === 1;
          });

          if (isAllSubtasksCompleted) {
            task.status = "DONE";
          } else {
            task.status = "IN_PROGRESS";
          }
        }

        await task.save();
      }
      console.log("Task status updated successfully.");
    } catch (error) {
      console.error("Error updating task priorities:", error);
    }
  });
};

export default taskStatus;
