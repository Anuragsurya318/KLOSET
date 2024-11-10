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
            src="https://img.freepik.com/premium-photo/aesthetic-modern-scandinavian-home-interior-design-elegant-living-room-with-comfortable-sofa-midcentury-furniture-cozy-carpet-wooden-floor-white-walls-home-plants_408798-11066.jpg"
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
            src="https://wallpapercave.com/wp/wp10558592.jpg"
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
              src="https://mbazar.co/cdn/shop/products/WhatsAppImage2022-07-19at1.40.09PM_800x.jpg?v=1658229218"
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
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5rgR8ehHWnOiXsuxpaldXslS2DaiE9RNRfA&s"
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
