import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export function verifyJWT(req, res, next) {
  try {
    // 1️⃣ Read token from cookie
    const token = req.cookies?.accessToken;

    if (!token) {
      throw createHttpError(401, "Authentication required");
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3️⃣ Attach user info to request
    req.user = {
      id: decoded.id,
    };

    // 4️⃣ Allow request to continue
    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
}
