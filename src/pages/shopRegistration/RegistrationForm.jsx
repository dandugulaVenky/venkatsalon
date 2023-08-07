import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

import OtpVerification from "../registration/OtpVerification";
import baseUrl from "../../utils/client";
import options from "../../utils/time";
import RegistrationWizard from "./RegistrationWizard";

const RegistrationForm = () => {
  const [token, setToken] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  let { dispatch: dispatch1, type } = useContext(SearchContext);
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [header, setHeader] = useState(false);
  const [verified, setVerified] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const userID = "123";
  // console.log(options,"opt");
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

  const saveToken = async (id, token) => {
    try {
      const response = await axios.post(`${baseUrl}/tokens`, {
        userId: id,
        token,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Req user for notification permission
    window.scrollTo(0, 0);
    requestPermission();
  }, []);

  const { loading, error: errorContext } = useContext(AuthContext);

  const {
    handleSubmit,
    register,

    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, password }) => {
    // if (!verified) {
    //   return toast("Please verify the phone number!");
    // }
    // else if (!termsAccepted) {
    //   return toast("Please accept terms and conditions to continue!");
    // }else if(!address){
    //   return toast("Please select a city!");

    // }
    console.log({ name, email, password, address });
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
    navigate("/shop-details", { state: { userID } });
  };
  const handleLocation = () => {
    setHeader(!header);
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
      ) : address.length > 0 ? (
        <Header header={header} />
      ) : (
        <Header header={null} />
      )}
      {open && <Sidebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}
      <div className="md:py-0.5 py-5">
        <RegistrationWizard activeStep={0} />
      </div>
      <div className="px-8 w-full mx-auto md:min-h-[60vh] md:flex justify-center md:mb-20 pb-20 pt-5">
        <img
          src={LoginImage}
          alt="login"
          height={400}
          width={400}
          className="card"
        ></img>
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
            <label htmlFor="password">Password</label>
            <input
              className="w-full"
              type="password"
              id="password"
              {...register("password", {
                pattern: {
                  value: /^(?=.*[@_])[a-zA-Z0-9@_]+$/,
                  message:
                    "Password must include special characters like @ or _",
                },
                minLength: {
                  value: 8,
                  message: "password must be more than 8 chars",
                },
              })}
            />
            {errors.password && (
              <div className="text-red-500 ">{errors.password.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="city">Address</label>
            <input
              type="text"
              className="w-full"
              id="city"
              value={address ? address : ""}
              onClick={handleLocation}
              placeholder="enter city name"
            />
          </div>

          <OtpVerification
            verified={verified}
            setVerified={setVerified}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            loading={loading}
            number={number}
            setNumber={setNumber}
            userID={userID}
          />
          <p className="text-xs underline text-blue-600">
            <Link to="/login">Already have an account? Click Here</Link>
          </p>
          {errorContext && <span>{errorContext.message}</span>}
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default RegistrationForm;
