import axios from "axios";

import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../context/AuthContext";
import baseUrl from "../utils/client";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const getFinalBookingDetails = async () => {
    try {
      const { data, status } = await axios.get(
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
    let finalBookingDetails = await getFinalBookingDetails();

    if (finalBookingDetails) {
      handleBooking(finalBookingDetails);
    } else {
      return alert(t("somethingWentWrong"));
    }

    return () => console.log("My effect is destroying");
  }, []);

  const bookNow = async (finalBookingDetails) => {
    const selectedSeats1 = finalBookingDetails?.selectedSeats.filter((seat) => {
      return seat.options.length > 0;
    });

    try {
      await axios.post(
        `${baseUrl}/api/hotels/updateRequests/${finalBookingDetails?.shopId}`,
        {
          dates: finalBookingDetails.dates,
          user: finalBookingDetails?.user,
          selectedSeats: selectedSeats1,
          type: finalBookingDetails?.type,
          totalAmount: finalBookingDetails?.totalAmount,
          shopId: finalBookingDetails?.shopId,
          shopName: finalBookingDetails?.shopName,
          bookId: finalBookingDetails?.bookId,
          isPaid: true,
          isDone: "false",
          referenceNumber: referenceNum,
        },
        { withCredentials: true }
      );

      await axios.post(
        `${baseUrl}/api/users/bookings/${finalBookingDetails?.user._id}`,
        {
          dates: finalBookingDetails.dates,
          shopId: finalBookingDetails?.shopId,
          shopName: finalBookingDetails?.shopName,
          bookId: finalBookingDetails?.bookId,
          selectedSeats: selectedSeats1,
          type: finalBookingDetails?.type,

          totalAmount: finalBookingDetails?.totalAmount,
          isPaid: true,
          isDone: "false",
          referenceNumber: referenceNum,
        },
        { withCredentials: true }
      );

      await axios.post(
        `${baseUrl}/api/users/clearfinalBookingDetails/${mainUser._id}`,
        null,
        {
          withCredentials: true,
        }
      );

      await axios.post(
        `${baseUrl}/api/sendmail`,
        {
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
        },
        { withCredentials: true }
      );

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
            .put(
              `${baseUrl}/api/rooms/availability/${room.id}`,
              {
                dates: correctDate,
              },
              { withCredentials: true }
            )
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

  return (
    <div className="">
      <div className="md:h-[75vh] h-[65vh] flex flex-col items-center justify-center">
        Reference No.{referenceNum}
        <img
          src="https://media.giphy.com/media/mks5DcSGjhQ1a/giphy.gif"
          alt="gif"
          className="mt-2"
        />
      </div>
    </div>
  );
};
