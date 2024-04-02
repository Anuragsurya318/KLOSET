// setup.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://kloset.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

mongoose.connect(process.env.MONGODB_URI);

export default app;
