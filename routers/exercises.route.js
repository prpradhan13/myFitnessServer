import express from "express";
import { createExercise, getAllExercise } from "../controllers/exercise.controller.js";

const router = express.Router();

router.route('/exercises').get(getAllExercise).post(createExercise);

export default router;