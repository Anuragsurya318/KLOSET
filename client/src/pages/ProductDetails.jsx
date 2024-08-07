import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useCart } from "@/Context/CartContext";
import { useAuth } from "@/Context/AuthContext";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner"; // Import the Toaster and toast from Sonner

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { auth, updateAvailableMoney, purchaseProduct } = useAuth();
  const [quantity, setQuantity] = useState(1); // Initial quantity
  const [showDialog, setShowDialog] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [redirectPath, setRedirectPath] = useState("/"); // New state for redirect path
  const location = useLocation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // New state for confirm dialog

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("http://localhost:3000/product");
        const foundProduct = response.data.products.find((product) => product._id === id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = () => {
    // Add the product to the cart quantity times
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...product }); // Add a copy of the product with current quantity
    }
  };

  const handleBuyNow = () => {
    if (!auth.isLoggedIn) {
      setRedirectPath(location.pathname); // Store current location before showing login dialog
      setShowDialog(true);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      await purchaseProduct(auth.userID, product._id, product.price * quantity, quantity);
      setShowConfirmDialog(false);
      toast.success("Transaction Successful"); // Show success toast message
    } catch (error) {
      console.error("Error purchasing product:", error);
      toast.error("Transaction Failed"); // Show error toast message if needed
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>
      <img
        src={product.images.find((img) => img.description === "main view").url}
        alt={product.productName}
        className="w-full h-auto mb-4"
      />
      <p className="text-lg mb-4">{product.description}</p>
      <p className="text-xl font-semibold mb-4">₹{product.price * quantity}</p>
      {/* ... other product details */}
      <div className="flex items-center mb-4">
        <button
          onClick={handleDecreaseQuantity}
          className="bg-gray-300 text-gray-800 px-3 py-1 rounded-l"
        >
          -
        </button>
        <span className="px-4 py-2 border-t border-b border-gray-300">{quantity}</span>
        <button
          onClick={handleIncreaseQuantity}
          className="bg-gray-300 text-gray-800 px-3 py-1 rounded-r"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
      >
        ADD TO CART
      </button>
      <button
        onClick={handleBuyNow}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        BUY NOW
      </button>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-2">
              {isLoginForm ? "Login" : "Register"} Page
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mb-4">
              {isLoginForm
                ? "Please login to proceed with the purchase."
                : "Please register to proceed with the purchase."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {isLoginForm ? (
              <LoginForm
                switchToRegister={() => setIsLoginForm(false)}
                setShowDialog={setShowDialog}
                setLoginError={setLoginError}
                redirectPath={redirectPath} // Pass redirect path to LoginForm
              />
            ) : (
              <RegistrationForm
                switchToLogin={() => setIsLoginForm(true)}
                setShowDialog={setShowDialog}
              />
            )}
            {loginError && <p className="text-red-500">{loginError}</p>}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-2">Confirm Purchase</DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mb-4">
              Please confirm your purchase of {product.productName} for ₹{product.price * quantity}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <button
              onClick={handleConfirmPurchase}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirmDialog(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster /> {/* Add Toaster component */}
    </div>
  );
};

export default ProductDetails;
