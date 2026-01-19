import mongoose from "mongoose";

export default async function dbConnection() {
     if (!process.env.MONGO_URI) {
       throw new Error("MONGO_URI is not defined");
     }
     try {
       const conn = await mongoose.connect(process.env.MONGO_URI);
       console.log(`MongoDB Connected: ${conn.connection.host}`);
     } catch (error) {
       console.error("MongoDB connection failed:", error.message);
       throw error; // Stop the app if DB fails
     }
}