import React, { useContext, useState } from "react";

import "../components/searchItem/searchItem.css";

import useFetch from "../hooks/useFetch";

import { AuthContext } from "../context/AuthContext";

import { toast } from "react-toastify";
import {
  faCircleArrowDown,
  faCircleArrowUp,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import baseUrl from "../utils/client";
import useEffectOnce from "../utils/UseEffectOnce";
import moment from "moment";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../components/axiosInterceptor";

const BookingHistory = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showTypeOfOrders, setShowTypeOfOrders] = useState("directOrders");
  const [shopId, setShopId] = useState(user?.shopId);
  const [userInput, setUserInput] = useState("");

  const [visible, setVisible] = useState(10);
  const [roomData, setRoomData] = useState();
  const [showServices, setShowServices] = useState(null);
  const { data, loading, error } = useFetch(
    `${baseUrl}/api/users/getBookings/${user._id}`,
    { credentials: true }
  );
  console.log(data);
  const { t } = useTranslation();
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
        const { data } = await axiosInstance.get(
          `${baseUrl}/api/hotels/room/${shopId}`
        );

        setRoomData(data[0].roomNumbers);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [shopId, user?.bookings]);

  if (error?.response?.data?.status === 401) {
    navigate("/login", { state: { destination: `/history` } });
  }

  const setLoadMore = () => setVisible((prev) => prev + 10);

  useEffect(() => {
    if (userInput) {
      return setVisible(10);
    }

    // console.log(userInput);
  }, [userInput]);

  function filterArray(array, userInput) {
    if (!userInput) {
      return array;
    }
    return showTypeOfOrders === "directOrders"
      ? data[showTypeOfOrders]?.filter((booking) => {
          return (
            booking.referenceNumber
              .toLowerCase()
              .includes(userInput.toLowerCase()) ||
            booking.date.toLowerCase().includes(userInput.toLowerCase()) ||
            booking.time.toLowerCase().includes(userInput.toLowerCase())
          );
        })
      : data[showTypeOfOrders]?.filter((booking) => {
          return (
            booking.referenceNum
              .toLowerCase()
              .includes(userInput.toLowerCase()) ||
            booking.date.toLowerCase().includes(userInput.toLowerCase())
          );
        });
  }
  const filteredArray = filterArray(data[showTypeOfOrders], userInput);

  const GetPushed = () => {
    const item = showServices;

    let seats = [];

    if (item && roomData) {
      item.selectedSeats.map((seat, i) => {
        const find = roomData.find((item) => item?._id === seat.id);
        console.log(find);
        if (find) {
          seats.push(find.number);
        }
      });
    }

    return (
      <div className="reserve pt-20">
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
                    <p className="font-semibold">
                      {t("seat")} - {seats[i] || "Any Seat"}
                    </p>
                    <p> Category : {item?.superCategory}</p>
                    <span key={i}>
                      {t("services")} :{" "}
                      {seat.options.map((option, i) => {
                        return (
                          <span className="ml-1 font-bold" key={i}>
                            {option.service}{" "}
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
    <div className="pt-6 pb-20">
      {showServices !== null && <GetPushed />}

      <div className="min-h-[85.5vh] max-w-[99vw] mx-auto">
        <div className="flex items-center justify-around ">
          <p className=" md:text-xl text-xs font-semibold">
            {t("bookingHistory")}
          </p>

          <select
            onChange={(e) => {
              setShowTypeOfOrders(e.target.value);
              setUserInput("");
            }}
          >
            <option value="directOrders">Direct Orders</option>
            <option value="appointments">Appointment Orders</option>
          </select>

          <input
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
            className="  rounded-md md:w-[14.3rem] w-[9.3rem]"
            placeholder="Filter by date,time,ref.."
          />

          <p className="md:text-lg text-xs">
            {t("count")} : {filteredArray?.length}
          </p>
        </div>
        {loading && filteredArray?.length === 0 && (
          <div className="min-h-[75vh] flex items-center justify-center">
            <span className="loader"></span>
          </div>
        )}

        {showTypeOfOrders === "directOrders" && filteredArray?.length > 0 ? (
          <div className="grid md:grid-cols-5 lg:grid-cols-4 lg:gap-5 md:gap-5  md:max-w-[90vw] max-w-[98vw] mx-auto pt-5 pb-10 ">
            <div className="overflow-x-auto  col-span-5 border-2 border-gray-500">
              <table className="min-w-full  ">
                <thead className="border-b bg-gray-400 ">
                  <tr className="border-b-2 border-gray-200 ">
                    <th className="text-center md:text-md text-sm md:p-5 py-3">
                      {t("reference")}
                    </th>
                    <th className=" md:p-5 px-10 md:text-md text-sm text-right">
                      {t("date")}
                    </th>
                    <th className="md:p-5 px-10  md:text-md text-sm text-right">
                      {t("time")}
                    </th>
                    <th className="md:p-5 px-5  md:text-md text-sm text-right">
                      {t("amount")}
                    </th>
                    <th className="md:p-5  px-10  md:text-md text-sm text-right">
                      {t("shop")}
                    </th>
                    {
                      <th className="md:p-5  px-10 md:text-md text-sm text-right">
                        {t("inclusions")}
                      </th>
                    }
                    <th className="md:p-5  px-5 md:text-md text-sm text-right">
                      {t("payment")}
                    </th>{" "}
                    <th className="md:p-5  px-5 md:text-md text-sm text-right">
                      {t("done")}
                    </th>
                    <th className="md:p-5 px-5 md:text-md text-sm text-right">
                      {t("createdAt")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArray?.slice(0, visible)?.map((item, j) => {
                    // {filteredArray?.map((item, j) => {
                    return (
                      <tr key={j} className="border-b-2 border-gray-500">
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
                            {t("showServices")}
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
                              <span className="text-red-500">
                                {t("notYetDone")}
                              </span>
                            ) : item.isDone === "cancelled" ? (
                              <span className="text-red-500">
                                {t("cancelled")}
                              </span>
                            ) : (
                              <span className="text-green-500">
                                {" "}
                                {t("done")}
                              </span>
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
            {filteredArray?.length >= 10 && (
              <div className="min-w-[90vw] py-4  grid place-items-center pb-10">
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
        ) : showTypeOfOrders === "appointments" && filteredArray?.length > 0 ? (
          <div className="grid md:grid-cols-5 lg:grid-cols-4 lg:gap-5 md:gap-5  md:max-w-[90vw] max-w-[98vw] mx-auto pt-5 pb-10 ">
            <div className="overflow-x-auto  col-span-5 border-2 border-gray-500">
              <table className="min-w-full  ">
                <thead className="border-b bg-gray-400 ">
                  <tr className="border-b-2 border-gray-200 ">
                    <th className="text-center md:text-md text-sm  py-3">
                      {t("reference")}
                    </th>
                    <th className=" md:p-5 px-10 md:text-md text-sm text-right">
                      {t("date")}
                    </th>
                    <th className="md:p-5 px-5  md:text-md text-sm text-right">
                      {t("amount")}
                    </th>
                    <th className="md:p-5  px-10  md:text-md text-sm text-right">
                      {t("shop")}
                    </th>
                    <th className="md:p-5  px-5 md:text-md text-sm text-right">
                      {t("payment")}
                    </th>{" "}
                    <th className="md:p-5  px-5 md:text-md text-sm text-right">
                      Validity
                    </th>
                    <th className="md:p-5  px-5 md:text-md text-sm text-right">
                      Status
                    </th>
                    {/* <th className="md:p-5 px-5 md:text-md text-sm text-right">
                      {t("createdAt")}
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredArray?.slice(0, visible)?.map((item, j) => {
                    // {filteredArray?.map((item, j) => {
                    return (
                      <tr key={j} className="border-b-2 border-gray-500">
                        <td className="p-3  md:text-md text-center text-sm">
                          <label className="text-gray-900 w-full">
                            {item.referenceNum}{" "}
                          </label>
                        </td>
                        <td className="p-3 text-right md:text-md text-sm">
                          <label className="text-gray-900 w-full">
                            {item.date}
                          </label>
                        </td>

                        <td className="p-3 text-right md:text-md text-sm">
                          <label>
                            <label>&#8377; {item.totalAmount}</label>
                          </label>
                        </td>
                        <td className="p-3 text-right md:text-md text-sm">
                          <label>{item.shopName}</label>
                        </td>

                        {/* <td className="p-3 text-right md:text-md text-sm">
                          <label>
                            {item.isPaid === true ? "paid" : "Not paid"}
                          </label>
                        </td> */}

                        <td className="p-3 text-right md:text-md text-sm">
                          <label>
                            {" "}
                            {item.isDone === "false" ? (
                              <span className="text-red-500">
                                {t("notYetDone")}
                              </span>
                            ) : item.isDone === "cancelled" ? (
                              <span className="text-red-500">
                                {t("cancelled")}
                              </span>
                            ) : (
                              <span className="text-green-500">
                                {" "}
                                {t("done")}
                              </span>
                            )}
                          </label>
                        </td>
                        <td className="p-3 text-right md:text-md text-sm">
                          {item.validity}
                        </td>
                        <td className="p-3 text-right md:text-md text-sm">
                          {item.status || "pending"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredArray?.length >= 10 && (
              <div className="min-w-[90vw] py-4  grid place-items-center pb-10">
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
        ) : (
          <div className="min-h-[75vh] flex items-center justify-center">
            {/* <span className="loader"></span> */}
            {t("noBookingsFound")}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
