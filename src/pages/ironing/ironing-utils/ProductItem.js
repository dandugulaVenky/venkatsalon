import React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { t } from "i18next";

export default function ProductItem({ product, addToCartHandler }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCart = () => {
    if (!user) {
      return navigate("/login", { state: { destination: `/iron` } });
    }

    addToCartHandler(product);
  };

  return (
    <div className="card ">
      <Link to={`/iron/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow object-cover h-64 w-full"
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5 space-y-1">
        <Link to={`/iron/product/${product.slug}`}>
          <h2 className="text-lg">{t('productName',{name:product.name})}</h2>
        </Link>

        <p>{t('rs')}.{product.price}</p>
        <button className="primary-button" type="button" onClick={handleCart}>
          {t('addToCart')}
        </button>
      </div>
    </div>
  );
}
