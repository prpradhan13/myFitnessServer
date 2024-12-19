import express from "express";
import { createDay, getDayExerciseById, getDayExercises, getDayExercisesByUserId, getPublicDayExercises } from "../controllers/day.controller.js";

const router = express.Router();

// This getDayExercises() give all day data (public & private)
router.route('/dayExercises').get(getDayExercises).post(createDay);

// it is need Day's mongodb Id
router.get('/dayExercises/:dayId', getDayExerciseById);

router.get('/userDayExercises/:userId', getDayExercisesByUserId);

// Give all public day exercises data
router.get('/publicDayExercises', getPublicDayExercises);

export default router;