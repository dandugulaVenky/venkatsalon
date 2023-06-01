import moment from "moment";
import React from "react";
import useFetch from "../hooks/useFetch";
import baseUrl from "../utils/client";

const BookingHistoryItem = ({ item, k }) => {
  const { data, loading, error } = useFetch(
    `${baseUrl}/api/hotels/room/${item.shopId}`
  );

  //   console.log(`frpm item ${k}`, data);
  let seats = [];

  data[0]?.roomNumbers?.map((seat, i) => {
    if (seat._id === item.selectedSeats[i]?.id) {
      seats.push(seat.number);
    } else if (seat._id === item.selectedSeats[i]?.id) {
      seats.push(seat.number);
    }
  });

  return (
    <div className="list p-3 ">
      <div className="">
        <span>
          {item.referenceNumber && (
            <span className=" text-[20px] ">
              Reference No:{item.referenceNumber}
            </span>
          )}
        </span>
        <div className=" p-5">
          <div className="space-y-1.5">
            <div className="flex space-x-2">
              <img
                src="https://picsum.photos/800/600?random=2"
                alt=""
                className="siImg"
              />

              <div className="flex flex-col md:space-y-2 space-y-1 ">
                <h1 className=" text-[13px] md:text-[15px] ">
                  {" "}
                  BookedDate : {item.date}
                </h1>
                <span className="text-[13px] md:text-[15px]">
                  BookedTime : {item.time}
                </span>

                <span className="flex  flex-wrap md:space-y-0 space-y-1">
                  {item.selectedSeats.map((seat, i) => {
                    return (
                      <span
                        className="text-[13px] md:text-[13px] px-1 bg-orange-900 text-white rounded"
                        key={i}
                      >
                        {seat.options.map((option, i) => {
                          return (
                            <span className="ml-1" key={i}>
                              {option}
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
            <div className="flex flex-col space-y-1  ">
              <div className="space-y-1">
                <span className="text-[13px] md:text-[15px] siTaxiOp mr-1">
                  Paid status : {item.isPaid === true ? "paid" : "Not paid"}
                </span>
                <span className="text-[13px] md:text-[15px] bg-orange-900 text-white px-2 py-1 rounded mr-1">
                  Amount : {item.totalAmount}
                </span>
                <span className="text-xs md:text-[15px] siTaxiOp ">
                  {item.shop}{" "}
                </span>
              </div>
              <div>
                <span className="text-xs md:text-[15px] ">
                  Completion :{" "}
                  {item.isDone === "false" ? (
                    <span className="text-red-500">Not Yet Done</span>
                  ) : item.isDone === "cancelled" ? (
                    <span className="text-red-500">Cancelled</span>
                  ) : (
                    <span className="text-green-500"> Done</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex siCancelOpSubtitle items-center space-x-2 ">
        <span className="text-[10px] md:text-[12px] ">Booking Done At :</span>
        <span className="md:text-[12px] text-[10px]">
          {moment(item.createdAt).format("MMM Do YY hh:mm:ss A")}
        </span>
      </div>
    </div>
  );
};

export default BookingHistoryItem;
