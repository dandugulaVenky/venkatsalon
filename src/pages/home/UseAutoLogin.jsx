import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import baseUrl from "../../utils/client";

import axios from "axios";

const UseAutoLogin = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const tryAutoLogin = async () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      // console.log(location.pathname, "location.pathname");
      if (!accessToken || !refreshToken) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login", {
          state: {
            destination: location.pathname.includes("/salon-reserve")
              ? location.pathname.replace("salon-reserve", "")
              : location.pathname,
          },
        });
        return;
      }

      try {
        // Use plain axios to manually send refresh_token
        const res = await axios.get(`${baseUrl}/api/auth/refresh`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
          withCredentials: true,
        });

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: res.data.details,
            token: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          },
        });
      } catch (error) {
        alert(
          error?.response?.data?.message ||
            "Session expired. Please login again."
        );
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      }
    };

    if (
      location.pathname.includes("/admin") ||
      location.pathname.includes("/salon-reserve") ||
      location.pathname.includes("/history")
    ) {
      tryAutoLogin();
    }
  }, [dispatch, location, navigate]);
};

export default UseAutoLogin;
