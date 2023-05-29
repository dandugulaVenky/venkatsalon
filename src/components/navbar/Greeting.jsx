import {
  faChevronCircleDown,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";
import Header from "../header/Header";
const shortenString = (inputString) => {
  if (inputString.length > 20) {
    return inputString.substr(0, 20) + "..";
  } else {
    return inputString;
  }
};
const Greeting = () => {
  const [greet, setGreet] = useState("");
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();

  let { dispatch: dispatch1, city, type } = useContext(SearchContext);
  const [address, setAddress] = useState("");
  const [header, setHeader] = useState(false);

  useEffect(() => {
    const myDate = new Date();
    const hrs = myDate.getHours();
    if (hrs < 12) setGreet("Good morning");
    else if (hrs >= 12 && hrs <= 17) setGreet("Good afternoon");
    else if (hrs >= 17 && hrs <= 24) setGreet("Good evening");
  }, []);

  const handleLocation = () => {
    setHeader(!header);
  };

  return (
    <div>
      {header ? (
        <Header
          setHeader={setHeader}
          setAddress={setAddress}
          dispatch={dispatch1}
          type={type}
          city={city}
        />
      ) : null}
      <div className="h-10 pt-8 pb-8 px-4 flex items-center justify-between w-full font-bold text-lg">
        <p className="w-32 text-sm"> {greet}</p>
        <div className="pl-2 text-xs mt-1 font-semibold flex items-center justify-center space-x-3">
          <FontAwesomeIcon icon={faLocation} size="lg" color="#00ccbb" />
          <p className="text-xs w-full flex items-center justify-center space-x-2.5 ">
            <span> {city ? shortenString(city).toUpperCase() : "Loading"}</span>
            {pathname === "/" && (
              <FontAwesomeIcon
                icon={faChevronCircleDown}
                size="lg"
                color="#00ccbb"
                onClick={handleLocation}
              />
            )}
          </p>
        </div>

        {user ? (
          ""
        ) : (
          <Link to="/login" className="ml-5">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Greeting;
