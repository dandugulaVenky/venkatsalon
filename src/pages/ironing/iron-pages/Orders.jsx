import React, { useContext } from "react";

import useFetch from "../../../hooks/useFetch";
import baseUrl from "../../../utils/client";
import { AuthContext } from "../../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { data, loading, error } = useFetch(
    `${baseUrl}/api/users/iron/getUserIronOrders/${user?._id}`,
    { credentials: true }
  );
  if (!user || error?.response?.data?.status === 401) {
    navigate("/login", { state: { destination: `/iron-orders` } });
  }

  return (
    <div className="pt-6 pb-20">
      {loading ? (
        <div className="min-h-[90vh] flex items-center justify-center">
          <p> loading...</p>
        </div>
      ) : (
        <div className="min-h-[90vh] md:mx-10 mx-5  ">
          <p className="pb-4 font-bold">{t("myIronOrders")}</p>
          <div className="grid grid-cols-1 md:gap-4 md:grid-cols-2 lg:grid-cols-4 ">
            {data?.map((order) => (
              <div className="card  overflow-auto ">
                <div className="flex flex-col items-start justify-center p-5 ">
                  <Link to={`/iron-orders`}>
                    <h2 className="text-lg text-[#00ccbb]">
                      {t("orderId")}: {order?.orderId}
                    </h2>
                  </Link>

                  <p className="font-bold">
                    {t("rs")}.{order?.itemsPrice}
                  </p>
                  <p className="font-bold">
                    {t("paid")}: {order?.isPaid ? "Yes" : "No"}
                  </p>
                  <p className="font-bold">
                    {t("delivered")}: {order?.isDelivered ? "Yes" : "No"}
                  </p>
                  <p>
                    {t("date")}:{" "}
                    {moment(order?.createdAt).format("MMM Do YYYY")}
                  </p>
                  <Link to={`/iron/order/${order?.orderId}`}>
                    <p className="font-bold text-blue-600">
                      {t("clickForMoreDetails")}
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
