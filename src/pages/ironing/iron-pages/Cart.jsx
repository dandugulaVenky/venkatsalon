import React, { useContext } from "react";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../ironing-utils/Store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { SearchContext } from "../../../context/SearchContext";
import SIdebar from "../../../components/navbar/SIdebar";
import Greeting from "../../../components/navbar/Greeting";
import Seo from "../../../utils/Seo";
import Layout from "../../../components/navbar/Layout";
import Footer from "../../../components/footer/Footer";
import useEffectOnce from "../../../utils/UseEffectOnce";
import { useTranslation } from "react-i18next";

const siteMetadata = {
  title: "Home | Effortless Appointments With Easytym",
  description:
    "Easytym provides reliable salon booking services, connecting customers with top-quality beauty parlours and professional ironing services.",
  canonical: "https://easytym.com",
};

function Cart() {
  useEffectOnce(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { open } = useContext(SearchContext);
  let w = window.innerWidth;
  const { t } = useTranslation();

  const {
    cart: { cartItems },
  } = state;
  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };
  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);

    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    toast.success("Product updated in the cart");
  };
  return (
    <>
      {""}

      <Seo props={siteMetadata} />

      <div className="bg-gray-200 h-[100vh] md:px-14 px-5 py-10">
        <h1 className="mb-4 text-xl">{t("shoppingCart")}</h1>
        {cartItems.length === 0 ? (
          <div className="font-bold py-2">
            {t("emptyCart")}{" "}
            <Link to="/iron" className="primary-button">
              {t("goAddingItems")}
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 lg:gap-5  ">
            <div className="overflow-x-auto lg:col-span-3 h-auto ">
              <table className="min-w-full ">
                <thead className="border-b">
                  <tr className=" border-2 border-b-white">
                    <th className="p-5 text-left">{t("item")}</th>
                    <th className="p-5 text-right">{t("quantity")}</th>
                    <th className="p-5 text-right">{t("price")}</th>
                    <th className="p-5">{t("action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.slug} className=" border-2 border-b-white">
                      <td>
                        <Link to={`/iron/product/${item.slug}`}>
                          <a className="flex items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></img>
                            &nbsp;
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className="p-5 text-right">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-5 text-right">Rs.{item.price}</td>
                      <td className="p-5 text-center">
                        <button onClick={() => removeItemHandler(item)}>
                          <FontAwesomeIcon icon={faXmarkCircle} size="lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card px-5 my-10 md:my-0 lg:h-[30vh] py-5">
              <ul>
                <li>
                  <div className="pb-3 text-xl">
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) :
                    {t("rs")}.
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/iron/shipping")}
                    className="primary-button w-full"
                  >
                    {t("checkOut")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate(-1)}
                    className="default-button  border-2 border-red-200 w-full my-2"
                  >
                    {t("goBack")}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
