import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";
import exerciseRoute from "./routers/exercises.route.js";
import planRoute from "./routers/plans.route.js";
import dayRoute from "./routers/day.route.js";

// Config .env file path
dotenv.config({
  path: "./.env",
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
});

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(helmet());
// app.use(limiter);
app.use(morgan("combined"));

// Pass no parameters
// app.use(clerkMiddleware())

app.use("/api/v1", exerciseRoute);
app.use("/api/v1", planRoute);
app.use("/api/v1", dayRoute);

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.get("/", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Welcome to My Fitness Server",
      });
    });
    app.listen(PORT, () => {
      console.log(`listening on port`);
    });
  })
  .catch((err) => {
    console.log(`Mongoose server error: ${err}`);
  });
