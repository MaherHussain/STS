import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

export async function registerEmployee({ email, name, password, adminId }) {
  const normalizedEmail = email.toLowerCase().trim();
  const isUserExist = await User.findOne({
    email: normalizedEmail,
    isActive: true,
  });

  if (isUserExist) {
    throw createHttpError(409, "This email is already exist in the system");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email: normalizedEmail,
    hashedPassword,
    role: "EMPLOYEE",
    isActive: true,
    createdBy: adminId,
    name,
  });

  return {
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
    isActive: newUser.isActive,
    createdAt: newUser.createdAt,
    createdBy: adminId,
    name: newUser.name,
  };
}

export async function getEmployeesByAdmin(adminId, search) {
  const query = { isActive: true, createdBy: adminId };

  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const employees = await User.find(query)
    .select("name email createdAt")
    .sort({ createdAt: -1 });
  return employees;
}