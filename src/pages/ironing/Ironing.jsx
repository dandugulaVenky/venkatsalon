import React from "react";
import SIdebar from "../../components/navbar/SIdebar";
import Greeting from "../../components/navbar/Greeting";

import { SearchContext } from "../../context/SearchContext";
import Seo from "../../utils/Seo";
import Footer from "../../components/footer/Footer";
import Layout from "../../components/navbar/Layout";
import CarouselBanner from "../../components/CarouselBanner";
import { useEffect, useState, useContext } from "react";

import { toast } from "react-toastify";
import { Store } from "./ironing-utils/Store";
import ProductItem from "./ironing-utils/ProductItem";

const siteMetadata = {
  title: "Ironing | Effortless Ironing With Easytym",
  description: "Easytym provides reliable and professional ironing services.",
  canonical: "https://easytym.com/iron",
};

export default function Ironing() {
  let w = window.innerWidth;
  const { open } = useContext(SearchContext);
  const [homeImg, setHomeImg] = useState(false);

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  console.log(cart);

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });

    toast.success("Product added to the cart");
  };

  const products = [
    {
      _id: 0,
      name: "Shirts",
      image: "https://picsum.photos/800/600?random=5",
      slug: "shirts",
      price: "12",
    },
    {
      _id: 1,
      name: "Pants",
      image: "https://picsum.photos/800/600?random=5",
      slug: "pants",
      price: "12",
    },
    {
      _id: 2,
      name: "Sarees",
      image: "https://picsum.photos/800/600?random=5",
      slug: "sarees",
      price: "50",
    },
    {
      _id: 2,
      name: "Others",
      image: "https://picsum.photos/800/600?random=5",
      slug: "others",
      price: "50",
    },
  ];

  return (
    <>
      {open && <SIdebar />}
      {w < 768 && <Greeting />}
      <Seo props={siteMetadata} />
      <div className={` ${homeImg ? "home-img1" : "home-img2"} mb-5`}>
        <div className=" px-4">{w >= 768 && <Layout />}</div>
        <div className="md:h-[75vh] h-[90vh] flex  flex-col items-center justify-center ">
          <h1 className="text-[#00ccbb] md:text-6xl text-4xl text-center font-bold">
            Hi Welcome To Easytym Ironing🫡
          </h1>
          <h1 className="text-gray-700 md:px-64 px-4 text-md font-bold text-center py-5">
            Our company provides convenient and reliable salon booking services,
            connecting customers with top-quality beauty parlours and
            professional ironing services. With our user-friendly platform,
            customers can easily book appointments at their favourite saloons or
            parlours and schedule an at-home pickup and delivery ironing
            service, saving your time and hassle.
          </h1>
        </div>
      </div>
      <CarouselBanner />

      <div className="px-4 py-14">
        <h2 className="h2 my-4 text-xl font-semibold">Items</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            ></ProductItem>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
