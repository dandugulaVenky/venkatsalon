import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../components/axiosInterceptor";
import baseUrl from "../../utils/client";
import useEffectOnce from "../../utils/UseEffectOnce";

const useAutoLogin = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const isTokenExpired = (token) => {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= exp * 1000;
  };

  useEffectOnce(() => {
    const tryAutoLogin = async () => {
      const token = localStorage.getItem("access_token");
      console.log(isTokenExpired(token), "isTokenExpired");
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      try {
        const res = await axiosInstance.get(`${baseUrl}/api/auth/refresh`, {
          withCredentials: true,
        });
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: res.data.details, token: res.data.accessToken },
        });
      } catch (error) {
        alert(JSON.stringify(error.response.data));
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    };

    tryAutoLogin();
  }, [navigate]);
};

export default useAutoLogin;
