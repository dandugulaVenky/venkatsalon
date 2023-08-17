import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import LoginImage from "../pages/images/login.jpeg";
// import { messaging } from "../../firebase";
// import { getToken } from "firebase/messaging";
import axios from "axios";
import "../pages/login/login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useState } from "react";

import { SearchContext } from "../context/SearchContext";

import secureLocalStorage from "react-secure-storage";
import baseUrl from "../utils/client";
import { AuthContext } from "../context/AuthContext";

import PhoneInput from "react-phone-number-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export default function Login1({ setLoginUser, shopId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState();
  console.log(shopId);
  //   const [token, setToken] = useState("");

  //   async function requestPermission() {
  //     const permission = await Notification.requestPermission();
  //     if (permission === "granted") {
  //       // Generate Token
  //       const token = await getToken(messaging, {
  //         vapidKey:
  //           "BBxeTBZDBt6mAaEKjhzYA6GC1vJ7nuGhXfb5eqpArsgnfP4iWlgIAZmoHP6jJn9_HDODQKSPiLrGzQd6rKNhuCo",
  //       });
  //       // console.log("Token Gen", token);
  //       setToken(token);
  //       // Send this token  to server ( db)
  //     } else if (permission === "denied") {
  //       alert("You denied for the notification");
  //     }
  //   }
  let w = window.innerWidth;
  useEffect(() => {
    // Req user for notification permission
    secureLocalStorage.clear();
    w <= 768
      ? window.scrollTo(0, document.body.scrollHeight)
      : window.scrollTo(0, 0);
    // requestPermission();
  }, [w]);

  //   const saveToken = async (id, token) => {
  //     try {
  //       const response = await axios.post(`${baseUrl}/api/firebase/tokens`, {
  //         userId: id,
  //         token,
  //       });
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

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

        // token !== "" && saveToken(res.data.details._id, token);
        setLoginUser(true);
      } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
      }
    } catch (err) {
      toast.error(err);
    }
  };
  return (
    <div className="reserve ">
      <div className=" flex ">
        <img
          src={LoginImage}
          alt="login"
          height={400}
          width={400}
          className="md:block  hidden rounded-lg mb-5 bg-slate-100 shadow-md border-2 border-gray-100"
          // style={{ visibility: "hidden" }}
        ></img>
        <form
          className="relative px-10 py-5 card h-auto"
          onSubmit={handleSubmit1}
        >
          <h1 className="mb-4 text-2xl font-semibold">Login</h1>

          <div className="absolute top-2 right-5">
            <FontAwesomeIcon icon={faClose} size="lg" />
          </div>
          <div className="mb-4">
            <label htmlFor="name">Phone</label>
            <PhoneInput
              defaultCountry="IN"
              id="number"
              value={number}
              onChange={setNumber}
              placeholder="Enter Phone Number"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password">Password</label>
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
              Login
            </button>
          </div>
          <p className="text-md underline text-blue-600 mt-3">
            <span
              onClick={() => {
                navigate("/register", {
                  state: { destination: `/shops/${shopId}, `, shopId },
                });
              }}
            >
              {" "}
              Don't have an account? Click Here
            </span>
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
