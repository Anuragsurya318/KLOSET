import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import Modal from "react-modal";

const ShopPage = () => {
  const { auth } = useAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleShopClick = () => {
    if (!auth.isLoggedIn) {
      setModalIsOpen(true);
    } else {
      // Redirect to the shop or perform shopping logic
    }
  };

  return (
    <div>
      <h1>Shop</h1>
      <button onClick={handleShopClick}>Go Shopping</button>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Please Register or Login First</h2>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default ShopPage;
