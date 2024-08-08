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
  const [mainImage, setMainImage] = useState(""); // State for the main image
  const [images, setImages] = useState([]); // State for product images
  const { addToCart } = useCart();
  const { auth, updateAvailableMoney, purchaseProduct } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [redirectPath, setRedirectPath] = useState("/");
  const location = useLocation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("https://kloset.onrender.com/product");
        const foundProduct = response.data.products.find((product) => product._id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          // Set initial main image
          const initialImage = foundProduct.images.find(
            (img) => img.description === "main view"
          ).url;
          setMainImage(initialImage);
          // Store images in state
          setImages(foundProduct.images);
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
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!auth.isLoggedIn) {
      setRedirectPath(location.pathname);
      setShowDialog(true);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      await purchaseProduct(auth.userID, product._id, product.price * quantity, quantity);
      setShowConfirmDialog(false);
      toast.success("Transaction Successful");
    } catch (error) {
      console.error("Error purchasing product:", error);
      toast.error("Transaction Failed");
    }
  };

  const handleMouseOver = (url) => {
    setMainImage(url);
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="w-[87%] m-auto mb-24">
      <h1 className="text-3xl lg:text-4xl font-bold text-center mt-12">{product.productName}</h1>
      <div className="flex flex-col lg:flex-row w-full">
        <div className="lg:w-1/2">
          <img
            src={mainImage}
            alt={product.productName}
            className="w-4/5 lg:w-3/5 m-auto h-auto my-4"
          />
          <div className="flex gap-4 flex-wrap justify-center items-center">
            {images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.description}
                className="h-20 lg:h-32 lg:w-32 hover:shadow-xl hover:border-2 hover:border-gray-400"
                onMouseOver={() => handleMouseOver(image.url)}
              />
            ))}
          </div>
        </div>
        <div className="lg:w-1/2 bg-zinc-100 flex flex-col mt-10 justify-center items-center">
          <p className="text-lg lg:text-2xl mb-4 w-4/5 mt-10">{product.description}</p>
          <div className="flex items-center my-8 justify-between w-4/5">
            <div className="font-semibold text-xl lg:text-3xl">Quantity</div>
            <span className="lg:text-2xl text-xl font-semibold">
              <button
                onClick={handleDecreaseQuantity}
                className="bg-gray-300 text-gray-800 px-3 py-1 rounded-l"
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={handleIncreaseQuantity}
                className="bg-gray-300 text-gray-800 px-3 py-1 rounded-r"
              >
                +
              </button>
            </span>
            <p className="text-xl lg:text-3xl font-semibold">₹{product.price * quantity}</p>
          </div>
          <div className="flex justify-between mb-10 w-4/5 m-auto h-12 lg:h-16 lg:text-xl font-semibold">
            <button
              onClick={handleAddToCart}
              className="border-2 lg:border-4 border-black bg-transparent duration-500 hover:bg-black hover:text-white w-[48%]"
            >
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              className="border-2 lg:border-4 border-[#B6002C] bg-[#B6002C] duration-300 hover:bg-transparent hover:text-[#B6002C] text-white w-[48%]"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
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
                redirectPath={redirectPath}
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
      <Toaster />
    </div>
  );
};

export default ProductDetails;
