import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [loginError, setLoginError] = useState("");

  const openModal = (login = true) => {
    setIsLoginForm(login);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setLoginError(""); // Clear any errors when closing
  };

  return (
    <ModalContext.Provider
      value={{ showModal, isLoginForm, loginError, openModal, closeModal, setLoginError }}
    >
      {children}
    </ModalContext.Provider>
  );
};
