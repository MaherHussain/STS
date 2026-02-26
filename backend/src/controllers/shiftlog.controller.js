import { createShiftLog } from "../services/shift.service.js";
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

/* export const getMonthlyLogs = async (req, res, next) => {
  try {
    const { userId, month, year } = req.query;
    if (!userId || !month || !year) {
      return res.status(400).json({ message: "Missing params: userId, month, year" });
    }
    // Create date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const logs = await ShiftLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }, 
    }).sort({ date: 1 });
    const totalHours = logs.reduce((sum, log) => sum + log.totalHours, 0);
    res.status(200).json({
      data: logs,
      summary: {
        totalHours: Number(totalHours.toFixed(2)),
        count: logs.length
      }
    });
  } catch (error) {
    next(error);
  }

}; */