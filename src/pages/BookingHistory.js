import React, { useContext, useEffect, useRef, useState } from "react";

import "../components/searchItem/searchItem.css";
import Footer from "../components/footer/Footer";

import useFetch from "../hooks/useFetch";

import { AuthContext } from "../context/AuthContext";

import BookingHistoryItem from "../components/BookingHistoryItem";
import { toast } from "react-toastify";
import {
  faCircleArrowDown,
  faCircleArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Layout from "../components/navbar/Layout";
import { SearchContext } from "../context/SearchContext";
import Sidebar from "../components/navbar/SIdebar";
import Greeting from "../components/navbar/Greeting";
import baseUrl from "../utils/client";

const BookingHistory = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, loading, error } = useFetch(
    `${baseUrl}/api/users/getBookings/${user._id}`,
    { credentials: true }
  );

  // if (error === false) {
  //   navigate("/login", { state: { destination: `/history` } });
  // }

  if (error?.response?.data?.status === 401) {
    navigate("/login", { state: { destination: `/history` } });
  }
  const [userInput, setUserInput] = useState("");

  const [visible, setVisible] = useState(5);

  const setLoadMore = () => setVisible((prev) => prev + 5);

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
        if (destroyFunc.current) {
          destroyFunc.current();
        }
      };
    }, []);
  };

  useEffectOnce(() => {
    console.log("my effect is running");

    if (error) {
      toast("Please login to see history!");
    }
    return () => console.log("my effect is destroying");
  });

  useEffect(() => {
    if (userInput) {
      return setVisible(5);
    }

    // console.log(userInput);
  }, [userInput]);

  function filterArray(array, userInput) {
    if (!userInput) {
      return array;
    }
    return data?.filter((booking) => {
      return (
        booking.referenceNumber
          .toLowerCase()
          .includes(userInput.toLowerCase()) ||
        booking.date.toLowerCase().includes(userInput.toLowerCase()) ||
        booking.time.toLowerCase().includes(userInput.toLowerCase())
      );
    });
  }
  const filteredArray = filterArray(data, userInput);
  // console.log(data);
  // console.log(visible);

  let w = window.innerWidth;
  const { open } = useContext(SearchContext);

  return (
    <div className="">
      {open && <Sidebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}

      <div className="flex min-h-screen flex-col ">
        {loading ? (
          <div className="min-h-[75vh] flex items-center justify-center">
            <span className="loader "></span>
          </div>
        ) : (
          <div className="lg:px-44 px-5  md:pt-5 pt-5 md:mb-32 pb-20 ">
            <div className="flex items-start justify-between mb-5">
              <h1 className="">Booking History</h1>

              <div className="flex flex-col items-center">
                <input
                  onChange={(e) => setUserInput(e.target.value)}
                  value={userInput}
                  className="bg-slate-100 text-black  rounded-md md:w-[14.3rem] w-[10.3rem]  mb-5"
                  placeholder="Filter by date,time,ref.."
                />
                <p className="md:text-md text-xs">
                  Count : {filteredArray.length}
                </p>
              </div>
            </div>

            <div className="">
              {filteredArray?.slice(0, visible).map((item, i) => {
                let k = i;
                return <BookingHistoryItem item={item} k={k} key={k} />;
              })}
            </div>
            {filteredArray?.length === 0 && (
              <h1 className="text-center min-h-screen">No Bookings</h1>
            )}
            {filteredArray?.length >= 5 && (
              <div className="flex items-center justify-center mt-10 mb-10">
                {visible >= filteredArray.length ? (
                  <button
                    className="primary-button"
                    onClick={() => {
                      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                    }}
                  >
                    <FontAwesomeIcon icon={faCircleArrowUp} />
                  </button>
                ) : (
                  <button className=" primary-button " onClick={setLoadMore}>
                    <FontAwesomeIcon icon={faCircleArrowDown} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;
