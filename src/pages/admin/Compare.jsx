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
import { parlourCategories } from "../../utils/parlourServices";
import { salonCategories } from "../../utils/salonServices";
import DatePicker from "react-date-picker";
import Charts from "../../utils/Charts";

const Compare = () => {
  let w = window.innerWidth;
  const {
    state: { shopId, shopType },
  } = useLocation();
  const [loading, setLoading] = useState(false);
  const [resultInServicesCount, setResultInServicesCount] = useState({});
  const [resultInCategoriesCount, setResultInCategoriesCount] = useState({});
  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);
  const [amount, setAmount] = useState(null);

  const navigate = useNavigate();
  const requests = useCallback(async () => {
    setLoading(true);
    await axios
      .post(
        `${baseUrl}/api/hotels/getShopRequests/${shopId}`,
        {
          startDate: moment(value).format("MMM Do YY"),
          endDate: moment(value1).format("MMM Do YY"),
        },
        { withCredentials: true }
      )
      .then((res) => {
        const typeServices =
          shopType === "parlour" ? parlourCategories : salonCategories;

        const output = [];

        res?.data.forEach((item) => {
          const existingItem = output.find(
            (outputItem) => outputItem.Date === item.date
          );

          if (existingItem) {
            existingItem.amount += item.totalAmount;
          } else {
            output.push({ Date: item.date, Amount: item.totalAmount });
          }
        });
        console.log(output);
        setAmount(output);

        //merge all the services from utils
        const mergedPreviewServices = typeServices
          ?.reduce((arr, item) => {
            arr.push(item.services);
            return arr;
          }, [])
          .reduce((arr, item) => {
            return arr.concat(item);
          }, []);

        //remove packages becaause packages are not comparable because they have differnt names which are not predefined
        const packagesRemovedServices = mergedPreviewServices.filter(
          (service) => service.category !== "packages"
        );

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
          return packagesRemovedServices?.filter(
            (ser) => ser.name === service
          )[0];
        });

        //we will get ndefined for the package services names like winter etc..which does not have in our utils folder
        const filteredUndefined = getObjs.filter(
          (service) => service !== undefined
        );

        //find the count of each category andeach service except packages

        let resultInServices = {};
        let resultInCategories = {};

        for (let i = 0; i < filteredUndefined.length; i++) {
          const name = filteredUndefined[i].name;
          resultInServices[name] = (resultInServices[name] || 0) + 1;
          const cat = filteredUndefined[i].category;
          resultInCategories[cat] = (resultInCategories[cat] || 0) + 1;
        }

        //now as we do not count packages service count as they were not needed and we need package category count

        const filterPackages = getObjs.filter(
          (service) => service === undefined
        );

        resultInCategories.packages = filterPackages.length;

        const arr = Object.keys(resultInServices).map((key) => ({
          name: key,
          count: resultInServices[key],
        }));
        const arr1 = Object.keys(resultInCategories).map((key) => ({
          name: key,
          count: resultInCategories[key],
        }));

        setResultInServicesCount(arr);
        setResultInCategoriesCount(arr1);

        setLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        navigate("/login", { state: { destination: `/admin/compare` } });
      });
  }, [navigate, shopId, shopType, value, value1]);

  const { open } = useContext(SearchContext);

  const modifiedOnChange = (selectedDate) => {
    // Perform your desired modifications or actions her
    setValue(selectedDate);
  };
  const modifiedOnChange1 = (selectedDate) => {
    // Perform your desired modifications or actions her
    setValue1(selectedDate);
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
    value !== null && value1 !== null && requests();
  }, [requests, value, value1]);

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
          My Services Analysis
        </p>
        <div className="flex px-5 space-x-4">
          <div className="">
            <p>Start Date:</p>
            <DatePicker
              onChange={modifiedOnChange}
              tileClassName={tileClassName}
              value={value}
              className="bg-slate-100 text-blue-400 p-2.5 h-10 rounded-md md:w-[14.3rem] w-[10.3rem] z-10 "
            />
          </div>

          <div className="">
            <p>End Date:</p>
            <DatePicker
              onChange={modifiedOnChange1}
              tileClassName={tileClassName}
              value={value1}
              className="bg-slate-100 text-blue-400 p-2.5 h-10 rounded-md md:w-[14.3rem] w-[10.3rem] z-10 "
            />
          </div>
        </div>

        <div className="min-w-full overflow-auto py-10">
          <p className="py-10 text-center font-bold">Category Chart</p>
          <Charts
            data={resultInCategoriesCount}
            XAxisDatakey="name"
            BarDataKey="count"
          />
        </div>
        <div className="py-10 min-w-full overflow-auto ">
          <p className="py-10 text-center font-bold">Services Chart</p>
          <Charts
            data={resultInServicesCount}
            XAxisDatakey="name"
            BarDataKey="count"
          />
        </div>
        <div className="py-10 min-w-full overflow-auto ">
          <p className="py-10 text-center font-bold">Revenue</p>
          <Charts data={amount} XAxisDatakey="Date" BarDataKey="Amount" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Compare;
