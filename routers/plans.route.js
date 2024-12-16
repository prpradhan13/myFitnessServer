import express from "express";
import { createPlan, getAllPlans, getPlanById, getPlanByUser } from "../controllers/plan.controller.js";

const router = express.Router();

router.route('/plans').get(getAllPlans);

router.route('/plans/:planId').get(getPlanById);

router.route('/userplans/:userId').get(getPlanByUser).post(createPlan);

export default router;
