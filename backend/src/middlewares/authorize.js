import createHttpError from "http-errors";

export default function authorize(...allowedRoles) {
  return (req, res, next) => {
    // req.user is set by authenticate middleware
    if (!req.user) {
      return next(createHttpError(401, "Unauthorized"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(createHttpError(403, "Forbidden: Access denied"));
    }

    next();
  };
}
