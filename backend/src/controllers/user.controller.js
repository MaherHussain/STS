import createHttpError from "http-errors";
import {
  registerEmployee,
  getEmployeesByAdmin,
} from "../services/user.service.js";

export async function addUser(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return next(
        createHttpError(400, "Email and password are required fields."),
      );
    }

    const employee = await registerEmployee({
      email,
      password,
      name,
      adminId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Employee have been added successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsers(req, res, next) {
  try {
    const { search, cursor, limit } = req.query;
    const result = await getEmployeesByAdmin(
      req.user.id,
      search,
      cursor,
      limit ? parseInt(limit) : 10,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}