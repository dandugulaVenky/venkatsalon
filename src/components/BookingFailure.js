import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./footer/Footer";
import Greeting from "./navbar/Greeting";
import Layout from "./navbar/Layout";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import secureLocalStorage from "react-secure-storage";
import useEffectOnce from "../utils/UseEffectOnce";

const BookingFailure = () => {
  const location = useLocation();
  const { user: mainUser } = useContext(AuthContext);
  const [reference, setReference] = useState(location?.state?.referenceNum);
  const navigate = useNavigate();

  const handleToast = () => {
    toast("Sorry for the inconvenience!");
    // navigate("/contactus", { state: null });
  };

  const sendMail = async (finalBookingDetails) => {
    try {
      await axios.post("/api/sendmail/failure", {
        email: finalBookingDetails?.user.email,
        userName: finalBookingDetails?.user.username,
        userNumber: finalBookingDetails?.user.phone,
        dates: finalBookingDetails?.dates,
        shopName: finalBookingDetails?.shopName,
        ownerEmail: finalBookingDetails?.ownerEmail,
        ownerNumber: finalBookingDetails?.ownerNumber,
        totalAmount: finalBookingDetails?.totalAmount,
        selectedSeats: finalBookingDetails?.selectedSeats,

        referenceNumber: reference,

        link: "https://main--profound-babka-e67f58.netlify.app/history",
      });

      try {
        await axios.post(`/api/users/clearfinalBookingDetails/${mainUser._id}`);
      } catch (err) {
        toast.error(err?.response?.data?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getFinalBookingDetails = async () => {
    try {
      const { data, status } = await axios.get(
        `/api/users/getFinalBookingDetails/${mainUser?._id}`
      );
      if (status === 201) {
        return data[0];
      } else {
        return null;
      }
    } catch (err) {
      toast.error(err.response.data.message);
      secureLocalStorage.removeItem("session");

      return null;
    }
  };

  useEffectOnce(async () => {
    window.scrollTo(0, 0);
    let finalBookingDetails = await getFinalBookingDetails();

    if (finalBookingDetails) {
      reference !== undefined && reference !== null && handleToast();
      sendMail(finalBookingDetails);
    } else {
      return alert("Something went wrong!");
    }

    return () => console.log("my effect is destroying");
  });
  let w = window.innerWidth;

  return (
    <>
      {w < 768 && <Greeting />}
      {w >= 768 && <Layout />}
      <div className=" flex flex-col items-center justify-center pb-40">
        {reference !== undefined && (
          <div className="flex flex-col items-center justify-center md:min-h-[70vh] min-h-[80vh]">
            <p>Reference : {reference}</p>
            <p className="ml-2 bg-red-500 p-4 mt-2">
              This seat and time are booked by someone else jusy by few seconds
              ago!. The reference Number and other details were mailed to you.
              We will refund your amount with in short time!
            </p>
            <Link to="/get-started" className="primary-button mt-1">
              Home
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BookingFailure;
