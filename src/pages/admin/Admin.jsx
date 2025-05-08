import React, { useContext, useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import baseUrl from "../../utils/client";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../components/axiosInterceptor";
import PlanExpiryPopup from "./PlanExpiryPopup";
import moment from "moment";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [shopData, setShopData] = useState();
  const { dispatch } = useContext(AuthContext);
  const { t } = useTranslation();
  const [allShops, setAllShops] = useState([]);
  const [fetchNow, setFetchNow] = useState(false);
  const [shopName, setShopName] = useState("null");

  useEffect(() => {
    if (!user?._id || !user?.shopId) return;

    const fetchData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);

      try {
        // Fetch admin status
        const adminResponse = await axiosInstance.get(
          `${baseUrl}/api/users/${user._id}`,
          { withCredentials: true }
        );
        setIsAdmin(adminResponse.data);

        // Fetch shop data
        const shopResponse = await axiosInstance.get(
          `${baseUrl}/api/hotels/find/${user.shopId}`
        );
        setShopData(shopResponse.data);
      } catch (err) {
        console.error(err);
        toast("Fetching data failed!");
      } finally {
        setLoading(false);
      }
    };

    fetchNow && fetchData();
  }, [fetchNow, user._id, user.shopId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getAllShops = async () => {
      const res = await axiosInstance.get(
        `${baseUrl}/api/hotels/findUserShops/${user._id}`
      );
      setAllShops(res?.data?.data);
      setFetchNow(res?.data?.data?.length > 1 ? false : true);
    };

    getAllShops();
  }, [user._id]);

  const handleClick = (value) => {
    const input = value;

    switch (input) {
      case "rewards":
        navigate("/admin/rewards");
        break;
      case "orders":
        navigate("/admin/orders");
        break;
      case "appointments":
        navigate("/admin/appointments");
        break;
      case "packages":
        navigate("/admin/packages");
        break;
      case "services":
        navigate("/admin/my-services");
        break;
      case "myBarbers":
        navigate("/admin/my-barbers");
        break;
      case "addServices":
        navigate("/admin/add-services");
        break;
      case "block":
        navigate("/admin/break");
        break;
      case "myOffers":
        navigate("/admin/my-offers");
        break;
      case "updateShopDetails":
        navigate("/admin/update-shop-details");
        break;
      default:
        console.log("It is an unknown input.");
        break;
    }
  };
  useEffect(() => {
    if (user.shopId) {
      setFetchNow(true);
      setShopName(user.shopId);
    }
  }, [user.shopId]);

  const handleShop = (value) => {
    console.log(value, "value");
    if (!value) return;
    setShopName(value);
    dispatch({ type: "UPDATE_SHOP_ID", payload: value });
  };

  return (
    <>
      <div>
        {allShops?.length > 1 && (
          <div className="p-5">
            <select
              onChange={(e) => handleShop(e.target.value)}
              value={shopName}
            >
              <option value="null">Select a shop</option>
              {allShops.map((shop) => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="pt-6 pb-20">
        {loading && fetchNow ? (
          <div className="min-h-[80vh]  flex items-center justify-center">
            <span className="loader "></span>
          </div>
        ) : isAdmin ? (
          <div className="flex   md:flex-row flex-column items-center justify-center gap-8  md:w-[80vw] w-[85%] mx-auto">
            <PlanExpiryPopup hotel={shopData} />

            <div className="flex flex-col flex-1 items-center justify-center ">
              <p className="text-gray-500 font-bold text-4xl scroll-pb-3">
                {" "}
                Hi, welcome to {shopData?.name}
              </p>

              <div className="card mt-5 p-5 w-full flex flex-col items-center justify-center">
                <p className="font-bold text-xl">{shopData.plan.duration}</p>
                <p>{shopData.plan.description}</p>
                {/* <p>{moment(shopData.plan.startDate).format("MMMM Do YYYY")}</p> */}
                <p>
                  Expiry: {moment(shopData.plan.endDate).format("MMMM Do YYYY")}
                </p>
              </div>
            </div>
            <div className="min-h-[85vh] flex flex-col justify-center w-[50%] cursor-pointer">
              <div
                className="card p-5 w-full"
                onClick={() => handleClick("rewards")}
              >
                <p>Rewards</p>
              </div>
              <div
                className="card p-5 w-full"
                onClick={() => handleClick("orders")}
              >
                <p>View Appointments</p>
              </div>
              {/* <div
                className="card p-5 w-full"
                onClick={() => handleClick("appointments")}
              >
                <p>View Appointments</p>
              </div> */}
              <div
                className="card p-5 w-full"
                onClick={() => handleClick("services")}
              >
                <p>{t("myServices")}</p>
              </div>
              <div
                className="card p-5 w-full"
                onClick={() => handleClick("myBarbers")}
              >
                <p>My Barbers</p>
              </div>
              <div
                className="card p-5 w-full"
                onClick={() => handleClick("addServices")}
              >
                <p>{t("addServices")}</p>
              </div>
              <div
                className="card p-5 w-full"
                onClick={() => handleClick("packages")}
              >
                <p>{t("addPackages")}</p>
              </div>
              <div
                className="card p-5 w-full"
                onClick={() => handleClick("block")}
              >
                <p>{t("takeBreak")} </p>
              </div>
              <div
                className="card p-5 w-full"
                onClick={() => handleClick("updateShopDetails")}
              >
                <p>Update Shop Details</p>
              </div>
              <div
                className="card p-5 w-full"
                onClick={() => handleClick("myOffers")}
              >
                <p>My Offers</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center px-10">
            <p>
              Please select a shop to manage. If you don't have a shop,
              <Link to="/contactus">{t("contactUs")}</Link>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;
