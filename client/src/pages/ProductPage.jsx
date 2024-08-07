import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomProduct = async () => {
      try {
        // Fetch all products
        const response = await axios.get("http://localhost:3000/product");
        const products = response.data.products;

        // Check if products are available
        if (products.length === 0) {
          throw new Error("No products available");
        }

        // Select a random product
        const randomProduct = products[Math.floor(Math.random() * products.length)];

        setProduct(randomProduct);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products", err);
        setError("Failed to fetch product details");
        setLoading(false);
      }
    };

    fetchRandomProduct();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!product) return <div>No product found</div>;

  return (
    <div className="p-5 lg:p-10">
      <h1 className="text-2xl font-bold mb-4">{product.productName}</h1>
      <img
        src={
          product.images.find((img) => img.description === "main view")?.url ||
          "default-image-url.jpg"
        }
        alt={product.productName}
        className="w-full h-64 object-cover mb-4"
      />
      <p className="text-lg mb-2">₹{product.price}</p>
      <p className="text-sm mb-4">{product.description}</p>
      <p className="text-sm mb-2">Size: {product.size}</p>
      <p className="text-sm mb-2">Stock Quantity: {product.stockQuantity}</p>
      <p className="text-sm mb-2">Texture: {product.texture}</p>
      <p className="text-sm mb-4">Weight: {product.weight}</p>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductPage;
