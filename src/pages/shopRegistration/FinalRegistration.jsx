import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import RegistrationWizard from "./RegistrationWizard";
import { AuthContext } from "../../context/AuthContext";
import baseUrl from "../../utils/client";
import axiosInstance from "../../components/axiosInterceptor";
import { toast } from "react-toastify";

function setCookieObject(name1, value, daysToExpire) {
  const expires = new Date();
  expires.setDate(expires.getDate() + daysToExpire);

  // Serialize the object to JSON and encode it
  const cookieValue =
    encodeURIComponent(JSON.stringify(value)) +
    (daysToExpire ? `; expires=${expires.toUTCString()}` : "");

  document.cookie = `${name1}=${cookieValue}; path=/`;
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const FinalRegistration = () => {
  const [seats, setSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [shopDetails, setShopDetails] = useState();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paymentOptionTrue, setPaymentOptionTrue] = useState(false);
  const { t } = useTranslation();

  function getCookieObject(name) {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

    for (const cookie of cookies) {
      if (cookie.startsWith(name + "=")) {
        const encodedValue = cookie.substring(name.length + 1);
        return JSON.parse(decodeURIComponent(encodedValue));
      }
    }

    return null; // Cookie not found
  }

  const handleRegister = async () => {
    if (seats > 10) {
      return alert(t("max10SeatsAllowed"));
    }
    if (!shopDetails) {
      return alert(t("detailsAreNotUpToTheMark"));
    }
    setPaymentOptionTrue(true);

    // setLoading(true);

    // try {
    //   const response = await axiosInstance.post(
    //     `${baseUrl}/api/shop_registration/new_registration`,
    //     newhotel,
    //     { withCredentials: true }
    //   );
    //   if (response.status === 200) {
    //     setLoading(false);
    //     alert(t("willContactYouShortly"));
    //     // Usage example
    //     removeCookie("user_info");
    //     navigate("/");
    //   } else {
    //     alert(
    //       "Something went wrong, please contact us at services@easytym.com"
    //     );
    //     setLoading(false);
    //   }
    // } catch (err) {
    //   alert(err.response.data.message);
    //   setLoading(false);

    //   console.log(err, "err2");
    // }

    // console.log(user);
  };

  const handleSubscription = async (plan) => {
    try {
      const res = await axiosInstance.post(
        `${baseUrl}/api/users/checkAlreadyShopPresent/${user?._id}/${shopDetails?.name}`,
        { phone: user?.phone },
        { withCredentials: true }
      );

      console.log(res, "res");
      if (res.data.status === 409) {
        alert(res.data.message);
        // setLoading(false);

        return;
      }

      const res1 = await axiosInstance.post(
        `${baseUrl}/api/shop_registration/checkIfRegistrationExists`,

        {
          email: user?.email,
          phone: user?.phone,
          name: shopDetails?.name,
        },
        { withCredentials: true }
      );

      if (res1.data.status === 409) {
        alert(res1.data.message);
        // setLoading(false);

        return;
      }
    } catch (err) {
      console.log(err, "err1");
      // setLoading(false);

      alert(err.response.data.message);

      return;
    }

    const arrayOfObjects = [];
    for (let i = 1; i <= seats; i++) {
      const newObj = {
        number: i,
      };

      arrayOfObjects.push(newObj);
    }

    const ownerDetails = {
      username: user?.username.trim().toLowerCase(),
      userId: user?._id,
      city: user?.city,
      phone: user?.phone,
      email: user?.email,
      isAdmin: true,
    };

    const newhotel = {
      ...shopDetails,
      city: shopDetails.city.toLowerCase(),
      roomNumbers: arrayOfObjects.length,
      ownerDetails,
      plan,
    };

    setCookieObject("new_hotel", newhotel, 7);
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const {
      data: { key },
    } = await axiosInstance.get(`${baseUrl}/api/getkey`);

    try {
      const {
        data: { order },
      } = await axiosInstance.post(
        `${baseUrl}/api/payments/subscription/checkout`,
        {
          // amount: totalAmount,
          // amount: Number(plan.price),
          amount: 1,
        },
        { withCredentials: true }
      );

      const token = sessionStorage.getItem("access_token");

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Saalons",
        description: "SAALONS",
        image: "https://avatars.githubusercontent.com/u/25058652?v=4",
        order_id: order.id,
        callback_url: `${baseUrl}/api/payments/subscription/paymentverification?token=${token}`,

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
      setLoading(false);
    } catch (err) {
      toast("Token expired! Please login");
      setLoading(false);
      console.log(err);
      //   setTimeout(() => {
      //     navigate("/login", { state: { destination: `/shops/${shopId}` } });
      //   }, 3000);
    }
  };

  const PaymentOption = () => {
    const plans = [
      {
        duration: "3 Months",
        price: "119",
        description: "Basic access for 3 months.",
      },
      {
        duration: "6 Months",
        price: "219",
        description: "Save more with a 6-month plan.",
      },
      {
        duration: "1 Year",
        price: "399",
        description: "Best value for a full year.",
      },
    ];

    return (
      <div className="flex flex-col items-center h-auto mt-5 bg-gray-100 p-6 m-6">
        <h2 className="text-3xl font-bold mb-6">Choose Your Subscription</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {plan.duration}
              </h3>
              <p className="text-2xl font-bold text-[#00ccbb] my-2">
                Rs. {plan.price}
              </p>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <button
                onClick={() => handleSubscription(plan)}
                className="w-full bg-[#00ccbb] text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!user || user === "undefined") {
      navigate("/login");
    }
    window.scrollTo(0, 0);

    // Usage example
    const shopDetails = getCookieObject("shop_info");
    setShopDetails(shopDetails);
    console.log(typeof user, "shopDetails");
  }, [navigate, user]);

  return (
    <div className="pt-10 pb-20">
      {/*<Seo props={siteMetadata} />*/}

      <div className="min-h-[85.5vh]">
        <div className="md:py-0.5 py-5">
          <RegistrationWizard activeStep={2} />
        </div>
        {!paymentOptionTrue && (
          <div className="flex flex-col justify-center w-full min-h-[70vh] items-center">
            <div className="space-y-2">
              <p>
                {t("shopName")} :{" "}
                <span className="ml-4 w-52">{shopDetails?.name}</span>
              </p>
              <div className="mb-4">
                <label htmlFor="phone">{t("noOfSeats")}: </label>
                <input
                  className="ml-4 w-44"
                  type="number"
                  id="phone"
                  min={1}
                  max={15}
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                />
              </div>
              <div className="mb-4 flex justify-between m">
                <button
                  disabled={seats === undefined || seats === ""}
                  className={`${
                    seats === undefined || seats === ""
                      ? "default-button mt-4"
                      : "primary-button mt-4"
                  }`}
                  onClick={handleRegister}
                >
                  {loading ? (
                    <span className="buttonloader ml-2"></span>
                  ) : (
                    t("register")
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {paymentOptionTrue && <PaymentOption />}
      </div>
    </div>
  );
};

export default FinalRegistration;
