// This layer get inputs and return the results. in this case is login(email, password) → { user, token }

import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function loginService(email, password) {
  const user = await User.findOne({ email }).select("+hashedPassword");
  if (!user) {
    const error = new Error(
      "Email or password is invalid, please contact your admin",
    );
    error.statusCode = 401;
    throw error;
  }
  if (!user.isActive) {
    const error = new Error("Email is inactive, please contact your Admin");
    error.statusCode = 403;
    throw error;
  }
  const isMatchPassword = await bcrypt.compare(password, user.hashedPassword);

  if (!isMatchPassword) {
    const error = new Error("Email or password is invalid");
    error.statusCode = 401;
    throw error;
  }
  const safeUser = {
    id: user._id,
    email: user.email,
    role: user.role,
    shiftTemplate: user.shiftTemplate,
  };
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );
  return { safeUser, accessToken };
}

export async function getUserService(userId) {
  const user = await User.findById(userId).select("email role isActive shiftTemplate");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("User is inactive");
    error.statusCode = 403;
    throw error;
  }

  return {
    id: user._id,
    email: user.email,
    role: user.role,
    shiftTemplate: user.shiftTemplate,
  };
}