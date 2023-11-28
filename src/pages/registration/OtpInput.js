import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import baseUrl from "../../utils/client";

const OtpInput = ({ length, email, setIsVerifiedEmail }) => {
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
    console.log(email);
    const otp = values.reduce((acc, i) => acc + i, "");
    console.log(typeof Number(otp));
    try {
      const { data } = await axios.post(
        `${baseUrl}/verify-email-verification-otp`,
        {
          email,
          otp: Number(otp),
        }
      );
      setIsVerifiedEmail("True");
    } catch (err) {
      if (err.response.data.status === 401) {
        setIsVerifiedEmail("Expired");
      } else {
        setIsVerifiedEmail("Invalid");
      }
    }
    // if (res.data.status === 200) {
    //   console.log("True");
    //   setIsVerifiedEmail("True");
    // } else if (res.data.status === 401) {
    //   console.log("Expired");

    //   setIsVerifiedEmail("Expired");
    // } else {
    //   console.log("Invalid");

    //   setIsVerifiedEmail("Invalid");
    // }
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
        disabled={isButtonDisabled}
      >
        Submit
      </button>
    </div>
  );
};

export default OtpInput;
