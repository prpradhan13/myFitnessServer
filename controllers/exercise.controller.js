import Exercise from "../models/exercise.model.js";

export const getAllExercise = async (req, res) => {
  try {
    // In future add userId for verify that user is logged in and can access the exercise
    // Add cashing also

    const exercises = await Exercise.find();

    return res.status(200).json({
      success: true,
      exercisesData: exercises,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in geting all Exercise",
      error: error.message,
    });
  }
};

export const createExercise = async (req, res) => {
  try {
    const {
      name,
      targetMuscle,
      difficultyLevel,
      equipmentRequired,
      instruction,
      isPublic,
      sets,
    } = req.body;

    // Validate required fields
    if (!name || !targetMuscle || !difficultyLevel ||!sets || sets.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name, target muscle, difficulty level, and instruction are required.",
      });
    }

    // Create a new Exercise
    const newExercise = new Exercise({
      name,
      targetMuscle,
      difficultyLevel,
      equipmentRequired,
      instruction,
      isPublic,
      sets,
    });

    // Save the exercise to the database
    const savedExercise = await newExercise.save();

    return res.status(201).json({
      success: true,
      message: "Exercise created successfully.",
      exercise: savedExercise,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating the exercise.",
      error: error.message,
    });
  }
};