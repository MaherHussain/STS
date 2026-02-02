import express from 'express'
import { login, getUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const authRoute = express.Router();

authRoute.route("/profile").get(verifyJWT, getUser);
authRoute.route("/login").post(login);

export default authRoute;