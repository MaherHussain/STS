import mongoose from "mongoose";

const shiftLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    shiftType: {
      type: String,
      enum: ["HOURLY", "REVENUE"],
      default: "HOURLY",
      required: true,
    },
    startTime: {
      type: String, // Storing as "HH:mm" (e.g., "09:00")
      required: false,
    },
    endTime: {
      type: String, // Storing as "HH:mm" (e.g., "17:00")
      required: false,
    },
    breakDuration: {
      type: Number, // In minutes
      default: 0,
    },
    totalHours: {
      type: Number,
      required: false, // Calculated before saving
    },
    revenue: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: false, // Path to the uploaded image
    },
    ownPay: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    
  },
  { timestamps: true }
);

// Index to quickly find logs for a user in a specific month/year
shiftLogSchema.index({ userId: 1, date: -1 });

export default mongoose.model("ShiftLog", shiftLogSchema);