import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    // createdBy: {
    //     type: String,
    //     ref: "User",
    //     required: true,
    // },
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
});

export default mongoose.model('Day', daySchema)