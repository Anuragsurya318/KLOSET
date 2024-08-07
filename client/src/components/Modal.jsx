import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css"; // Ensure you have the styles for the modal

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
