import express from "express";
import taskRouter from "./taskRouter.js";
import subtaskRouter from "./subtaskRouter.js";
import userRouter from "./userRouter.js";
const rootRouter = express.Router();

rootRouter.use("/task", taskRouter);
rootRouter.use("/subtask", subtaskRouter);
rootRouter.use("/user", userRouter);

export default rootRouter;
