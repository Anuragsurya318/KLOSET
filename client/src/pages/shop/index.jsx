import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import "./style.css";
import { useGetProducts } from "../../hooks/useGetProducts";
import { Product } from "./Product";

export const ShopPage = () => {
  const [cookies, _] = useCookies(["access_token"]);

  const { products } = useGetProducts();

  if (!cookies.access_token) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="shop">
      <div className="products">
        {products.map((product) => (
          <Product product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
};
