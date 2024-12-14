import { clerkClient } from "@clerk/express";
import User from "../models/user.model.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get a user by Clerk ID
export const getUserByClerkId = async (req, res) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return void res.status(400).json({ error: "Error: No signed-in user" });
    }

    const user = await clerkClient.users.getUser(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user", error });
  }
};

// Create or update a user (upsert)
export const createOrUpdateUser = async (req, res) => {
  const { clerkId, name, gender, age, height, weight, fitness_level, role } =
    req.body;

  try {
    const user = await User.findOneAndUpdate(
      { clerkId },
      { clerkId, name, gender, age, height, weight, fitness_level, role },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating/updating user", error });
  }
};

// Delete a user by Clerk ID
export const deleteUser = async (req, res) => {
  const { clerkId } = req.params;

  try {
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user", error });
  }
};
