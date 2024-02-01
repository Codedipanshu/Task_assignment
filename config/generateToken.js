import jwt from "jsonwebtoken";
import JWT_SECRET from "./jwt.js";

const generateToken = (id ) => {
  return jwt.sign({ id  }, JWT_SECRET);
};

export default generateToken;
