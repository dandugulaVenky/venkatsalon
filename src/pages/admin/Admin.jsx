import axios from "axios";

import React, { useContext, useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Footer from "../../components/footer/Footer";
import Greeting from "../../components/navbar/Greeting";
import Layout from "../../components/navbar/Layout";
import Sidebar from "../../components/navbar/SIdebar";

import { AuthContext } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";
import baseUrl from "../../utils/client";
import { toast } from "react-toastify";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    const getAdmin = async () => {
      try {
        let isAdmin = await axios.get(`${baseUrl}/api/users/${user?._id}`, {
          withCredentials: true,
        });
        setIsAdmin(isAdmin.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        toast("finding admin failed!");
      }
    };
    getAdmin();
  }, [user?._id]);

  let w = window.innerWidth;
  const { open } = useContext(SearchContext);

  const handleClick = (value) => {
    const input = value;

    switch (input) {
      case "transactions":
        navigate("/admin/transactions");
        break;
      case "orders":
        navigate("/admin/orders");

        break;
      case "packages":
        navigate("/admin/packages");
        break;
      case "services":
        navigate("/admin/my-services");
        break;
      case "addServices":
        navigate("/admin/add-services");
        break;
      default:
        console.log("It is an unknown input.");
        break;
    }
  };

  return (
    <div className="min-h-screen">
      {open && <Sidebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}

      {loading ? (
        <div className="min-h-[85vh]  flex items-center justify-center">
          <span className="loader "></span>
        </div>
      ) : isAdmin ? (
        <div className="min-h-[85vh] flex flex-col  justify-center md:w-[30vw] w-[80vw] mx-auto cursor-pointer">
          <div
            className="card p-5 w-full"
            onClick={() => handleClick("transactions")}
          >
            <p>Transactions</p>
          </div>
          <div
            className="card p-5 w-full"
            onClick={() => handleClick("orders")}
          >
            <p>View Orders</p>
          </div>
          <div
            className="card p-5 w-full"
            onClick={() => handleClick("services")}
          >
            <p>My Services</p>
          </div>
          <div
            className="card p-5 w-full"
            onClick={() => handleClick("addServices")}
          >
            <p>Add Services</p>
          </div>
          <div
            className="card p-5 w-full"
            onClick={() => handleClick("packages")}
          >
            <p>Add Packages</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-10">
          <p>
            You are not an admin, if you want to register your saloon, please
            <Link to="/contactus">contact us</Link>
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Admin;
