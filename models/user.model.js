import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    gender: { type: String },
    isAdmin: { type: Boolean, default: false },
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    fitness_level: { type: String },
    role: { type: String, enum: ["trainer", "gym_goer"], default: "gym_goer" },
  },
  { timestamps: true, _id: false }
); // Disable default MongoDB _id

export default mongoose.model("User", userSchema);
