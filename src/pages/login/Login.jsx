import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import LoginImage from "../images/login.jpeg";
import { auth, messaging, provider } from "../../firebase";
import { getToken } from "firebase/messaging";

import "./login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { useState } from "react";

import PhoneInput from "react-phone-number-input";
import baseUrl from "../../utils/client";

import { useTranslation } from "react-i18next";
import axiosInstance from "../../components/axiosInterceptor";
import { signInWithPopup } from "firebase/auth";
import OtpVerification from "../registration/OtpVerification";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  // const [number, setNumber] = useState("");
  // const [password, setPassword] = useState("");
  const [loading1, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const { t } = useTranslation();

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [storedUser, setStoredUser] = useState(null);
  const [canShowNumber, setCanShowNumber] = useState(false);
  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
          "BBxeTBZDBt6mAaEKjhzYA6GC1vJ7nuGhXfb5eqpArsgnfP4iWlgIAZmoHP6jJn9_HDODQKSPiLrGzQd6rKNhuCo",
      });
      console.log("Token Gen", token);
      setToken(token);
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      // alert(t("deniedForNotification"));
      console.log("denied notification");
    }
  }
  let w = window.innerWidth;

  useEffect(() => {
    // Req user for notification permission
    // secureLocalStorage.clear();
    w <= 768
      ? window.scrollTo(0, document.body.scrollHeight)
      : window.scrollTo(0, 0);
    requestPermission();
  }, [w]);

  const saveToken = async (id, token) => {
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/api/firebase/tokens`,
        {
          userId: id,
          token,
        }
      );
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const params = new URLSearchParams(location?.search);
  const redirect = params.get("redirect") || location?.state?.destination;

  const { loading, error: errorContext, dispatch } = useContext(AuthContext);

  // const { open } = useContext(SearchContext);

  // const handleSubmit1 = async (e) => {
  //   e.preventDefault();

  //   try {
  //     dispatch({ type: "LOGIN_START" });

  //     try {
  //       const res = await axiosInstance.post(
  //         `${baseUrl}/api/auth/login`,
  //         {
  //           phone: number,
  //           password,
  //           type: "normal",
  //         },
  //         { withCredentials: true }
  //       );
  //       localStorage.setItem("access_token", res.data.token);
  //       dispatch({
  //         type: "LOGIN_SUCCESS",
  //         payload: {
  //           user: res.data.details, // Assuming user details are in 'details'
  //           token: res.data.accessToken,
  //           refreshToken: res.data.refreshToken, // Assuming token is in 'token'
  //         },
  //       });

  //       token !== "" && saveToken(res.data.details._id, token);
  //       navigate(redirect || "/");
  //     } catch (err) {
  //       dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
  //     }
  //   } catch (err) {
  //     toast.error(err);
  //   }
  // };

  const googleLogin = async () => {
    setLoading(true);
    const response = await signInWithPopup(auth, provider);

    const { user } = response;
    let user1 = { name: user.displayName, email: user.email, city: "" };
    // alert(JSON.stringify(user1));
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axiosInstance.post(
        `${baseUrl}/api/auth/login`,
        {
          email: user1.email,
          type: "google",
        },
        { withCredentials: true }
      );

      toast.success("Login Successfull");

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: res.data.details, // Assuming user details are in 'details'
          token: res.data.accessToken,
          refreshToken: res.data.refreshToken, // Assuming token is in 'token'
        },
      });
      // token !== "" && saveToken(res.data.details._id, token);
      setLoading(false);
      navigate(redirect || "/");
    } catch (err) {
      toast.success("User not found...redirect...");
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
      if (err.response.status === 404) {
        alert("User not found with this email, creating a account!");

        setStoredUser(user1);
        setCanShowNumber(true);
        setEmailVerified(true);
        setLoading(false);
      }
    }
  };
  // const [showPassword, setShowPassword] = useState(false);
  // const toggleVisibility = () => {
  //   setShowPassword((prev) => !prev);
  // };
  const HandleRegistrationNew = () => {
    return (
      <div className="md:px-10 px-5 pt-10 card text-sm ">
        <OtpVerification
          token={token}
          emailVerified={false}
          setEmailVerified={setEmailVerified}
          phoneVerified={phoneVerified}
          setPhoneVerified={setPhoneVerified}
          storedUser={storedUser}
          setCanShowNumber={setCanShowNumber}
          google={true}
        />
      </div>
    );
  };

  return (
    <div className="pt-10 pb-20">
      <div className="px-8 md:min-h-[60vh] md:flex justify-center  ">
        <img
          src={LoginImage}
          alt="login"
          height={400}
          width={400}
          className="card"
        ></img>

        {canShowNumber ? (
          <HandleRegistrationNew />
        ) : (
          <div className="px-10 py-5 card h-auto">
            <h1 className="mb-4 text-2xl font-semibold">{t("loginTitle")}</h1>
            <button
              onClick={googleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-md bg-gradient-to-r from-[#00ccbb] to-[#0099aa] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ccbb]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
                className="w-5 h-5"
                fill="white"
              >
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>

              {loading1 ? (
                <div className="loaderGoogle w-full" />
              ) : (
                <span className="text-sm">Login / Register with Google</span>
              )}
            </button>
            {/* <form onSubmit={handleSubmit1}> */}
            {/* <button onClick={googleLogin} className=" my-5">
                <div className="flex items-center space-x-2 px-4 py-2 border rounded-md border-gray-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-[250px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                    className="w-5 h-5"
                    fill="#00ccbb"
                  >
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                  </svg>
                  <div className="grid items-center">
                    {loading1 ? (
                      <div className="loaderGoogle ml-5"></div>
                    ) : (
                      "Login/Register with Google"
                    )}
                  </div>
                </div>
              </button> */}

            {/* <h1 className="text-[#00ccbb] pb-2 pt-3 font-semibold text-center">
                Or
              </h1> */}

            {/* <div className="mb-4">
                <label htmlFor="name">{t("phoneTitle")}</label>
                <PhoneInput
                  defaultCountry="IN"
                  id="number"
                  value={number}
                  onChange={setNumber}
                  placeholder="Enter Phone Number"
                />
              </div>

              <div className="mb-4 relative">
                <label htmlFor="password">{t("password")}</label>
                <input
                  className="w-full "
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={toggleVisibility}
                  className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[#00ccbb]"
                />
              </div> */}

            {/* <div className="mb-1">
                <button className="primary-button" disabled={loading}>
                  {t("loginTitle")}
                </button>
              </div> */}
            {/* <p className="text-md underline text-blue-600 mt-3">
                <Link to="/forgot-password">Forgot Password</Link>
                <br></br>
              </p> */}
            {/* <Link to="/register">{t("dontHaveAccountClickHere")}</Link> */}

            {/* {errorContext && (
                <p className="mt-8 rounded py-2 bg-red-500 px-5 text-white">
                  {errorContext.message}
                </p>
              )} */}
            {/* </form> */}
          </div>
        )}
      </div>
    </div>
  );
}
