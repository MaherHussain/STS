import express from "express";
import { addUser, getUsers, updateMyTemplate } from "../controllers/user.controller.js";
import authorize from "../middlewares/authorize.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = express.Router();

userRouter.route("/add").post(verifyJWT, authorize("ADMIN"), addUser);
userRouter.route("/users").get(verifyJWT, authorize("ADMIN"), getUsers);
userRouter.route("/template").put(verifyJWT, updateMyTemplate);

export default userRouter; 