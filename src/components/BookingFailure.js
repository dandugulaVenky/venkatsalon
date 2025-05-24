import React, { useEffect, useRef } from "react";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import baseUrl from "../utils/client";
import { useTranslation } from "react-i18next";
import axiosInstance from "./axiosInterceptor";
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

const BookingFailure = () => {
  const location = useLocation();
  const { user: mainUser } = useContext(AuthContext);
  const [reference, setReference] = useState(location?.state?.referenceNum);
  const { t } = useTranslation();

  const handleToast = () => {
    toast("Sorry for the inconvenience!");
    // navigate("/contactus", { state: null });
  };

  const sendMail = async (finalBookingDetails) => {
    try {
      await axiosInstance.post(
        `${baseUrl}/api/users/clearfinalBookingDetails/${mainUser._id}`,
        null,
        { withCredentials: true }
      );

      await axiosInstance.post(
        `${baseUrl}/api/sendmail/failure`,
        {
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

          link: "https://easytym.com/history",
        },
        { withCredentials: true }
      );
    } catch (err) {
      toast(err.response.data.message);
    }
  };

  const getFinalBookingDetails = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        `${baseUrl}/api/users/getFinalBookingDetails/${mainUser?._id}`,
        { withCredentials: true }
      );
      if (status === 201) {
        return data[0];
      } else {
        return null;
      }
    } catch (err) {
      toast.error(err.response.data.message);

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
      return alert(t("somethingWentWrong"));
    }

    return () => console.log("my effect is destroying");
  });

  return (
    <div className="pt-6 pb-20">
      <div className=" flex flex-col items-center justify-center ">
        {reference !== undefined && (
          <div className="flex flex-col items-center justify-center md:min-h-[70vh] min-h-[80vh]">
            <p>Reference : {reference}</p>
            <p className="ml-2 bg-red-500 p-4 mt-2 ">
              This seat and time are booked by someone else jusy by few seconds
              ago!. The reference Number and other details were mailed to you.
              We will refund your amount with in short time!
            </p>
            <Link to="/" className="primary-button mt-1">
              Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFailure;
