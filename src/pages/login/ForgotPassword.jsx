import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
import { auth } from "../../firebase";
import baseUrl from "../../utils/client";
import PhoneInput from "react-phone-number-input";
import { toast } from "react-toastify";
import { t } from "i18next";
function ForgotPassword() {
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [flag, setFlag] = useState(false);
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");
  const [disable, setDisable] = useState(false);
  const [number, setNumber] = useState("");
  const [disableNow, setDisableNow] = useState(false);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // axios.defaults.withCredentials = true;
  // const handleSubmit = () => {

  //   setLoading(true);
  //   axios
  //     .post(`${baseUrl}/api/auth/forgot-password`, { email, phone })
  //     .then((res) => {
  //       if (res.data.Status === "Success") {
  //         setLoading(false);
  //         alert("Check your email for the link to reset your password!");

  //         navigate("/login");
  //       }
  //     })
  //     .catch((err) => {
  //       setLoading(false);

  //       console.log(err);
  //     });
  // };

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

      setDisable(false);
      alert("Phone Verified");
      navigate("/reset-password", {
        state: {
          phone: number,
        },
      });
    } catch (err) {
      toast.error(`${err.message} please recheck the otp and try again!`);
      setDisable(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-slate-300 p-3 rounded min-w-[30vw]">
        <h4 className="pt-2 pb-5 text-2xl font-bold ">Forgot Password</h4>
        <div>
          <div
            className="mb-4"
            style={{
              display: !flag ? "block" : "none",
            }}
          >
            <label htmlFor="phone">Phone</label>
            <PhoneInput
              defaultCountry="IN"
              id="number"
              value={number}
              onChange={setNumber}
              disabled={disableNow}
              placeholder="Enter Phone Number"
            />
          </div>
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

        <div
          style={{
            display: flag ? "block" : "none",
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
      </div>
    </div>
  );
}

export default ForgotPassword;
