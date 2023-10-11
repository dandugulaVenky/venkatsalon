import {
  faCartShopping,
  faChevronCircleDown,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";
import Header from "../header/Header";
import { Store } from "../../pages/ironing/ironing-utils/Store";
import { ToastContainer } from "react-toastify";
import "./greeting.scss";
import "./navbar.scss";

const shortenString = (inputString) => {
  if (inputString.length > 20) {
    return inputString.substr(0, 20) + "..";
  } else {
    return inputString;
  }
};

const scrollNow = () => {
  return window.scrollTo(0, 0);
};
const Greeting = ({ bestRef }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const scrollTimeoutIdRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY >= 1) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    scrollTimeoutIdRef.current = setTimeout(() => {
      window.addEventListener("scroll", handleScroll);
    }, 800);

    // Clean up the event listener and clear the timeout on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeoutIdRef.current);
    };
  }, []);

  const [greet, setGreet] = useState("");
  const { user } = useContext(AuthContext);

  const [cartItemsCount, setCartItemsCount] = useState(0);

  const { state } = useContext(Store);
  const { cart } = state;
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

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  return (
    <>
      <ToastContainer position="bottom-center" />
      {header ? (
        <Header
          setHeader={setHeader}
          setAddress={setAddress}
          dispatch={dispatch1}
          type={type}
          city={city}
          header={header}
          bestRef={bestRef}
        />
      ) : address.length > 0 ? (
        <Header header={header} />
      ) : (
        <Header header={null} />
      )}

      <div className="h-20">
        <div className="mainHead">
          <div
            className={`flex items-center justify-between px-4 p-2 ${
              isScrolled ? "head1" : "head2"
            }`}
          >
            <div className="flex items-center justify-center">
              <Link to="/">
                <img
                  src="https://res.cloudinary.com/dqupmzcrb/image/upload/e_auto_contrast,q_100/v1685348916/EASY_TYM-removebg-preview_sab2ie.png"
                  alt="logo"
                  className={`${
                    isScrolled ? "greetingimgs1" : "greetingimgs2"
                  }`}
                  onClick={scrollNow}
                />
              </Link>
            </div>
            <div className="pl-5 text-xl mt-1 font-semibold flex items-center justify-center space-x-4">
              <FontAwesomeIcon icon={faLocation} size="lg" color="#00ccbb" />
              <p className="text-xs">
                {city ? shortenString(city).toUpperCase() : "loading"}
              </p>
              {pathname === "/" && (
                <FontAwesomeIcon
                  icon={faChevronCircleDown}
                  size="sm"
                  color="#00ccbb"
                  onClick={handleLocation}
                />
              )}
            </div>
            {pathname.includes("iron") && (
              <Link to="/iron/cart">
                <a className=" font-semibold md:text-lg text-xs " href="###">
                  <FontAwesomeIcon icon={faCartShopping} color="black" />
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-[#00ccbb] px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
            )}
            {user ? (
              ""
            ) : (
              <Link to="/login" className="ml-5 text-sm font-bold">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Greeting;
