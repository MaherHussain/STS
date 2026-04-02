import ShiftLog from "../models/shiftlog.model.js";
import { calculateShiftHours } from "../utils/calculations.js";

export const createShiftLog = async ({ userId, date, startTime, endTime, breakDuration, imageUrl,ownPay }) => {

    if (!startTime || !endTime || !breakDuration ) {
        const error  = new Error("Missing required fields");
        error.status = 400;
        throw error;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        const error  = new Error("Invalid time format. Use HH:mm");
        error.status = 400;
        throw error;
    }
  // 1. If no date is provided, use today's date
  const shiftDate = date ? new Date(date) : new Date();

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
    const error  = new Error("You have already submitted a log for Today.");
    error.status = 409;
    throw error;
  }

  // Calculate total hours using the utility function
  const totalHours = calculateShiftHours(startTime, endTime, breakDuration);
  const newLog = new ShiftLog({
    userId,
    date: shiftDate, // Uses the provided date or 'now'
    startTime,
    endTime,
    breakDuration: Number(breakDuration) || 0,
    totalHours,
    imageUrl,
    ownPay,
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
  const allLogsInRange = await ShiftLog.find(query).select("totalHours ownPay");
  const totalHours = allLogsInRange.reduce((sum, log) => sum + (log.totalHours || 0), 0);
  const totalOwnPay = allLogsInRange.reduce((sum, log) => sum + (log.ownPay || 0), 0);

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
      count: allLogsInRange.length,
    },
    pagination: {
      nextCursor,
      hasNextPage,
    }
  };
};
