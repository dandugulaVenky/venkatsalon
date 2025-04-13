import React, { memo, useCallback, useRef } from "react";
import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import baseUrl from "../../utils/client";

import { useEffect } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import DatePicker from "react-date-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowDown,
  faCircleArrowUp,
} from "@fortawesome/free-solid-svg-icons";

import CustomerDetails from "../../components/admin/CustomerDetails";

import Charts from "../../utils/Charts";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../components/axiosInterceptor";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);

  const shopId = user?.shopId;

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shopType, setShopType] = useState();
  const [gender, setGender] = useState("men");
  const [typeOfOrders, setTypeOfOrders] = useState("true");
  const [value, setValue] = useState(new Date());
  const [allOrders, setAllOrders] = useState("");
  const [customerDetailsId, setCustomerDetailsId] = useState("");
  const [userInput, setUserInput] = useState("");

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(5);

  const [resultInServicesCount, setResultInServicesCount] = useState({});
  const [resultInCategoriesCount, setResultInCategoriesCount] = useState({});
  const [genderAnalysis, setGenderAnaylis] = useState(null);
  const navigate = useNavigate();

  const endRef = useRef(null);

  const setLoadMore = () => setVisible((prev) => prev + 5);
  const { t } = useTranslation();

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
        const { data } = await axiosInstance.get(
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

    await axiosInstance
      .post(
        `${baseUrl}/api/hotels/getShopRequests/${shopId}`,
        {
          date: allOrders ? allOrders : moment(value).format("MMM Do YY"),
        },
        { withCredentials: true }
      )
      .then(async (res) => {
        setData(res.data);
        try {
          const res1 = await axiosInstance.get(
            `${baseUrl}/api/hotels/room/${shopId}`
          );

          //merge all the services from utils

          const mergedPreviewServices = res1.data[0]?.services
            ?.reduce((arr, item) => {
              arr.push(item.services);
              return arr;
            }, [])
            .reduce((arr, item) => {
              return arr.concat(item);
            }, []);

          let statusDoneServices = res.data.filter(
            (booking) =>
              booking.isDone === typeOfOrders && booking.subCategory === gender
          );

          let statusDoneServices1 = res.data.filter(
            (booking) => booking.isDone === typeOfOrders
          );

          //now again merge all the user services based on selection date

          let services = statusDoneServices
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

          //find the count of each category andeach service except packages

          let resultInServices = {};
          let resultInCategories = {};

          for (let i = 0; i < services?.length; i++) {
            const name = services[i].service;

            resultInServices[name] = (resultInServices[name] || 0) + 1;

            const cat = services[i].category;
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
          console.log(arr);
          //generating revenue based on gender
          const generateRevenue = statusDoneServices1.reduce((acc, item) => {
            if (item.subCategory) {
              if (isNaN(acc[item.subCategory])) {
                acc[item.subCategory] = 0; // Initialize to 0 if it's NaN
              }
              acc[item.subCategory] += item.totalAmount;
            }
            return acc;
          }, {});

          const arr3 = Object.keys(generateRevenue).map((key) => {
            return {
              name: key,
              amount: generateRevenue[key],
            };
          });

          console.log(arr3, "arr3");

          setGenderAnaylis(arr3);

          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((error) => {
        console.error(error.response.data.message);
        navigate("/login", { state: { destination: `/admin` } });
      });
  }, [allOrders, gender, typeOfOrders, navigate, shopId, value]);

  useEffect(() => {
    requests();
  }, [
    allOrders,
    navigate,
    requests,
    shopId,
    shopType,
    value,
    visible,
    openModal,
  ]);

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

  const itemStyle = {
    flex: "1 1 150px", // flex-grow flex-shrink flex-basis
    margin: "10px", // Add some space between items
    padding: "5px",
  };

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap", // Allow items to wrap into multiple lines if needed
  };

  const handleGender = (e) => {
    setGender(e.target.value);
  };

  const handleTypeOfOrders = (e) => {
    setTypeOfOrders(e.target.value);
  };

  return (
    <div className="pt-6 pb-20">
      <div className="px-3   mx-auto" style={{ maxWidth: "1140px" }}>
        <div style={containerStyle}>
          <button
            className="bg-[#00ccbb]  rounded-md text-white"
            onClick={() => {
              setAllOrders("allTillNow");
              setValue(null);
            }}
            style={itemStyle}
          >
            {t("allOrdersTillNow")}
          </button>
          <button
            className="bg-[#00ccbb]  rounded-md text-white"
            onClick={() => {
              setAllOrders("futureOrders");
              setValue(null);
            }}
            style={itemStyle}
          >
            {t("futureOrders")}
          </button>
          <button
            className="bg-green-600  rounded-md text-white"
            onClick={() => {
              endRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            style={itemStyle}
          >
            {t("seeStatistics")}
          </button>
          <button
            className="bg-green-600  rounded-md text-white"
            onClick={() => {
              navigate("/admin/compare", { state: { shopId, shopType } });
            }}
            style={itemStyle}
          >
            {t("compareB/wDates")}
          </button>
          <input
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
            className="bg-slate-100 text-black  rounded-md "
            placeholder="Filter everything.."
            style={itemStyle}
          />
          <DatePicker
            onChange={modifiedOnChange}
            tileClassName={tileClassName}
            value={value}
            className="bg-slate-100 text-blue-400  h-10 z-10  rounded-md p-2 ml-2.5 my-2  w-auto"
            style={itemStyle}
          />

          <p className="md:text-md text-md" style={itemStyle}>
            {t("count")} : {filteredArray?.length}
          </p>
        </div>

        {filteredArray?.slice(0, visible).map((item, i) => {
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
                      {t("bookedDate")} : {item.date}
                    </h1>
                    <span className="text-xs md:text-[15px]">
                      {t("bookedTime")} : {item.time}
                    </span>

                    <div className="flex space-x-1 ">
                      <span className="text-xs md:text-[15px] siTaxiOp px-2">
                        {item.username}
                      </span>
                      {/* <span className="text-xs md:text-[15px] siTaxiOp mr-2 ">
                        {t("paidStatus")} :{" "}
                        {item.isPaid === true ? "paid" : "Not paid"}
                      </span> */}
                    </div>
                    <button
                      onClick={() => {
                        setCustomerDetailsId(item._id);
                        setOpenModal(true);
                      }}
                      className="px-2 py-1 bg-[#5151c0] text-white rounded"
                    >
                      {t("open")}
                    </button>
                    {item._id === customerDetailsId && openModal && (
                      <CustomerDetails
                        setOpenModal={setOpenModal}
                        item={item}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-1 ">
                  {/* <div className=" flex space-x-1">
                    <p className="text-xs md:text-[15px] siTaxiOp ">
                      {t("on")}:{" "}
                      {moment(item.createdAt).format("MMM Do YY hh:mm:ss A")}
                    </p>
                    {item.referenceNumber && (
                      <p className="text-xs md:text-[15px] siTaxiOp">
                        {t("ref")}: {item.referenceNumber}
                      </p>
                    )}
                  </div> */}
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
            {t("noBookingRequests")}
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

        <div className="flex space-x-2 flex-wrap gap-2 mt-5 bg-yellow-300 rounded items-center justify-around py-3">
          <select onChange={handleTypeOfOrders} value={typeOfOrders}>
            <option value="true">{t("completed")}</option>
            <option value="false">{t("notCompleted")}</option>

            <option value="cancelled">{t("cancelled")}</option>
          </select>
          <select onChange={handleGender} value={gender}>
            <option value="men">{t("men")}</option>
            <option value="women">{t("women")}</option>
          </select>
        </div>
        <div className="min-w-full overflow-auto py-10" ref={endRef}>
          <p className="py-10 text-center font-bold">{t("categoryChart")}</p>
          <Charts
            data={resultInCategoriesCount}
            XAxisDatakey="name"
            BarDataKey="count"
            BarDataAmount="amount"
          />
        </div>
        <div className="py-10 min-w-full overflow-auto ">
          <p className="py-10 text-center font-bold">{t("servicesChart")}</p>
          <Charts
            data={resultInServicesCount}
            XAxisDatakey="name"
            BarDataKey="count"
            BarDataAmount="amount"
          />
        </div>
        {genderAnalysis !== null && (
          <div className="py-10 min-w-full overflow-auto ">
            <p className="py-10 text-center font-bold">
              {t("genderWiseRevenue")}
            </p>
            <Charts
              data={genderAnalysis}
              XAxisDatakey="name"
              BarDataAmount="amount"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(AdminOrders);
