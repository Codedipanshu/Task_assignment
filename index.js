import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import rootRouter from "./routes/rootRoutes.js";
import taskPriority from "./jobs/taskPriority.js";
import taskStatus from "./jobs/taskStatus.js";
import voiceCalling from "./jobs/voiceCalling.js";

const app = express();
connectDB();

app.use(express.json());

app.use("/api/v1", rootRouter);

taskPriority();
taskStatus();
voiceCalling();

app.listen(3000, () => {
  console.log(`Server running on port 3000!`);
});
