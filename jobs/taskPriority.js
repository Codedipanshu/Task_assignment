import cron from "node-cron";
import Task from "../models/taskModel.js";

// Implementation for changing task priority based on due_date
const taskPriority = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      await Task.updateMany(
        {
          due_date: { $lt: today },
        },
        { priority: 0 }
      );

      await Task.updateMany(
        {
          due_date: { $gte: tomorrow, $lt: tomorrow + 2 * 24 * 60 * 60 * 1000 },
        },
        { priority: 1 }
      );

      await Task.updateMany(
        {
          due_date: {
            $gte: tomorrow + 2 * 24 * 60 * 60 * 1000,
            $lt: tomorrow + 4 * 24 * 60 * 60 * 1000,
          },
        },
        { priority: 2 }
      );

      await Task.updateMany(
        {
          due_date: { $gte: tomorrow + 4 * 24 * 60 * 60 * 1000 },
        },
        { priority: 3 }
      );

      console.log("Task priorities updated successfully.");
    } catch (error) {
      console.error("Error updating task priorities:", error);
    }
  });
};

export default taskPriority;
