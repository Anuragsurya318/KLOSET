import { useContext, useEffect, useState } from "react";
import "./style.css";
import { ShopContext } from "../../context/shop-context";

export const PurchasedItemsPage = () => {
  const { purchasedItems, addToCart, getCartItemCount, fetchPurchasedItems } =
    useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPurchasedItems();
  }, []);

  useEffect(() => {
    if (purchasedItems) {
      setIsLoading(false);
    }
  }, [purchasedItems]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="purchased-items-page">
      <h1> Previously Purchased Items Page </h1>

      <div className="purchased-items">
        {purchasedItems.map((item, index) => {
          const cartItemCount = getCartItemCount(item._id);
          return (
            <div key={index} className="item">
              <h3> {item.productName} </h3>
              <img src={item.imageURL} alt={item.productName} />
              <p> ₹{item.price} </p>
              <button onClick={() => addToCart(item._id)}>
                Purchase Again {cartItemCount > 0 && <> ({cartItemCount})</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
