import express from "express";
import { createDay, getDayExerciseById, getDayExercises } from "../controllers/day.controller.js";

const router = express.Router();

router.route('/dayExercises').get(getDayExercises).post(createDay);

router.get('/dayExercises/:dayId', getDayExerciseById);

export default router;