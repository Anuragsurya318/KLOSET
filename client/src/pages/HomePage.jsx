import React from "react";
import { useNavigate } from "react-router-dom";
import ProductsWeAreProudOf from "@/section/ProductsWeAreProudOf";

const HomePage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate("/categories", { state: { category } });
  };

  return (
    <>
      <div className="flex justify-center lg:justify-normal gap-4 flex-wrap mt-5 lg:mt-6 w-[87%] m-auto">
        <div
          className="relative group w-full sm:w-[45%] md:w-[33%] lg:w-[45%] hover:cursor-pointer h-52 lg:h-[550px]"
          onClick={() => handleCategoryClick("Furniture")}
        >
          <img
            src="https://minimalist-e-commerce.vercel.app/static/media/home-img-1.3de7da0f1e4634169c62.jpg"
            alt="Live Comfortable"
            className="w-full h-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-xl lg:text-5xl bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-bg duration-700">
            Live Comfortable
          </span>
        </div>
        <div
          className="relative group w-full sm:w-[45%] md:w-[33%] lg:w-[25%] hover:cursor-pointer h-52 lg:h-[550px]"
          onClick={() => handleCategoryClick("Skin Care")}
        >
          <img
            src="https://minimalist-e-commerce.vercel.app/static/media/home-img-2.4daa711cfda65062efd0.jpg"
            alt="Skincare"
            className="w-full h-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-xl lg:text-5xl bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-bg duration-700">
            Skincare
          </span>
        </div>
        <div className="flex gap-4 w-full sm:w-[45%] md:w-[33%] lg:flex-col lg:h-[550px] lg:w-[320px]">
          <div
            className="relative group w-full hover:cursor-pointer h-52 lg:h-[270px]"
            onClick={() => handleCategoryClick("Kitchen")}
          >
            <img
              src="https://minimalist-e-commerce.vercel.app/static/media/home-img-3.60734311499ba1dbbc41.jpg"
              alt="Kitchen"
              className="w-full h-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center text-white text-xl lg:text-5xl bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-bg duration-700">
              Kitchen
            </span>
          </div>
          <div
            className="relative group w-full hover:cursor-pointer h-52 lg:h-[263px]"
            onClick={() => handleCategoryClick("Electronics")}
          >
            <img
              src="https://minimalist-e-commerce.vercel.app/static/media/home-img-4.672d1d0d7656e2a778f6.jpg"
              alt="Electronics"
              className="w-full h-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center text-white text-xl lg:text-5xl bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-bg duration-700">
              Electronics
            </span>
          </div>
        </div>
      </div>
      <div>
        <ProductsWeAreProudOf />
      </div>
    </>
  );
};

export default HomePage;
