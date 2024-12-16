import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    targetMuscle: {
      type: String,
      lowercase: true,
      trim: true,
    },
    difficultyLevel: {
      type: String,
      lowercase: true,
      trim: true,
    },
    equipmentRequired: {
      type: String,
      lowercase: true,
      trim: true,
    },
    instruction: {
      type: String,
      lowercase: true,
      trim: true,
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    sets: [
      {
        repetitions: { type: String },
        rest: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Exercise", exerciseSchema);
