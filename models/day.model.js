import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    exercises: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Exercise", // This creates a reference to the Exercise model
        },
    ],
}, {timestamps: true});

export default mongoose.model('Day', daySchema)