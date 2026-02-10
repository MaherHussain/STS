import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

export async function registerEmployee({ email, name, password}) {

  const normalizedEmail = email.toLowerCase().trim();
  const isUserExist = await User.findOne({
    email: normalizedEmail,
    isActive: true,
  });

  if (isUserExist) {
    throw createHttpError(409, "This email is already exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email: normalizedEmail,
    hashedPassword,
    role: "EMPLOYEE",
    isActive: true,
    name,
  });

  return {
    id: newUser._id,
    email: newUser.email,
    role:newUser.role,
    isActive: newUser.isActive,
    createdAt: newUser.createdAt,
    name: newUser.name,
  };
}
