import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu } from "@headlessui/react";
import DropdownLink from "../DropdownLink";
import "./navbar.scss";
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

const scrollNow = () => {
  return window.scrollTo(0, 0);
};
const Layout = ({ bestRef }) => {
  const { user, dispatch } = useContext(AuthContext);

  const { state } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { pathname } = useLocation();

  let { dispatch: dispatch1, city, type } = useContext(SearchContext);
  const [address, setAddress] = useState("");
  const [header, setHeader] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const scrollTimeoutIdRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const getAdmin = async () => {
      try {
        let isAdmin = await axios.get(`${baseUrl}/api/users/${user?._id}`, {
          withCredentials: true,
        });

        setIsAdmin(isAdmin.data);
      } catch (err) {
        console.log(err);
      }
    };

    user?._id && getAdmin(user?._id);
  }, [user?._id]);

  const navigate = useNavigate();

  const handleLocation = () => {
    setHeader(true);
  };

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  return (
    <>
      <ToastContainer position="top-center" />
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

      <div className="pb-[6.3rem]">
        <div className="mainHead">
          <div
            className={`flex items-center justify-between px-10  ${
              isScrolled ? "head1" : "head2"
            }`}
          >
            <div className="flex items-center justify-center">
              <Link to="/" onClick={scrollNow}>
                <img
                  src="https://res.cloudinary.com/dqupmzcrb/image/upload/e_auto_contrast,q_100/v1685348916/EASY_TYM-removebg-preview_sab2ie.png"
                  alt="logo"
                  className={`${isScrolled ? "imgs1" : "imgs2"}`}
                />
              </Link>
              <div className="pl-5 text-xl mt-1 font-semibold flex items-center justify-center space-x-4">
                <FontAwesomeIcon icon={faLocation} size="lg" />
                <p className="text-sm">
                  {city ? shortenString(city).toUpperCase() : "loading"}
                </p>
                {pathname === "/" && (
                  <FontAwesomeIcon
                    icon={faChevronCircleDown}
                    size="lg"
                    onClick={handleLocation}
                  />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between ">
              {user ? (
                <div className="flex items-center justify-center md:space-x-8 space-x-3 ">
                  {(pathname.includes("/cart") ||
                    pathname.includes("/shipping") ||
                    pathname.includes("/place-order")) && (
                    <Link to="/iron" className="transition-all delay-300">
                      <h1 className=" font-semibold md:text-lg text-xs">
                        Iron Home
                      </h1>
                    </Link>
                  )}
                  <Link to="/about-us">
                    <h1 className=" font-semibold md:text-lg text-xs">About</h1>
                  </Link>
                  <Link to="/contact-us">
                    <h1 className=" font-semibold md:text-lg text-xs">
                      Contact
                    </h1>
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
                  <Menu
                    as="div"
                    className="relative inline-block  z-10 -mt-0.4"
                  >
                    <Menu.Button className="flex items-center space-x-2 justify-center font-semibold capitalize mr-1">
                      <h1 className="md:text-lg text-xs "> {user.username}</h1>
                      <FontAwesomeIcon
                        icon={faChevronCircleDown}
                        size="lg"
                        color="black"
                      />
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
                      <Menu.Item>
                        <DropdownLink className="dropdown-link p-1">
                          <Link to="/iron-orders">Iron Orders</Link>
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
                        <Link
                          className="dropdown-link p-1 mb-2"
                          to="#"
                          onClick={() => {
                            dispatch({ type: "LOGOUT" });
                            navigate("/login");
                          }}
                        >
                          Logout
                        </Link>
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
              ) : (
                <Link to="/login">
                  <p className="p-2">Login</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
