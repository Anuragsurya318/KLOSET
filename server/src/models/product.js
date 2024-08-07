import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: [1, "price of product should be above 1"] },
  description: { type: String, required: true },
  texture: { type: String, required: true },
  weight: { type: String, required: true },
  size: { type: String, required: true },
  stockQuantity: { type: Number, required: true, min: [1, "stock quantity should be above 1"] },
  images: [
    { url: { type: String, required: true }, description: { type: String, required: true } },
  ],
});

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
