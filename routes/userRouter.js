import express from "express";
import zod from "zod";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";
const userRouter = express.Router();

const loginBody = zod.object({
  phone_number: zod.string(),
  priority: zod.number().optional(),
});
// login/signup route
userRouter.post("/", async (req, res) => {
  try {
    const { success } = loginBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({ message: "Incorrect inputs" });
    }

    const { phone_number, priority } = req.body;
    const updatedFields = {};

    if (phone_number) updatedFields.phone_number = phone_number;
    if (priority) updatedFields.priority = priority;

    const existingUser = await User.findOne({
      phone_number: updatedFields.phone_number,
    });

    if (existingUser) {
      res.json({
        message: "User login successfully",
        token: generateToken(existingUser._id),
      });
    } else {
      const user = await User.create(updatedFields);

      res.json({
        message: "User created successfully",
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default userRouter;
