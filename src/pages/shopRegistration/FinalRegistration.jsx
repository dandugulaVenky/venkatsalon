import { useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useMemo, useState } from "react";
import SIdebar from "../../components/navbar/SIdebar";
import Greeting from "../../components/navbar/Greeting";

import Layout from "../../components/navbar/Layout";

import Footer from "../../components/footer/Footer";
import { SearchContext } from "../../context/SearchContext";
import RegistrationWizard from "./RegistrationWizard";
import Select from "../images/select.png";

const FinalRegistration = () => {
  let w = window.innerWidth;

  const [seats, setSeats] = useState("");
  const { open } = useContext(SearchContext);

  const [storedUser, setStoredUser] = useState();

  const navigate = useNavigate();

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

  const handleRegister = () => {
    const arrayOfObjects = [];
    for (let i = 1; i <= seats; i++) {
      const newObj = {
        number: i * 100,
      };
      arrayOfObjects.push(newObj);
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
      {open && <SIdebar />}
      {w < 768 && <Greeting />}
      {/*<Seo props={siteMetadata} />*/}
      <div className=" px-4">{w >= 768 && <Layout />}</div>
      <div className="md:py-0.5 py-5">
        <RegistrationWizard activeStep={2} />
      </div>
      <div className="flex flex-col justify-center w-full min-h-[70vh] items-center">
        <div>
          <p>
            Shop Name :{" "}
            <span className="ml-2">{storedUser?.hotelInfo?.shopName}</span>
          </p>
          <div className="mb-4">
            <label htmlFor="phone">No.of Seats</label>
            <input
              className="ml-4"
              type="number"
              id="phone"
              min={1}
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />
          </div>
          <div className="mb-4 flex justify-between">
            <button
              disabled={seats === undefined || seats === ""}
              className={`${
                seats === undefined || seats === ""
                  ? "default-button"
                  : "primary-button"
              }`}
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
        <img src={Select} alt="select category" className="h-72" />
      </div>
      <Footer />
    </>
  );
};

export default FinalRegistration;
