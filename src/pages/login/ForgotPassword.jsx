import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../utils/client";
import PhoneInput from "react-phone-number-input";
function ForgotPassword() {
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${baseUrl}/api/auth/forgot-password`, { email, phone })
      .then((res) => {
        if (res.data.Status === "Success") {
          setLoading(false);
          alert("Check your email for the link to reset your password!");

          navigate("/login");
        }
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-slate-300 p-3 rounded min-w-[30vw]">
        <h4 className="pt-2 pb-5 text-2xl font-bold ">Forgot Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              //   autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="phone">
              <strong>Phone</strong>
            </label>
            <input
              type="number"
              placeholder="Enter Phone Number"
              autoComplete="off"
              name="phone"
              className="form-control rounded-0"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div> */}

          <div className="mb-4">
            <label htmlFor="phone">Phone</label>
            <PhoneInput
              defaultCountry="IN"
              id="number"
              value={phone}
              onChange={setPhone}
              placeholder="Enter Phone Number"
            />
          </div>
          <button type="submit" className="primary-button">
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
