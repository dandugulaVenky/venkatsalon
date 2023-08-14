import React, { useCallback, useContext, useEffect, useState } from "react";
import SIdebar from "../../components/navbar/SIdebar";
import Layout from "../../components/navbar/Layout";
import Greeting from "../../components/navbar/Greeting";
import { SearchContext } from "../../context/SearchContext";
import Footer from "../../components/footer/Footer";
import axios from "axios";
import baseUrl from "../../utils/client";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

import DatePicker from "react-date-picker";
import Charts from "../../utils/Charts";
import { useTranslation } from 'react-i18next';


const Compare = () => {
  let w = window.innerWidth;
  const { t } = useTranslation();

  const {
    state: { shopId },
  } = useLocation();
  const [loading, setLoading] = useState(false);
  const [resultInServicesCount, setResultInServicesCount] = useState({});
  const [resultInCategoriesCount, setResultInCategoriesCount] = useState({});
  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);
  const [months, setMonths] = useState(1);
  const [amount, setAmount] = useState();
  const navigate = useNavigate();
  const requests = useCallback(async () => {
    setLoading(true);
    let startDate = "";
    let endDate = "";

    if (months === 1) {
      startDate = moment().date(1).format("MMM Do YY");
      endDate = moment(new Date()).format("MMM Do YY");
    } else if (months === 2) {
      startDate = moment().subtract(1, "month").date(1).format("MMM Do YY");
      endDate = moment(new Date()).format("MMM Do YY");
    } else if (months === 3) {
      startDate = moment().subtract(2, "month").date(1).format("MMM Do YY");
      endDate = moment(new Date()).format("MMM Do YY");
    } else if (months === 6) {
      startDate = moment().subtract(5, "month").date(1).format("MMM Do YY");
      endDate = moment(new Date()).format("MMM Do YY");
    } else {
      startDate = moment(value).format("MMM Do YY");
      endDate = moment(value1).format("MMM Do YY");
    }

    await axios
      .post(
        `${baseUrl}/api/hotels/getShopRequests/${shopId}`,
        {
          startDate,
          endDate,
        },
        { withCredentials: true }
      )
      .then(async (res) => {
        let output = [];
        let output1 = [];
        let statusDoneServices = res.data.filter(
          (booking) => booking.isDone === "true"
        );
        //problem here is total amount remains same but thee owner may change the price
        //  which will prices of categories amount may show false values
        new Promise((resolve, reject) => {
          statusDoneServices.forEach((item) => {
            const existingItem = output.find(
              (outputItem) => outputItem.Date === item.date
            );

            if (existingItem) {
              existingItem.Amount += item.totalAmount;
            } else {
              output.push({ Date: item.date, Amount: item.totalAmount });
            }
          });
          resolve(output);
        }).then((resolvedOutput) => {
          resolvedOutput.forEach((item) => {
            const existingItem = output1.find(
              (outputItem) =>
                outputItem.Date.split(" ")[0] === item?.Date.split(" ")[0]
            );

            if (existingItem) {
              existingItem.Amount += item.Amount;
            } else {
              output1.push({
                Date: item.Date.split(" ")[0],
                Amount: item.Amount,
              });
            }
          });
          setAmount(output1);
        });

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

          for (let i = 0; i < services.length; i++) {
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

          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((error) => {
        console.error(error.response.data.message);
        navigate("/login", { state: { destination: `/admin` } });
      });
  }, [months, navigate, shopId, value, value1]);

  const { open } = useContext(SearchContext);

  const modifiedOnChange = (selectedDate) => {
    // Perform your desired modifications or actions here
    setValue(selectedDate);
    setMonths(0);
  };
  const modifiedOnChange1 = (selectedDate) => {
    // Perform your desired modifications or actions here
    setValue1(selectedDate);
    setMonths(0);
  };

  // this is to mark tuesdays in red colors

  function tileClassName({ date, view }) {
    // Add logic to check if it's Tuesday
    if (view === "month" && date.getDay() === 2) {
      return "red-tuesday";
    }
    return null;
  }

  useEffect(() => {
    requests();
  }, [months, requests, value, value1]);

  return (
    <div>
      {open && <SIdebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}
      <div
        className=" md:px-5  pb-20 md:pt-4 mx-auto"
        style={{ maxWidth: "1140px" }}
      >
        <p className="text-center font-semibold py-10 md:text-xl underline">
          {t('myservicesAnalysis')}
        </p>
        <div className="flex md:flex-row flex-col px-5 gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="">
              <p>{t('startDate')}:</p>
              <DatePicker
                onChange={modifiedOnChange}
                tileClassName={tileClassName}
                value={value}
                className="bg-slate-100 text-blue-400 px-2.5  h-10 rounded-md md:w-[14.3rem] w-[10.3rem] z-10 border-2 border-black"
              />
            </div>

            <div className="">
              <p>{t('endDate')}:</p>
              <DatePicker
                onChange={modifiedOnChange1}
                tileClassName={tileClassName}
                value={value1}
                className="bg-slate-100 text-blue-400 px-2.5  h-10 rounded-md md:w-[14.3rem] w-[10.3rem] z-10 border-2 border-black"
              />
            </div>
          </div>
          <div className="">
            <p>{t('test')}</p>
            <select
              className="bg-slate-100  px-2.5  h-10 rounded-md md:w-[14.3rem] w-[10.3rem] z-10 border-2 border-black"
              onChange={(e) => {
                setMonths(Number(e.target.value));
                setValue(null);
                setValue1(null);
              }}
              value={months}
            >
              <option selected value={0}>
                {t('selectMonth')}
              </option>
              <option value={1}>{t('thisMonth')}</option>
              <option value={2}>{t('lastMonth')}</option>

              <option value={3}>{t('lastThreeMonths')}</option>
              <option value={6}>{t('lastSixMonths')}</option>
            </select>
          </div>
        </div>

        <div className="min-w-full overflow-auto py-10">
          <p className="py-10 text-center font-bold">{t('categoryChart')}</p>
          <Charts
            data={resultInCategoriesCount}
            XAxisDatakey="name"
            BarDataKey="count"
            BarDataAmount="amount"
          />
        </div>
        <div className="py-10 min-w-full overflow-auto ">
          <p className="py-10 text-center font-bold">{t('servicesChart')}</p>
          <Charts
            data={resultInServicesCount}
            XAxisDatakey="name"
            BarDataKey="count"
            BarDataAmount="amount"
          />
        </div>
        <div className="py-10 min-w-full overflow-auto ">
          <p className="py-10 text-center font-bold">{t('revenue')}</p>
          <Charts data={amount} XAxisDatakey="Date" BarDataKey="Amount" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Compare;
