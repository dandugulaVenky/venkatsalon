import Cookies from "js-cookie";
import React, { useCallback, useContext, useState } from "react";
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
import { AuthContext } from "../../../context/AuthContext";
import baseUrl from "../../../utils/client";
import { useTranslation } from 'react-i18next';


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

  const { user } = useContext(AuthContext);
  const { open } = useContext(SearchContext);
  let w = window.innerWidth;
  const [buttonLoad, setButtonLoad] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  ); // 123.4567 => 123.46

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();


  const placeOrderHandler = async () => {
    setLoading(true);
    const userId = user?._id;

    if (userId !== undefined) {
      const {
        data: { key },
      } = await axios.get(`${baseUrl}/api/getkey`);

      try {
        const {
          data: { order },
        } = await axios.post(
          `${baseUrl}/api/payments/iron/checkout`,
          {
            amount: 200,
          },
          { withCredentials: true }
        );

        const options = {
          key,
          amount: order.amount,
          currency: "INR",
          name: "EASYTYM ",
          description: "Ironing",
          image: "https://avatars.githubusercontent.com/u/25058652?v=4",
          order_id: order.id,
          callback_url: `${baseUrl}/api/payments/iron/paymentverification`,
          prefill: {
            name: "Test Team",
            email: "test.test@example.com",
            contact: "9999999999",
          },
          notes: {
            address: "EasyTym Corporate Office",
          },
          theme: {
            color: "#121212",
          },
          modal: {
            ondismiss: function () {},
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
        setButtonLoad(false);
        setLoading(false);
      } catch (err) {
        toast("Token expired! Please login");
        setButtonLoad(false);
        setLoading(false);
        setTimeout(() => {
          return navigate("/login", {
            state: { destination: `/iron/place-order` },
          });
        }, 3000);
      }
    } else {
      return navigate("/login", {
        state: { destination: `/iron/place-order` },
      });
    }
  };

  return (
    <>
      {open && <SIdebar />}
      {w < 768 && <Greeting />}
      <Seo props={siteMetadata} />
      <div className=" px-4">{w >= 768 && <Layout />}</div>
      <CheckoutWizard activeStep={2} />
      <h1 className="mb-4 text-xl px-10 pt-5">{t('placeOrder')}</h1>
      {cartItems.length === 0 ? (
        <div className="px-10 pt-10">
          {t('emptyCart')}{" "}
          <Link to="/iron" className="primary-button ">
            {t('goShopping')}
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5  h-auto px-4  md:px-10  pb-16">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">{t('shippingAddress')}</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}
              </div>
              <div className="bg-gray-400 text-white px-3 py-2 w-14 rounded-md my-2">
                <Link to="/iron/shipping">{t('edit')}</Link>
              </div>
            </div>

            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">{t('orderItems')}</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr className="border-b-2 border-white">
                    <th className="px-5 text-left">{t('item')}</th>
                    <th className="    p-5 text-right">{t('quantity')}</th>
                    <th className="  p-5 text-right">{t('price')}</th>
                    <th className="p-5 text-right">{t('Subtotal')}</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b-2 border-white">
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
                      <td className="p-5 text-right">{t('rs')}.{item.price}</td>
                      <td className="p-5 text-right">
                        {t('rs')}.{item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-400 text-white px-3 py-2 w-14 rounded-md my-2">
                <Link to="/iron/cart">{t('edit')}</Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">{t('orderSummary')}</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>{t('items')}</div>
                    <div>{t('rs')}.{itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>{t('tax')}</div>
                    <div>{t('rs')}.{taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>{t('shipping')}</div>
                    <div>{t('rs')}.{shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>{t('total')}</div>
                    <div>{t('rs')}.{totalPrice}</div>
                  </div>
                </li>
                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="primary-button w-full"
                  >
                    {loading ? (
                      t('loading')
                    ) : buttonLoad ? (
                      <span className="buttonloader"></span>
                    ) : (
                      t('placeOrder')
                    )}
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
