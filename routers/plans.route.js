import express from "express";
import { createPlan, getAllPlans, getPlanById, getPlanByUser } from "../controllers/plan.controller.js";

const router = express.Router();

router.route('/plans').get(getAllPlans);

// It is need a Plan's Id
router.route('/plans/:planId').get(getPlanById);

// It is need user's id(mongodb _id)
router.route('/userplans/:userId').get(getPlanByUser).post(createPlan);

export default router;
