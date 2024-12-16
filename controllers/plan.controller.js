import Plan from "../models/plan.model.js";
import Day from "../models/day.model.js";
import Exercise from "../models/exercise.model.js";

export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().populate("days");

    return res.status(200).json({
      success: true,
      planData: plans,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in geting all Plan",
      error: error.message,
    });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(404).json({ error: "User not valid" })
    }

    const { planId } = req.params;

    const plan = await Plan.findById(planId).populate("days");

    return res.status(200).json({
      success: true,
      planData: plan,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in geting Plan",
      error: error.message,
    });
  }
};

export const createPlan = async (req, res) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(404).json({ error: "User not valid" })
    }

    const { name, planType, isPublic, difficultyLevel, description, days } =
      req.body;

    // Validate required fields
    if (!name || !planType || !days || days.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name, planType, and days are required fields.",
      });
    }

    const dayReferences = [];
    for (const day of days) {
      if (day.dayId) {
        // Validate the provided dayId
        const existingDay = await Day.findById(day.dayId);
        if (!existingDay) {
          return res.status(400).json({
            success: false,
            message: `Day with ID ${day.dayId} does not exist.`,
          });
        }
        dayReferences.push(day.dayId);
      } else if (day.name && day.exercises) {
        // Handle new day creation
        const exerciseReferences = [];
        for (const exercise of day.exercises) {
          if (!exercise.exerciseId && exercise.details) {
            // Create a new Exercise if details are provided
            const newExercise = new Exercise(exercise.details);
            const savedExercise = await newExercise.save();
            exerciseReferences.push(savedExercise._id);
          } else if (exercise.exerciseId) {
            // Use existing exerciseId
            exerciseReferences.push(exercise.exerciseId);
          } else {
            return res.status(400).json({
              success: false,
              message: "Exercise must have either an exerciseId or details.",
            });
          }
        }

        // Create a new Day document
        const newDay = new Day({
          name: day.name,
          exercises: exerciseReferences,
        });
        const savedDay = await newDay.save();
        dayReferences.push(savedDay._id);
      } else {
        return res.status(400).json({
          success: false,
          message: "Day must have either a dayId or name with exercises.",
        });
      }
    }

    // Create the Plan
    const newPlan = new Plan({
      name,
      planType,
      createdBy: userId,
      isPublic,
      difficultyLevel,
      description,
      days: dayReferences,
    });

    const savedPlan = await newPlan.save();

    return res.status(201).json({
      success: true,
      message: "Plan created successfully.",
      plan: savedPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating the plan.",
      error: error.message,
    });
  }
};
