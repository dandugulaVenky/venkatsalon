import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import baseUrl from "../../utils/client";

const CustomerDetails = ({ item, setOpen }) => {
  const navigate = useNavigate();

  useEffect(() => {}, [setOpen]);

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

  function compareTimeDiff(time) {
    let time1 = time;
    let currentDate = new Date();
    let time1Date = new Date(time1);

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
    let datetime = moment(`${date} ${time}`, "MMM Do YYYY h:mm A");
    let result = datetime.valueOf();
    let result2 = compareTimeDiff(result);
    console.log(result2);
    if (result2 === -1) {
      return toast("Cannot approve past times!");
    }
    setOpen(false);
    try {
      await Promise.all(
        uniqueArr.map((item) => {
          axios.put(
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
    }

    try {
      await Promise.all(
        uniqueArr1.map((item) => {
          axios.put(
            `${baseUrl}/api/users/updateUserApprovalStatus/${item}`,
            {
              isDone: "cancelled",
            },
            { withCredentials: true }
          );
        })
      );
    } catch (err) {
      toast(err);
    }
    try {
      await Promise(
        axios.put(
          `${baseUrl}/api/hotels/updateOwnerApprovalStatus/${item._id}`,
          {
            isDone: "cancelled",
          },
          { withCredentials: true }
        )
      );
    } catch (err) {
      toast(err);
    }

    try {
      const { email, phone } = user;
      const mail = await axios.post(
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
    }

    toast("Rejected Successfully");

    window.location.replace("/admin");
  };

  const handleClick = async (uniqueArr, uniqueArr1) => {
    // console.log("I am clicked", { uniqueArr, uniqueArr1 });

    let datetime = moment(`${date} ${time}`, "MMM Do YYYY h:mm A");
    let result = datetime.valueOf();
    let result2 = compareTimeDiff(result);
    console.log(result2);
    if (result2 === -1) {
      return toast("Cannot approve past times!");
    }
    setOpen(false);
    if (uniqueArr.length > 0 && uniqueArr1.length > 0) {
      try {
        await Promise.all(
          uniqueArr.map((item) => {
            axios.put(
              `${baseUrl}/api/rooms/updateAvailabilityStatus/${item.unavailableDateId}`,
              {
                isAccepted: "true",
              },
              { withCredentials: true }
            );
          })
        );
        try {
          await Promise.all(
            uniqueArr1.map((item) => {
              axios.put(
                `${baseUrl}/api/users/updateUserApprovalStatus/${item}`,
                {
                  isDone: "true",
                },
                { withCredentials: true }
              );
            })
          );
        } catch (err) {
          toast(err);
        }
        try {
          await Promise(
            axios.put(
              `${baseUrl}/api/hotels/updateOwnerApprovalStatus/${item._id}`,
              {
                isDone: "true",
              },
              { withCredentials: true }
            )
          );
        } catch (err) {
          toast(err);
        }

        try {
          const { email, phone } = user;
          const mail = await axios.post(
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
        } catch (err) {
          console.log(err);
        }
        toast("Done Successfully");

        window.location.replace("/admin");
      } catch (err) {
        toast(err);
      }
    } else {
      toast("Something wrong!");
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
    data1.map((booking) => {
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
          onClick={() => setOpen(false)}
        />

        <div className="">
          <div className="space-y-1.5">
            <div className="flex space-x-2">
              <div className="flex flex-col md:space-y-2 space-y-1 ">
                <h1>
                  <span>
                    {item.referenceNumber && (
                      <span className=" text-[20px] text-white">
                        Reference No:{item.referenceNumber}
                      </span>
                    )}
                  </span>
                </h1>
                <h1 className=" text-[13px] md:text-[15px] text-white">
                  {" "}
                  BookedDate : {item.date}
                </h1>
                <span className="text-[13px] md:text-[15px] text-white">
                  BookedTime : {item.time}
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
                        className="text-[13px] md:text-[15px] px-1 bg-orange-900 text-white"
                        key={i}
                      >
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
                  Paid status : {item.isPaid === true ? "paid" : "Not paid"}
                </span>
                <span className="text-[13px] md:text-[15px] bg-orange-900 px-2 py-1 rounded mr-1 text-white">
                  Amount : {item.totalAmount}
                </span>
              </div>
              <div>
                <span className="text-[13px] md:text-[15px] siTaxiOp px-2">
                  {item.email}
                </span>
                <span className="text-[13px] md:text-[15px] siTaxiOp px-2 ml-1">
                  {item.phone}
                </span>
              </div>
            </div>
            <div className="space-x-3">
              <button
                className={
                  item.isDone === "true" || item.isDone === "cancelled"
                    ? "siCheckButton bg-blue-400 px-4"
                    : "primary-button"
                }
                onClick={() => {
                  item.isDone === "false" && handleClick(uniqueArr, uniqueArr1);
                }}
                disabled={
                  item.isDone === "true" || item.isDone === "cancelled"
                    ? true
                    : false
                }
              >
                {item.isDone === "true" ? "Accepted" : "Mark Done"}
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
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
