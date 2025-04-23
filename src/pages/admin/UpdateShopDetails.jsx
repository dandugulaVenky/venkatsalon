import React, { useContext, useEffect, useState } from "react";
import AdminAddBanner from "../../components/admin/AdminAddBanner";
import options from "../../utils/time";
import axiosInstance from "../../components/axiosInterceptor";
import baseUrl from "../../utils/client";
import { AuthContext } from "../../context/AuthContext";
import MapComponent from "../../components/MapComponent";
import { t } from "i18next";

const UpdateShopDetails = () => {
  const [timeReserve, setTimeReserve] = useState("");
  const [timeReserve1, setTimeReserve1] = useState("");
  const [shopName, setShopName] = useState();
  const [latLong, setLatLong] = useState(null);
  const [map, setMap] = useState(false);
  const [shopAddress, setShopAddress] = useState();
  const [formErrors, setFormErrors] = useState({});
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axiosInstance.get(
        `${baseUrl}/api/hotels/find/${user?.shopId}`
      );

      setData(data);
    };
    window.scrollTo(0, 0);
    getData();
  }, [user?.shopId]);

  const handleTime = (item) => {
    console.log(item, "item");
    setTimeReserve(item);
  };

  const handleTime1 = (item) => {
    setTimeReserve1(item);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = [];

    options.map((option) => {
      if (option.id >= timeReserve && option.id <= timeReserve1) {
        return data.push(option.id);
      }
    });

    // Add your API call logic here to update the lunch details
    try {
      const res = await axiosInstance.put(
        `${baseUrl}/api/hotels/updateLunchDetails/${user?.shopId}`,
        { data },
        { withCredentials: true }
      );

      if (res.status === 201) {
        setTimeReserve("");
        setTimeReserve1("");
        alert("Updated successfully");
      }
    } catch (err) {
      console.log(err, "err");
      alert(err.response.data.message);
    }
  };

  const handleMapClick = (coords) => {
    setLatLong(coords);
    setMap(!map);
    clearError("latLong");
  };

  const handleClick = () => {
    setMap(!map);
  };

  const handleUpdateBasicDetails = async () => {
    setFormErrors(
      validate(
        shopName,

        shopAddress
      )
    );

    if (Object.keys(formErrors).length > 0) {
      return;
    }
    setLoading(true);
    console.log("not");
    const data1 = {
      name: shopName,
      fullAddress: shopAddress,
      latLong: {
        type: "Point",
        coordinates: [
          latLong ? latLong?.lng : data?.latLong?.coordinates?.[0],
          latLong ? latLong?.lat : data?.latLong?.coordinates?.[1],
        ], // IMPORTANT: longitude comes first!
      },
    };

    try {
      const res = await axiosInstance.put(
        `${baseUrl}/api/hotels/updateBasicDetails/${user?.shopId}`,
        data1,
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        alert("Updated successfully");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (fieldName) => {
    setFormErrors((prevErrors) => {
      return { ...prevErrors, [fieldName]: "" };
    });
  };
  const validate = (shopName, latLong) => {
    const errors = {};
    // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!shopName) {
      errors.shopName = "shop name is required!";
    }

    if (!shopAddress) {
      errors.fullAddress = "shop address is required";
    }
    if (!latLong) {
      errors.latLong = "latitudes, longitudes are required";
    }

    return errors;
  };

  const handleFullAddress = (e) => {
    setShopAddress(e.target.value);
    clearError("fullAddress");
  };
  const handleShopName = (e) => {
    setShopName(e.target.value);
    clearError("shopName");
  };

  return (
    <>
      <div className="pt-5 border  border-gray-300 p-5 shadow-md">
        <h1 className="text-2xl font-bold text-center">Update Lunch Details</h1>
        <div className="flex items-center justify-center mt-5">
          <div className="flex flex-col items-start justify-center mt-5 space-y-2 ">
            <div>
              <h1>Select Lunch Start Time</h1>
              <select
                value={timeReserve}
                onChange={(e) => handleTime(e.target.value)}
              >
                <option selected disabled value="">
                  Select time
                </option>
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h1>Select Lunch End Time</h1>
              <select
                value={timeReserve1}
                onChange={(e) => handleTime1(Number(e.target.value))}
              >
                <option disabled value="">
                  Select time
                </option>
                {options.map((option) => (
                  <option key={option.id} value={Number(option.id)}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="primary-button float-left"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <AdminAddBanner />

      <div className="flex flex-col items-center justify-center mt-10 space-y-2  border-gray-300 p-5 shadow-md mb-20">
        <h1>Update Shop Basic Details</h1>

        <div className="flex flex-col items-start justify-center mt-5 space-y-2 border  border-gray-300 p-5 shadow-md">
          <input
            type="text"
            value={shopName || data?.name}
            placeholder="Shop Name"
            onChange={handleShopName}
          />
          <p className="text-red-500 py-2">{formErrors?.shopName}</p>

          <textarea
            rows={3}
            value={shopAddress || data?.fullAddress}
            type="text"
            placeholder="Shop Full Address"
            onChange={handleFullAddress}
          />
          <p className="text-red-500 py-2">{formErrors?.fullAddress}</p>

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
        </div>

        <div className="mb-4 " onClick={handleClick}>
          <label htmlFor="address">Exact Address- Click to change</label>
          <p className="w-full px-5 py-2 bg-green-200 rounded-md cursor-pointer">
            {latLong
              ? `lat:${latLong?.lat} , lng:${latLong?.lng}`
              : `lat:${data?.latLong?.coordinates?.[1]} , lng:${data?.latLong?.coordinates?.[0]}`}
          </p>
          <p className="text-red-500 py-2">{formErrors?.latLong}</p>
        </div>
        <button
          className="primary-button p-5 "
          onClick={handleUpdateBasicDetails}
        >
          {loading ? <span className="buttonloader ml-2"></span> : "Update"}
        </button>
      </div>
    </>
  );
};

export default UpdateShopDetails;
