import createHttpError from "http-errors";
import { loginService, getUserService } from "../services/auth.service.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createHttpError(400, "Email and password is required."));
    }

    const { safeUser, accessToken } = await loginService(email, password);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60, // 1 hour (match JWT)
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    });

    res.status(200).json({
      success: true,
      message: "logged in successfully",
      data: safeUser,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(createHttpError(401, "Unauthorized"));
    }

    const user = await getUserService(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
