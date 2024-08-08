import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/Context/AuthContext";

const PreviouslyPurchasedItems = () => {
  const { auth } = useAuth();
  const [purchasedItems, setPurchasedItems] = useState([]);

  console.log(auth);

  useEffect(() => {
    const fetchPurchasedItems = async () => {
      try {
        const response = await axios.get(
          `https://kloset.onrender.com/product/purchased-items/${auth.userID}`,
          {
            headers: { Authorization: auth.token },
          }
        );
        setPurchasedItems(response.data.purchasedItems);
      } catch (error) {
        console.error("Failed to fetch purchased items", error);
      }
    };

    if (auth.isLoggedIn) {
      fetchPurchasedItems();
    }
  }, [auth.isLoggedIn, auth.token, auth.userID]);

  // Count the occurrences of each product ID
  const countOccurrences = (arr) => {
    return arr.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
  };

  const productCounts = countOccurrences(auth.purchasedItems);

  // Aggregate purchased items with their counts
  const aggregatedItems = purchasedItems.map((item) => ({
    ...item,
    count: productCounts[item._id] || 0,
  }));

  console.log(purchasedItems);

  return (
    <div className="w-[87%] m-auto pt-16 mb-16">
      <h1 className="text-2xl font-semibold mb-4">Previously Purchased Items</h1>
      {aggregatedItems.length === 0 ? (
        <p>No purchased items found.</p>
      ) : (
        <ul className="flex flex-wrap gap-4">
          {aggregatedItems.map((item, index) => (
            <li
              key={index}
              className="border-2 border-gray-300 hover:border-gray-600 duration-700 cursor-pointer w-[47%] h-72 flex flex-col justify-between lg:h-[340px] lg:w-[22%]"
            >
              <div className="w-[90%] lg:w-full">
                <img
                  src={item.images[0].url ? item.images[0].url : "default-image-url.jpg"}
                  alt={"Product Image"}
                  className="lg:w-[80%] m-auto object-cover"
                />
              </div>
              <div className="ml-2 mb-2">
                <h2 className="text-lg pr-3 lg:text-xl font-semibold">{item.productName}</h2>
                <p className="text-lg text-gray-600 font-bold">Price: ₹{item.price}</p>
                <p className={`${item.count === 0 ? `hidden` : ``}`}>
                  Quantity Purchased: <span className="font-semibold">{item.count}</span>
                </p>
                {/* Display the count */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PreviouslyPurchasedItems;
