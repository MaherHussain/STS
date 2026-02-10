import express from "express";
import {addUser}from '../controllers/user.controller.js'
import authorize from "../middlewares/authorize.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'
const userRouter = express.Router()

userRouter.post("/add", verifyJWT, authorize("ADMIN"), addUser);

export default userRouter; 