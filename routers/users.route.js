import express from "express";
import { getUserByClerkId } from "../controllers/user.controller.js";
import { requireAuth } from "@clerk/express"; // Ensures the user is authenticated

const router = express.Router();

router.get('/users/:clerkId', getUserByClerkId);

export default router;
