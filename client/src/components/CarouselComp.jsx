import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../components/ui/carousel"; // Adjust this import based on where your Carousel components are located
import { Button } from "@/components/ui/button";

const CarouselComp = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://kloset.onrender.com/product");
        const data = await response.json();
        setProducts(data.products); // Update based on the actual data structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleProductClick = (productId) => {
    navigate(`/categories/product/${productId}`); // Navigate to the product details page
  };

  return (
    <div className="w-[87%] m-auto mt-20 lg:mt-28 text-xl font-semibold mb-10 lg:text-2xl">
      <h2 className="mb-4">Trending Now</h2>
      <Carousel>
        <div className="absolute right-12 z-40 flex lg:w-12 -top-7">
          <CarouselPrevious className="rounded-none lg:h-10 lg:w-16" />
          <CarouselNext className="rounded-none lg:h-10 lg:w-16" />
        </div>
        <CarouselContent>
          {products.map((product) => {
            // Find the main view image
            const mainImage = product.images.find((img) => img.description === "main view");

            return (
              <CarouselItem key={product._id} className="lg:basis-1/4 basis-1/2">
                <div
                  className="m-auto lg:w-full border-2 border-gray-300 p-4 cursor-pointer"
                  onClick={() => handleProductClick(product._id)} // Add onClick handler
                >
                  <img
                    src={mainImage ? mainImage.url : ""}
                    alt={product.productName}
                    className="w-full h-48 object-contain mb-4 lg:mb-8"
                  />
                  <h3 className="text-sm lg:text-lg font-bold mb-2">{product.productName}</h3>
                  <p className="text-sm lg:text-2xl text-gray-500">₹{product.price}</p>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CarouselComp;
