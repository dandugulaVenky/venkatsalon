import React, { useContext } from "react";
import SIdebar from "../../../components/navbar/SIdebar";
import Greeting from "../../../components/navbar/Greeting";
import Layout from "../../../components/navbar/Layout";
import { SearchContext } from "../../../context/SearchContext";
import Footer from "../../../components/footer/Footer";
import useFetch from "../../../hooks/useFetch";
import baseUrl from "../../../utils/client";
import { AuthContext } from "../../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment/moment";

const Orders = () => {
  const { open } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  let w = window.innerWidth;

  const { data, loading, error } = useFetch(
    `${baseUrl}/api/users/iron/getUserIronOrders/${user?._id}`,
    { credentials: true }
  );
  if (!user || error?.response?.data?.status === 401) {
    navigate("/login", { state: { destination: `/iron-orders` } });
  }

  return (
    <div>
      {open && <SIdebar />}
      {w < 768 && <Greeting />}

      <div className=" px-4">{w >= 768 && <Layout />}</div>
      {loading ? (
        <div className="min-h-[90vh] flex items-center justify-center">
          <p> loading...</p>
        </div>
      ) : (
        <div className="min-h-[90vh] md:mx-10 mx-5  ">
          <p className="py-4 font-bold">My Iron Orders</p>
          <div className="grid grid-cols-1 md:gap-4 md:grid-cols-2 lg:grid-cols-4 pb-20">
            {data?.map((order) => (
              <div className="card  overflow-auto ">
                <div className="flex flex-col items-start justify-center p-5 ">
                  <Link to={`/iron-orders`}>
                    <h2 className="text-lg text-[#00ccbb]">
                      Order Id: {order?.orderId}
                    </h2>
                  </Link>

                  <p className="font-bold">Rs.{order?.itemsPrice}</p>
                  <p className="font-bold">
                    Paid: {order?.isPaid ? "Yes" : "No"}
                  </p>
                  <p className="font-bold">
                    Delivered: {order?.isDelivered ? "Yes" : "No"}
                  </p>
                  <p>Date: {moment(order?.createdAt).format("MMM Do YYYY")}</p>
                  <Link to={`/iron/order/${order?.orderId}`}>
                    <p className="font-bold text-blue-600">
                      Click for more details
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
