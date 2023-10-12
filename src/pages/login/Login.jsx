import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import LoginImage from "../images/login.jpeg";
import { messaging } from "../../firebase";
import { getToken } from "firebase/messaging";
import axios from "axios";
import "./login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/navbar/Layout";

import Footer from "../../components/footer/Footer";
import { useState } from "react";

import { SearchContext } from "../../context/SearchContext";
import Sidebar from "../../components/navbar/SIdebar";
import Greeting from "../../components/navbar/Greeting";
import PhoneInput from "react-phone-number-input";
import baseUrl from "../../utils/client";
import secureLocalStorage from "react-secure-storage";
import { useTranslation } from "react-i18next";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState();

  const [token, setToken] = useState("");
  const { t } = useTranslation();

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
          "BBxeTBZDBt6mAaEKjhzYA6GC1vJ7nuGhXfb5eqpArsgnfP4iWlgIAZmoHP6jJn9_HDODQKSPiLrGzQd6rKNhuCo",
      });
      // console.log("Token Gen", token);
      setToken(token);
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      alert(t("deniedForNotification"));
    }
  }
  let w = window.innerWidth;
  useEffect(() => {
    // Req user for notification permission
    secureLocalStorage.clear();
    w <= 768
      ? window.scrollTo(0, document.body.scrollHeight)
      : window.scrollTo(0, 0);
    requestPermission();
  }, [w]);

  const saveToken = async (id, token) => {
    try {
      const response = await axios.post(`${baseUrl}/api/firebase/tokens`, {
        userId: id,
        token,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const params = new URLSearchParams(location?.search);
  const redirect = params.get("redirect") || location?.state?.destination;

  const { loading, error: errorContext, dispatch } = useContext(AuthContext);

  const { open } = useContext(SearchContext);

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "LOGIN_START" });

      try {
        const res = await axios.post(
          `${baseUrl}/api/auth/login`,
          {
            phone: number,
            password,
          },
          { withCredentials: true }
        );

        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });

        token !== "" && saveToken(res.data.details._id, token);
        navigate(redirect || "/");
      } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
      }
    } catch (err) {
      toast.error(err);
    }
  };
  return (
    <div>
      <div className="px-8 py-8 md:min-h-[60vh] md:flex justify-center md:mb-20 pb-20 md:pt-8 pt-5">
        <img
          src={LoginImage}
          alt="login"
          height={400}
          width={400}
          className="card"
        ></img>
        <form className="px-10 py-5 card h-auto" onSubmit={handleSubmit1}>
          <h1 className="mb-4 text-2xl font-semibold">{t("loginTitle")}</h1>

          <div className="mb-4">
            <label htmlFor="name">{t("phoneTitle")}</label>
            <PhoneInput
              defaultCountry="IN"
              id="number"
              value={number}
              onChange={setNumber}
              placeholder="Enter Phone Number"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password">{t("password")}</label>
            <input
              className="w-full"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <button className="primary-button" disabled={loading}>
              {t("loginTitle")}
            </button>
          </div>
          <p className="text-md underline text-blue-600 mt-3">
            <Link to="/register">{t("dontHaveAccountClickHere")}</Link>
          </p>
          {errorContext && (
            <p className="mt-8 rounded py-2 bg-red-500 px-5 text-white">
              {errorContext.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
