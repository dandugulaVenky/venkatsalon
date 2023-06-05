import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu } from "@headlessui/react";
import DropdownLink from "../DropdownLink";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleDown,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../header/Header";
import { SearchContext } from "../../context/SearchContext";
import baseUrl from "../../utils/client";
import { Store } from "../../pages/ironing/ironing-utils/Store";
const shortenString = (inputString) => {
  if (inputString.length > 30) {
    return inputString.substr(0, 30) + "...";
  } else {
    return inputString;
  }
};
const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 400) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const { user, dispatch } = useContext(AuthContext);

  const { state, dispatch: dispatch2 } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { pathname } = useLocation();

  let { dispatch: dispatch1, city, type } = useContext(SearchContext);
  const [address, setAddress] = useState("");
  const [header, setHeader] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getAdmin = async () => {
      let isAdmin = await axios.get(`${baseUrl}/api/users/${user?._id}`, {
        withCredentials: true,
      });

      setIsAdmin(isAdmin.data);
    };

    user?._id && getAdmin(user?._id);
  }, [user?._id]);

  const navigate = useNavigate();

  const handleLocation = () => {
    setHeader(!header);
  };

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  return (
    <>
      <ToastContainer position="top-left" />
      {header ? (
        <Header
          setHeader={setHeader}
          setAddress={setAddress}
          dispatch={dispatch1}
          type={type}
          city={city}
        />
      ) : null}

      <header className="py-2">
        <nav
          className={`flex items-center px-4 justify-between bg-transparent transition-all  ease-out ${
            isScrolled &&
            "fixed top-0 left-0 right-0 z-50 bg-white transition-all delay-300 ease-out"
          }`}
        >
          <Link to="/">
            <div className="flex items-center justify-center ">
              <img
                src="https://res.cloudinary.com/dqupmzcrb/image/upload/e_auto_contrast,q_100/v1685348916/EASY_TYM-removebg-preview_sab2ie.png"
                alt="logo"
                height={100}
                width={100}
                className="rounded-lg"
              ></img>

              <div className="pl-5 text-xl mt-1 font-semibold flex items-center justify-center space-x-4">
                <FontAwesomeIcon icon={faLocation} size="lg" color="#00ccbb" />
                <p className="text-sm">
                  {city ? shortenString(city).toUpperCase() : "loading"}
                </p>
                {pathname === "/" && (
                  <FontAwesomeIcon
                    icon={faChevronCircleDown}
                    size="lg"
                    color="#00ccbb"
                    onClick={handleLocation}
                  />
                )}
              </div>
            </div>
          </Link>

          <div className="flex items-center justify-between ">
            {user ? (
              <div className="flex items-center justify-center md:space-x-8 space-x-3">
                <Link to="/about-us">
                  <h1 className=" font-semibold md:text-lg text-xs">About</h1>
                </Link>
                <Link to="/contact-us">
                  <h1 className=" font-semibold md:text-lg text-xs">Contact</h1>
                </Link>
                {pathname.includes("iron") && (
                  <Link to="/iron/cart">
                    <a className=" font-semibold md:text-lg text-xs">
                      Cart
                      {cartItemsCount > 0 && (
                        <span className="ml-1 rounded-full bg-[#00ccbb] px-2 py-1 text-xs font-bold text-white">
                          {cartItemsCount}
                        </span>
                      )}
                    </a>
                  </Link>
                )}
                <Menu as="div" className="relative inline-block  z-10 -mt-0.5">
                  <Menu.Button className=" font-semibold capitalize mr-1">
                    <h1 className="md:text-lg text-xs "> {user.username}</h1>
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-gray-100  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link p-1 mt-2">
                        <Link to="/profile">Profile</Link>
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink className="dropdown-link p-1">
                        <Link to="/history">Booking History</Link>
                      </DropdownLink>
                    </Menu.Item>
                    {isAdmin && (
                      <Menu.Item>
                        <DropdownLink className="dropdown-link p-1">
                          <Link to="/admin"> Admin Dashboard</Link>
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link p-1 mb-2"
                        href="#"
                        onClick={() => {
                          dispatch({ type: "LOGOUT" });
                          navigate("/login");
                        }}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            ) : (
              <Link to="/login">
                <a className="p-2">Login</a>
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Layout;
