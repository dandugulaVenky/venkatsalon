import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu } from "@headlessui/react";
import SaalonsLogo from "../../pages/images/saalonsT.png";
import "./navbar.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleDown,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";

import Header from "../header/Header";
import { SearchContext } from "../../context/SearchContext";
import baseUrl from "../../utils/client";
// import { Store } from "../../pages/ironing/ironing-utils/Store";
// import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
// import LanguageContext from "../../context/LanguageContext";
// import i18next from "../../i18n";
import axiosInstance from "../axiosInterceptor";

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

  // const { state } = useContext(Store);
  // const { cart } = state;
  // const [cartItemsCount, setCartItemsCount] = useState(0);
  const { pathname } = useLocation();

  let { dispatch: dispatch1, city, type } = useContext(SearchContext);

  const [address, setAddress] = useState("");
  const [header, setHeader] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const scrollTimeoutIdRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  // const { locale, setLocale } = useContext(LanguageContext);
  // const [ironing, setIroning] = useState(false);
  // i18next.on("languageChanged", (ing) => setLocale(i18next.language));
  // const handleChange = (event) => {
  //   i18next.changeLanguage(event.target.value); //fr or
  // };

  useEffect(() => {
    setIsScrolled(false);
    scrollNow();

    let timeout = pathname.includes("/shops")
      ? 600
      : pathname.includes("/iron")
      ? 0
      : pathname.includes("/iron/product")
      ? 600
      : 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY >= 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    scrollTimeoutIdRef.current = setTimeout(() => {
      window.addEventListener("scroll", handleScroll);
      // pathname.includes("/iron") && setIroning(true);
    }, timeout);

    // Clean up the event listener and clear the timeout on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeoutIdRef.current);
      // setIroning(false);
    };
  }, [pathname]);

  useEffect(() => {
    const getAdmin = async () => {
      try {
        let isAdmin = await axiosInstance.get(
          `${baseUrl}/api/users/${user?._id}`,
          {
            withCredentials: true,
          }
        );

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

  // useEffect(() => {
  //   setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  // }, [cart.cartItems]);

  // const handleLanguageChange = () => {
  //   console.log("update");
  //   updateLng('te'); // Change language to English
  // };
  // const handleChange = (event) =>{
  //   i18n.changeLanguage (event.target.value)
  // }

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

      <div className="mb-[5.5rem]">
        <div className="mainHead bg-[#34fbea32]">
          <div
            className={`flex items-center justify-between px-10 ${
              pathname.includes("/shops") ? "bg-white" : "bg-transparent"
            } ${isScrolled ? "head1 " : "head2"}`}
          >
            <div className="flex items-center justify-center">
              <Link to="/" onClick={scrollNow}>
                <img
                  src={SaalonsLogo}
                  alt="logo"
                  className={`${isScrolled ? "imgs1" : "imgs2"}`}
                />
              </Link>
              <div className="pl-5 text-xl mt-1 font-semibold flex items-center justify-center space-x-4">
                <FontAwesomeIcon icon={faLocation} size="lg" />
                <p className="text-sm">
                  {city ? shortenString(city).toUpperCase() : "Enter Your City"}
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
              <div className="flex items-center justify-center md:space-x-8 space-x-3 ">
                {/* {
                  <Link to="/iron" className="transition-all delay-300">
                    <h1
                      className={`font-semibold md:text-lg text-xs ${
                        pathname?.includes("/iron") ? "text-[#00ccbb]" : ""
                      } `}
                    >
                      <FontAwesomeIcon
                        icon={faTShirt}
                        size="lg"
                        className="mr-1"
                      />
                      {t("ironHome")}
                    </h1>
                  </Link>
                } */}
                <Link to="/about-us">
                  <h1
                    className={` font-semibold md:text-lg text-xs ${
                      pathname?.includes("/about") ? "text-[#00ccbb]" : ""
                    }`}
                  >
                    {t("about")}
                  </h1>
                </Link>
                <Link to="/contact-us">
                  <h1
                    className={` font-semibold md:text-lg ${
                      pathname?.includes("/contact-us") ? "text-[#00ccbb]" : ""
                    }`}
                  >
                    {t("contact")}
                  </h1>
                </Link>
                {/* <button onClick={handleLanguageChange}>Change Language</button> */}
                {/* <div>
                
                  <select
                    value={locale}
                    onChange={handleChange}
                    className="border-none font-semibold md:text-lg bg-transparent cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="te">తెలుగు</option>
                    <option value="hi">हिंदी</option>
                  </select>
                </div> */}
                {/* {ironing && (
                  <Link to="/iron/cart">
                    <label className="mr-1">
                      <FontAwesomeIcon
                        icon={faBagShopping}
                        size="xl"
                        color="black"
                      />
                    </label>
                    <a
                      className={` font-semibold md:text-lg text-xs slide-in-right ${
                        pathname?.includes("/cart") ? "text-[#00ccbb]" : ""
                      }`}
                    >
                      {cartItemsCount > 0 && (
                        <span className="ml-1 rounded-full bg-[#00ccbb] px-2 py-1 text-xs font-bold text-white">
                          {cartItemsCount}
                        </span>
                      )}
                    </a>
                  </Link>
                )} */}

                {user ? (
                  <Menu as="div" className="relative inline-block  z-10 ">
                    <Menu.Button className="flex items-center space-x-2 justify-center font-semibold capitalize mr-1">
                      <h1 className="md:text-lg text-xs "> {user.username}</h1>
                      <FontAwesomeIcon
                        icon={faChevronCircleDown}
                        size="sm"
                        color={"black"}
                      />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 w-56 origin-top-right bg-gray-100  shadow-lg ">
                      <Menu.Item>
                        {/* <DropdownLink className="dropdown-link p-1 mt-2"> */}
                        <Link className="dropdown-link p-1 mt-2" to="/profile">
                          {t("profile")}
                        </Link>
                        {/* </DropdownLink> */}
                      </Menu.Item>

                      <Menu.Item>
                        {/* <DropdownLink className="dropdown-link p-1"> */}
                        <Link className="dropdown-link p-1" to="/history">
                          {t("bookingHistory")}
                        </Link>
                        {/* </DropdownLink> */}
                      </Menu.Item>

                      {isAdmin && (
                        <Menu.Item>
                          {/* <DropdownLink className="dropdown-link p-1"> */}
                          <Link className="dropdown-link p-1" to="/admin">
                            {t("aAdminDashboard")}
                          </Link>
                          {/* </DropdownLink> */}
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
                          {t("logout")}
                        </Link>
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                ) : (
                  <Link to="/login">
                    <p className=" md:text-lg font-bold">Login</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Layout);
