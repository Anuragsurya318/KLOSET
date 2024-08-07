import { Router } from "express";
import ProductModel from "../models/product.js";
import { verifyToken } from "./user.js";
import UserModel from "../models/user.js";
import { ProductErrors, UserErrors } from "../errors.js";

const router = Router();

// Route to get all products (no authentication required)
router.get("/", async (_, res) => {
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
    const products = await ProductModel.find({ _id: { $in: productIDs } });

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
