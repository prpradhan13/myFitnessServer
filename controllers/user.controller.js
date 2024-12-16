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
    const {userId} = req.params;

    if (!userId) {
      return void res.status(400).json({ error: "Error: No signed-in user" });
    }

    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user", error });
  }
};

// Create or update a user (upsert)
export const createUser = async (user) => {
  try {
    const newUser = await User.create(user);
    return res.status(200).json(newUser);

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
