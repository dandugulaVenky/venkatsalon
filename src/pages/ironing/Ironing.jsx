import React from "react";

import { SearchContext } from "../../context/SearchContext";
import Seo from "../../utils/Seo";

import CarouselBanner from "../../components/CarouselBanner";
import { useState, useContext } from "react";

import { toast } from "react-toastify";
import { Store } from "./ironing-utils/Store";
import ProductItem from "./ironing-utils/ProductItem";
import useEffectOnce from "../../utils/UseEffectOnce";
import "./styles.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const siteMetadata = {
  title: "Ironing | Effortless Ironing With Saalons",
  description: "Saalons provides reliable and professional ironing services.",
  canonical: "https://saalons.com/iron",
};

export default function Ironing() {
  let w = window.innerWidth;

  const location = useLocation();
  const navigate = useNavigate();

  const [reference, setReference] = useState(location?.state?.referenceNum);

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { t } = useTranslation();

  const handleToast = () => {
    toast("Ordered successfully 🎉");

    navigate("/iron", { state: null });
    return null;
  };

  console.log("hii");
  useEffectOnce(() => {
    window.scrollTo(0, 0);
    reference !== undefined && reference !== null && handleToast();
  }, []);

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
      id: "0",
      name: "Shirts",
      image:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ5KbDS5XHqc7JwvdH27YvP96wbS0FzLDTXlPPtAQJK9NKrjULDQ2mFRt3kzN0NYpE4CqXJpXhnG9fsePBDnPTpKwLiBhnvHImNa7cplwVfWLHnYq6RFfN-",
      slug: "shirts",
      price: "12",
    },
    {
      id: "1",
      name: "Pants",
      image:
        "https://5.imimg.com/data5/SELLER/Default/2021/12/LY/WW/SE/102288778/16-500x500.jpg",
      slug: "pants",
      price: "12",
    },
    {
      id: "2",
      name: "Sarees",
      image:
        "https://t4.ftcdn.net/jpg/01/67/25/37/360_F_167253732_FVaF7PyA5vat3JVPvP4F5AsCoZkYAnZF.jpg",
      slug: "sarees",
      price: "50",
    },
    {
      id: "3",
      name: "Others",
      image: "https://picsum.photos/800/600?random=5",
      slug: "others",
      price: "50",
    },
  ];
  let images = [];
  w >= 539
    ? (images = [
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1691922131/easytym_ehuu84.gif",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1691923496/2_inpdfe.png",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1691923462/3_sbjb2n.png",
      ])
    : (images = [
        "https://res.cloudinary.com/duk9xkcp5/image/upload/v1692469472/A_New_Design_-_Made_with_PosterMyWall_6_ja8ott.jpg",
        "https://res.cloudinary.com/duk9xkcp5/image/upload/v1692469472/A_New_Design_-_Made_with_PosterMyWall_6_ja8ott.jpg",
        "https://res.cloudinary.com/duk9xkcp5/image/upload/v1692469472/A_New_Design_-_Made_with_PosterMyWall_6_ja8ott.jpg",
        "https://res.cloudinary.com/duk9xkcp5/image/upload/v1692469472/A_New_Design_-_Made_with_PosterMyWall_6_ja8ott.jpg",
      ]);
  return (
    <>
      <Seo props={siteMetadata} />
      <div className="home-img mb-5">
        <div className="md:h-[75vh] h-[90vh] flex  flex-col items-center justify-center ">
          <h1 className="text-[#00ccbb] md:text-6xl text-4xl text-center font-bold">
            {t("ironingWelcome")}
          </h1>
          <h1 className="text-white md:px-64 px-4 text-md font-bold text-center py-5">
            {t("ironingMessage")}
          </h1>
        </div>
      </div>
      <div className={` w-full mx-auto  md:rounded md:px-4 md:py-3`}>
        <CarouselBanner autoSlide={true}>
          {images.map((s) => {
            return (
              <img
                src={s}
                className="md:rounded"
                style={{
                  backgroundPosition: "center",

                  backgroundSize: "cover",
                  width: "100%",
                }}
                alt="carousel-img"
              />
            );
          })}
        </CarouselBanner>
      </div>

      <div className="px-4 pb-14">
        <h2 className="h2 my-4 text-xl font-semibold">{t("items")}</h2>

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
    </>
  );
}
