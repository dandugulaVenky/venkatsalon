import {
  faAddressCard,
  faBuildingShield,
  faClose,
  faDashboard,
  faShield,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useContext } from "react";
import { SearchContext } from "../../context/SearchContext";

import { faContactBook } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { useState } from "react";

import { useEffect } from "react";
import baseUrl from "../../utils/client";
import axiosInstance from "../axiosInterceptor";
import { t } from "i18next";

const SIdebar = () => {
  const { open, dispatch } = useContext(SearchContext);
  const { user, dispatch: dispatch1 } = useContext(AuthContext);

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getAdmin = async () => {
      let isAdmin = await axiosInstance.get(
        `${baseUrl}/api/users/${user?._id}`,
        {
          withCredentials: true,
        }
      );

      setIsAdmin(isAdmin.data);
    };
    getAdmin(user?._id);
  }, [user?._id]);

  return (
    <div className="">
      <div className="min-h-screen p-3 space-y-2 w-60 bg-gray-200  fixed right-0 top-0 bottom-0 z-50 scale-in-center ">
        <div className="flex items-center p-2 space-x-4">
          <img
            src="https://source.unsplash.com/100x100/?portrait"
            alt=""
            className="w-12 h-12 rounded-full dark:bg-gray-500"
          />
          <div>
            <h2 className="text-lg font-semibold">{user?.username}</h2>

            <span
              className="flex items-center space-x-1"
              onClick={() => dispatch({ type: "SIDEBAR_OPEN", payload: !open })}
            >
              <Link
                to="/profile"
                className="text-xs hover:underline dark:text-gray-400"
              >
                View profile
              </Link>
            </span>
          </div>
        </div>
        <div className="divide-y divide-gray-700">
          <ul
            className="pt-2 pb-4 space-y-1 text-sm "
            onClick={() => dispatch({ type: "SIDEBAR_OPEN", payload: !open })}
          >
            <li className="">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-start space-x-2 p-2  rounded-md"
                >
                  <FontAwesomeIcon icon={faDashboard} size="xl" />{" "}
                  <span>Dashboard</span>
                </Link>
              )}
            </li>
            <li className="">
              <Link
                to="/about-us"
                className="flex items-start space-x-2 p-2  rounded-md "
              >
                <FontAwesomeIcon icon={faBuildingShield} size="xl" />{" "}
                <span>About US</span>
              </Link>
            </li>
            <li>
              <Link
                to="/contact-us"
                className="flex items-start space-x-2 p-2  rounded-md "
              >
                {" "}
                <FontAwesomeIcon icon={faAddressCard} size="xl" />
                <span>Contact Us</span>
              </Link>
            </li>

            <li>
              <Link
                to="/privacy-policy"
                className="flex items-start space-x-2 p-2  rounded-md"
              >
                {" "}
                <FontAwesomeIcon icon={faShield} size="xl" />
                <span className="">Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link
                to="/terms-and-conditions"
                className="flex items-start space-x-2 p-2  rounded-md"
              >
                {" "}
                <FontAwesomeIcon icon={faContactBook} size="xl" />
                <span>Terms&Conditions</span>
              </Link>
            </li>
            <li>
              {user?.username ? (
                <div className="flex items-start space-x-2 p-2  rounded-md">
                  <FontAwesomeIcon icon={faSignOut} size="xl" />
                  <span
                    className=""
                    onClick={() => {
                      dispatch1({ type: "LOGOUT" });
                      navigate("/login");
                    }}
                  >
                    Logout
                  </span>
                </div>
              ) : (
                <div className="flex items-start space-x-2 p-2  rounded-md">
                  <FontAwesomeIcon icon={faSignOut} size="xl" />
                  <span
                    className=""
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login
                  </span>
                </div>
              )}
            </li>
          </ul>

          <span
            className="flex items-start space-x-2 p-2  rounded-md cursor-pointer"
            onClick={() => {
              if (user) {
                navigate("/shop-details");
              } else {
                alert("Please login to join with us!");
              }
            }}
          >
            {t("joinUs")}
          </span>

          <p
            className="  text-sm fixed top-1 right-5 border border-gray-300 rounded-full px-1.5 py-0.5 cursor-pointer"
            onClick={() => dispatch({ type: "SIDEBAR_OPEN", payload: !open })}
          >
            <FontAwesomeIcon icon={faClose} size="1x" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SIdebar;
