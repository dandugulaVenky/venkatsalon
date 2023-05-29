import axios from "axios";

import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/footer/Footer";
import Greeting from "../components/navbar/Greeting";
import Layout from "../components/navbar/Layout";
import Sidebar from "../components/navbar/SIdebar";

import { SearchContext } from "../context/SearchContext";

import { AuthContext } from "../context/AuthContext";

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

export const PaymentSuccess = () => {
  const seachQuery = useSearchParams()[0];
  const { user: mainUser } = useContext(AuthContext);
  const referenceNum = seachQuery.get("reference");
  const navigate = useNavigate();

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

      return null;
    }
  };

  useEffectOnce(async () => {
    let finalBookingDetails = await getFinalBookingDetails();

    if (finalBookingDetails) {
      handleBooking(finalBookingDetails);
    } else {
      return alert("Something went wrong!");
    }

    return () => console.log("My effect is destroying");
  }, []);

  const bookNow = async (finalBookingDetails) => {
    const selectedSeats1 = finalBookingDetails?.selectedSeats.filter((seat) => {
      return seat.options.length > 0;
    });

    try {
      await axios.post(
        `/api/hotels/updateRequests/${finalBookingDetails?.shopId}`,
        {
          dates: finalBookingDetails.dates,
          user: finalBookingDetails?.user,
          selectedSeats: selectedSeats1,
          totalAmount: finalBookingDetails?.totalAmount,
          shopId: finalBookingDetails?.shopId,
          shopName: finalBookingDetails?.shopName,
          bookId: finalBookingDetails?.bookId,
          isPaid: true,
          isDone: "false",
          referenceNumber: referenceNum,
        }
      );

      await axios.post(`/api/users/bookings/${finalBookingDetails?.user._id}`, {
        dates: finalBookingDetails.dates,
        shopId: finalBookingDetails?.shopId,
        shopName: finalBookingDetails?.shopName,
        bookId: finalBookingDetails?.bookId,
        selectedSeats: selectedSeats1,
        totalAmount: finalBookingDetails?.totalAmount,
        isPaid: true,
        isDone: "false",
        referenceNumber: referenceNum,
      });

      await axios.post(`/api/users/clearfinalBookingDetails/${mainUser._id}`);

      await axios.post("/api/sendmail", {
        email: finalBookingDetails?.user.email,
        userName: finalBookingDetails?.user.username,
        userNumber: finalBookingDetails?.user.phone,
        dates: finalBookingDetails?.dates,
        shopName: finalBookingDetails?.shopName,
        ownerEmail: finalBookingDetails?.ownerEmail,
        ownerNumber: finalBookingDetails?.ownerEmail,
        totalAmount: finalBookingDetails?.totalAmount,
        selectedSeats: selectedSeats1,
        referenceNumber: referenceNum,
        link: "https://main--profound-babka-e67f58.netlify.app/history",
      });

      navigate("/", {
        state: { referenceNum: referenceNum },
      });
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  let isExecuted = false;
  const handleBooking = async (finalBookingDetails) => {
    await Promise.all(
      finalBookingDetails?.selectedSeats.map((room, i) => {
        const correctDate = finalBookingDetails?.dates.filter((date) => {
          return date.findId === room.id;
        });

        return (
          room.options.length > 0 &&
          axios
            .put(`/api/rooms/availability/${room.id}`, {
              dates: correctDate,
            })
            .then((res) => {
              if (
                (!isExecuted && finalBookingDetails !== null) ||
                (!isExecuted && finalBookingDetails !== undefined)
              ) {
                bookNow(finalBookingDetails);

                isExecuted = true;
              }
              return console.log(res.status);
            })
            .catch((err) => {
              isExecuted = true;
              localStorage.removeItem("count");

              return (
                err.response.status === 400 &&
                navigate("/failure", { state: { referenceNum: referenceNum } })
              );
            })
        );
      })
    );
  };

  let w = window.innerWidth;
  const { open } = useContext(SearchContext);

  return (
    <div className="">
      {open && <Sidebar />}
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
