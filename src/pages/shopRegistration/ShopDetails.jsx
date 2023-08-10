import SIdebar from "../../components/navbar/SIdebar";
import Greeting from "../../components/navbar/Greeting";

import Layout from "../../components/navbar/Layout";

import Footer from "../../components/footer/Footer";
import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { useForm } from "react-hook-form";

import { useNavigate, useLocation } from "react-router-dom";

import options from "../../utils/time";
import RegistrationWizard from "./RegistrationWizard";
import MapComponent from "../../components/MapComponent";

const ShopDetails = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { open } = useContext(SearchContext);

  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [latLong, setLatLong] = useState(null);
  const [map, setMap] = useState(false);
  let w = window.innerWidth;
  const location = useLocation();
  const userIdValue = location?.state?.userID || 12345;

  const shopID = "qwerty";

  function getCookieObject(name) {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

    for (const cookie of cookies) {
      if (cookie.startsWith(name + "=")) {
        const encodedValue = cookie.substring(name.length + 1);
        return JSON.parse(decodeURIComponent(encodedValue));
      }
    }

    return null; // Cookie not found
  }

  const submitHandler = ({
    shopName,
    userID,
    phone,
    city,
    description,
    type,
    address,
  }) => {
    console.log(shopName, "shop name in shop-details");
    console.log(shopID, "shop id in shop-details");
    console.log(userID, "user id in shop details");
    if (!latLong) {
      alert("Please select address in map");
    } else if (selectedStartTime === "" || selectedEndTime === "") {
      alert("Select start time and end time correctly!");
    } else if (selectedStartTime !== selectedEndTime) {
      const selectedStartIndex = options.filter((option) => {
        return option.value === selectedStartTime;
      })[0]?.id;
      const selectedEndIndex = options.filter((option) => {
        return option.value === selectedEndTime;
      })[0]?.id;

      if (selectedEndIndex * 10 - selectedStartTime * 10 < 480) {
        return alert("Minimum of 8 hrs is needed!");
      }
      const lunchTime = options.filter((option) => {
        return option.id >= selectedStartIndex && option.id < selectedEndIndex;
      });
      const lunchTimeArray = lunchTime.map((option) => {
        return option.id;
      });
      console.log(lunchTimeArray, "lunch array in shop-details");
      const existingUserData = getCookieObject("user_info");
      existingUserData.hotelInfo = {
        shopName,
        userID,
        phone,
        city,
        description,
        type,
        address,
        lunchTimeArray,
        latLong,
      };
      existingUserData.step = 2;
      function setCookieObject(name1, value, daysToExpire) {
        const expires = new Date();
        expires.setDate(expires.getDate() + daysToExpire);

        // Serialize the object to JSON and encode it
        const cookieValue =
          encodeURIComponent(JSON.stringify(value)) +
          (daysToExpire ? `; expires=${expires.toUTCString()}` : "");

        document.cookie = `${name1}=${cookieValue}; path=/`;
      }
      setCookieObject("user_info", existingUserData, 7);

      navigate("/shop-final-registration", {
        state: { userIdValue, shopID, shopName, latLong },
      });
    } else {
      alert("Something wrong!");
    }
  };
  const handleStartTimeChange = (event) => {
    setSelectedStartTime(event.target.value);
  };
  const handleEndTimeChange = (event) => {
    setSelectedEndTime(event.target.value);
  };
  const handleMapClick = (coords) => {
    setLatLong(coords);
    setMap(!map);
  };

  const handleClick = () => {
    setMap(!map);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Usage example
    const storedUser = getCookieObject("user_info");

    if (storedUser) {
      if (storedUser.step === 1) {
        return;
      } else if (storedUser.step === 2) {
        navigate("/shop-final-registration");
      }
    } else {
      console.log("User info not found in the cookie.");
      navigate("/shop-registration");
    }
  }, [navigate]);

  return (
    <>
      {open && <SIdebar />}
      {w < 768 && <Greeting />}

      <div className=" px-4">{w >= 768 && <Layout />}</div>
      <div className="md:py-0.5 py-5">
        <RegistrationWizard activeStep={1} />
      </div>
      {map ? (
        <div className="reserve">
          <div className="md:w-[75%] w-[90%] mx-auto">
            <h1>React Google Maps Click Example</h1>
            <MapComponent onMapClick={handleMapClick} latLong={latLong} />
          </div>
        </div>
      ) : (
        <div className="hidden">
          <MapComponent latLong={latLong} />
        </div>
      )}
      <form
        className="card mx-auto max-w-screen-md py-0.5 md:px-12 px-7 pb-20 
                 "
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="my-4 text-xl">Shop Details</h1>
        <div className="mb-4">
          <label htmlFor="shopName">Shop Name</label>
          <input
            className="w-full"
            id="shopName"
            autoFocus
            {...register("shopName", {
              required: "Please enter Shop name",
              minLength: {
                value: 4,
                message: "Username must be more than 3 chars",
              },
            })}
          />
          {errors.shopName && (
            <div className="text-red-500">{errors.shopName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">User ID</label>
          <input className="w-full" id="userId" value={userIdValue} readOnly />
          {errors.userID && (
            <div className="text-red-500">{errors.userID.message}</div>
          )}
        </div>
        <div className="flex w-full ">
          <div className="mb-4 mr-4 flex flex-col w-full">
            <label htmlFor="type">Lunch Start time</label>
            <select
              className="w-full"
              value={selectedStartTime}
              onChange={(e) => handleStartTimeChange(e)}
            >
              <option selected value="">
                Select Time
              </option>
              {options.map((option, index) => (
                <option key={option.id} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex flex-col  w-full">
            <label htmlFor="type">Lunch End time</label>
            <select
              className="w-full"
              value={selectedEndTime}
              onChange={(e) => handleEndTimeChange(e)}
            >
              <option selected value="">
                Select Time
              </option>
              {options.map((option, index) => (
                <option key={option.id} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="phone">Alternate Phone Number</label>
          <input
            className="w-full"
            type="number"
            id="phone"
            {...register("phone", {
              required: "Please enter phone number",
              minLength: {
                value: 10,
                message: "Phone must be 10 numbers",
              },
            })}
          />
          {errors.phone && (
            <div className="text-red-500 ">{errors.phone.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City/Town</label>
          <input
            className="w-full"
            id="city"
            {...register("city", {
              required: "Please enter city",
              minLength: {
                value: 3,
                message: "City must be more than 3 chars",
              },
            })}
          />
          {errors.city && (
            <div className="text-red-500 ">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="description">Description</label>
          <input
            className="w-full"
            placeholder="unique point about your shop"
            id="description"
            {...register("description", {
              required: "Please enter description",
              minLength: {
                value: 10,
                message: "City must be more than 10 chars",
              },
            })}
          />
          {errors.description && (
            <div className="text-red-500 ">{errors.description.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="type">Type</label>
          <select
            className="w-full"
            id="description"
            {...register("type", {
              required: "Please select a type",
            })}
          >
            <option>Salon</option>
            <option>Parlour</option>
          </select>
          {errors.type && (
            <div className="text-red-500 ">{errors.type.message}</div>
          )}
        </div>
        <div className="mb-4" onClick={handleClick}>
          <label htmlFor="address">Exact Address</label>
          <p className="w-full px-5 py-2 bg-green-200 rounded-md cursor-pointer">
            {latLong
              ? `lat:${latLong?.lat} , lng:${latLong?.lng}`
              : "Select on map"}
          </p>
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>

        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
      <Footer />
    </>
  );
};

export default ShopDetails;
