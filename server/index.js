import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./src/routes/user.js";
import { productRouter } from "./src/routes/product.js";

const app = express();
app.use(express.json());
app.use(
  cors(
    app.use(
      cors({
        origin: ["https://kloset.vercel.app", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
      })
    )
  )
);

app.get("/", (req, res) => {
  res.send("Welcome to Kloset API");
});
app.use("/user", userRouter);
app.use("/product", productRouter);

mongoose.connect(process.env.MONGODB_URI);

app.listen(process.env.PORT, () => {
  console.log("SERVER STARTED");
});
