import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { CategoriesPage, HomePage, LoginPage, RegistrationPage, ShopPage } from "./pages";
import Navbar from "./section/Navbar";
import ProductDetails from "./pages/ProductDetails"; // Import your new product details page
import ProductPage from "./pages/ProductPage";
import { CartProvider } from "./Context/CartContext";
import PreviouslyPurchasedItems from "./pages/PreviouslyPurchasedItems";

const App = () => (
  <div className="font-sans">
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/categories/product/:id" element={<ProductDetails />} />
            <Route path="/product-page" element={<ProductPage />} />
            <Route path="/previously-purchased-items" element={<PreviouslyPurchasedItems />} />
            {/* Add this route */}
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  </div>
);

export default App;
