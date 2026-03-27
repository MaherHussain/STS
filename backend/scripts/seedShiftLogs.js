import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/user.model.js";
import ShiftLog from "../src/models/shiftlog.model.js";
import dbConnection from "../src/config/db.js";

dotenv.config();

const seed = async () => {
  try {
    await dbConnection();

    // 1. Find the first employee
    const employee = await User.findOne({ role: "EMPLOYEE", isActive: true });

    if (!employee) {
      console.error("No active employee found to seed logs for.");
      process.exit(1);
    }

    console.log(`Seeding 50 logs for employee: ${employee.name} (${employee.email})`);

    const logs = [];
    const baseDate = new Date();

    for (let i = 0; i < 50; i++) {
      const logDate = new Date(baseDate);
      logDate.setDate(baseDate.getDate() - i); // Go back one day for each log

      logs.push({
        userId: employee._id,
        date: logDate,
        startTime: "09:00",
        endTime: "17:00",
        breakDuration: 60,
        totalHours: 7,
        ownPay: 100 + i,
        imageUrl: null,
      });
    }

    // Clear existing logs for this user to have a clean test (optional)
    // await ShiftLog.deleteMany({ userId: employee._id });

    await ShiftLog.insertMany(logs);

    console.log("Successfully seeded 50 shift logs!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding logs:", error);
    process.exit(1);
  }
};

seed();
