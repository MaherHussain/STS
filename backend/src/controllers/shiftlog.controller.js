import { createShiftLog, getShiftReports } from "../services/shift.service.js";
import createHttpError from "http-errors";

export const submitShiftLog = async (req, res, next) => {
  try {
    const { date, startTime, endTime, breakDuration, ownPay } = req.body;
    const userId = req.user.id;
    if(!startTime || !endTime || !breakDuration){
        return next(createHttpError(400, "StartTime, EndTime and BreakDuration are required fields"));
    }
    const newLog = await createShiftLog({
      userId,
      date,
      startTime,
      endTime,
      breakDuration,
      ownPay,
      imageUrl: req.file?.path ?? null,
    });
    return res.status(201).json({ message: "Work log submitted successfully", data: newLog });
  } catch (error) {
    next(error);
  }
};

export async function getShiftLogs(req, res, next) {
  try {
    const { userId, month, year, date, startDate, endDate, cursor, limit } = req.query;
    const requestUserId = req.user.id;
    const userRole = req.user.role;

    let targetUserId = userId;

    if (userRole === "EMPLOYEE") {
      targetUserId = requestUserId;
    } else if (userRole === "ADMIN") {
      if (!targetUserId) {
        return next(createHttpError(400, "UserId is required for Admin reports"));
      }
    } else {
      return next(createHttpError(403, "Unauthorized role"));
    }

    const reportData = await getShiftReports({
      userId: targetUserId,
      month: month ? parseInt(month) : undefined,
      year: year ? parseInt(year) : undefined,
      date,
      startDate,
      endDate,
      cursor,
      limit: limit ? parseInt(limit) : undefined,
    });

    res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    next(error);
  }
}
