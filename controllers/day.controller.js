import mongoose from "mongoose";
import Day from "../models/day.model.js";
import Exercise from "../models/exercise.model.js";

export const getDayExercises = async (req, res) => {
  try {
    const dayExercises = await Day.find().populate("exercises");

    return res.status(200).json({
      success: true,
      dayExercisesData: dayExercises,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in get day exercise",
      error: error.message,
    });
  }
};

export const getDayExerciseById = async (req, res) => {
  try {

    const { dayId } = req.params;

    const dayExercises = await Day.findById(dayId).populate("exercises");

    return res.status(200).json({
      success: true,
      dayExercisesData: dayExercises,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error getDayExerciseById",
      error: error.message,
    });
  }
};

export const createDay = async (req, res) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(404).json({ error: "User not valid" })
    }

    const { name, isPublic, exercises } = req.body;

    // Validate required fields
    if (!name || !exercises || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name and exercises are required.",
      });
    }

    const exerciseIds = [];

    // Iterate over exercises to process exerciseId or create new exercise
    for (const exercise of exercises) {
      if (exercise.exerciseId) {
        // If exerciseId exists, check if it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(exercise.exerciseId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid ObjectId for exercise: ${exercise.exerciseId}`,
          });
        }
        // Directly push the exerciseId if it's valid
        exerciseIds.push(exercise.exerciseId);
      } else if (exercise.details) {
        // If exerciseId doesn't exist, create a new exercise
        const newExercise = new Exercise(exercise.details);
        const savedExercise = await newExercise.save();
        exerciseIds.push(savedExercise._id); // Add the newly created exerciseId
      } else {
        return res.status(400).json({
          success: false,
          message: "Each exercise must either have an exerciseId or details.",
        });
      }
    }

    // Create the new day with the resolved exerciseIds
    const newDay = new Day({
      name,
      isPublic,
      createdBy: userId,
      exercises: exerciseIds, // Only pass ObjectIds here
    });

    // Save the day to the database
    const savedDay = await newDay.save();

    return res.status(201).json({
      success: true,
      message: "Day created successfully.",
      day: savedDay,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating the day.",
      error: error.message,
    });
  }
};
