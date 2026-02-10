import createHttpError from "http-errors";
import { registerEmployee } from "../services/user.service.js";

export async function addUser(req, res, next) {
    try {
        const {email,password,name} =  req.body

        if(!email || !password ) {
            return next(createHttpError(400, "Email and password are required fields."))
        }
        const employee = await registerEmployee({email,password,name});

        res.status(201).json({
          success: true,
          data: employee,
        });
    } catch (error) {
        next(error)
    }
} 