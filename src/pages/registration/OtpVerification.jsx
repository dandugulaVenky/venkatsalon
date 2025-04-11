import React, { useState, useContext } from "react";
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
import axiosInstance from "../../components/axiosInterceptor";
import { SearchContext } from "../../context/SearchContext";
import Header from "../../components/header/Header";
import { tr } from "date-fns/locale";

function setCookieObject(name1, value, daysToExpire) {
  const expires = new Date();
  expires.setDate(expires.getDate() + daysToExpire);
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
    setEmailVerified,
    phoneVerified,
    setPhoneVerified,
    storedUser,
    setCanShowNumber,
    google,
  } = props;

  const [flag, setFlag] = useState(false);
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");
  const [disable, setDisable] = useState(false);
  const [number, setNumber] = useState("");
  const [disableNow, setDisableNow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  let { dispatch: dispatch1, type, city } = useContext(SearchContext);

  const [address, setAddress] = useState("");
  const [header, setHeader] = useState(false);

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

  function setUpRecaptcha(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved - allow signInWithPhoneNumber.
        },
        "expired-callback": () => {
          // Response expired. Ask user to re-enter.
        },
      },
      auth
    );
    return recaptchaVerifier.verify().then(() => {
      return signInWithPhoneNumber(auth, number, recaptchaVerifier);
    });
  }

  const getOtp = async (e) => {
    e.preventDefault();
    setDisableNow(true);
    if (!number) return toast("Something is wrong!");

    if (number.toString().length !== 13 || number === undefined) return;
    try {
      setDisable(true);
      const response = await setUpRecaptcha(number);
      setResult(response);
      setFlag(true);
      setDisable(false);
    } catch (err) {
      toast(err.message);
      setFlag(false);
      setDisable(false);
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
      toast.error(`${err.message} please recheck the otp and try again!`);
      setDisable(false);
    }
  };

  const RegisterNow = async () => {
    setLoading(true);
    const { name, city: city1 } = storedUser;

    try {
      const res = await axiosInstance.post(
        `${baseUrl}/api/auth/register`,
        {
          username: name.trim().toLowerCase(),
          password: google ? password.trim() : storedUser.password.trim(),
          city: city.toLowerCase() || city1.toLowerCase(),
          phone: number || storedUser.number,
          email: storedUser.email.trim().toLowerCase() || null,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        dispatch({ type: "LOGIN_START" });
        try {
          const res = await axiosInstance.post(
            `${baseUrl}/api/auth/login`,
            {
              phone: storedUser.number || number,
              type: "normal",
              password,
            },
            { withCredentials: true }
          );
          sessionStorage.setItem("access_token", res.data.token);
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
      console.log(err);
      if (err.response.status === 409) {
        toast.error(
          `${err.response.data.message} please try with another email!`
        );
        setEmailVerified(false);
        storedUser.emailVerified = false;
        setCanShowNumber(false);
        setCookieObject("normalUser_info", storedUser, 7);
      } else if (err.response.status === 400) {
        setPhoneVerified(false);
        storedUser.phoneVerified = false;
        toast.error(
          `${err.response.data.message} please try with another number!`
        );
        setFlag(false);
        setCookieObject("normalUser_info", storedUser, 7);
      } else {
        console.log("Unexpected error:", err);
      }
    }
    setLoading(false);
  };
  const handleLocation = () => {
    setHeader(true);
  };
  return (
    <>
      {header ? (
        <Header
          city={address}
          setHeader={setHeader}
          setAddress={setAddress}
          dispatch={dispatch1}
          type={type}
          register={true}
          header={header}
        />
      ) : (
        ""
      )}
      <div className="w-full transition-all delay-1000 ease-linear py-5">
        <div>
          <p className="bg-green-300 p-2 mt-5 rounded-md">Successful!</p>
        </div>

        {!phoneVerified && (
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
              readOnly={disableNow}
              className="w-full"
            />
            <div id="recaptcha-container"></div>
            <button
              className={` ${
                number?.toString()?.length !== 13 || disable
                  ? "default-button"
                  : "primary-button"
              } `}
              onClick={getOtp}
              disabled={disable || number?.toString()?.length !== 13}
            >
              {disable ? "Sending..." : t("getOtp")}
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
            className={`${disable ? "default-button" : "primary-button"}`}
            onClick={verifyOtp}
            disabled={disable}
          >
            {disable ? "Verifying..." : "Verify"}
          </button>
        </div>

        <div
          style={{
            display: storedUser.phoneVerified ? "block" : "none",
            marginTop: 10,
          }}
        >
          <input
            type="text"
            value={"Verified"}
            placeholder="Verified"
            readOnly
          />
          <FontAwesomeIcon icon={faCheckCircle} size="lg" className="ml-3" />
        </div>
      </div>

      {google && storedUser.phoneVerified ? (
        <div className="mb-4">
          <label htmlFor="password">Set a Password</label>
          <input
            className="w-full"
            type="password"
            id="password"
            value={password || storedUser.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mb-4" onClick={handleLocation}>
            <label htmlFor="city">{t("address")}</label>

            <input
              type="text"
              className="w-full"
              id="city"
              placeholder={"enter city name."}
              readOnly
              value={address || city}
            />
          </div>
        </div>
      ) : (
        ""
      )}

      {password && storedUser.phoneVerified ? (
        <button className="primary-button" onClick={RegisterNow}>
          {loading ? "Loading..." : "Google Proceed"}
        </button>
      ) : storedUser.password && storedUser.phoneVerified ? (
        <button className="primary-button" onClick={RegisterNow}>
          {loading ? "Loading..." : "Proceed"}
        </button>
      ) : (
        ""
      )}
    </>
  );
};

export default OtpVerification;
