import User from "../models/user.model.js";
import ShiftLog from "../models/shiftlog.model.js";
import { calculateShiftHours } from "../utils/calculations.js";

export const createShiftLog = async ({ userId, date, shiftType, startTime, endTime, breakDuration, revenue, notes, imageUrl, ownPay }) => {
    // Fetch user to get their payment system and share
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    const type = shiftType || user.payType || "HOURLY";

    if (type === "HOURLY") {
        if (!startTime || !endTime || breakDuration === undefined) {
            const error = new Error("Missing required fields for hourly shift");
            error.status = 400;
            throw error;
        }

        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            const error = new Error("Invalid time format. Use HH:mm");
            error.status = 400;
            throw error;
        }
    } else if (type === "REVENUE") {
        if (revenue === undefined) {
            const error = new Error("Missing revenue");
            error.status = 400;
            throw error;
        }
    }

    // 1. If no date is provided, use today's date
    const shiftDate = date ? new Date(date) : new Date();

    // Check if shiftDate is in the future
    const now = new Date();
    now.setHours(23, 59, 59, 999); // Allow logs for today
    if (shiftDate > now) {
        const error = new Error("Cannot submit a log for a future date.");
        error.status = 400;
        throw error;
    }

    // Check if a log already exists for this user on this date
    const startOfDay = new Date(shiftDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(shiftDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingLog = await ShiftLog.findOne({
        userId,
        date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingLog) {
        const error = new Error("You have already submitted a log for this date.");
        error.status = 409;
        throw error;
    }

    // Calculate total hours only for hourly shifts
    const totalHours = type === "HOURLY" ? calculateShiftHours(startTime, endTime, breakDuration) : 0;
    
    const newLog = new ShiftLog({
        userId,
        date: shiftDate,
        shiftType: type,
        startTime: type === "HOURLY" ? startTime : undefined,
        endTime: type === "HOURLY" ? endTime : undefined,
        breakDuration: type === "HOURLY" ? (Number(breakDuration) || 0) : 0,
        totalHours,
        revenue: type === "REVENUE" ? Number(revenue) : 0,
        notes,
        imageUrl,
        ownPay: Number(ownPay) || 0,
    });
    return await newLog.save();
};

export const getShiftReports = async ({ userId, month, year, date, startDate, endDate, cursor, limit = 10 }) => {
  let query = { userId };

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  } else if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    query.date = { $gte: start };
  } else if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.date = { $lte: end };
  } else if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    query.date = { $gte: startOfDay, $lte: endOfDay };
  } else if (month && year) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    query.date = { $gte: startOfMonth, $lte: endOfMonth };
  }

  // Calculate summary for the ENTIRE filtered range (before pagination)
  const allLogsInRange = await ShiftLog.find(query).select("totalHours ownPay revenue");
  const totalHours = allLogsInRange.reduce((sum, log) => sum + (log.totalHours || 0), 0);
  const totalOwnPay = allLogsInRange.reduce((sum, log) => sum + (log.ownPay || 0), 0);
  const totalRevenue = allLogsInRange.reduce((sum, log) => sum + (log.revenue || 0), 0);

  // Apply cursor-based pagination for the logs list
  const paginationQuery = { ...query };
  if (cursor) {
    if (cursor.includes("_")) {
      const [cursorId, cursorDateStr] = cursor.split("_");
      const cursorDate = new Date(cursorDateStr);
      
      // Correct composite cursor logic for descending sort:
      // (date < cursorDate) OR (date == cursorDate AND _id < cursorId)
      paginationQuery.$or = [
        { date: { $lt: cursorDate } },
        { date: cursorDate, _id: { $lt: cursorId } }
      ];
    } else {
      // Fallback for simple ID cursor
      paginationQuery._id = { $lt: cursor };
    }
  }

  const logs = await ShiftLog.find(paginationQuery)
    .sort({ date: -1, _id: -1 }) 
    .limit(Number(limit) + 1);

  const hasNextPage = logs.length > Number(limit);
  if (hasNextPage) {
    logs.pop(); 
  }

  const lastLog = logs[logs.length - 1];
  const nextCursor = hasNextPage && lastLog ? `${lastLog._id}_${lastLog.date.toISOString()}` : null;

  return {
    logs,
    summary: {
      totalHours: Number(totalHours.toFixed(2)),
      totalOwnPay: Number(totalOwnPay.toFixed(2)),
      totalRevenue: Number(totalRevenue.toFixed(2)),
      count: allLogsInRange.length,
    },
    pagination: {
      nextCursor,
      hasNextPage,
    }
  };
};
