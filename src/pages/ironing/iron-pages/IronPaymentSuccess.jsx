import axios from "axios";

import React, { useCallback } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Store } from "../ironing-utils/Store";
import Cookies from "js-cookie";
import baseUrl from "../../../utils/client";
import { AuthContext } from "../../../context/AuthContext";
import { SearchContext } from "../../../context/SearchContext";
import SIdebar from "../../../components/navbar/SIdebar";
import Layout from "../../../components/navbar/Layout";
import Greeting from "../../../components/navbar/Greeting";
import Footer from "../../../components/footer/Footer";

const useEffectOnce = (effect) => {
  const destroyFunc = useRef();
  const effectCalled = useRef(false);
  const renderAfterCalled = useRef(false);
  const [val, setVal] = useState(0);

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFunc.current = effect();
      effectCalled.current = true;
    }

    // this forces one render after the effect is run
    setVal((val) => val + 1);

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!renderAfterCalled.current) {
        return;
      }
      if (typeof destroyFunc.current === "function") {
        destroyFunc.current();
      }
    };
  }, []);
};

export const IronPaymentSuccess = () => {
  let w = window.innerWidth;
  const seachQuery = useSearchParams()[0];
  const { user: mainUser } = useContext(AuthContext);
  const { open } = useContext(SearchContext);
  const referenceNum = seachQuery.get("reference");
  const navigate = useNavigate();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const { cartItems, shippingAddress } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  ); // 123.4567 => 123.46

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  const generateRandomString = useCallback((length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }, []);

  useEffectOnce(async () => {
    const id = generateRandomString(20);
    if (id) {
      try {
        const { data } = await axios.post(
          `${baseUrl}/api/users/iron/updateIronOrders/${mainUser?._id}`,
          {
            orderItems: cartItems,
            shippingAddress,
            user: mainUser?._id,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            orderId: id,
          },
          { withCredentials: true }
        );

        dispatch({ type: "CART_CLEAR_ITEMS" });
        Cookies.set(
          "iron-cart",
          JSON.stringify({
            ...cart,
            cartItems: [],
          })
        );
        navigate("/iron", {
          state: { referenceNum: referenceNum },
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      toast("Something went wrong!");
      setTimeout(() => {
        navigate("/iron");
      }, 3000);
    }
    return () => console.log("My effect is destroying");
  }, []);

  return (
    <div className="">
      {open && <SIdebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}

      <div className="md:h-[75vh] h-[65vh] flex flex-col items-center justify-center">
        Reference No.{referenceNum}
        <img
          src="https://media.giphy.com/media/mks5DcSGjhQ1a/giphy.gif"
          alt="gif"
          className="mt-2"
        />
      </div>

      <Footer />
    </div>
  );
};
