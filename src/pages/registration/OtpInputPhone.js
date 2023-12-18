import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
function setCookieObject(name1, value, daysToExpire) {
  const expires = new Date();
  expires.setDate(expires.getDate() + daysToExpire);

  // Serialize the object to JSON and encode it
  const cookieValue =
    encodeURIComponent(JSON.stringify(value)) +
    (daysToExpire ? `; expires=${expires.toUTCString()}` : "");

  document.cookie = `${name1}=${cookieValue}; path=/`;
}
const OtpInput = ({
  length,
  setDisableNow,
  setVerified,
  setDisable,
  storedUser,
  result,
  number,
  shopRegistration = false,
  disable,
  setPhoneVerified,
}) => {
  const inputs = Array.from({ length });
  const inputRefs = useRef([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const focusInput = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

  const handleInputChange = (e, index) => {
    const values = inputRefs.current.map((ref) => ref.value);

    const allValuesEntered = values.every((value) => value.length === 1);
    setIsButtonDisabled(!allValuesEntered);

    if (e.target.value.length === 1 && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && e.target.value === "") {
      focusInput(index - 1);
    }
  };

  const handleSubmit = async () => {
    const values = inputRefs.current.map((ref) => ref.value);

    const otp = values.reduce((acc, i) => acc + i, "");
    console.log(typeof Number(otp));
    const verifyOtp = async (e) => {
      setDisableNow(false);

      if (otp === "" || otp === null) return;
      setDisable(true);

      try {
        await result.confirm(otp);
        setVerified(true);
        storedUser.phoneVerified = true;
        storedUser.number = number;
        setPhoneVerified(true);
        setCookieObject("normalUser_info", storedUser, 7);
        setDisable(false);
      } catch (err) {
        toast(err.message);
        setVerified(false);
        setPhoneVerified(false);
        setDisable(false);
      }
    };

    const shopVerifyOtp = async () => {
      setDisableNow(false);

      if (otp === "" || otp === null) return;
      setDisable(true);

      try {
        await result.confirm(otp);

        if (state?.phoneNumber) {
          storedUser.verified = true;
          storedUser.number = number;
          setCookieObject("user_info", storedUser, 7);
          return navigate("/shop-final-registration");
        }
        setPhoneVerified(true);
        setVerified(true);
        storedUser.verified = true;
        storedUser.number = number;
        storedUser.step = 1;

        setCookieObject("user_info", storedUser, 7);
        setDisable(false);

        navigate("/shop-details");
      } catch (err) {
        toast(err.message);
        setPhoneVerified(false);
        setDisable(false);
      }
    };

    shopRegistration ? shopVerifyOtp() : verifyOtp();
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      {inputs.map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength="1"
          className="w-10 h-10 text-center border rounded focus:outline-none focus:border-[#00ccbb]"
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}

      <button
        className={`${
          isButtonDisabled ? "default-button " : "primary-button "
        }`}
        onClick={handleSubmit}
        disabled={isButtonDisabled || disable}
      >
        {disable ? "loading" : "Submit"}
      </button>
    </div>
  );
};

export default OtpInput;
