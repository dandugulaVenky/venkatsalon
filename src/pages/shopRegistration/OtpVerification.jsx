import React, { useMemo } from "react";
import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";
import PhoneInput from "react-phone-number-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "../registration/otp.css";
import axios from "axios";
import baseUrl from "../../utils/client";

import { useLocation, useNavigate } from "react-router-dom";
function setCookieObject(name1, value, daysToExpire) {
  const expires = new Date();
  expires.setDate(expires.getDate() + daysToExpire);

  // Serialize the object to JSON and encode it
  const cookieValue =
    encodeURIComponent(JSON.stringify(value)) +
    (daysToExpire ? `; expires=${expires.toUTCString()}` : "");

  document.cookie = `${name1}=${cookieValue}; path=/`;
}
const OtpVerification = (props) => {
  const { token, verified, setVerified, number, setNumber, storedUser } =
    useMemo(() => props, [props]);

  const [flag, setFlag] = useState(false);
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");
  const [disable, setDisable] = useState(false);
  const location = useLocation();

  const { state } = location;

  let [disablenow, setDisableNow] = useState();
  const navigate = useNavigate();

  //this should be used in finalRegustration Page
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
      // const response = await setUpRecaptha(number);
      // setResult(response);
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
      // await result.confirm(otp);

      if (state?.phoneNumber) {
        storedUser.verified = true;
        storedUser.number = number;
        setCookieObject("user_info", storedUser, 7);
        return navigate("/shop-final-registration");
      }

      setVerified(true);
      storedUser.verified = true;
      storedUser.number = number;
      storedUser.step = 1;

      setCookieObject("user_info", storedUser, 7);
      setDisable(false);
      navigate("/shop-details");
    } catch (err) {
      toast(err.message);
      setDisable(false);
    }
  };

  return (
    <>
      <div className="mb-4 w-full transition-all delay-1000 ease-linear">
        <label htmlFor="phone">Phone</label>

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
              Get Otp
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
            Verify Otp
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
    </>
  );
};

export default OtpVerification;
