import React, { memo, useCallback, useMemo, useRef } from "react";
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

import Charts from "../../utils/Charts";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);

  const shopId = user?.shopId;

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shopType, setShopType] = useState();

  const [value, setValue] = useState(new Date());
  const [allOrders, setAllOrders] = useState(false);
  const [customerDetailsId, setCustomerDetailsId] = useState("");
  const [userInput, setUserInput] = useState("");

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(5);

  const [resultInServicesCount, setResultInServicesCount] = useState({});
  const [resultInCategoriesCount, setResultInCategoriesCount] = useState({});

  const navigate = useNavigate();

  const endRef = useRef(null);

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
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/hotels/find/${user?.shopId}`
        );
        setShopType(data?.type);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [user?.shopId]);

  const requests = useCallback(async () => {
    setLoading(true);

    await axios
      .post(
        `${baseUrl}/api/hotels/getShopRequests/${shopId}`,
        {
          date: allOrders ? "all" : moment(value).format("MMM Do YY"),
        },
        { withCredentials: true }
      )
      .then(async (res) => {
        setData(res.data);
        try {
          const res1 = await axios.get(`${baseUrl}/api/hotels/room/${shopId}`);

          //merge all the services from utils

          const mergedPreviewServices = res1.data[0]?.services
            ?.reduce((arr, item) => {
              arr.push(item.services);
              return arr;
            }, [])
            .reduce((arr, item) => {
              return arr.concat(item);
            }, []);

          //now again merge all the user services based on selection date

          let services = res?.data
            ?.reduce((acc, item) => {
              acc.push(item.selectedSeats);
              return acc;
            }, [])
            .reduce((arr, item) => {
              return arr.concat(item);
            }, [])
            .reduce((acc1, item1) => {
              return acc1.concat(item1.options);
            }, []);

          // get the objs based on user selected service names

          let getObjs = services?.map((service) => {
            return mergedPreviewServices?.filter(
              (ser) => ser.service === service
            )[0];
          });

          const filteredUndefined = getObjs.filter(
            (service) => service !== undefined
          );

          //find the count of each category andeach service except packages

          let resultInServices = {};
          let resultInCategories = {};

          for (let i = 0; i < filteredUndefined.length; i++) {
            const name = filteredUndefined[i].service;

            resultInServices[name] = (resultInServices[name] || 0) + 1;

            const cat = filteredUndefined[i].category;
            resultInCategories[cat] = (resultInCategories[cat] || 0) + 1;
          }

          //now as we do not count packages service count as they were not needed and we need package category count

          const arr = Object.keys(resultInServices).map((key) => {
            const price =
              mergedPreviewServices.filter(
                (service) => service.service === key
              )[0].price * resultInServices[key];
            const category = mergedPreviewServices.find(
              (service) => service.service === key
            );

            return {
              name: key + " Rs-" + price.toString(),
              amount: price,
              count: resultInServices[key],
              category: category.category,
            };
          });
          const arr1 = Object.keys(resultInCategories).map((key) => {
            const price = arr
              .filter((service) => service.category === key)
              .reduce((acc, item) => (acc += item.amount), 0);

            return {
              name: key + "( Rs-" + price.toString() + ")",
              amount: price,
              count: resultInCategories[key],
            };
          });

          setResultInServicesCount(arr);
          setResultInCategoriesCount(arr1);

          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((error) => {
        console.error(error.response.data.message);
        navigate("/login", { state: { destination: `/admin` } });
      });
  }, [allOrders, navigate, shopId, value]);

  useEffect(() => {
    requests();
  }, [allOrders, navigate, requests, shopId, shopType, value, visible]);

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
      <div
        className=" md:px-5  pb-20 md:pt-4 mx-auto"
        style={{ maxWidth: "1140px" }}
      >
        <div className="pt-5 mb-5 space-x-2 flex items-center flex-wrap gap-3 justify-center">
          <div className="">
            <DatePicker
              onChange={modifiedOnChange}
              tileClassName={tileClassName}
              value={value}
              className="bg-slate-100 text-blue-400 p-2.5 h-10 rounded-md md:w-[14.3rem] w-[10.3rem] z-10 "
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
          <button
            className="bg-green-600 px-2 py-1.5 rounded-md text-white"
            onClick={() => {
              endRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            See Statistics
          </button>
          <button
            className="bg-green-600 px-2 py-1.5 rounded-md text-white"
            onClick={() => {
              navigate("/admin/compare", { state: { shopId, shopType } });
            }}
          >
            Compare B/w Dates
          </button>
          <p className="md:text-md text-xs">Count : {filteredArray.length}</p>
        </div>

        {filteredArray?.slice(0, visible).map((item, i) => {
          let k = i;

          return (
            <div className="list p-5 overflow-x-auto relative mx-4" key={i}>
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

        <div className="min-w-full overflow-auto py-10" ref={endRef}>
          <p className="py-10 text-center font-bold">Category Chart</p>
          <Charts
            data={resultInCategoriesCount}
            XAxisDatakey="name"
            BarDataKey="count"
            BarDataAmount="amount"
          />
        </div>
        <div className="py-10 min-w-full overflow-auto ">
          <p className="py-10 text-center font-bold">Services Chart</p>
          <Charts
            data={resultInServicesCount}
            XAxisDatakey="name"
            BarDataKey="count"
            BarDataAmount="amount"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default memo(AdminOrders);
