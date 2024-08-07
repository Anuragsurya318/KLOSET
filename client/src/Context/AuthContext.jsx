// Context/AuthContext.jsx
import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    token: null,
    availableMoney: null,
    userID: null,
    purchasedItems: [],
  });
  const [error, setError] = useState(""); // Add error state

  const login = async (username, password) => {
    try {
      // Send login request
      const response = await axios.post("http://localhost:3000/user/login", { username, password });
      const { token, userID } = response.data;

      // Fetch available money
      const moneyResponse = await axios.get(
        `http://localhost:3000/user/available-money/${userID}`,
        {
          headers: { Authorization: token },
        }
      );
      const { availableMoney } = moneyResponse.data;

      // Fetch purchased items
      const purchasedItemsResponse = await axios.get(
        `http://localhost:3000/product/purchased-items/${userID}`,
        {
          headers: { Authorization: token },
        }
      );
      const { purchasedItems } = purchasedItemsResponse.data;

      // Update auth state
      setAuth({ isLoggedIn: true, token, availableMoney, userID, purchasedItems });
      setError(""); // Clear any previous error on successful login
    } catch (error) {
      console.error("Login failed", error);
      setError("Invalid credentials. Please try again."); // Set error message on login failure
      return "Invalid credentials. Please try again."; // Return error message
    }
  };

  const logout = () => {
    setAuth({
      isLoggedIn: false,
      token: null,
      availableMoney: null,
      userID: null,
      purchasedItems: [],
    });
  };

  const updateAvailableMoney = (newAmount) => {
    setAuth((prevAuth) => ({
      ...prevAuth,
      availableMoney: newAmount,
    }));
  };

  const purchaseProduct = async (userID, productID, productPrice, quantity) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/purchase",
        { userID, productID, productPrice, quantity },
        {
          headers: { Authorization: auth.token },
        }
      );
      const { availableMoney, purchasedItems } = response.data; // Get updated purchasedItems
      setAuth((prevAuth) => ({
        ...prevAuth,
        availableMoney,
        purchasedItems, // Update purchasedItems in auth state
      }));
    } catch (error) {
      console.error("Purchase failed", error);
    }
  };

  const purchaseAllProducts = async (cartItems) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/purchase-all",
        { userID: auth.userID, cartItems },
        {
          headers: { Authorization: auth.token },
        }
      );
      const { availableMoney, purchasedItems } = response.data;
      setAuth((prevAuth) => ({
        ...prevAuth,
        availableMoney,
        purchasedItems,
      }));
    } catch (error) {
      console.error("Purchase all failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
        error,
        updateAvailableMoney,
        purchaseProduct,
        purchaseAllProducts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
