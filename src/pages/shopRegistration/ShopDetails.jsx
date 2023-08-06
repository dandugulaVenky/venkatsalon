import SIdebar from "../../components/navbar/SIdebar";
import Greeting from "../../components/navbar/Greeting";
import Seo from "../../utils/Seo";
import Layout from "../../components/navbar/Layout";
import CheckoutWizard from "../ironing/ironing-utils/CheckoutWizard";
import Footer from "../../components/footer/Footer";
import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { Store } from "../ironing/ironing-utils/Store";
import options from "../../utils/time";
import RegistrationWizard from "./RegistrationWizard";

const ShopDetails = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const { open } = useContext(SearchContext);
  const { state, dispatch } = useContext(Store);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  let w = window.innerWidth;
  const location = useLocation();
  const userIdValue = location.state;

  const shopID = "qwerty";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    if (
      selectedStartTime !== selectedEndTime
      // && selectedStartTime !== "" && selectedEndTime !== ""
    ) {
      const selectedStartIndex = options.filter((option) => {
        return option.value === selectedStartTime;
      })[0]?.id;
      const selectedEndIndex = options.filter((option) => {
        return option.value === selectedEndTime;
      })[0]?.id;
      const lunchTime = options.filter((option) => {
        return option.id >= selectedStartIndex && option.id < selectedEndIndex;
      });
      const lunchTimeArray = lunchTime.map((option) => {
        return option.id;
      });
      console.log(lunchTimeArray, "lunch array in shop-details");
      navigate("/shop-final-registration", {
        state: { userIdValue, shopID, shopName },
      });
    } else {
      console.log("Select different times");
    }

    // Cookies.set(
    //     "iron-cart",
    //     JSON.stringify({
    //         ...cart,
    //         shippingAddress: {
    //             fullName,
    //             address,
    //             city,
    //             phone,
    //         },
    //     })
    // );

    // navigate("/iron/place-order");
  };
  const handleStartTimeChange = (event) => {
    // console.log(event.target.value,"value start")
    setSelectedStartTime(event.target.value);
  };
  const handleEndTimeChange = (event) => {
    // console.log(event.target.value,"E")
    setSelectedEndTime(event.target.value);
  };
  return (
    <>
      {open && <SIdebar />}
      {w < 768 && <Greeting />}
      {/*<Seo props={siteMetadata} />*/}
      <div className=" px-4">{w >= 768 && <Layout />}</div>
      <div className="md:py-0.5 py-5">
        <RegistrationWizard activeStep={1} />
      </div>
      <form
        className="card mx-auto max-w-screen-md py-0.5 md:px-12 px-7
                 {/*h-[90vh]*/}
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
            })}
          />
          {errors.shopName && (
            <div className="text-red-500">{errors.shopName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">User ID</label>
          <input
            className="w-full"
            id="userId"
            value={userIdValue}
            {...register("userID", {
              // required: "Please enter user ID",
              //     minLength: {
              //         value: 8,
              //         message: "Address must be more than 8 chars",
              //     },
            })}
          />
          {errors.userID && (
            <div className="text-red-500">{errors.userID.message}</div>
          )}
        </div>
        <div className="flex">
          <div className="mb-4 mr-4 flex flex-col">
            <label htmlFor="type">Lunch Start time</label>
            <select
              className="w-28"
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
          <div className="mb-4 flex flex-col">
            <label htmlFor="type">Lunch End time</label>
            <select
              className="w-28"
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
              // required: "Please enter phone number",
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
              // required: "Please enter city",
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
            id="description"
            {...register("description", {
              // required: "Please enter description",
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
              // required: "Please select a type",
            })}
          >
            <option>Salon</option>
            <option>Parlour</option>
          </select>
          {errors.type && (
            <div className="text-red-500 ">{errors.type.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Exact Address</label>
          <input
            className="w-full"
            id="address"
            {...register("address", {
              // required: "Please enter address",
              minLength: {
                value: 8,
                message: "Address must be more than 8 chars",
              },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>

        {/* <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            className="w-full"
            id="country"
            {...register("country", {
              required: "Please enter country",
            })}
          />
          {errors.country && (
            <div className="text-red-500 ">{errors.country.message}</div>
          )}
        </div> */}
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
      <Footer />
    </>
  );
};

export default ShopDetails;
