import React, { useContext } from "react";
import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";
import PhoneInput from "react-phone-number-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "./otp.css";

import baseUrl from "../../utils/client";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import OtpInput from "./OtpInput";
import axiosInstance from "../../components/axiosInterceptor";

function setCookieObject(name1, value, daysToExpire) {
  const expires = new Date();
  expires.setDate(expires.getDate() + daysToExpire);

  // Serialize the object to JSON and encode it
  const cookieValue =
    encodeURIComponent(JSON.stringify(value)) +
    (daysToExpire ? `; expires=${expires.toUTCString()}` : "");

  document.cookie = `${name1}=${cookieValue}; path=/`;
}

function removeCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
const OtpVerification = (props) => {
  const {
    token,
    emailVerified,
    setEmailVerified,
    phoneVerified,
    setPhoneVerified,

    storedUser,
    setCanShowNumber,
  } = props;

  const [flag, setFlag] = useState(false);
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");
  const [disable, setDisable] = useState(false);
  let { dispatch } = useContext(AuthContext);
  const [number, setNumber] = useState("");
  let [disablenow, setDisableNow] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const saveToken = async (id, token) => {
    try {
      await axiosInstance.post(`${baseUrl}/tokens`, {
        userId: id,
        token,
      });
    } catch (error) {
      console.error(error);
    }
  };
  function setUpRecaptha(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }

  const getOtp = async (e) => {
    e.preventDefault();
    setDisableNow(true);
    if (!number) return toast("Something is wrong!");

    if (number.toString().length !== 13 || number === undefined) return;
    try {
      setDisable(true);
      const response = await setUpRecaptha(number);
      setResult(response);
      setFlag(true);
      setDisable(false);
    } catch (err) {
      toast(err.message);
      setFlag(false);

      setDisable(false);
      setTimeout(() => {
        window.location.replace("/register");
      }, 3000);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    setDisableNow(false);
    if (otp === "" || otp === null) return;
    setDisable(true);

    try {
      await result.confirm(otp);
      setPhoneVerified(true);

      storedUser.phoneVerified = true;

      storedUser.number = number;

      setCookieObject("normalUser_info", storedUser, 7);
      setDisable(false);
    } catch (err) {
      alert(`${err.message} please recheck the otp and try again!`);
      setDisable(false);
    }
  };

  const RegisterNow = async () => {
    setLoading(true);
    const { name, email, password, city } = storedUser;

    try {
      const res = await axiosInstance.post(`${baseUrl}/api/auth/register`, {
        username: name.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password: password.trim(),

        city: city.toLowerCase(),
        phone: number || storedUser.number,
      });

      if (res.status === 200) {
        dispatch({ type: "LOGIN_START" });
        try {
          const res = await axiosInstance.post(
            `${baseUrl}/api/auth/login`,
            {
              phone: number,
              password,
            },
            { withCredentials: true }
          );
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
          token !== "" && saveToken(res.data.details._id, token);
          setLoading(false);

          removeCookie("normalUser_info");
          navigate("/");
        } catch (err) {
          dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
          setLoading(false);
        }
      }
    } catch (err) {
      if (err.response.status === 409) {
        alert(`${err.response.data.message} please try with another email!`);

        setEmailVerified(false);
        storedUser.emailVerified = false;
        setCanShowNumber(false);
        setCookieObject("normalUser_info", storedUser, 7);
      } else if (err.response.status === 400) {
        setPhoneVerified(false);
        storedUser.phoneVerified = false;

        alert(`${err.response.data.message} please try with another number!`);
        setFlag(false);
        setCookieObject("normalUser_info", storedUser, 7);
      } else {
        console.log("Everything is fine!");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div className="w-full transition-all delay-1000 ease-linear py-5">
        {!storedUser.emailVerified && !emailVerified && (
          <>
            <p className="bg-green-300 p-2 my-5 rounded-md">
              Check your email for otp!
            </p>
            <OtpInput
              length={4}
              email={storedUser?.email}
              setIsVerifiedEmail={setEmailVerified}
              emailVerified={emailVerified}
              storedUser={storedUser}
            />
          </>
        )}

        {storedUser.emailVerified && emailVerified && (
          <div>
            <p className="bg-green-300 p-2 mt-5 rounded-md">Successfull!</p>
          </div>
        )}

        {!phoneVerified && emailVerified && (
          <div
            style={{ display: !flag ? "block" : "none" }}
            className="space-y-2 mt-7"
          >
            <label htmlFor="phone">{t("phoneTitle")}</label>
            <PhoneInput
              defaultCountry="IN"
              value={number}
              onChange={setNumber}
              placeholder="Enter Phone Number"
              readOnly={disablenow}
              className="w-full"
            />
            <div id="recaptcha-container"></div>
            <button
              className={` ${
                number?.toString()?.length !== 13
                  ? "default-button"
                  : "primary-button"
              } `}
              onClick={getOtp}
              disabled={disable || number?.toString()?.length !== 13}
            >
              {t("getOtp")}
            </button>
          </div>
        )}

        <div
          style={{
            display: flag && !storedUser.phoneVerified ? "block" : "none",
          }}
          className="space-y-2"
        >
          <input
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter otp"
            className="w-full"
          />

          <div id="recaptcha-container"></div>
          <button
            className="primary-button "
            onClick={verifyOtp}
            disabled={disable}
          >
            {t("verifyOtp")}
          </button>
        </div>

        <div style={{ display: storedUser.phoneVerified ? "block" : "none" }}>
          <input
            type="text"
            value={"Verified"}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Verified"
            readOnly
          />

          <FontAwesomeIcon icon={faCheckCircle} size="lg" className="ml-3" />
        </div>
      </div>

      {storedUser.phoneVerified && storedUser.emailVerified ? (
        <button className="primary-button" onClick={RegisterNow}>
          {loading ? "loading" : "Proceed"}
        </button>
      ) : (
        ""
      )}
    </>
  );
};

export default OtpVerification;
