import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // this default value for admin that created by system. employee user will have adminId
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