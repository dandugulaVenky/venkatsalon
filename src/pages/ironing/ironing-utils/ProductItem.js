import React from "react";
import { Link } from "react-router-dom";

export default function ProductItem({ product, addToCartHandler }) {
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
          <h2 className="text-lg">{product.name}</h2>
        </Link>

        <p>Rs.{product.price}</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
