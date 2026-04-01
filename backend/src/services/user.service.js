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

export async function getEmployeesByAdmin(adminId, search, cursor, limit = 10) {
  const query = { isActive: true, createdBy: adminId };

  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const paginationQuery = { ...query };
  if (cursor) {
    paginationQuery._id = { $lt: cursor };
  }

  const employees = await User.find(paginationQuery)
    .select("name email createdAt")
    .sort({ _id: -1 })
    .limit(Number(limit) + 1);

  const hasNextPage = employees.length > Number(limit);
  if (hasNextPage) {
    employees.pop();
  }

  const nextCursor = hasNextPage ? employees[employees.length - 1]._id : null;

  return {
    employees,
    pagination: {
      nextCursor,
      hasNextPage,
    },
  };
}

export async function updateUserTemplateService(userId, { startTime, endTime, breakDuration }) {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      shiftTemplate: {
        startTime,
        endTime,
        breakDuration,
      },
    },
    { new: true }
  );

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return user;
}