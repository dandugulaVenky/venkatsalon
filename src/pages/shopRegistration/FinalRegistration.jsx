import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import RegistrationWizard from "./RegistrationWizard";
import Select from "../images/select.png";

import { AuthContext } from "../../context/AuthContext";
import baseUrl from "../../utils/client";
import axios from "axios";

const FinalRegistration = () => {
  const [seats, setSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [shopDetails, setShopDetails] = useState();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const handleRegister = async () => {
    if (seats > 10) {
      return alert(t("max10SeatsAllowed"));
    }
    if (!shopDetails) {
      return alert(t("detailsAreNotUpToTheMark"));
    }
    setLoading(true);
    const arrayOfObjects = [];
    for (let i = 1; i <= seats; i++) {
      const newObj = {
        number: i,
      };

      arrayOfObjects.push(newObj);
    }

    function removeCookie(name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    console.log(user);
    try {
      const res = await axios.get(
        `${baseUrl}/api/users/checkAlreadyShopPresent/${user?._id}`,
        { withCredentials: true }
      );
      if (res.data.status === 409) {
        alert(res.data.message);
        setLoading(false);

        return;
      }

      const res1 = await axios.post(
        `${baseUrl}/api/shop_registration/checkIfRegistrationExists`,

        {
          email: user?.email,
          phone: user?.phone,
        },
        { withCredentials: true }
      );

      if (res1.data.status === 409) {
        alert(res.data.message);
        setLoading(false);

        return;
      }
    } catch (err) {
      console.log(err);
      setLoading(false);

      alert(err.response.data.message);

      return;
    }

    const ownerDetails = {
      username: user?.username.trim().toLowerCase(),
      userId: user?._id,
      city: user?.city,
      phone: user?.phone,
      email: user?.city,
      isAdmin: true,
    };

    try {
      const newhotel = {
        ...shopDetails,
        city: shopDetails.city.toLowerCase(),
        roomNumbers: arrayOfObjects.length,
        ownerDetails,
      };

      const response = await axios.post(
        `${baseUrl}/api/shop_registration/new_registration`,
        newhotel,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setLoading(false);
        alert(t("willContactYouShortly"));
        // Usage example
        removeCookie("user_info");
        navigate("/");
      } else {
        alert(
          "Something went wrong, please contact us at services@easytym.com"
        );
        setLoading(false);
      }
    } catch (err) {
      alert(err.response.data.message);
      setLoading(false);

      console.log(err);
    }

    console.log(user);
  };

  useEffect(() => {
    if (!user || user === "undefined") {
      navigate("/login");
    }
    window.scrollTo(0, 0);

    // Usage example
    const shopDetails = getCookieObject("shop_info");
    setShopDetails(shopDetails);
    console.log(typeof user, "shopDetails");
  }, [navigate, user]);

  return (
    <div className="pt-10 pb-20">
      {/*<Seo props={siteMetadata} />*/}

      <div className="min-h-[85.5vh]">
        <div className="md:py-0.5 py-5">
          <RegistrationWizard activeStep={2} />
        </div>
        <div className="flex flex-col justify-center w-full min-h-[70vh] items-center">
          <div className="space-y-2">
            <p>
              {t("shopName")} :{" "}
              <span className="ml-4 w-52">{shopDetails?.name}</span>
            </p>
            <div className="mb-4">
              <label htmlFor="phone">{t("noOfSeats")}: </label>
              <input
                className="ml-4 w-44"
                type="number"
                id="phone"
                min={1}
                max={15}
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
              />
            </div>
            <div className="mb-4 flex justify-between m">
              <button
                disabled={seats === undefined || seats === ""}
                className={`${
                  seats === undefined || seats === ""
                    ? "default-button mt-4"
                    : "primary-button mt-4"
                }`}
                onClick={handleRegister}
              >
                {loading ? (
                  <span className="buttonloader ml-2"></span>
                ) : (
                  t("register")
                )}
              </button>
            </div>
          </div>
          <img src={Select} alt="select category" className="h-72" />
        </div>
      </div>
    </div>
  );
};

export default FinalRegistration;
