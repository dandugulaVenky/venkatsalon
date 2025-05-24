import React, { useRef, useEffect, useState } from "react";
import baseUrl from "../../utils/client";
import { toast } from "react-toastify";
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

const OtpInput = ({
  length,

  setIsVerifiedEmail,
  emailVerified,
  storedUser,
}) => {
  const inputs = Array.from({ length });
  const inputRefs = useRef([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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
    try {
      await axiosInstance.post(`${baseUrl}/verify-email-verification-otp`, {
        email: storedUser.email,
        otp: Number(otp),
      });
      setIsVerifiedEmail(true);
      storedUser.emailVerified = true;

      setCookieObject("normalUser_info", storedUser, 7);
    } catch (err) {
      console.log(err);
      toast(err.response.data);
      setIsVerifiedEmail(false);
      storedUser.emailVerified = false;
      setCookieObject("normalUser_info", storedUser, 7);
    }
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
        disabled={emailVerified || isButtonDisabled}
      >
        Submit
      </button>
    </div>
  );
};

export default OtpInput;
