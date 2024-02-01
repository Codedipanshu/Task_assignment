import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone_number: String,
  priority: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

export default User;
