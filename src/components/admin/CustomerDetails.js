import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import moment from "moment";
import React, { useContext, useState } from "react";

import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import baseUrl from "../../utils/client";
import { useTranslation } from "react-i18next";
import axiosInstance from "../axiosInterceptor";

const CustomerDetails = ({ item, setOpenModal }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const { date, time, bookId } = item;

  let seats = [];

  let [acceptIds, setAcceptIds] = useState([]);

  const { data } = useFetch(`${baseUrl}/api/hotels/room/${item.shopId}`);

  const { data: data1 } = useFetch(
    `${baseUrl}/api/users/getBookings/${item.user}`,
    { credentials: true }
  );

  const { data: shopData } = useFetch(
    `${baseUrl}/api/hotels/find/${item.shopId}`
  );

  const { t } = useTranslation();

  function compareTimeDiff(time) {
    let time1 = time;
    let currentDate = new Date();
    let time1Date = new Date(time1);

    // Calculate the time difference in milliseconds between the given time and the current time
    let timeDiff = time1Date.getTime() - currentDate.getTime();

    // Check if the time difference is less than or equal to 1.5 hours (90 minutes)
    if (timeDiff >= 90 * 60 * 1000) {
      return 10; // The current time is 1.5 hours or less before the given time
    } else {
      // Compare the year, month, and day components
      if (
        time1Date.getFullYear() === currentDate.getFullYear() &&
        time1Date.getMonth() === currentDate.getMonth() &&
        time1Date.getDate() === currentDate.getDate()
      ) {
        // Compare the time components
        if (
          time1Date.getHours() === currentDate.getHours() &&
          time1Date.getMinutes() === currentDate.getMinutes()
        ) {
          return 0; // Time is the same
        } else if (time1Date > currentDate) {
          return 1; // Time is in the future
        } else {
          return -1; // Time is in the past
        }
      } else if (time1Date > currentDate) {
        return 1; // Date is in the future
      } else {
        return -1; // Date is in the past
      }
    }
  }

  if (data[0]?.roomNumbers) {
    item.selectedSeats.map((seat, i) => {
      const find = data[0]?.roomNumbers.find((item) => item._id === seat.id);

      if (find) {
        seats.push(find.number);
      }
    });
  }

  //This is to send request with unailvalabledateId to backend for updating
  const isAvailable = (data, date, time, bookId) => {
    // console.log(`data mak ${k}`, data);
    const isFound = data.unavailableDates.map((item, i) => {
      if (item?.date.includes(date)) {
        if (item?.time.includes(time)) {
          if (item.bookId === bookId) {
            acceptIds.push({
              unavailableDateId: item._id,
              seat: data.number,
              seatId: data._id,
            });
          }
        }
      }
    });
  };

  const handleCancel = async (user) => {
    setLoading(true);
    let datetime = moment(`${date} ${time}`, "MMM Do YYYY h:mm A");
    let result = datetime.valueOf();
    let result2 = compareTimeDiff(result);
    console.log(result2);
    if (result2 !== 10) {
      setLoading(false);
      return toast("Cannot cancel now!");
    }

    try {
      await Promise.all(
        uniqueArr.map((item) => {
          axiosInstance.put(
            `${baseUrl}/api/rooms/updateAvailabilityStatus/${item.unavailableDateId}`,
            {
              isAccepted: "cancelled",
            },
            { withCredentials: true }
          );
        })
      );
    } catch (err) {
      toast(err.response.data.message);
      setLoading(false);
    }

    await Promise.all(
      uniqueArr1.map((item) => {
        axiosInstance.put(
          `${baseUrl}/api/users/updateUserApprovalStatus/${item}`,
          {
            isDone: "cancelled",
          },
          { withCredentials: true }
        );
      })
    );
    await Promise.resolve(
      axiosInstance.put(
        `${baseUrl}/api/hotels/updateOwnerApprovalStatus/${item._id}`,
        {
          isDone: "cancelled",
        },
        { withCredentials: true }
      )
    );

    try {
      const { email, phone } = user;
      await axiosInstance.post(
        `${baseUrl}/api/sendmail`,
        {
          email: item.email,
          userNumber: item.phone,

          type: "cancel",
          shopName: shopData.name,
          ownerEmail: email,
          ownerNumber: phone,
          link: "https://easytym.com/history",
        },
        { withCredentials: true }
      );
    } catch (err) {
      toast(err.response.data.message);
      setLoading(false);
    }
    setOpenModal(false);
    setLoading(false);
    toast("Rejected Successfully");
  };

  const handleClick = async (uniqueArr, uniqueArr1) => {
    setLoading(true);
    let datetime = moment(`${date} ${time}`, "MMM Do YYYY h:mm A");
    let result = datetime.valueOf();
    let result2 = compareTimeDiff(result);
    console.log(result2);
    if (result2 === -1) {
      return toast("Cannot approve past times!");
    }
    if (result2 === 1 || result2 === 10) {
      setLoading(false);
      return toast("Cannot approve Future times!");
    }

    if (uniqueArr.length > 0 && uniqueArr1.length > 0) {
      const { email, phone } = user;
      try {
        await Promise.all(
          uniqueArr.map((item) => {
            return axiosInstance.put(
              `${baseUrl}/api/rooms/updateAvailabilityStatus/${item.unavailableDateId}`,
              {
                isAccepted: "true",
              },
              { withCredentials: true }
            );
          })
        );
        await Promise.all(
          uniqueArr1.map((item) => {
            return axiosInstance.put(
              `${baseUrl}/api/users/updateUserApprovalStatus/${item}`,
              {
                isDone: "true",
              },
              { withCredentials: true }
            );
          })
        );
        await Promise.resolve(
          axiosInstance.put(
            `${baseUrl}/api/hotels/updateOwnerApprovalStatus/${item._id}`,
            {
              isDone: "true",
            },
            { withCredentials: true }
          )
        );

        await axiosInstance.post(
          `${baseUrl}/api/sendmail`,
          {
            email: item.email,
            userNumber: item.phone,
            //shopName we are using already in backend
            shopName: shopData.name,
            ownerEmail: email,
            ownerNumber: phone,
            link: "https://easytym.com/history",
          },
          { withCredentials: true }
        );
        setOpenModal(false);
        toast("Done Successfully");
        setLoading(false);
      } catch (err) {
        toast("Something wrong!, please contact your administrator");
        console.log(err);
        setLoading(false);
      }
    } else {
      toast("Something wrong!");
      setLoading(false);
    }
  };

  const mapData = data[0];
  // console.log("seats", seats);
  for (let i = 0; i < mapData?.roomNumbers.length; i++) {
    if (date && time) {
      isAvailable(mapData?.roomNumbers[i], date, time, bookId);
    }
  }

  const [userBookingIds, setUserBookingsIds] = useState([]);

  const mapUserBookingIds = (data1) => {
    data1?.directOrders?.map((booking) => {
      if (booking.bookId === item.bookId) {
        userBookingIds.push(booking._id);
        // console.log(`Foundroooooo ${k}`, booking.bookId);
      }
    });
  };
  let uniqueArr = [];
  let uniqueArr1 = [];

  if (data1) {
    mapUserBookingIds(data1);
    uniqueArr = Array.from(
      new Set(acceptIds.map((item) => JSON.stringify(item)))
    ).map((item) => JSON.parse(item));

    uniqueArr1 = Array.from(new Set(userBookingIds));
  }

  return (
    <div className="reserve-admin px-4">
      <div className="relative border-2 border-white rounded p-3">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="text-white float-right"
          onClick={() => setOpenModal(false)}
        />

        <div className="">
          <div className="space-y-1.5">
            <div className="flex space-x-2">
              <div className="flex flex-col md:space-y-2 space-y-1 ">
                <h1>
                  <span>
                    {item.referenceNumber && (
                      <span className=" text-[20px] text-white">
                        {t("referenceNo")}:{item.referenceNumber}
                      </span>
                    )}
                  </span>
                </h1>
                <h1 className=" text-[13px] md:text-[15px] text-white">
                  {" "}
                  {t("bookedDate")} : {item.date}
                </h1>
                <span className="text-[13px] md:text-[15px] text-white">
                  {t("bookedTime")} : {item.time}
                </span>
                {/* <span className="text-[13px] md:text-sm">
                  Seat Numbers :{" "}
                  {seats.map((seat, i) => {
                    return (
                      <span className="text-[13px] md:text-[15px]" key={i}>
                        {seat}&nbsp;
                      </span>
                    );
                  })}
                </span> */}
                <span className="flex md:space-x-1 flex-wrap  space-y-1">
                  {item.selectedSeats.map((seat, i) => {
                    return (
                      <span
                        className="text-[13px] md:text-[15px] px-1 bg-orange-900 text-white my-1 rounded"
                        key={i}
                      >
                        <p className="text-white">{item.superCategory}</p>
                        {seat.options.map((option, j) => {
                          return (
                            <span className="">
                              {option.service}{" "}
                              <span>
                                {j !== seat.options.length - 1 ? ", " : ". "}
                              </span>
                            </span>
                          );
                        })}
                        &nbsp;- seat {seats[i]}
                      </span>
                    );
                  })}
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-1 ">
              <div>
                <span className="text-[13px] md:text-[15px] siTaxiOp mr-1">
                  {t("paidStatus")} :{" "}
                  {item.isPaid === true ? "paid" : "Not paid"}
                </span>
                <span className="text-[13px] md:text-[15px] bg-orange-900 px-2 py-1 rounded mr-1 text-white">
                  {t("amount")} : {item.totalAmount}
                </span>
              </div>
              <div>
                <span className="text-[13px] md:text-[15px] siTaxiOp px-2">
                  {t("email", { email: item.email })}
                </span>
                <span className="text-[13px] md:text-[15px] siTaxiOp px-2 ml-1">
                  {t("phone", { phone: item.phone })}
                </span>
              </div>
            </div>
            {loading ? (
              <p className="py-2">
                <span className="buttonloader ml-2"></span>
              </p>
            ) : (
              <div className="space-x-3">
                <button
                  className={
                    item.isDone === "true" || item.isDone === "cancelled"
                      ? "siCheckButton bg-blue-400 px-4"
                      : "primary-button"
                  }
                  onClick={() => {
                    item.isDone === "false" &&
                      handleClick(uniqueArr, uniqueArr1);
                  }}
                  disabled={
                    item.isDone === "true" || item.isDone === "cancelled"
                      ? true
                      : false
                  }
                >
                  {item.isDone === "true"
                    ? `${t("accepted")}`
                    : `${t("markDone")}`}
                </button>
                <button
                  className={
                    item.isDone === "true" || item.isDone === "cancelled"
                      ? "siCheckButton bg-red-400 px-4"
                      : "danger-button"
                  }
                  onClick={() => item.isDone === "false" && handleCancel(user)}
                  disabled={
                    item.isDone === "true" || item.isDone === "cancelled"
                      ? true
                      : false
                  }
                >
                  {t("cancel")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
