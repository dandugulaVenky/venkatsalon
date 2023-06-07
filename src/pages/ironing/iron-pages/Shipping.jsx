import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

import { useNavigate } from "react-router-dom";
import { Store } from "../ironing-utils/Store";
import CheckoutWizard from "../ironing-utils/CheckoutWizard";
import SIdebar from "../../../components/navbar/SIdebar";
import Greeting from "../../../components/navbar/Greeting";
import Seo from "../../../utils/Seo";
import Layout from "../../../components/navbar/Layout";
import { SearchContext } from "../../../context/SearchContext";
import Footer from "../../../components/footer/Footer";
import useEffectOnce from "../../../utils/UseEffectOnce";

const siteMetadata = {
  title: "Home | Effortless Appointments With Easytym",
  description:
    "Easytym provides reliable salon booking services, connecting customers with top-quality beauty parlours and professional ironing services.",
  canonical: "https://easytym.com",
};

export default function Shipping() {
  useEffectOnce(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { open } = useContext(SearchContext);
  let w = window.innerWidth;

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const navigate = useNavigate();

  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("phone", shippingAddress.phone);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, phone }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, phone },
    });
    Cookies.set(
      "iron-cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          phone,
        },
      })
    );

    navigate("/iron/place-order");
  };

  return (
    <>
      {open && <SIdebar />}
      {w < 768 && <Greeting />}
      <Seo props={siteMetadata} />
      <div className=" px-4">{w >= 768 && <Layout />}</div>
      <div className="md:py-0.5 py-5">
        <CheckoutWizard activeStep={1} />
      </div>
      <form
        className="mx-auto max-w-screen-md py-12 md:px-12 px-7 h-[90vh]"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register("fullName", {
              required: "Please enter full name",
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Exact Address</label>
          <input
            className="w-full"
            id="address"
            {...register("address", {
              required: "Please enter address",
              minLength: {
                value: 8,
                message: "Address must be more than 8 chars",
              },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City/Town</label>
          <input
            className="w-full"
            id="city"
            {...register("city", {
              required: "Please enter city",
            })}
          />
          {errors.city && (
            <div className="text-red-500 ">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="phone">Current Phone Number</label>
          <input
            className="w-full"
            type="number"
            id="phone"
            {...register("phone", {
              required: "Please enter phone numbere",
            })}
          />
          {errors.phone && (
            <div className="text-red-500 ">{errors.phone.message}</div>
          )}
        </div>
        {/* <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            className="w-full"
            id="country"
            {...register("country", {
              required: "Please enter country",
            })}
          />
          {errors.country && (
            <div className="text-red-500 ">{errors.country.message}</div>
          )}
        </div> */}
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
      <Footer />
    </>
  );
}
