import React from "react";
import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";
import PhoneInput from "react-phone-number-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "./otp.css";
const OtpVerification = ({
  verified,
  setVerified,
  termsAccepted,
  setTermsAccepted,
  loading,
  number,
  setNumber,
}) => {
  const [flag, setFlag] = useState(false);
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");

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
    if (!number) return toast("Please enter your number");
    try {
      const response = await setUpRecaptha(number);
      setResult(response);
      setFlag(true);
    } catch (err) {
      toast(err.message);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (otp === "" || otp === null) return;
    try {
      await result.confirm(otp);
      setVerified(true);
    } catch (err) {
      toast(err.message);
    }
  };
  return (
    <>
      <div className="mb-4">
        <label htmlFor="phone">Phone</label>

        <div
          style={{ display: !flag ? "block" : "none" }}
          className="space-y-2"
        >
          <PhoneInput
            defaultCountry="IN"
            value={number}
            onChange={setNumber}
            placeholder="Enter Phone Number"
          />
          <div id="recaptcha-container"></div>
          <button className="primary-button " onClick={getOtp}>
            Get Otp
          </button>
        </div>
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
          <button className="primary-button " onClick={verifyOtp}>
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
          Register
        </button>
      </div>
    </>
  );
};

export default OtpVerification;
