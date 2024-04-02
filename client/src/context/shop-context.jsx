import { createContext, useEffect, useState } from "react";
import { useGetProducts } from "../hooks/useGetProducts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGetToken } from "../hooks/useGetToken";

export const ShopContext = createContext(null);

export const ShopContextProvider = (props) => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [cartItems, setCartItems] = useState({}); // { itemID: amount }
  const [availableMoney, setAvailableMoney] = useState(0);
  const [purchasedItems, setPurchaseItems] = useState([]); // [itemID: amount]
  const [isAuthenticated, setIsAuthenticated] = useState(cookies.access_token !== null);

  const { products, fetchProducts } = useGetProducts();
  const { headers } = useGetToken();
  const navigate = useNavigate();

  const fetchAvailableMoney = async () => {
    const res = await axios.get(
      `http://localhost:3000/user/available-money/${localStorage.getItem("userID")}`,
      { headers }
    );
    setAvailableMoney(res.data.availableMoney);
  };

  const fetchPurchasedItems = async () => {
    const res = await axios.get(
      `http://localhost:3000/product/purchased-items/${localStorage.getItem("userID")}`,
      { headers }
    );

    setPurchaseItems(res.data.purchasedItems);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAvailableMoney();
      fetchPurchasedItems();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.clear();
      setCookies("access_token", null);
    }
  }, [isAuthenticated]);

  const getCartItemCount = (itemId) => {
    if (itemId in cartItems) {
      return cartItems[itemId];
    }

    return 0;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalCartAmount = () => {
    if (products.length === 0) return 0;

    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = products.find((product) => product._id === item);

        totalAmount += cartItems[item] * itemInfo.price;
      }
    }
    return Number(totalAmount.toFixed(2));
  };

  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = (itemId) => {
    if (!cartItems[itemId]) return;
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const updateCartItemCount = (newAmount, itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
  };

  const checkout = async () => {
    const body = { customerID: localStorage.getItem("userID"), cartItems };
    try {
      const res = await axios.post("http://localhost:3000/product/checkout", body, { headers });
      setPurchaseItems(res.data.purchasedItems);

      fetchAvailableMoney();
      fetchProducts();
      fetchPurchasedItems(); // Add this line
      navigate("/");
    } catch (err) {
      let errorMessage = "";
      switch (err.response.data.type) {
        case "NO_PRODUCT_FOUND":
          errorMessage = "No product found";
          break;
        case "NO_AVAILABLE_MONEY":
          errorMessage = "Not enough money";
          break;
        case "NOT_ENOUGH_STOCK":
          errorMessage = "Not enough stock";
          break;
        default:
          errorMessage = "Something went wrong";
      }

      alert("ERROR: " + errorMessage);
    }
  };

  const contextValue = {
    getCartItemCount,
    addToCart,
    updateCartItemCount,
    removeFromCart,
    getTotalCartAmount,
    checkout,
    availableMoney,
    fetchAvailableMoney,
    purchasedItems,
    isAuthenticated,
    setIsAuthenticated,
    clearCart,
    fetchPurchasedItems,
  };

  return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};
