import React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../utils/client";
import { toast } from "react-toastify";

function ResetPassword() {
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  axios.defaults.withCredentials = true;
  const location = useLocation();

  const phone = location?.state?.phone;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${baseUrl}/api/auth/reset-password/${phone}`, {
        password,
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          setLoading(false);
          navigate("/login");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message);
        console.log(err);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-slate-100 p-3 rounded min-w-[30vw]">
        <h4 className="pt-2 pb-5 text-2xl font-bold ">Reset Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="email">
              <strong>New Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="primary-button rounded-0">
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
