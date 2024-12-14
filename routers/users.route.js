import express from "express";
import { createOrUpdateUser, getAllUsers, getUserByClerkId } from "../controllers/user.controller.js";

const router = express.Router();

router.route('/users').get(getAllUsers).post(createOrUpdateUser);
router.get('/users/:clerkId', getUserByClerkId);

export default router;
