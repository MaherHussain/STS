import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../src/config/db.js";
import User from "../src/models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error("Usage: node scripts/createAdmin.js <email> <password>");
  process.exit(1);
}
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

if (!isValidEmail(email)) {
  console.error("Invalid email format.");
  process.exit(1);
}
const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email,
      isActive: true,
    });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      process.exitCode = 0;
      return;
    }
    const SALT_ROUND = 12;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

    const adminUser = await User.create({
      email,
      hashedPassword,
      role: "ADMIN",
      isActive: true,
    });

    console.log("Admin user created successfully:");
    console.log({
      id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();