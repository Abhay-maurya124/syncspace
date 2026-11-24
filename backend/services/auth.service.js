import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

export const registerUser = async (payload) => {
  const { name, email, password } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();
  return newUser
};

export const loginUser = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
