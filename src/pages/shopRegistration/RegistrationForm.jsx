import axios from "axios";
import React, { memo, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Footer from "../../components/footer/Footer";
import Layout from "../../components/navbar/Layout";
import "../registration/otp.css";
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

import OtpVerification from "./OtpVerification";

import RegistrationWizard from "./RegistrationWizard";
import Select from "../images/select.png";

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

const RegistrationForm = () => {
  const [token, setToken] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  let { dispatch: dispatch1, city, type } = useContext(SearchContext);
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [header, setHeader] = useState(null);
  const [verified, setVerified] = useState(false);
  const { pathname } = useLocation();
  const [canShowNumber, setCanShowNumber] = useState();
  const [storedUser, setStoredUser] = useState();
  const [askOwner, setAskOwner] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;

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
      alert(t("deniedForTheNotification"));
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    requestPermission();
    const storedUser = getCookieObject("user_info");
    // const storedUser1 = getCookieObject("ownerUser_info");

    if (storedUser) {
      setValue("name", storedUser?.name);
      setValue("email", storedUser?.email);
      setValue("password", storedUser?.password);
      setValue("city", storedUser?.city);
      setAddress(storedUser?.city);
      setStoredUser(storedUser);
      if (storedUser.step === 1) {
        setAskOwner(true);
      } else if (storedUser.step === 2) {
        setAskOwner(true);
      }
    } else {
      console.log("User info not found in the cookie.");
    }
  }, [navigate, askOwner]);

  const handleContinueProcess = (check) => {
    if (check === "startAgain") {
      function removeCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }

      // Usage example
      removeCookie("user_info");

      setAskOwner(false);
      setStoredUser(null);
      return null;
    }

    const storedUser = getCookieObject("user_info");

    if (storedUser) {
      if (storedUser.step === 1) {
        navigate("/shop-details");
      } else if (storedUser.step === 2) {
        navigate("/shop-final-registration");
      }
    } else {
      console.log("User info not found in the cookie.");
    }
  };

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
      return alert(t("pleaseEnterAllDetails"));
    }

    if (!termsAccepted) {
      return toast("Please accept terms and conditions to continue!");
    }

    if (state?.goToStep && !state?.phoneNumber) {
      storedUser.name = name;
      storedUser.email = email;
      storedUser.city = address;
      storedUser.password = password;

      function setCookieObject(name1, value, daysToExpire) {
        const expires = new Date();
        expires.setTime(expires.getTime() + daysToExpire * 24 * 60 * 60 * 1000);

        // Serialize the object to JSON and encode it
        const cookieValue =
          encodeURIComponent(JSON.stringify(value)) +
          (daysToExpire ? `; expires=${expires.toUTCString()}` : "");

        document.cookie = `${name1}=${cookieValue}; path=/`;
      }
      setCookieObject("user_info", storedUser, 1);
      return navigate("/shop-final-registration");
    }

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
      <div className="md:py-0.5 py-5">
        <RegistrationWizard activeStep={0} />
      </div>

      <div className="px-8  md:min-h-[60vh] md:flex justify-center md:mb-20 pb-20 pt-5">
        <img
          src={LoginImage}
          alt="login"
          height={400}
          width={400}
          className="card"
        ></img>

        {!askOwner || state?.goToStep ? (
          <>
            {canShowNumber || state?.phoneNumber ? (
              <div className="md:px-10 px-5 pt-10 card text-sm ">
                <OtpVerification
                  token={token}
                  verified={verified}
                  setVerified={setVerified}
                  number={number}
                  setNumber={setNumber}
                  storedUser={storedUser}
                  setCanShowNumber={setCanShowNumber}
                  owner={true}
                />

                <img src={Select} alt="select category" className="h-72 w-52" />
              </div>
            ) : (
              <form
                className="md:px-10 px-5 py-2.5 card text-sm "
                onSubmit={handleSubmit(submitHandler)}
              >
                <h1 className="mb-4 text-2xl font-semibold">Register</h1>

                <div className="mb-4 ">
                  <label htmlFor="name">Username</label>
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
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="w-full"
                    id="email"
                    {...register("email", {
                      required: "Please enter email",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                        message: "Please enter valid email",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="text-red-500">{errors.email.message}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="password">Password</label>
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
                    <div className="text-red-500 ">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                <div className="mb-4" onClick={handleLocation}>
                  <label htmlFor="city">Address</label>

                  <input
                    type="text"
                    className="w-full"
                    id="city"
                    placeholder={"enter city name."}
                    readOnly
                    value={storedUser?.city || address}
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
                      I agree, all the terms and conditions and
                    </label>
                    <p className="text-[10px]">
                      I have read privacy policy and cancellation policy
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <button className="primary-button" disabled={loading}>
                    Next
                  </button>
                </div>

                {pathname.includes("/register") && (
                  <p className="text-xs underline text-blue-600 pb-2">
                    <Link to="/shop-registration">
                      Are you a barber/beautician? Click Here
                    </Link>
                  </p>
                )}
                <p className="text-xs underline text-blue-600">
                  <Link to="/login">Already have an account? Click Here</Link>
                </p>
                {errorContext && <span>{errorContext.message}</span>}
              </form>
            )}
          </>
        ) : (
          <div className="flex flex-col space-y-3 pt-1">
            <button
              className="primary-button "
              onClick={() => handleContinueProcess("continue")}
            >
              Continue
            </button>
            <button
              className="primary-button"
              onClick={() => handleContinueProcess("startAgain")}
            >
              Start Again
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default memo(RegistrationForm);
// try {
//   const res = await axios.post(`${baseUrl}/api/auth/register`, {
//     username: name.trim().toLowerCase(),
//     email: email.trim().toLowerCase(),
//     password: password.trim(),

//     city:city.toLowerCase(),
//     phone: number,
//   });

//   if (res.status === 200) {
//     dispatch({ type: "LOGIN_START" });
//     try {
//       const res = await axios.post(`${baseUrl}/api/auth/login`, {
//         phone: number,

//         password,
//       });
//       dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
//       token !== "" && saveToken(res.data.details._id, token);

//       navigate("/");
//     } catch (err) {
//       dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
//     }
//   }
// } catch (err) {
//   toast.error(err.response.data.message);
// }
