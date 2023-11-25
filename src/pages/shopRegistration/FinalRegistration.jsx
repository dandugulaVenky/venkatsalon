import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import RegistrationWizard from "./RegistrationWizard";
import Select from "../images/select.png";
import baseUrl from "../../utils/client";
import axios from "axios";

const FinalRegistration = () => {
  let w = window.innerWidth;

  const [seats, setSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [storedUser, setStoredUser] = useState();

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
    if (!storedUser) {
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

    const ownerDetails = {
      username: storedUser?.name.trim().toLowerCase(),
      email: storedUser?.email.trim().toLowerCase(),
      password: storedUser?.password.trim(),

      city: storedUser?.city.toLowerCase(),
      phone: storedUser?.number,
      isAdmin: true,
    };

    try {
      const newhotel = {
        ...storedUser.hotelInfo,
        city: storedUser.hotelInfo.city.toLowerCase(),
        roomNumbers: arrayOfObjects.length,
        ownerDetails,
      };
      console.log(newhotel);

      // await axios.post(`${baseUrl}/api/rooms/${hotelId}`, {
      //   roomNumbers: arrayOfObjects,
      //   name: storedUser?.hotelInfo?.name,
      //   shopId: hotelId,
      // });

      // let res = await axios.post(`${baseUrl}/api/auth/register`, {
      //   username: storedUser?.name.trim().toLowerCase(),
      //   email: storedUser?.email.trim().toLowerCase(),
      //   password: storedUser?.password.trim(),
      //   shopId: hotelId,
      //   city: storedUser?.city.toLowerCase(),
      //   phone: storedUser?.number,
      //   isAdmin: true,
      // });

      let res = await axios.post(`${baseUrl}/api/auth/check_existing`, {
        username: storedUser?.name.trim().toLowerCase(),
        email: storedUser?.email.trim().toLowerCase(),

        phone: storedUser?.number,
      });

      console.log(res);

      if (res.status === 200) {
        const response = await axios.post(
          `${baseUrl}/api/shop_registration/new_registration`,
          newhotel
        );
        if (response.status === 200) {
          setLoading(false);
          alert(t("willContactYouShortly"));
          // Usage example
          removeCookie("user_info");
          navigate("/login");
        } else {
          alert(
            "Something went wrong, please contact us at services@easytym.com"
          );
        }

        // const hotelId = response.data._id;
      } else {
        alert(
          "Something went wrong, please contact us at services@easytym.com"
        );
        // await axios.put(
        //   `${baseUrl}/api/hotels/${hotelId}`,
        //   {
        //     shopOwnerId: res.data,
        //   },
        //   {
        //     withCredentials: true,
        //   }
        // );
      }
    } catch (err) {
      alert(err.response.data.message);
      setLoading(false);
      if (err.response.status === 409) {
        navigate("/shop-registration", { state: { goToStep: true } });
      } else if (err.response.status === 400) {
        navigate("/shop-registration", {
          state: { goToStep: true, phoneNumber: true },
        });
      }
      console.log(err);
    }

    console.log(storedUser);
    console.log(arrayOfObjects);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Usage example
    const storedUser = getCookieObject("user_info");

    if (storedUser) {
      setStoredUser(storedUser);
      if (storedUser.step === 3) {
        return;
      } else if (storedUser.step === 2) {
        return;
      }
    } else {
      console.log("User info not found in the cookie.");
      navigate("/shop-registration");
    }
  }, [navigate]);

  return (
    <>
      {""}

      {/*<Seo props={siteMetadata} />*/}

      <div className="min-h-[85.5vh]">
        <div className="md:py-0.5 py-5">
          <RegistrationWizard activeStep={2} />
        </div>
        <div className="flex flex-col justify-center w-full min-h-[70vh] items-center">
          <div className="space-y-2">
            <p>
              {t('shopName')} :{" "}
              <span className="ml-4 w-52">{storedUser?.hotelInfo?.name}</span>
            </p>
            <div className="mb-4">
              <label htmlFor="phone">{t('noOfSeats')}: </label>
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
                  t('register')
                )}
              </button>
            </div>
          </div>
          <img src={Select} alt="select category" className="h-72" />
        </div>
      </div>
    </>
  );
};

export default FinalRegistration;