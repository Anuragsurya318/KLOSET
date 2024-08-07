import express from "express";
import UserModel from "../models/user.js";
import { UserErrors } from "../errors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXITS });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for username: ${username}`);

  try {
    const user = await UserModel.findOne({ username });
    console.log(`User found: ${user}`);

    if (!user) {
      console.log("No user found");
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log("Wrong credentials");
      return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
    }
    const token = jwt.sign({ id: user._id }, "secret");
    res.json({ token, userID: user._id });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(500).json({ type: err });
  }
});

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, "secret", (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decoded; // Attach decoded token to request
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get("/available-money/:userID", verifyToken, async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }

    res.json({ availableMoney: user.availableMoney });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

router.post("/purchase", verifyToken, async (req, res) => {
  const { userID, productID, productPrice, quantity } = req.body;

  try {
    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }

    // Subtract total product price (quantity * productPrice) from user's available money
    const totalCost = productPrice * quantity;
    user.availableMoney -= totalCost;

    // Add product to purchased items array multiple times based on the quantity
    for (let i = 0; i < quantity; i++) {
      user.purchasedItems.push(productID);
    }

    // Save the updated user document
    await user.save();

    res.json({ availableMoney: user.availableMoney, purchasedItems: user.purchasedItems });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

export { router as userRouter };
