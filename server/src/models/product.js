import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: [1, "price of product should be above 1"] },
  description: { type: String, required: true },
  imageURL: { type: String, required: true },
  stockQuantity: { type: Number, required: true, min: [0, "Stock can't be lower than 0"] },
});

const ProductModel = mongoose.model("product", ProductSchema);

export default ProductModel;
