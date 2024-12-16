import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    planType: {
      type: String,
      lowercase: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    difficultyLevel: {
        type: String,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        lowercase: true,
        trim: true,
    },
    days: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Day",
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
