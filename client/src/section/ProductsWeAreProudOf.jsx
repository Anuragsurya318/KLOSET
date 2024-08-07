import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/Context/CartContext";

const ProductsWeAreProudOf = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/product");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleProductClick = (productId) => {
    navigate(`/categories/product/${productId}`);
  };

  return (
    <>
      <div>
        <div className="w-[87%] m-auto mt-20 lg:mt-28 text-xl font-semibold mb-10 lg:text-2xl">
          Products We Are Proud Of
        </div>
        <div className="pl-9 lg:pl-[88px]">
          <div className="flex flex-wrap gap-5 m-auto">
            {products.map((product) => {
              const mainImage = product.images.find((image) => image.description === "main view");

              return (
                <div
                  key={product._id}
                  className="border-2 border-gray-300 hover:border-gray-600 duration-700 cursor-pointer w-[45%] h-72 flex flex-col justify-between lg:h-[340px] lg:w-[22%]"
                  onClick={() => handleProductClick(product._id)}
                >
                  <div className="w-[90%] lg:w-full">
                    <img
                      src={mainImage ? mainImage.url : "default-image-url.jpg"}
                      alt={product.productName}
                      className="lg:w-[80%] m-auto object-cover"
                    />
                  </div>
                  <div className="ml-2 mb-2">
                    <h2 className="text-lg mb-1">{product.productName}</h2>
                    <p className="text-xl font-semibold">₹{product.price}</p>
                  </div>
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click event from bubbling up
                      handleAddToCart(product);
                    }}
                  >
                    Add to Cart
                  </button> */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsWeAreProudOf;
