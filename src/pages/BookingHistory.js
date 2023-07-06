import React, { useContext, useState } from "react";

import "../components/searchItem/searchItem.css";
import Footer from "../components/footer/Footer";

import useFetch from "../hooks/useFetch";

import { AuthContext } from "../context/AuthContext";

import { toast } from "react-toastify";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Layout from "../components/navbar/Layout";
import { SearchContext } from "../context/SearchContext";
import Sidebar from "../components/navbar/SIdebar";
import Greeting from "../components/navbar/Greeting";
import baseUrl from "../utils/client";
import useEffectOnce from "../utils/UseEffectOnce";
import moment from "moment";
import axios from "axios";
import { useEffect } from "react";

const BookingHistory = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shopId, setShopId] = useState();

  const { data, error } = useFetch(
    `${baseUrl}/api/users/getBookings/${user._id}`,
    { credentials: true }
  );

  if (error?.response?.data?.status === 401) {
    navigate("/login", { state: { destination: `/history` } });
  }
  const [userInput, setUserInput] = useState("");

  const [visible, setVisible] = useState(5);
  const [roomData, setRoomData] = useState();
  const [showServices, setShowServices] = useState(null);

  // const setLoadMore = () => setVisible((prev) => prev + 5);

  useEffectOnce(() => {
    window.scrollTo(0, 0);
    if (error) {
      toast("Please login to see history!");
    }
    return () => console.log("my effect is destroying");
  });

  useEffect(() => {
    const fetchData = async (item) => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/hotels/room/${shopId}`
        );

        setRoomData(data[0].roomNumbers);
      } catch (err) {
        console.log(err);
      }
    };

    user?.bookings[0]?.shopId && fetchData();
  }, [shopId, user?.bookings]);
  // useEffect(() => {
  //   if (userInput) {
  //     return setVisible(5);
  //   }

  //   // console.log(userInput);
  // }, [userInput]);

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

  let w = window.innerWidth;
  const { open } = useContext(SearchContext);

  const GetPushed = () => {
    // console.log(item);
    const item = showServices;

    let seats = [];

    roomData?.map((seat, i) => {
      if (seat._id === item.selectedSeats[i]?.id) {
        seats.push(seat.number);
      } else if (seat._id === item.selectedSeats[i]?.id) {
        seats.push(seat.number);
      }
    });

    return (
      <div className="reserve">
        <div className="overflow-x-auto relative ">
          <FontAwesomeIcon
            icon={faClose}
            size="sm"
            className="right-1 absolute top-1 text-black  border-2  rounded-full px-2 py-1 border-black"
            onClick={() => setShowServices(null)}
          />

          <>
            <div className="card p-5 overflow-auto md:max-w-[60vw] max-w-[90vw]">
              {item.selectedSeats.map((seat, i) => {
                return (
                  <div className="py-2">
                    <p className="font-semibold">Seat - {seats[i]}</p>
                    <span key={i}>
                      Services :{" "}
                      {seat.options.map((option, i) => {
                        return (
                          <span className="ml-1 font-bold" key={i}>
                            {option}{" "}
                            <span>
                              {i !== seat.options.length - 1 ? "," : "."}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      {open && <Sidebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}

      {/* <div className="flex min-h-screen flex-col ">
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
      </div> */}
      {showServices !== null && <GetPushed />}

      <div className="flex items-center justify-between max-w-[90vw] mx-auto py-5">
        <p className=" md:text-xl text-xs font-semibold">Booking-History</p>

        <input
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
          className="bg-slate-100 text-black  rounded-md md:w-[14.3rem] w-[9.3rem]  "
          placeholder="Filter by date,time,ref.."
        />

        <p className="md:text-lg text-xs">Count : {filteredArray.length}</p>
      </div>
      {filteredArray?.length > 0 ? (
        <div className="grid md:grid-cols-5 lg:grid-cols-4 lg:gap-5 md:gap-5  md:max-w-[90vw] max-w-[96vw] mx-auto pt-5 pb-10 min-h-screen">
          <>
            <div className="overflow-x-auto  col-span-5">
              <table className="min-w-full ">
                <thead className="border-b bg-gray-400 ">
                  <tr className="border-b-2 border-gray-200 ">
                    <th className="text-center md:text-md text-sm md:p-5 py-3">
                      Reference
                    </th>
                    <th className=" md:p-5 px-10 md:text-md text-sm text-right">
                      Date
                    </th>
                    <th className="md:p-5 px-10  md:text-md text-sm text-right">
                      Time
                    </th>
                    <th className="md:p-5 px-5  md:text-md text-sm text-right">
                      Amount
                    </th>
                    <th className="md:p-5  px-10  md:text-md text-sm text-right">
                      Shop
                    </th>
                    {
                      <th className="md:p-5  px-10 md:text-md text-sm text-right">
                        Inclusions
                      </th>
                    }
                    <th className="md:p-5  px-5 md:text-md text-sm text-right">
                      Payment
                    </th>{" "}
                    <th className="md:p-5  px-5 md:text-md text-sm text-right">
                      Done
                    </th>
                    <th className="md:p-5 px-5 md:text-md text-sm text-right">
                      CreatedAt
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArray?.slice(0, visible)?.map((item, j) => {
                    return (
                      <tr key={j} className="border-b-2 border-white">
                        <td className="p-3 text-right md:text-md text-sm">
                          <label className="text-gray-900 w-full">
                            {item.referenceNumber}{" "}
                          </label>
                        </td>
                        <td className="p-3 text-right md:text-md text-sm">
                          <label className="text-gray-900 w-full">
                            {item.date}
                          </label>
                        </td>

                        <td className="p-3 text-right md:text-md text-sm">
                          <label className="text-gray-900">{item.time}</label>
                        </td>

                        <td className="p-3 text-right md:text-md text-sm">
                          <label>
                            <label>&#8377; {item.totalAmount}</label>
                          </label>
                        </td>
                        <td className="p-3 text-right md:text-md text-sm">
                          <label>{item.shop}</label>
                        </td>
                        <td className="p-3 text-right md:text-md text-sm underline cursor-pointer">
                          <label
                            onClick={() => {
                              setShowServices(item);

                              setShopId(item.shopId);
                            }}
                            className="cursor-pointer"
                          >
                            Show Services
                          </label>
                        </td>
                        <td className="p-3 text-right md:text-md text-sm">
                          <label>
                            {item.isPaid === true ? "paid" : "Not paid"}
                          </label>
                        </td>

                        <td className="p-3 text-right md:text-md text-sm">
                          <label>
                            {" "}
                            {item.isDone === "false" ? (
                              <span className="text-red-500">Not Yet Done</span>
                            ) : item.isDone === "cancelled" ? (
                              <span className="text-red-500">Cancelled</span>
                            ) : (
                              <span className="text-green-500"> Done</span>
                            )}
                          </label>
                        </td>
                        <td className="p-3 text-right md:text-md text-sm">
                          <label>
                            {moment(item.createdAt).format(
                              "MMM Do YY hh:mm:ss A"
                            )}
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        </div>
      ) : (
        <div className="min-h-[75vh] flex items-center justify-center">
          <span className="loader"></span>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default BookingHistory;
