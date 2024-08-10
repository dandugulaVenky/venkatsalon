import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./otp.css";
import "react-phone-number-input/style.css";
import { AuthContext } from "../../context/AuthContext";
import LoginImage from "../../pages/images/login.jpeg";
import { messaging } from "../../firebase";
import { getToken } from "firebase/messaging";
import { useState } from "react";
import { useEffect } from "react";
import { SearchContext } from "../../context/SearchContext";

import Header from "../../components/header/Header";
import Select from "../images/select.png";

import OtpVerification from "./OtpVerification";

import { useTranslation } from "react-i18next";
import baseUrl from "../../utils/client";
import axiosInstance from "../../components/axiosInterceptor";

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

function setCookieObject(name1, value, daysToExpire) {
  const expires = new Date();
  expires.setDate(expires.getDate() + daysToExpire);

  // Serialize the object to JSON and encode it
  const cookieValue =
    encodeURIComponent(JSON.stringify(value)) +
    (daysToExpire ? `; expires=${expires.toUTCString()}` : "");

  document.cookie = `${name1}=${cookieValue}; path=/`;
}

const Register = () => {
  const [token, setToken] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  let { dispatch: dispatch1, type } = useContext(SearchContext);

  const [address, setAddress] = useState("Thimmapur");
  const [header, setHeader] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const location = useLocation();
  const { shopId } = location?.state !== null && location?.state;

  const [canShowNumber, setCanShowNumber] = useState();
  const [storedUser, setStoredUser] = useState(null);
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
      // Send this token  to server (db)
    } else if (permission === "denied") {
      alert(t("deniedForNotification"));
    }
  }

  useEffect(() => {
    // Req user for notification permission
    window.scrollTo(0, 0);
    requestPermission();

    const storedUser1 = getCookieObject("normalUser_info");

    if (storedUser1) {
      setStoredUser(storedUser1);
      setValue("name", storedUser1.name);
      setAddress(storedUser1.city);
      setEmailVerified(storedUser1.emailVerified);
      setPhoneVerified(storedUser1.phoneVerified);
      setTermsAccepted(storedUser1.termsAccepted);

      setValue("email", storedUser1.email);
      setValue("password", storedUser1.password);
    }
  }, [canShowNumber]);

  const { error: errorContext } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    setValue,

    formState: { errors },
  } = useForm();

  const { t } = useTranslation();

  const submitHandler = async ({ name, email, password }) => {
    setLoading(true);
    if (!name || !password || !address) {
      setLoading(false);
      return alert(t("pleaseEnterAllDetails"));
    }

    if (!termsAccepted) {
      setLoading(false);

      return toast("Please accept terms and conditions to continue!");
    }
    const storedUser1 = getCookieObject("normalUser_info");

    const normalUserData = {
      name,
      city: address,
      // email,
      // emailVerified,
      phoneVerified,
      password,
      termsAccepted,
      number: storedUser1?.number || "",
    };
    setStoredUser(normalUserData);
    setCookieObject("normalUser_info", normalUserData, 7);
    setCanShowNumber(true);
    setLoading(false);
    // try {
    // const sendOtp = async () => {
    // const res = await axiosInstance.post(
    //   `${baseUrl}/send-email-verification-otp`,
    //   {
    //     email,
    //   }
    // );

    // if (res.status === 200) {

    // } else {
    //   alert("Something went wrong!");
    //   setLoading(false);
    // }
    // };

    // sendOtp();
    // } catch (err) {
    //   console.log(err);
    //   setLoading(false);
    // }
  };
  const handleLocation = () => {
    setHeader(true);
  };

  return (
    <div className="pt-10 pb-20">
      {header ? (
        <Header
          city={address}
          setHeader={setHeader}
          setAddress={setAddress}
          dispatch={dispatch1}
          type={type}
          z
          register={true}
          header={header}
        />
      ) : (
        <Header header={header} />
      )}

      <div className="px-8  md:min-h-[60vh] md:flex justify-center ">
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
              emailVerified={false}
              setEmailVerified={setEmailVerified}
              phoneVerified={phoneVerified}
              setPhoneVerified={setPhoneVerified}
              storedUser={storedUser}
              setCanShowNumber={setCanShowNumber}
            />

            <img src={Select} alt="select category" className="h-52" />
          </div>
        ) : (
          <form
            className="md:px-10 px-5 py-2.5 card text-sm "
            onSubmit={handleSubmit(submitHandler)}
          >
            <h1 className="mb-4 text-2xl font-semibold">{t("register")}</h1>

            <div className="mb-4 ">
              <label htmlFor="name">{t("Full Name")}</label>
              <input
                type="text"
                className="w-full"
                id="name"
                autoFocus
                {...register("name", {
                  required: "Please enter username",
                  minLength: {
                    value: 6,
                    message: "Name must be more than 5 chars",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-@#]+(\s[a-zA-Z0-9_.+-@#]+)?$/i,

                    message: "Please enter valid name",
                  },
                })}
              />
              {errors.name && (
                <div className="text-red-500">{errors.name.message}</div>
              )}
            </div>
            {/* <div className="mb-4">
              <label htmlFor="email">{t("emailTitle")}</label>
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
            </div> */}

            <div className="mb-4">
              <label htmlFor="password">{t("password")}</label>
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
              <label htmlFor="city">{t("address")}</label>

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
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
              </div>
              <div>
                <label htmlFor="terms" className="text-[10px] ">
                  {t("agreeAllThetermsAndConditions")}
                </label>
                <p className="text-[10px]">
                  {t("haveReadPrivacyAndCancellationPolicy")}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <button className="primary-button" disabled={loading}>
                {loading ? "loading" : t("next")}
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
                {t("alreadyHaveAccountClickHere")}
              </button>
            </p>
            {errorContext && <span>{errorContext.message}</span>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
