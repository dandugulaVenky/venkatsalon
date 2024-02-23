import React, { useContext, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import options from "../../utils/time";
import RegistrationWizard from "./RegistrationWizard";
import MapComponent from "../../components/MapComponent";

import { AuthContext } from "../../context/AuthContext";

const ShopDetails = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedShopStartTime, setSelectedShopStartTime] = useState("");
  const { user } = useContext(AuthContext);

  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedShopEndTime, setSelectedShopEndTime] = useState("");
  const [shopName, setShopName] = useState();
  const [latLong, setLatLong] = useState(null);
  const [typeOfShop, setTypeOfShop] = useState(null);
  const [genderType, setGenderType] = useState(null);
  const [map, setMap] = useState(false);
  const [spaIncluded, setSpaIncluded] = useState(null);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  // function getCookieObject(name) {
  //   const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

  //   for (const cookie of cookies) {
  //     if (cookie.startsWith(name + "=")) {
  //       const encodedValue = cookie.substring(name.length + 1);
  //       return JSON.parse(decodeURIComponent(encodedValue));
  //     }
  //   }

  //   return null;
  // }

  const [selectedState, setSelectedState] = useState();
  const [selectedPincode, setSelectedPincode] = useState();

  const states = {
    Telangana: {
      Rangareddy: {
        509325: [
          {
            name: "Thimmapur",
          },
          {
            name: "Kothur",
          },
          {
            name: "Shapur",
          },
        ],
        509216: [
          {
            name: "Shadnagar",
          },
          {
            name: "Farooqnagar",
          },
        ],
      },
    },

    Karnataka: {
      Bangalore: {
        509228: [
          {
            name: "Thimmapur",
          },
          {
            name: "Kothur",
          },
          {
            name: "Shapur",
          },
        ],
        509216: [
          {
            name: "Shadnagar",
          },
          {
            name: "Farooqnagar",
          },
        ],
      },
    },
  };

  const statesInIndia = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const [selectedDistrict, setSelectedDistrict] = useState();

  const handleStartTimeChange = (event) => {
    setSelectedStartTime(event.target.value);
    clearError("selectedStartTime");
  };
  const handleEndTimeChange = (event) => {
    setSelectedEndTime(event.target.value);
    clearError("selectedEndTime");
  };

  const handleShopStartTimeChange = (event) => {
    setSelectedShopStartTime(event.target.value);
    clearError("selectedShopStartTime");
  };
  const handleShopEndTimeChange = (event) => {
    setSelectedShopEndTime(event.target.value);
    clearError("selectedShopEndTime");
  };

  const handleMapClick = (coords) => {
    setLatLong(coords);
    setMap(!map);
    clearError("latLong");
  };

  const handleClick = () => {
    setMap(!map);
  };

  const handleType = (e) => {
    console.log(e.target.value, "ufufufu");
    setTypeOfShop(e.target.value);
    clearError("typeOfShop");
  };

  const handleParlourType = (e) => {
    setGenderType(e.target.value);

    clearError("genderType");
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!user || user === "undefined") {
    }
  }, [navigate, user]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedDistrict(null); // Reset district when state changes
    setSelectedPincode(null); // Reset pincode when state changes
    clearError("selectedState");
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedPincode(null); // Reset pincode when district changes
    clearError("selectedDistrict");
  };

  const handlePincodeChange = (e) => {
    setSelectedPincode(e.target.value);
    clearError("selectedPincode");
  };

  useEffect(() => {
    if (Object.keys(formErrors)?.length === 0 && isSubmit) {
      if (
        !selectedStartTime ||
        !selectedEndTime ||
        !selectedShopStartTime ||
        !selectedShopEndTime ||
        !selectedDistrict ||
        !selectedPincode ||
        !selectedState ||
        !latLong ||
        !genderType ||
        !typeOfShop ||
        !shopName
      ) {
        alert("Please ensure you have entered all the fields !");
      } else {
        if (
          selectedStartTime !== selectedEndTime &&
          selectedShopStartTime !== selectedShopEndTime
        ) {
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
            return alert(t("min8HrsNeededBetweenOpeningClosingTime"));
          }
          // console.log(selectedEndIndex * 10);
          // console.log(selectedStartIndex * 10 > 60);
          // console.log(selectedEndIndex * 10 - selectedStartIndex * 10 > 60);

          let diff = selectedEndIndex * 10 - selectedStartIndex * 10;

          if (diff > 60) {
            return alert(t("lunchTimeMax1HrOnly"));
          }
          if (diff < 10) {
            return alert(t("selectLunchTimeCorrectly10min"));
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
            return (
              option.id >= selectedStartIndex && option.id < selectedEndIndex
            );
          });
          const lunchTimeArray = lunchTime.map((option) => {
            return option.id;
          });
          // console.log(lunchTimeArray, "lunch array in shop-details");
          // console.log(shopTimeArray, "Shop array in shop-details");

          const hotelInfo = {
            name: shopName,

            alternatePhone: "phone",
            city:
              selectedState + ", " + selectedDistrict + ", " + selectedPincode,
            desc: "description",
            type: typeOfShop.toLowerCase(),

            subType: genderType.toLowerCase(),
            spaIncluded,
            lunchTimeArray,
            shopTimeArray,
            latLong,
          };

          function setCookieObject(name1, value, daysToExpire) {
            const expires = new Date();
            expires.setDate(expires.getDate() + daysToExpire);

            // Serialize the object to JSON and encode it
            const cookieValue =
              encodeURIComponent(JSON.stringify(value)) +
              (daysToExpire ? `; expires=${expires.toUTCString()}` : "");

            document.cookie = `${name1}=${cookieValue}; path=/`;
          }
          setCookieObject("shop_info", hotelInfo, 7);

          console.log("done");
          navigate("/shop-final-registration");
        } else {
          alert(t("somethingWrong"));
        }
      }
    }
  }, [formErrors]);

  const validate = (
    shopName,
    selectedStartTime,
    selectedEndTime,
    selectedShopStartTime,
    selectedShopEndTime,
    selectedDistrict,
    selectedPincode,
    selectedState,
    latLong,

    typeOfShop,
    genderType,
    spaIncluded
  ) => {
    console.log(spaIncluded, "jj");
    const errors = {};
    // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!shopName) {
      errors.shopName = "shop name is required!";
    }
    if (!selectedStartTime) {
      errors.selectedStartTime = "shop startTime is required!";
    }
    if (!selectedEndTime) {
      errors.selectedEndTime = "shop endTime is required!";
      // } else if (!regex.test(values.email)) {
      //   errors.email = "This is not a valid email format!";
      // }
    }
    if (!selectedShopStartTime) {
      errors.selectedShopStartTime = "lunch start time is required";
    }
    if (!selectedShopEndTime) {
      errors.selectedShopEndTime = "lunch end time is required";
    }
    if (!selectedDistrict) {
      errors.selectedDistrict = "district is required";
    }
    if (!selectedPincode) {
      errors.selectedPincode = "pincode is required";
    }
    if (!selectedState) {
      errors.selectedState = "state  is required";
    }
    if (!latLong) {
      errors.latLong = "latitudes, longitudes are required";
    }

    if (!genderType) {
      errors.genderType = "gender is required";
    }

    if (!typeOfShop) {
      errors.typeOfShop = "type is required";
    }

    if (spaIncluded === null) {
      errors.spaIncluded = "spa inclusion is required";
    }

    return errors;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(typeOfShop, "uiuiuiuiuiuiuiuiui");
    setFormErrors(
      validate(
        shopName,
        selectedStartTime,
        selectedEndTime,
        selectedShopStartTime,
        selectedShopEndTime,
        selectedDistrict,
        selectedPincode,
        selectedState,
        latLong,

        typeOfShop,
        genderType,
        spaIncluded
      )
    );
    setIsSubmit(true);
  };

  const clearError = (fieldName) => {
    setFormErrors((prevErrors) => {
      return { ...prevErrors, [fieldName]: "" };
    });
  };

  return (
    <div className="pt-10 pb-20">
      <div>
        <RegistrationWizard activeStep={1} />
      </div>
      {map ? (
        <div className="reserve">
          <div className="md:w-[75%] w-[90%] mx-auto">
            <h1>{t("reactGoogleMapsClickExample")}</h1>
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
        onSubmit={submitHandler}
      >
        <h1 className="my-4 text-xl">{t("shopDetails")}</h1>
        <div className="mb-4">
          <label htmlFor="shopName">{t("shopName")}</label>
          <input
            className="w-full"
            placeholder="salon name"
            id="shopName"
            autoFocus
            onChange={(e) => {
              setShopName(e.target.value);

              clearError("shopName");
            }}
          />
          <p className="text-red-500 py-2">{formErrors?.shopName}</p>
        </div>

        <div className="flex w-full ">
          <div className="mb-4 mr-4 flex flex-col w-full">
            <label htmlFor="shopStartTime">{t("shopStartTime")}</label>
            <select
              className="w-full"
              value={selectedShopStartTime}
              onChange={(e) => handleShopStartTimeChange(e)}
            >
              <option selected value="null">
                {t("selectTime")}
              </option>
              {options.map((option, index) => (
                <option key={option.id} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
            <p className="text-red-500 py-2">
              {formErrors?.selectedShopStartTime}
            </p>
          </div>
          <div className="mb-4 flex flex-col  w-full">
            <label htmlFor="type">{t("shopEndTime")}</label>
            <select
              className="w-full"
              value={selectedShopEndTime}
              onChange={(e) => handleShopEndTimeChange(e)}
            >
              <option selected value="null">
                {" "}
                {t("selectTime")}
              </option>
              {options.map((option, index) => (
                <option key={option.id} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
            <p className="text-red-500 py-2">
              {formErrors?.selectedShopEndTime}
            </p>
          </div>
        </div>
        <div className="flex w-full ">
          <div className="mb-4 mr-4 flex flex-col w-full">
            <label htmlFor="lunchStartTime">{t("lunchStartTime")}</label>
            <select
              className="w-full"
              value={selectedStartTime}
              onChange={(e) => handleStartTimeChange(e)}
            >
              <option selected value="null">
                {t("selectTime")}
              </option>
              {options.map((option, index) => (
                <option key={option.id} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
            <p className="text-red-500 py-2">{formErrors?.selectedStartTime}</p>
          </div>

          <div className="mb-4 flex flex-col  w-full">
            <label htmlFor="lunchEndTime">{t("lunchEndTime")}</label>
            <select
              className="w-full"
              value={selectedEndTime}
              onChange={(e) => handleEndTimeChange(e)}
            >
              <option selected value="null">
                {t("selectTime")}
              </option>
              {options.map((option, index) => (
                <option key={option.id} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
            <p className="text-red-500 py-2">{formErrors?.selectedEndTime}</p>
          </div>
        </div>
        {/* <div className="mb-4">
          <label htmlFor="phone">{t("alternatePhoneNumber")}</label>
          <input className="w-full" type="number" id="phone" />
          {errors.phone && (
            <div className="text-red-500 ">{errors.phone.message}</div>
          )}
        </div> */}

        <div>
          <div>
            <label htmlFor="stateSelect">Select a State:</label>
            <select
              id="stateSelect"
              onChange={handleStateChange}
              value={selectedState}
            >
              <option value="" disabled selected>
                Select a state
              </option>
              {statesInIndia.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <p className="text-red-500 py-2">{formErrors?.selectedState}</p>
          </div>

          {selectedState && (
            <div>
              <label htmlFor="districtSelect">Select a District:</label>
              <select
                id="districtSelect"
                onChange={handleDistrictChange}
                value={selectedDistrict}
              >
                <option value="" disabled selected>
                  Select a district
                </option>
                {Object.keys(states[selectedState])?.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <p className="text-red-500 py-2">
                {formErrors?.selectedDistrict}
              </p>
            </div>
          )}

          {selectedState && selectedDistrict && (
            <div>
              <label htmlFor="pincodeSelect">Select a Pincode:</label>
              <select
                id="pincodeSelect"
                onChange={handlePincodeChange}
                value={selectedPincode}
              >
                <option value="" disabled selected>
                  Select a pincode
                </option>
                {Object.keys(states[selectedState][selectedDistrict])?.map(
                  (postalCode, index) =>
                    states[selectedState][selectedDistrict][postalCode]?.map(
                      (pincodeObj, pincodeIndex) => (
                        <option
                          key={pincodeIndex}
                          value={`${pincodeObj.name}, ${postalCode}`}
                        >
                          {`${pincodeObj.name}, ${postalCode}`}
                        </option>
                      )
                    )
                )}
              </select>
              <p className="text-red-500 py-2">{formErrors?.selectedPincode}</p>
            </div>
          )}
        </div>

        <div className="w-full flex  flex-wrap">
          {/* <div className="mb-4">
            <label htmlFor="village">Village</label>
            <input className="w-full" placeholder="address" id="village" />
          </div> */}
          <div className="mb-4 w-full">
            <label htmlFor="type">{t("type")}</label>
            <select
              className="w-full p-1.5"
              onChange={handleType}
              value={typeOfShop}
            >
              <option value="null" selected>
                {t("selectType")}
              </option>
              <option value="salon">{t("salon")}</option>
              <option value="parlour">{t("parlour")}</option>
              <option value="spa">{t("spa")}</option>
            </select>
            <p className="text-red-500 py-2">{formErrors?.typeOfShop}</p>
          </div>

          <div className="mb-4 w-full">
            <label htmlFor="genderType">Gender {t("type")}</label>
            <select
              className="w-full p-1.5"
              onChange={handleParlourType}
              value={genderType}
            >
              <option value="null" selected>
                {t("select")} Gender {t("type")}
              </option>
              <option value="women">{t("women")}</option>
              <option value="men">{t("men")}</option>
              <option value="unisex">{t("unisex")}</option>
            </select>
            <p className="text-red-500 py-2">{formErrors?.genderType}</p>
          </div>
        </div>

        <div className="mb-4 w-full flex items-start justify-around">
          <label htmlFor="Spa">Does Your shops has SPA Included?</label>
          <div className="flex items-center justify-center space-x-2">
            <input
              type="checkbox"
              name="Yes"
              checked={spaIncluded === true}
              className="h-6 w-6"
              id="Yes"
              onChange={(event) => {
                setSpaIncluded(true);
                clearError("spaIncluded");
              }}
              // disabled={isAvailable(i)}
            />
            <label className="text-gray-900">{t("yesIncluded")}</label>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <input
              type="checkbox"
              name="No"
              checked={spaIncluded === false}
              className="h-6 w-6"
              id="No"
              value={false}
              onChange={(event) => {
                setSpaIncluded(false);
                clearError("spaIncluded");
              }}

              // disabled={isAvailable(i)}
            />
            <label className="text-gray-900">{t("notIncluded")}</label>
          </div>
        </div>
        <p className="text-red-500 py-2">{formErrors?.spaIncluded}</p>

        {/* <div className="mb-4">
          <label htmlFor="description">{t("description")}</label>
          <input
            className="w-full"
            placeholder="unique point about your shop"
            id="description"
          />
        </div> */}
        <div className="mb-4" onClick={handleClick}>
          <label htmlFor="address">Exact Address</label>
          <p className="w-full px-5 py-2 bg-green-200 rounded-md cursor-pointer">
            {latLong
              ? `lat:${latLong?.lat} , lng:${latLong?.lng}`
              : "Select on map"}
          </p>
          <p className="text-red-500 py-2">{formErrors?.latLong}</p>
        </div>

        <div className="mb-4 flex justify-between">
          <button className="primary-button">{t("next")}</button>
        </div>
      </form>
    </div>
  );
};

export default ShopDetails;
