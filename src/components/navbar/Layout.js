import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
const shortenString = (inputString) => {
  if (inputString.length > 30) {
    return inputString.substr(0, 30) + "...";
  } else {
    return inputString;
  }
};
const Layout = () => {
  const { user, dispatch } = useContext(AuthContext);

  let { dispatch: dispatch1, city, type } = useContext(SearchContext);
  const [address, setAddress] = useState("");
  const [header, setHeader] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const getAdmin = async () => {
    let isAdmin = await axios.get(`/api/users/${user?._id}`);

    setIsAdmin(isAdmin.data);
  };

  useEffect(() => {
    getAdmin(user?._id);
  }, []);

  const navigate = useNavigate();

  const handleLocation = () => {
    setHeader(!header);
  };

  return (
    <>
      <ToastContainer position="top-right" />
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
        <nav className="flex items-center px-4 justify-between bg-transparent ">
          <Link to="/get-started">
            <div className="flex items-center justify-center ">
              <img
                src="https://res.cloudinary.com/duk9xkcp5/image/upload/v1681883826/et_yyy_tjzm20-removebg-preview_1_wwzmks.png"
                alt="logo"
                height={80}
                width={80}
                className="rounded-lg"
              ></img>
              <p className="text-3xl text-[#00ccbb] font-bold ml-1">EasyTym</p>
              <div className="pl-5 text-xl mt-1 font-semibold flex items-center justify-center space-x-4">
                <FontAwesomeIcon icon={faLocation} size="lg" color="#00ccbb" />
                <p className="text-sm">
                  {city ? shortenString(city).toUpperCase() : "loading"}
                </p>
                <FontAwesomeIcon
                  icon={faChevronCircleDown}
                  size="lg"
                  color="#00ccbb"
                  onClick={handleLocation}
                />
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
