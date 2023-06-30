import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import baseUrl from "../../utils/client";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import DatePicker from "react-date-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowDown,
  faCircleArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import SIdebar from "../../components/navbar/SIdebar";
import Layout from "../../components/navbar/Layout";
import Greeting from "../../components/navbar/Greeting";
import { SearchContext } from "../../context/SearchContext";
import Footer from "../../components/footer/Footer";
import CustomerDetails from "../../components/admin/CustomerDetails";
const AdminOrders = () => {
  const { user } = useContext(AuthContext);

  const shopId = user?.shopId;

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState(new Date());
  const [allOrders, setAllOrders] = useState(false);
  const [customerDetailsId, setCustomerDetailsId] = useState("");
  const [userInput, setUserInput] = useState("");

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(5);
  const navigate = useNavigate();

  const setLoadMore = () => setVisible((prev) => prev + 5);

  // this is to mark tuesdays in red colors

  function tileClassName({ date, view }) {
    // Add logic to check if it's Tuesday
    if (view === "month" && date.getDay() === 2) {
      return "red-tuesday";
    }
    return null;
  }

  useEffect(() => {
    const requests = async () => {
      setLoading(true);
      await axios
        .post(
          `${baseUrl}/api/hotels/getShopRequests/${shopId}`,
          {
            date: allOrders ? "all" : moment(value).format("MMM Do YY"),
          },
          { withCredentials: true }
        )
        .then((res) => {
          setData(res.data);

          setLoading(false);
        })
        .catch((error) => {
          console.error(error.response.data.message);
          navigate("/login", { state: { destination: `/admin` } });
        });
    };
    requests();
  }, [allOrders, navigate, shopId, value, visible]);

  function filterArray(array, userInput) {
    if (!userInput) {
      return array;
    }
    return array.filter((booking) => {
      return (
        booking.username.toLowerCase().includes(userInput.toLowerCase()) ||
        booking.email.toLowerCase().includes(userInput.toLowerCase()) ||
        booking.referenceNumber
          .toLowerCase()
          .includes(userInput.toLowerCase()) ||
        booking.date.toLowerCase().includes(userInput.toLowerCase()) ||
        booking.time.toLowerCase().includes(userInput.toLowerCase())
      );
    });
  }
  const filteredArray = filterArray(data, userInput);
  useEffect(() => {
    if (userInput) {
      return setVisible(5);
    }
  }, [userInput]);

  const modifiedOnChange = (selectedDate) => {
    // Perform your desired modifications or actions her
    setValue(selectedDate);
    setAllOrders(false);
  };

  let w = window.innerWidth;
  const { open } = useContext(SearchContext);
  return (
    <div>
      {open && <SIdebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}
      <div className=" px-5 lg:px-96 pb-24 md:pt-4">
        <div className="pt-5 mb-5 space-x-2 flex items-center flex-wrap  justify-center">
          <div className="">
            <DatePicker
              onChange={modifiedOnChange}
              tileClassName={tileClassName}
              value={value}
              className="bg-slate-100 text-blue-400 p-2.5 h-14 rounded-md md:w-[14.3rem] w-[10.3rem] z-10 "
            />
          </div>
          <div className="">
            <input
              onChange={(e) => setUserInput(e.target.value)}
              value={userInput}
              className="bg-slate-100 text-black  rounded-md md:w-[14.4rem] w-[10.4rem]"
              placeholder="Filter everything.."
            />
          </div>
          <button
            className="bg-[#00ccbb] px-2 py-1.5 rounded-md text-white"
            onClick={() => {
              setAllOrders(true);
              setValue(null);
            }}
          >
            All Orders
          </button>
          <p className="md:text-md text-xs">Count : {filteredArray.length}</p>
        </div>
        {filteredArray?.slice(0, visible).map((item, i) => {
          let k = i;

          return (
            <div className="list p-5 overflow-x-auto relative" key={i}>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <img
                    src="https://picsum.photos/800/600?random=2"
                    alt=""
                    className="siImg"
                  />

                  <div className="flex flex-col md:space-y-2 space-y-1 ">
                    <h1 className=" text-xs md:text-[15px] ">
                      {" "}
                      BookedDate : {item.date}
                    </h1>
                    <span className="text-xs md:text-[15px]">
                      BookedTime : {item.time}
                    </span>

                    <div className="flex space-x-1 ">
                      <span className="text-xs md:text-[15px] siTaxiOp px-2">
                        {item.username}
                      </span>
                      <span className="text-xs md:text-[15px] siTaxiOp mr-2 ">
                        Paid status :{" "}
                        {item.isPaid === true ? "paid" : "Not paid"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setCustomerDetailsId(item._id);
                        setOpenModal(true);
                      }}
                      className="px-2 py-1 bg-[#5151c0] text-white rounded"
                    >
                      Open
                    </button>
                    {item._id === customerDetailsId && openModal && (
                      <CustomerDetails setOpen={setOpenModal} item={item} />
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-1 ">
                  <div className=" flex space-x-1">
                    <p className="text-xs md:text-[15px] siTaxiOp ">
                      On :{" "}
                      {moment(item.createdAt).format("MMM Do YY hh:mm:ss A")}
                    </p>
                    {item.referenceNumber && (
                      <p className="text-xs md:text-[15px] siTaxiOp">
                        Ref: {item.referenceNumber}
                      </p>
                    )}
                  </div>
                  <span
                    className={
                      item.isDone === "true"
                        ? " done top-right "
                        : "not-done top-right"
                    }
                  >
                    {item.isDone === "true"
                      ? "Done"
                      : item.isDone === "cancelled"
                      ? "cancelled"
                      : "Not Done"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredArray?.length === 0 && (
          <h1 className="flex items-center justify-center  h-[60vh]">
            No Booking Requests
          </h1>
        )}

        {filteredArray?.length >= 5 && (
          <div className="flex items-center justify-center mt-10 ">
            {visible >= filteredArray.length ? (
              <button
                className="primary-button"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <FontAwesomeIcon icon={faCircleArrowUp} />
              </button>
            ) : (
              <button className="primary-button" onClick={setLoadMore}>
                <FontAwesomeIcon icon={faCircleArrowDown} />
              </button>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminOrders;
