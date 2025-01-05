import React, { useContext, useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import baseUrl from "../../utils/client";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../components/axiosInterceptor";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [shopData, setShopData] = useState();
  const { t } = useTranslation();

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

    fetchData();
  }, [user?._id, user?.shopId]);

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
      case "updateShopDetails":
        navigate("/admin/update-shop-details");
        break;
      default:
        console.log("It is an unknown input.");
        break;
    }
  };

  return (
    <div className="pt-6 pb-20">
      {loading ? (
        <div className="min-h-[80vh]  flex items-center justify-center">
          <span className="loader "></span>
        </div>
      ) : isAdmin ? (
        <div className="flex   md:flex-row flex-column items-center justify-center gap-8  md:w-[80vw] w-[85%] mx-auto">
          <div className="flex flex-1 items-center justify-center ">
            <p className="text-gray-500 font-bold text-4xl scroll-pb-3">
              {" "}
              Hi, welcome to {shopData?.name}
            </p>
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
              <p>{t("viewOrders")}</p>
            </div>
            <div
              className="card p-5 w-full"
              onClick={() => handleClick("appointments")}
            >
              <p>View Appointments</p>
            </div>
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
              <p>Add/Del Shop Photos</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-10">
          <p>
            {t("notAnAdmintoRegisterYourSaloonPlease")}
            <Link to="/contactus">{t("contactUs")}</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Admin;
