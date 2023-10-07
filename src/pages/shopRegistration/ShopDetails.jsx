import SIdebar from "../../components/navbar/SIdebar";
import Greeting from "../../components/navbar/Greeting";

import Layout from "../../components/navbar/Layout";

import Footer from "../../components/footer/Footer";
import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import options from "../../utils/time";
import RegistrationWizard from "./RegistrationWizard";
import MapComponent from "../../components/MapComponent";
import { Combobox } from "@headlessui/react";

const ShopDetails = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { open } = useContext(SearchContext);
  const { t } = useTranslation();
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedShopStartTime, setSelectedShopStartTime] = useState("");
  const [storedUser, setStoredUser] = useState();

  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedShopEndTime, setSelectedShopEndTime] = useState("");

  const [latLong, setLatLong] = useState(null);
  const [map, setMap] = useState(false);
  let w = window.innerWidth;

  function getCookieObject(name) {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

    for (const cookie of cookies) {
      if (cookie.startsWith(name + "=")) {
        const encodedValue = cookie.substring(name.length + 1);
        return JSON.parse(decodeURIComponent(encodedValue));
      }
    }

    return null;
  }

  const cities = [
    "shadnagar, telangana 509216, india",
    "kothur, telangana 509228, india",
    "thimmapur, telangana 509325, india",
    "shamshabad, telangana 501218, india",
  ];

  const [query, setQuery] = useState("");

  const filteredCities =
    query === ""
      ? cities
      : cities.filter((city) => {
          return city.toLowerCase().includes(query.toLowerCase());
        });

  const [selectedCity, setSelectedCity] = useState("");

  const submitHandler = ({
    shopName,

    phone,
    city,
    description,
    type,
    address,
  }) => {
    if (!latLong) {
      return alert(t("selectAddressInMap"));
    } else if (selectedShopStartTime === "" || selectedShopEndTime === "") {
      return alert(t("selectShopStartEndTimeCorrectly"));
    } else if (selectedStartTime === "" || selectedEndTime === "") {
      return alert(t("selectLunchStartEndTimeCorrectly"));
    } else if (
      selectedStartTime !== selectedEndTime &&
      selectedShopStartTime !== selectedShopEndTime
    ) {
      const existingUserData = getCookieObject("user_info");
      const x = existingUserData.number.includes(phone);
      if (x) {
        alert(t("alternateNumberShouldBeDifferent"));
        return;
      }
      const selectedShopStartIndex = options.find((option) => {
        return option.value === selectedShopStartTime;
      })?.id;
      const selectedShopEndIndex = options.find((option) => {
        return option.value === selectedShopEndTime;
      })?.id;

      const selectedStartIndex = options.find((option) => {
        return option.value === selectedStartTime;
      })?.id;
      const selectedEndIndex = options.find((option) => {
        return option.value === selectedEndTime;
      })?.id;

      if (selectedShopEndIndex * 10 - selectedShopStartIndex * 10 < 480) {
        return alert(
          t("min8HrsNeededBetweenOpeningClosingTime")
        );
      }
      if (selectedEndIndex * 10 - selectedStartIndex * 10 > 60) {
        return alert(t("lunchTimeMax1HrOnly"));
      }

      const shopTime = options.filter((option) => {
        return (
          option.id >= selectedShopStartIndex &&
          option.id < selectedShopEndIndex
        );
      });
      const shopTimeArray = shopTime.map((option) => {
        return option.id;
      });

      const lunchTime = options.filter((option) => {
        return option.id >= selectedStartIndex && option.id < selectedEndIndex;
      });
      const lunchTimeArray = lunchTime.map((option) => {
        return option.id;
      });
      // console.log(lunchTimeArray, "lunch array in shop-details");
      // console.log(shopTimeArray, "Shop array in shop-details");

      existingUserData.hotelInfo = {
        name: shopName,

        alternatePhone: phone,
        city: selectedCity.toLowerCase(),
        desc: description,
        type: type.toLowerCase(),

        lunchTimeArray,
        shopTimeArray,
        latLong,
      };
      existingUserData.step = 2;
      console.log(existingUserData);
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

      navigate("/shop-final-registration");

      console.log("done");
    } else {
      alert(t("somethingWrong"));
    }
  };

  const handleStartTimeChange = (event) => {
    setSelectedStartTime(event.target.value);
  };
  const handleEndTimeChange = (event) => {
    setSelectedEndTime(event.target.value);
  };

  const handleShopStartTimeChange = (event) => {
    setSelectedShopStartTime(event.target.value);
  };
  const handleShopEndTimeChange = (event) => {
    setSelectedShopEndTime(event.target.value);
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
      setStoredUser(storedUser);
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
            placeholder="salon name"
            id="shopName"
            autoFocus
            {...register("shopName", {
              required: "Please enter shop name",
              minLength: {
                value: 6,
                message: "Username must be more than 5 chars",
              },
              pattern: {
                value: /^[a-z" "A-Z" "0-9_.+-@#]+$/i,
                message: "Please enter valid shop name",
              },
            })}
          />
          {errors.shopName && (
            <div className="text-red-500">{errors.shopName.message}</div>
          )}
        </div>

        <div className="flex w-full ">
          <div className="mb-4 mr-4 flex flex-col w-full">
            <label htmlFor="type">Shop Start time</label>
            <select
              className="w-full"
              value={selectedShopStartTime}
              onChange={(e) => handleShopStartTimeChange(e)}
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
            <label htmlFor="type">Shop End time</label>
            <select
              className="w-full"
              value={selectedShopEndTime}
              onChange={(e) => handleShopEndTimeChange(e)}
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
        {/* <div className="mb-4">
          <label htmlFor="city">City/Town</label>
          <input
            className="w-full"
            id="city"
            value={storedUser?.address}
            readOnly
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
        </div> */}

        <div className="w-full flex  flex-wrap">
          <div className=" mb-4 w-full">
            <label htmlFor="city" className="block">
              City
            </label>
            <div className="relative inline-block bg-slate-100 rounded-md  text-black items-center w-full">
              <Combobox value={selectedCity} onChange={setSelectedCity}>
                <Combobox.Input
                  onChange={(event) => setQuery(event.target.value)}
                  className="pl-2 w-full "
                  id="city"
                  {...register("city", {
                    required: "Please enter shop name",
                  })}
                />

                <Combobox.Options
                  style={{ zIndex: 999 }}
                  className="absolute top-[2.2rem]  cursor-pointer text-gray-500 bg-gray-100 md:p-3 p-2.5 w-full rounded  md:max-h-32 max-h-48 border border-gray-300 shadow-md  overflow-y-auto"
                >
                  {filteredCities.map((person) => (
                    <Combobox.Option
                      key={person}
                      value={person}
                      className="p-1"
                    >
                      {person}
                    </Combobox.Option>
                  ))}
                  {filteredCities.length <= 0 && (
                    <Combobox.Option>OOPS! We did not found!</Combobox.Option>
                  )}
                </Combobox.Options>
              </Combobox>
            </div>
            {errors.city && (
              <div className="text-red-500 ">{errors.city.message}</div>
            )}
          </div>
          <div className="mb-4 w-full">
            <label htmlFor="type">Type</label>
            <select
              className="w-full p-1.5"
              id="type"
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
