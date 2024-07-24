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
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    const getAdmin = async () => {
      try {
        let isAdmin = await axiosInstance.get(
          `${baseUrl}/api/users/${user?._id}`,
          {
            withCredentials: true,
          }
        );

        setIsAdmin(isAdmin.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        toast("finding admin failed!");
      }
    };
    getAdmin();
  }, [user?._id]);

  const handleClick = (value) => {
    const input = value;

    switch (input) {
      case "transactions":
        navigate("/admin/transactions");
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
        <div className="min-h-[85vh]  flex items-center justify-center">
          <span className="loader "></span>
        </div>
      ) : isAdmin ? (
        <div className="min-h-[85vh] flex flex-col justify-center md:w-[30vw] w-[80vw] mx-auto cursor-pointer">
          <p>{isAdmin?.shopName}</p>
          <div
            className="card p-5 w-full"
            onClick={() => handleClick("transactions")}
          >
            <p>{t("transactions")}</p>
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
          <div className="card p-5 w-full" onClick={() => handleClick("block")}>
            <p>{t("takeBreak")} </p>
          </div>
          <div
            className="card p-5 w-full"
            onClick={() => handleClick("updateShopDetails")}
          >
            <p>Add/Del Shop Photos</p>
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
