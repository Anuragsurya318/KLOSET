import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const CategoriesPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://kloset.onrender.com/product");
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
        if (location.state && location.state.category) {
          setSelectedCategory(location.state.category);
        }
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, [location.state]);

  useEffect(() => {
    handleCategoryChange(selectedCategory);
  }, [selectedCategory, products]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      let filtered;
      switch (category) {
        case "Skin Care":
          filtered = products.filter((product) =>
            [product.productName, product.description].some((text) =>
              text.toLowerCase().includes("oil")
            )
          );
          break;
        case "Furniture":
          filtered = products.filter((product) =>
            [product.productName, product.description].some(
              (text) =>
                text.toLowerCase().includes("vase") ||
                text.toLowerCase().includes("shelf") ||
                text.toLowerCase().includes("pulp unit - 5 compartments")
            )
          );
          break;
        case "Electronics":
          filtered = products.filter((product) =>
            [product.productName, product.description].some((text) =>
              text.toLowerCase().includes("anti dark light")
            )
          );
          break;
        case "Kitchen":
          filtered = products.filter((product) =>
            [product.productName, product.description].some(
              (text) =>
                text.toLowerCase().includes("pop-up toaster") ||
                text.toLowerCase().includes("unbleached cotton pads 180")
            )
          );
          break;
        case "Lamp":
        case "Chair":
          filtered = products.filter((product) =>
            [product.productName, product.description].some((text) =>
              text.toLowerCase().includes(category.toLowerCase())
            )
          );
          break;
        default:
          filtered = [];
      }
      setFilteredProducts(filtered);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/categories/product/${productId}`);
  };

  const categories = ["All", "Furniture", "Electronics", "Lamp", "Kitchen", "Chair", "Skin Care"];

  return (
    <div className="w-full">
      <div className="w-[87%] m-auto mt-12 text-xl font-semibold lg:text-2xl">
        Products in {selectedCategory}
      </div>
      <div className="w-[87%] m-auto ">
        <div className="flex flex-wrap gap-4 my-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 border-2 text-base lg:text-lg font-semibold border-black ${
                selectedCategory === category ? "bg-black text-white" : "bg-transparent"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-5 m-auto mb-16">
          {filteredProducts.map((product) => {
            const mainImage = product.images.find((image) => image.description === "main view");

            return (
              <div
                key={product._id}
                className="border-2 border-gray-300 hover:border-gray-600 duration-700 cursor-pointer w-[47%] h-72 flex flex-col justify-between lg:h-[340px] lg:w-[23.8%]"
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
