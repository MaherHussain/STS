import express from 'express'
import { login, getUser, logout } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const authRoute = express.Router();

authRoute.route("/profile").get(verifyJWT, getUser);
authRoute.route("/login").post(login);
authRoute.route("/logout").post(logout);

export default authRoute;