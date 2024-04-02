import React, { useState, useContext } from "react";
import { ShopContext } from "../../context/shop-context";
import "./style.css";

export const Product = (props) => {
  const { _id, productName, description, price, stockQuantity, imageURL } = props.product;
  const { addToCart, getCartItemCount } = useContext(ShopContext);

  const cartItemCount = getCartItemCount(_id);

  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const displayDescription = showMore ? description : `${description.substring(0, 100)}...`;

  return (
    <div className="product">
      <img src={imageURL} alt={productName} />
      <div className="description" onClick={toggleShowMore}>
        <h3>{productName}</h3>
        <p>{displayDescription}</p>
        {!showMore && <p className="more">more</p>}
        <p> ₹{price}</p>
      </div>
      <button className="addToCartBttn" onClick={() => addToCart(_id)}>
        Add To Cart {cartItemCount > 0 && <> ({cartItemCount})</>}
      </button>

      <div className="stockQuantity">{stockQuantity === 0 && <h1> OUT OF STOCK</h1>}</div>
    </div>
  );
};
