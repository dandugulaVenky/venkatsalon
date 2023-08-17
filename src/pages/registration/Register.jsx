import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../components/footer/Footer";
import Layout from "../../components/navbar/Layout";
import "./otp.css";
import "react-phone-number-input/style.css";
import { AuthContext } from "../../context/AuthContext";
import LoginImage from "../../pages/images/login.jpeg";
import { messaging } from "../../firebase";
import { getToken } from "firebase/messaging";
import { useState } from "react";
import { useEffect } from "react";
import { SearchContext } from "../../context/SearchContext";
import Sidebar from "../../components/navbar/SIdebar";
import Greeting from "../../components/navbar/Greeting";
import Header from "../../components/header/Header";
import Select from "../images/select.png";

import OtpVerification from "./OtpVerification";
import baseUrl from "../../utils/client";
import { useTranslation } from 'react-i18next';

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

const Register = () => {
  const [token, setToken] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  let { dispatch: dispatch1, city, type } = useContext(SearchContext);
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [header, setHeader] = useState(null);
  const [verified, setVerified] = useState(false);
  const location = useLocation();
  const { shopId } = location?.state !== null && location?.state;
  console.log(shopId);
  const [canShowNumber, setCanShowNumber] = useState();
  const [storedUser, setStoredUser] = useState();
  const navigate = useNavigate();
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
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    // Req user for notification permission
    window.scrollTo(0, 0);
    requestPermission();

    const storedUser = getCookieObject("normalUser_info");

    if (storedUser) {
      setStoredUser(storedUser);
      setValue("name", storedUser.name);
      setAddress(storedUser.city);
      setVerified(storedUser.verified);
      setNumber(storedUser.number);
      setValue("email", storedUser.email);
      setValue("password", storedUser.password);
    }
  }, []);

  const { loading, error: errorContext } = useContext(AuthContext);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const { t } = useTranslation();


  const submitHandler = async ({ name, email, password }) => {
    if (!name || !email || !password || !address) {
      return alert("Please enter all details!");
    }

    if (!termsAccepted) {
      return toast("Please accept terms and conditions to continue!");
    }

    // console.log(normalUserData);
    // function setCookieObject(name1, value, daysToExpire) {
    //   const expires = new Date();
    //   expires.setDate(expires.getDate() + daysToExpire);

    //   // Serialize the object to JSON and encode it
    //   const cookieValue =
    //     encodeURIComponent(JSON.stringify(value)) +
    //     (daysToExpire ? `; expires=${expires.toUTCString()}` : "");

    //   document.cookie = `${name1}=${cookieValue}; path=/`;
    // }
    // setCookieObject("normalUser_info", normalUserData, 7);
    const normalUserData = {
      name,
      city: address,
      email,
      password,
      termsAccepted,
    };
    setStoredUser(normalUserData);
    setCanShowNumber(true);
  };
  const handleLocation = () => {
    setHeader(true);
  };

  let w = window.innerWidth;
  const { open } = useContext(SearchContext);

  return (
    <div>
      {header ? (
        <Header
          setHeader={setHeader}
          setAddress={setAddress}
          dispatch={dispatch1}
          type={type}
          register={true}
          header={header}
        />
      ) : (
        <Header header={header} />
      )}
      {open && <Sidebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}

      {location?.pathname?.includes("/register") && (
        <p className="text-lg underline text-blue-600 pb-2 text-center">
          <Link to="/shop-registration">
            {t('barber/beauticianClickHere')}
          </Link>
        </p>
      )}
      <div className="px-8  md:min-h-[60vh] md:flex justify-center md:mb-20 pb-20 pt-5">
        <img
          src={LoginImage}
          alt="login"
          height={400}
          width={400}
          className="card"
        ></img>

        {canShowNumber ? (
          <div className="md:px-10 px-5 pt-10 card text-sm ">
            <OtpVerification
              token={token}
              verified={verified}
              setVerified={setVerified}
              number={number}
              setNumber={setNumber}
              storedUser={storedUser}
              setCanShowNumber={setCanShowNumber}
            />

            <img src={Select} alt="select category" className="h-72" />
          </div>
        ) : (
          <form
            className="md:px-10 px-5 py-2.5 card text-sm "
            onSubmit={handleSubmit(submitHandler)}
          >
            <h1 className="mb-4 text-2xl font-semibold">{t('register')}</h1>

            <div className="mb-4 ">
              <label htmlFor="name">{t('username')}</label>
              <input
                type="text"
                className="w-full"
                id="name"
                autoFocus
                {...register("name", {
                  required: "Please enter username",
                  minLength: {
                    value: 6,
                    message: "Username must be more than 5 chars",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-@#]+$/i,
                    message: "Please enter valid username",
                  },
                })}
              />
              {errors.name && (
                <div className="text-red-500">{errors.name.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email">{t('emailTitle')}</label>
              <input
                type="email"
                className="w-full"
                id="email"
                {...register("email", {
                  required: "Please enter email",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                    message: "Please enter valid email",
                  },
                })}
              />
              {errors.email && (
                <div className="text-red-500">{errors.email.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="password">{t('password')}</label>
              <input
                className="w-full"
                type="password"
                id="password"
                {...register("password", {
                  minLength: {
                    value: 8,
                    message: "password must be more than 8 chars",
                  },
                  pattern: {
                    value: /^(?=.*[@_])[a-zA-Z0-9@_]+$/,
                    message:
                      "Password must include special characters like @ or _",
                  },
                })}
              />
              {errors.password && (
                <div className="text-red-500 ">{errors.password.message}</div>
              )}
            </div>

            <div className="mb-4" onClick={handleLocation}>
              <label htmlFor="city">{t('address')}</label>

              <input
                type="text"
                className="w-full"
                id="city"
                placeholder={"enter city name."}
                readOnly
                value={address}
              />
            </div>

            <div className="flex mb-2 flex-col">
              <div>
                <input
                  type="checkbox"
                  id="terms"
                  value={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
              </div>
              <div>
                <label htmlFor="terms" className="text-[10px] ">
                  {t('agreeAllThetermsAndConditions')}
                </label>
                <p className="text-[10px]">
                  {t('haveReadPrivacyAndCancellationPolicy')}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <button className="primary-button" disabled={loading}>
              {t('next')}
              </button>
            </div>

            <p className="text-md underline text-blue-600">
              <button
                onClick={() => {
                  navigate("/login", {
                    state: { destination: `/shops/${shopId}` },
                  });
                }}
              >
                {t('alreadyHaveAccountClickHere')}
              </button>
            </p>
            {errorContext && <span>{errorContext.message}</span>}
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Register;
