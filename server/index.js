import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./src/routes/user.js";
import { productRouter } from "./src/routes/product.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Configure CORS to allow requests from any origin
app.use(cors({
  origin: "*", // Allows requests from any origin
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the E-Commerce API");
});

app.use("/user", userRouter);
app.use("/product", productRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(3000, () => {
  console.log("SERVER STARTED");
});
