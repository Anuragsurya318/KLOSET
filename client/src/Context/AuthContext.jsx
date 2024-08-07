import React, { createContext, useState, useContext, useEffect } from "react";
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

  useEffect(() => {
    const savedAuth = JSON.parse(localStorage.getItem("auth"));
    if (savedAuth) {
      setAuth(savedAuth);
    }
  }, []);

  const login = async (username, password) => {
    try {
      // Send login request
      const response = await axios.post("https://kloset.onrender.com/user/login", {
        username,
        password,
      });
      const { token, userID } = response.data;

      // Fetch available money
      const moneyResponse = await axios.get(
        `https://kloset.onrender.com/user/available-money/${userID}`,
        {
          headers: { Authorization: token },
        }
      );
      const { availableMoney } = moneyResponse.data;

      // Fetch purchased items
      const purchasedItemsResponse = await axios.get(
        `https://kloset.onrender.com/product/purchased-items/${userID}`,
        {
          headers: { Authorization: token },
        }
      );
      const { purchasedItems } = purchasedItemsResponse.data;

      // Update auth state
      const newAuthState = { isLoggedIn: true, token, availableMoney, userID, purchasedItems };
      setAuth(newAuthState);
      localStorage.setItem("auth", JSON.stringify(newAuthState)); // Save to localStorage
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
    localStorage.removeItem("auth"); // Clear localStorage
  };

  const updateAvailableMoney = (newAmount) => {
    setAuth((prevAuth) => {
      const updatedAuth = { ...prevAuth, availableMoney: newAmount };
      localStorage.setItem("auth", JSON.stringify(updatedAuth)); // Update localStorage
      return updatedAuth;
    });
  };

  const purchaseProduct = async (userID, productID, productPrice, quantity) => {
    try {
      const response = await axios.post(
        "https://kloset.onrender.com/user/purchase",
        { userID, productID, productPrice, quantity },
        {
          headers: { Authorization: auth.token },
        }
      );
      const { availableMoney, purchasedItems } = response.data; // Get updated purchasedItems
      const updatedAuth = { ...auth, availableMoney, purchasedItems };
      setAuth(updatedAuth);
      localStorage.setItem("auth", JSON.stringify(updatedAuth)); // Update localStorage
    } catch (error) {
      console.error("Purchase failed", error);
    }
  };

  const purchaseAllProducts = async (cartItems) => {
    try {
      const response = await axios.post(
        "https://kloset.onrender.com/user/purchase-all",
        { userID: auth.userID, cartItems },
        {
          headers: { Authorization: auth.token },
        }
      );
      const { availableMoney, purchasedItems } = response.data;
      const updatedAuth = { ...auth, availableMoney, purchasedItems };
      setAuth(updatedAuth);
      localStorage.setItem("auth", JSON.stringify(updatedAuth)); // Update localStorage
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
