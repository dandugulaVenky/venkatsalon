import React, { useEffect, useState } from "react";
import moment from "moment"; // you already have moment
import axiosInstance from "../../components/axiosInterceptor";
import baseUrl from "../../utils/client";
import { toast } from "react-toastify";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PlanExpiryPopup = ({ hotel }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [daysLeft, setDaysLeft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [renewal, setRenewal] = useState(false);
  useEffect(() => {
    if (!hotel?.plan?.endDate) return;

    const today = moment(); // For real testing, you can replace like moment('2025-07-10')
    const endDate = moment(hotel.plan.endDate);

    const diffDays = endDate.diff(today, "days");

    if (diffDays <= 2) {
      setShowPopup(true);
      setDaysLeft(diffDays);
    }

    if (today.isAfter(endDate)) {
      setIsExpired(true);
    }
  }, [hotel]);

  const handleContinue = () => {
    setShowPopup(false);
  };

  const handleRenew = () => {
    setRenewal(true);
  };

  const PaymentOption = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const handleSubscription = async (plan) => {
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
          callback_url: `${baseUrl}/api/payments/renewal/paymentverification?token=${token}&duration=${plan.duration}`,

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

    const plans = [
      {
        duration: "3 Months",
        price: "1",
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

  if (!showPopup) {
    return null;
  }

  return renewal ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {" "}
      <PaymentOption />
    </div>
  ) : (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {isExpired
            ? "Your subscription has expired!"
            : `Your subscription will expire in ${daysLeft} day(s)!`}
        </h2>

        <p className="mb-6 text-gray-600">
          {isExpired
            ? "Please renew your subscription to continue using our services."
            : "Please renew before it expires to avoid interruption."}
        </p>

        <div className="flex justify-center gap-4">
          {!isExpired && (
            <button
              className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              onClick={handleContinue}
            >
              Continue Working
            </button>
          )}
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleRenew}
          >
            Renew Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanExpiryPopup;
