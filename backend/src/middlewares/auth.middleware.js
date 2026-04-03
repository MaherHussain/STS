import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export function verifyJWT(req, res, next) {
  try {
    // 1️⃣ Read token from cookie or Authorization header
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw createHttpError(401, "Authentication required");
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3️⃣ Attach user info to request
    req.user = decoded;

    // 4️⃣ Allow request to continue
    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
}
