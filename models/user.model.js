import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
    },
    first_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    gender: { type: String },
    isAdmin: { type: Boolean, default: false },
    age: { type: Number, default: 0 },
    fitness_level: { type: String, default: "begginer"},
    role: { type: String, enum: ["trainer", "gym_goer"], default: "gym_goer" },
  },
  { timestamps: true }
); // Disable default MongoDB _id

export default mongoose.model("User", userSchema);
