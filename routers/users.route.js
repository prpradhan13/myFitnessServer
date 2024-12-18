import express from "express";
import { getUserByClerkId } from "../controllers/user.controller.js";
import { requireAuth } from "@clerk/express"; // Ensures the user is authenticated

const router = express.Router();

// It is need clerk user id
router.get('/users/:userId', getUserByClerkId);

export default router;
