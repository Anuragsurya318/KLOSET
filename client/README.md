below is my index.js backend code
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./src/routes/user.js";
import { productRouter } from "./src/routes/product.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

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

below is my src/routes/user.js file code backend
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

// Add this route to fetch purchased items
router.get("/purchased-items/:userID", verifyToken, async (req, res) => {
const { userID } = req.params;

try {
const user = await UserModel.findById(userID).populate("purchasedItems");
if (!user) {
return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
}

    res.json({ purchasedItems: user.purchasedItems });

} catch (err) {
res.status(500).json({ type: err });
}
});

router.post("/purchase", verifyToken, async (req, res) => {
const { userID, productID, productPrice } = req.body;

try {
const user = await UserModel.findById(userID);
if (!user) {
return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
}

    // Subtract product price from user's available money
    user.availableMoney -= productPrice;

    // Add product to purchased items
    user.purchasedItems.push(productID);

    // Save the updated user document
    await user.save();

    res.json({ availableMoney: user.availableMoney, purchasedItems: user.purchasedItems }); // Return updated purchased items

} catch (err) {
res.status(500).json({ type: err });
}
});

export { router as userRouter };

below is my src/routes/product.js
import { Router } from "express";
import ProductModel from "../models/product.js";
import { verifyToken } from "./user.js";
import UserModel from "../models/user.js";
import { ProductErrors, UserErrors } from "../errors.js";

const router = Router();

// Route to get all products (no authentication required)
router.get("/", async (\_, res) => {
try {
const products = await ProductModel.find({});
res.json({ products });
} catch (error) {
console.error("Error fetching products:", error); // Add logging here
res.status(400).json({ error });
}
});

// Route for checkout (authentication required)
router.post("/checkout", verifyToken, async (req, res) => {
const { customerID, cartItems } = req.body;
try {
const user = await UserModel.findById(customerID);
const productIDs = Object.keys(cartItems);
const products = await ProductModel.find({ \_id: { $in: productIDs } });

    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }

    if (products.length !== productIDs.length) {
      return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
    }

    let totalPrice = 0;
    for (const item in cartItems) {
      const product = products.find((product) => String(product._id) === item);

      if (!product) {
        return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
      }

      if (product.stockQuantity < cartItems[item]) {
        return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK });
      }

      totalPrice += product.price * cartItems[item];
    }

    if (user.availableMoney < totalPrice) {
      return res.status(400).json({ type: ProductErrors.NO_AVAILABLE_MONEY });
    }

    user.availableMoney -= totalPrice;
    user.purchasedItems.push(...productIDs);
    await user.save();
    await ProductModel.updateMany({ _id: { $in: productIDs } }, { $inc: { stockQuantity: -1 } });

    res.json({
      purchasedItems: user.purchasedItems,
    });

} catch (error) {
res.status(400).json(error);
}
});

// Route to get purchased items (authentication required)
router.get("/purchased-items/:customerID", verifyToken, async (req, res) => {
const { customerID } = req.params;
try {
const user = await UserModel.findById(customerID);

    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }

    const products = await ProductModel.find({
      _id: { $in: user.purchasedItems },
    });

    res.json({ purchasedItems: products });

} catch (error) {
res.status(400).json({ type: UserErrors.NO_USER_FOUND });
}
});

export { router as productRouter };

below is my src/models/user.js file code backend
import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
username: {
type: String,
required: true,
unique: true,
},
password: {
type: String,
required: true,
},
availableMoney: {
type: Number,
default: 100000,
},
purchasedItems: [{ type: Schema.Types.ObjectId, ref: "product", default: [] }],
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;

below is my src/models/product.js file code backend
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
productName: { type: String, required: true },
price: { type: Number, required: true, min: [1, "price of product should be above 1"] },
description: { type: String, required: true },
texture: { type: String, required: true },
weight: { type: String, required: true },
size: { type: String, required: true },
images: [
{ url: { type: String, required: true }, description: { type: String, required: true } },
],
});

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;

below is my AuthContext.js file code frontend
import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [auth, setAuth] = useState({
isLoggedIn: false,
token: null,
availableMoney: null,
userID: null,
purchasedItems: null,
});
const [error, setError] = useState(""); // Add error state

const login = async (username, password) => {
try {
const response = await axios.post("http://localhost:3000/user/login", { username, password });
const { token, userID } = response.data;

      const moneyResponse = await axios.get(
        `http://localhost:3000/user/available-money/${userID}`,
        {
          headers: { Authorization: token },
        }
      );
      const { availableMoney } = moneyResponse.data;

      setAuth({ isLoggedIn: true, token, availableMoney, userID });
      localStorage.setItem("token", token);
      setError(""); // Clear any previous error on successful login
    } catch (error) {
      console.error("Login failed", error);
      setError("Invalid credentials. Please try again."); // Set error message on login failure
      return "Invalid credentials. Please try again."; // Return error message
    }

};

const logout = () => {
setAuth({
isLoggedIn: false,
token: null,
availableMoney: null,
userID: null,
});
localStorage.removeItem("token");
};

const updateAvailableMoney = (newAmount) => {
setAuth((prevAuth) => ({
...prevAuth,
availableMoney: newAmount,
}));
};

const purchaseProduct = async (userID, productID, productPrice) => {
try {
const response = await axios.post(
"http://localhost:3000/user/purchase",
{ userID, productID, productPrice },
{
headers: { Authorization: auth.token },
}
);
const { availableMoney, purchasedItems } = response.data; // Get updated purchasedItems
setAuth((prevAuth) => ({
...prevAuth,
availableMoney,
purchasedItems, // Update purchasedItems in auth state
}));
} catch (error) {
console.error("Purchase failed", error);
}
};

return (
<AuthContext.Provider
value={{ auth, login, logout, error, updateAvailableMoney, purchaseProduct }} >
{children}
</AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);

i want as soon as a user logs in, the available money and purchased items should be fetched and stored in the auth state.
