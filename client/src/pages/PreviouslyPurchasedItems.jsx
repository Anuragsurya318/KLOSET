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
          `http://localhost:3000/product/purchased-items/${auth.userID}`,
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Previously Purchased Items</h1>
      {aggregatedItems.length === 0 ? (
        <p>No purchased items found.</p>
      ) : (
        <ul>
          {aggregatedItems.map((item, index) => (
            <li key={index} className="py-2 border-b">
              <h2 className="text-xl font-semibold">{item.productName}</h2>
              <p>Price: ₹{item.price}</p>
              <p>Description: {item.description}</p>
              <p>Quantity Purchased: {item.count}</p> {/* Display the count */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PreviouslyPurchasedItems;
