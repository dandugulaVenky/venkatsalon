import { useEffect } from "react";

import baseUrl from "../../../utils/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

import { useState } from "react";
import axiosInstance from "../../../components/axiosInterceptor";

export default function OrderDetails() {
  const { pathname } = useLocation();

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const orderId = pathname.split("/")[3];

  const [isAdmin, setIsAdmin] = useState(false);

  const { data, loading, error } = useFetch(
    `${baseUrl}/api/users/iron/getUserIronOrder/${user._id}/${
      pathname.split("/")[3]
    }`,
    { credentials: true }
  );

  if (!user || error?.response?.data?.status === 401) {
    navigate("/login", { state: { destination: `/iron/order/${orderId}` } });
  }
  //   async function deliverOrderHandler() {
  //     try {
  //       dispatch({ type: "DELIVER_REQUEST" });
  //       const { data } = await axiosInstance.put(
  //         `/api/admin/orders/${order._id}/deliver`,
  //         {}
  //       );
  //       dispatch({ type: "DELIVER_SUCCESS", payload: data });
  //       toast.success("Order is delivered");
  //     } catch (err) {
  //       dispatch({ type: "DELIVER_FAIL", payload: getError(err) });
  //       toast.error(getError(err));
  //     }
  //   }

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

    user?._id && getAdmin(user?._id);
  }, [user?._id]);

  return (
    <div className="pt-6 pb-20">
      <h1 className="mb-4 text-xl md:px-10 px-4  font-bold">{`Order ${orderId}`}</h1>

      {loading && data[0]?.length > 0 ? (
        "loading"
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5 md:px-10 px-4 ">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {data[0]?.shippingAddress.fullName},{" "}
                {data[0]?.shippingAddress.address},{" "}
                {data[0]?.shippingAddress.city},{" "}
                {data[0]?.shippingAddress.postalCode},{" "}
                {data[0]?.shippingAddress.country}
              </div>
              {data[0]?.isDelivered ? (
                <div className="alert-success">
                  Delivered at {data[0]?.deliveredAt}
                </div>
              ) : (
                <div className="alert-error">Not delivered</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{data[0]?.paymentMethod}</div>
              {data[0]?.isPaid ? (
                <div className="alert-success">Paid at {data[0]?.paidAt}</div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
            </div>

            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b-2 border-white">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="    p-5 text-right">Quantity</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {data[0]?.orderItems.map((item) => (
                    <tr key={item._id} className="border-b-2 border-white">
                      <td>
                        <Link href={`/product/${item.slug}`}>
                          <a className="flex items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></img>
                            &nbsp;
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        Rs.{item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>Rs.{data[0]?.itemsPrice}</div>
                  </div>
                </li>{" "}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>Rs.{data[0]?.taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>Rs.{data[0]?.shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div className="font-bold">Total</div>
                    <div className="font-bold">Rs.{data[0]?.totalPrice}</div>
                  </div>
                </li>
                {/* {isAdmin && data[0]?.isPaid && !data[0]?.isDelivered && (
                  <li>
                    <button
                      className="primary-button w-full"
                      //   onClick={deliverOrderHandler}
                    >
                      Deliver Order
                    </button>
                  </li>
                )} */}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
