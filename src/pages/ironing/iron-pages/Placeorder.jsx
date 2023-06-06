import Cookies from "js-cookie";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Store } from "../ironing-utils/Store";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CheckoutWizard from "../ironing-utils/CheckoutWizard";
import SIdebar from "../../../components/navbar/SIdebar";
import Greeting from "../../../components/navbar/Greeting";
import Seo from "../../../utils/Seo";
import Layout from "../../../components/navbar/Layout";
import { SearchContext } from "../../../context/SearchContext";
import Footer from "../../../components/footer/Footer";
import useEffectOnce from "../../../utils/UseEffectOnce";

const siteMetadata = {
  title: "Home | Effortless Appointments With Easytym",
  description:
    "Easytym provides reliable salon booking services, connecting customers with top-quality beauty parlours and professional ironing services.",
  canonical: "https://easytym.com",
};

export default function PlaceOrder() {
  useEffectOnce(() => {
    window.scrollTo(0, 0);
  }, []);

  const { state, dispatch } = useContext(Store);
  const { open } = useContext(SearchContext);
  let w = window.innerWidth;
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  ); // 123.4567 => 123.46

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      // const { data } = await axios.post("/api/orders", {
      //   orderItems: cartItems,
      //   shippingAddress,
      //   paymentMethod,
      //   itemsPrice,
      //   shippingPrice,
      //   taxPrice,
      //   totalPrice,
      // });
      setLoading(false);
      dispatch({ type: "CART_CLEAR_ITEMS" });
      Cookies.set(
        "cart",
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      // navigate(`/order/${data._id}`);
      toast("Ordered Successfully");
      setTimeout(() => {
        navigate("/iron");
      }, 3000);
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      {open && <SIdebar />}
      {w < 768 && <Greeting />}
      <Seo props={siteMetadata} />
      <div className=" px-4">{w >= 768 && <Layout />}</div>
      <CheckoutWizard activeStep={2} />
      <h1 className="mb-4 text-xl px-10 pt-5">Place Order</h1>
      {cartItems.length === 0 ? (
        <div className="px-10 pt-10">
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5  h-auto px-4  md:px-10  pb-16">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}
              </div>
              <div className="bg-gray-400 text-white px-3 py-2 w-14 rounded-md my-2">
                <Link to="/iron/shipping">Edit</Link>
              </div>
            </div>

            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr className="border-b-2 border-white">
                    <th className="px-5 text-left">Item</th>
                    <th className="    p-5 text-right">Quantity</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b-2 border-white">
                      <td>
                        <Link to={`/iron/product/${item.slug}`}>
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
              <div className="bg-gray-400 text-white px-3 py-2 w-14 rounded-md my-2">
                <Link to="/iron/cart">Edit</Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="primary-button w-full"
                  >
                    {loading ? "Loading..." : "Place Order"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
