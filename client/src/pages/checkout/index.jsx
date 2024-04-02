import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/shop-context";
import { useGetProducts } from "../../hooks/useGetProducts";
import "./style.css";
import { CartItem } from "./CartItem";

export const CheckoutPage = () => {
  const { getCartItemCount, getTotalCartAmount, checkout, clearCart } = useContext(ShopContext);
  const totalAmount = getTotalCartAmount();

  const navigate = useNavigate();

  const [checkoutCount, setCheckoutCount] = useState(0);

  const { products, fetchProducts } = useGetProducts();

  useEffect(() => {
    fetchProducts();
  }, [checkoutCount]);

  const handleCheckout = (userId) => {
    checkout(userId);
    navigate("/");
    setCheckoutCount((prevCount) => prevCount + 1);
    clearCart();
  };

  return (
    <div className="cart">
      <div>
        <h1>Your Cart Items</h1>
      </div>
      <div className="cart">
        {products.map((product) => {
          if (getCartItemCount(product._id) !== 0) {
            return <CartItem data={product} key={product._id} />;
          }
        })}
      </div>

      {totalAmount > 0 ? (
        <div className="checkout">
          <p> Subtotal: ₹{totalAmount} </p>
          <button onClick={() => navigate("/")}> Continue Shopping </button>
          <button
            onClick={() => {
              handleCheckout(localStorage.getItem("userID"));
            }}
          >
            Checkout
          </button>
        </div>
      ) : (
        <h1> Your Shopping Cart is Empty</h1>
      )}
    </div>
  );
};
