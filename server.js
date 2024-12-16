import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { clerkClient, clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";
import exerciseRoute from "./routers/exercises.route.js";
import planRoute from "./routers/plans.route.js";
import dayRoute from "./routers/day.route.js";
import usersRoute from "./routers/users.route.js";
import { Webhook } from "svix";
import bodyParser from "body-parser";
import userModel from "./models/user.model.js";

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
// app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(helmet());
// app.use(limiter);
app.use(morgan("combined"));

// Pass no parameters
app.use(clerkMiddleware())

const SIGNING_SECRET = process.env.SIGNING_SECRET

app.post(
  '/api/webhooks',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {

    if (!SIGNING_SECRET) {
      throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env')
    }
    
    // Get headers and body
    const headers = req.headers
    const payload = req.body

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET)

    let evt;
    try {
      evt = wh.verify(payload, headers)
    } catch (err) {
      console.log('Error: Could not verify webhook:', err.message)
      return void res.status(400).json({
        success: false,
        message: err.message,
      })
    }

    const { id } = evt.data
    const eventType = evt.type

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, gender } = evt.data;

      const existUser = await userModel.findOne({ clerkId: id });

      if (existUser) {
        return res.status(404).json({
          success: false,
          message: 'User already exists'
        });
      }

      const user = {
        clerkId: id,
        email: email_addresses[0].email_address || '',
        first_name, 
        last_name,
        gender
      }

      console.log(user);
      const newUser = await userModel.create(user);

      // if (newUser) {
      //   await clerkClient.users.updateUserMetadata(id, {
      //     publicMetadata: {
      //       userId: newUser._id,
      //     }
      //   })
      // }

      return res.status(200).json({
        success: true,
        newUser
      });
    }
  },
)

app.use("/api/v1", usersRoute);
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
