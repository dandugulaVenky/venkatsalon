import { useLocation } from "react-router-dom";
import React, { useContext, useEffect, useMemo, useState } from "react";
import SIdebar from "../../components/navbar/SIdebar";
import Greeting from "../../components/navbar/Greeting";

import Layout from "../../components/navbar/Layout";

import Footer from "../../components/footer/Footer";
import { SearchContext } from "../../context/SearchContext";
import RegistrationWizard from "./RegistrationWizard";

const FinalRegistration = () => {
  let w = window.innerWidth;
  const location = useLocation();
  const { userIdValue, shopID, shopName, latLong } = useMemo(
    () => location.state,
    [location.state]
  );
  const [seats, setSeats] = useState();
  const { open } = useContext(SearchContext);
  const [seatsArray, setSeatsArray] = useState([]);
  console.log(latLong, "from final");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleRegister = () => {
    const arrayOfObjects = [];
    for (let i = 1; i <= seats; i++) {
      const newObj = {
        number: i * 100,
      };
      arrayOfObjects.push(newObj);
    }
    console.log(arrayOfObjects, "arr");
    setSeatsArray(arrayOfObjects);
  };

  return (
    <>
      {open && <SIdebar />}
      {w < 768 && <Greeting />}
      {/*<Seo props={siteMetadata} />*/}
      <div className=" px-4">{w >= 768 && <Layout />}</div>
      <div className="md:py-0.5 py-5">
        <RegistrationWizard activeStep={2} />
      </div>
      <div className="flex justify-center w-full min-h-[85vh] items-center">
        <div>
          <p>
            Shop Name : <span className="ml-2">{shopName}</span>
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
      </div>
      <Footer />
    </>
  );
};

export default FinalRegistration;
