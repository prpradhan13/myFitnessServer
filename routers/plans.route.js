import express from "express";
import { getAllExercise } from "../controllers/exercise.controller.js";
import { createPlan, getAllPlans, getPlanById } from "../controllers/plan.controller.js";

const router = express.Router();

router.route('/plans').get(getAllPlans).post(createPlan);

router.route('/plans/:planId').get(getPlanById);

export default router;
