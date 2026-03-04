import express from "express";
import { submitShiftLog, getShiftLogs } from "../controllers/shiftlog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const shiftLogRouter = express.Router();

shiftLogRouter.post("/", verifyJWT, upload.single("image"), submitShiftLog);
shiftLogRouter.get("/reports", verifyJWT, getShiftLogs);

export default shiftLogRouter;
