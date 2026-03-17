import ShiftLog from "../models/shiftlog.model.js";

// Helper to convert "HH:mm" to minutes
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

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

  // Calculate duration
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  let durationMinutes = endMinutes - startMinutes;
  // Handle overnight shifts
  // If end time is smaller than start time (e.g., 09:00 vs 23:00), we assume it's the next day
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }
  
  const totalMinutes = durationMinutes - (Number(breakDuration) || 0);
  const totalHours = Number((totalMinutes / 60).toFixed(2));
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

export const getShiftReports = async ({ userId, month, year, date, startDate, endDate }) => {
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

  const logs = await ShiftLog.find(query).sort({ date: 1 });
  const totalHours = logs.reduce((sum, log) => sum + (log.totalHours || 0), 0);
  const totalOwnPay = logs.reduce((sum, log) => sum + (log.ownPay || 0), 0);

  return {
    logs,
    summary: {
      totalHours: Number(totalHours.toFixed(2)),
      totalOwnPay: Number(totalOwnPay.toFixed(2)),
      count: logs.length,
    },
  };
};
