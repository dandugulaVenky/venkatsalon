import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import axios from "axios";
import baseUrl from "../../utils/client";
import { FinalBookingContext } from "../../context/FinalBookingContext";
import { SearchContext } from "../../context/SearchContext";

const AppointmentPaymentSuccess = () => {
  let navigate = useNavigate();
  const seachQuery = useSearchParams()[0];
  const { user: mainUser } = useContext(AuthContext);
  const { type } = useContext(SearchContext);
  const { state } = useContext(FinalBookingContext);
  console.log(type, "maks");
  const referenceNum = seachQuery.get("reference");

  let isExecuted = false;

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

  useEffectOnce(async () => {
    const handleAppointment = async () => {
      try {
        await axios.put(
          `${baseUrl}/api/users/makeAnAppointment/${mainUser._id}`,
          {
            date: state.date,
            shopName: state.shopName,
            city: state.city,
            phone: state.phone,
            validity: "1 Day",
            totalAmount: 20,
            referenceNum,
            status: "pending",
            type,
            shopId: state.id,
          },
          { withCredentials: true }
        );

        await axios.put(
          `${baseUrl}/api/hotels/makeAnAppointment/${state.id}`,
          {
            date: state.date,
            totalAmount: 20,
            userId: mainUser._id,
            username: mainUser.username,
            shopName: state.shopName,

            email: mainUser.email,
            phone: mainUser.phone,
            validity: "1 Day",
            referenceNum,
            status: "pending",
            type,
            shopId: state.id,
          },
          { withCredentials: true }
        );

        alert("Done");
        isExecuted = true;
        navigate("/");
      } catch (err) {
        alert(err.response.data.message);
        navigate("/failure", { state: { referenceNum: referenceNum } });
      }
    };
    if (!isExecuted) {
      handleAppointment();
    }

    return () => console.log("My effect is destroying");
  }, []);

  return <div>AppointmentPaymentSuccess</div>;
};

export default AppointmentPaymentSuccess;
