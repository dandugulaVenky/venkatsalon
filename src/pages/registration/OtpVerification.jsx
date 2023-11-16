import React, { memo, useContext, useMemo } from "react";
import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";
import PhoneInput from "react-phone-number-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "./otp.css";
import axios from "axios";
import baseUrl from "../../utils/client";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

function removeCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
const OtpVerification = (props) => {
  const {
    token,
    verified,
    setVerified,
    number,
    setNumber,
    storedUser,
    setCanShowNumber,
  } = useMemo(() => props, [props]);

  const [flag, setFlag] = useState(false);
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");
  const [disable, setDisable] = useState(false);

  // const [number, setNumber] = useState();
  let { dispatch } = useContext(AuthContext);

  let [disablenow, setDisableNow] = useState();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const saveToken = async (id, token) => {
    try {
      const response = await axios.post(`${baseUrl}/tokens`, {
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
      setVerified(true);
      storedUser.verified = true;
      storedUser.number = number;
      function setCookieObject(name1, value, daysToExpire) {
        const expires = new Date();
        expires.setDate(expires.getDate() + daysToExpire);

        // Serialize the object to JSON and encode it
        const cookieValue =
          encodeURIComponent(JSON.stringify(value)) +
          (daysToExpire ? `; expires=${expires.toUTCString()}` : "");

        document.cookie = `${name1}=${cookieValue}; path=/`;
      }
      setCookieObject("normalUser_info", storedUser, 7);
      setDisable(false);
    } catch (err) {
      toast(err.message);
      setDisable(false);
    }
  };

  const RegisterNow = async () => {
    const { name, email, password, city } = storedUser;

    try {
      const res = await axios.post(`${baseUrl}/api/auth/register`, {
        username: name.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password: password.trim(),

        city: city.toLowerCase(),
        phone: number,
      });

      if (res.status === 200) {
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

          removeCookie("normalUser_info");
          navigate("/");
        } catch (err) {
          dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
      setCanShowNumber(false);
    }
  };

  return (
    <>
      <div className="mb-4 w-full transition-all delay-1000 ease-linear">
        <label htmlFor="phone">{t('phoneTitle')}</label>

        {!verified && (
          <div
            style={{ display: !flag ? "block" : "none" }}
            className="space-y-2"
          >
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
              {t('getOtp')}
            </button>
          </div>
        )}
        <div
          style={{ display: flag && !verified ? "block" : "none" }}
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
            {t('verifyOtp')}
          </button>
        </div>

        <div style={{ display: verified ? "block" : "none" }}>
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

      {verified ? (
        <button className="primary-button" onClick={RegisterNow}>
          Proceed
        </button>
      ) : (
        ""
      )}
    </>
  );
};

export default memo(OtpVerification);