import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true, // physical index
    },
    hashedPassword: {
      type: String,
      required: true,
      select: false, // never return by default
    },
    role: {
      type: String,
      enum: ["ADMIN", "EMPLOYEE"],
      default: "EMPLOYEE",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true, // used in almost all queries
    },
  },
  { timestamps: true },
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
  },
);
export default mongoose.model("User", userSchema);