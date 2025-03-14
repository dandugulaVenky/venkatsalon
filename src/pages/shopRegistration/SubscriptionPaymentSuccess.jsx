import React, { useEffect } from "react";

import axiosInstance from "../../components/axiosInterceptor";
import baseUrl from "../../utils/client";
import { useNavigate } from "react-router-dom";
import useEffectOnce from "../../utils/UseEffectOnce";

function getCookieObject(name) {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    if (cookie.startsWith(name + "=")) {
      const encodedValue = cookie.substring(name.length + 1);
      return JSON.parse(decodeURIComponent(encodedValue));
    }
  }

  return null; // Cookie not found
}
const SubscriptionPaymentSuccess = () => {
  const navigate = useNavigate();

  function removeCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  useEffectOnce(() => {
    window.scrollTo(0, 0);

    const handleNewHotel = async (hotel) => {
      try {
        const response = await axiosInstance.post(
          `${baseUrl}/api/shop_registration/new_registration`,
          hotel,
          { withCredentials: true }
        );
        if (response.status === 200) {
          alert("willContactYouShortly");
          // Usage example
          removeCookie("new_hotel");
          navigate("/");
        } else {
          alert(
            "Something went wrong, please contact us at services@easytym.com"
          );
        }
      } catch (err) {
        alert(err.response.data.message);

        console.log(err, "err2");
      }
    };

    // Usage example
    const newHotel = getCookieObject("new_hotel");
    if (newHotel) {
      handleNewHotel(newHotel);
    } else {
      alert("Something went wrong, please contact!");
    }
  }, []);

  return <div>SubscriptionPaymentSuccess</div>;
};

export default SubscriptionPaymentSuccess;
