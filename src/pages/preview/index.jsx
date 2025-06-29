import React from "react";

import { useEffect } from "react";

import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";

import baseUrl from "../../utils/client";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import time from "../../utils/time";
import axiosInstance from "../../components/axiosInterceptor";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Preview = (props) => {
  // const { state,setPreview } = useLocation();

  const { state, setPreview, mergedServices, offer } = props;

  // console.log(state, "state");
  const ConvenienceFee = Number(
    ((state?.totalAmount * (state?.totalAmount > 200 ? 8 : 9)) / 100).toFixed(1)
  );

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [height, setHeight] = useState(false);

  const [showPreviewServices, setShowPreviewServices] = useState();
  const [timeRange, setTimeRange] = useState(0);

  useEffect(() => {
    const mergedPreviewServices = state?.previewServices
      ?.reduce((arr, item) => {
        arr.push(item.services);
        return arr;
      }, [])
      .reduce((arr, item) => {
        return arr.concat(item);
      }, []);
    // .filter((item) => item.subCategory === state.subCategory);

    const showPreviewServicess = state?.selectedSeats.map((seat, i) => {
      const push = mergedPreviewServices.filter((item) =>
        seat.options.includes(item.service)
      );

      if (push) {
        return {
          id: seat.id,
          options: seat.options,
          index: seat.index,
          show: push,
          barber: seat?.barber?.name,
        };
      }
    });

    // let totalTime = 0;
    let totalTime1 = [];

    // showPreviewServicess?.forEach((seat, i) => {
    //   seat.show.length > 0 &&
    //     (totalTime += seat.show.reduce((acc, show) => acc + show.duration, 0));
    // });
    showPreviewServicess?.forEach((seat, i) => {
      seat.show.length > 0 &&
        totalTime1.push(
          seat.show.reduce((acc, item) => acc + item.duration, 0)
        );
    });
    console.log(totalTime1, "tyotalTime1");
    const findIdOfTime = time.find(
      (item, i) => item.value === state?.dates[0]?.time
    );

    const timeRanges = totalTime1?.map((item1) => {
      return time.find((item, i) => item.id === findIdOfTime.id + item1 / 10);
    });

    setTimeRange(timeRanges);

    setShowPreviewServices(showPreviewServicess);
  }, [state]);

  // const mass = options.map((option) => {
  //   return mergedPreviewServices.filter((item) =>
  //     option.includes(item.service)
  //   );
  // });

  // setShowPreviewServices(mass);

  // console.log(mass, "masss");

  // const uniqueArr = mass.reduce((arr, item) => {
  //   return arr.concat(item);
  // }, []);

  // const uniqueArray1 = [...new Set(uniqueArr)];

  // const userSelectedCategories = uniqueArray1.map((item) => {
  //   return item.category;
  // });
  // console.log(userSelectedCategories);

  const placeOrderHandler = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    setLoading(true);
    const {
      selectedSeats,
      totalAmount,
      roomId,
      shopOwner,
      shopId,
      shopName,
      ownerEmail,
      ownerNumber,
      bookId,
      user,
      link,
      dates,
      type,
      subCategory,
      superCategory,
    } = state;

    // console.log(selectedSeats, "selectedSeats");

    const manipulatedSelectedSeats = selectedSeats.map((seat) => {
      if (seat.options.length > 0) {
        // console.log(seat, "seat");
        const mappedOptions = seat.options.map((option) =>
          mergedServices.find((service) => service.service === option)
        );
        return { ...seat, options: mappedOptions };
      } else {
        return seat;
      }
    });

    // console.log(manipulatedSelectedSeats, "manipulatedSelectedSeats");

    try {
      const { status } = await axiosInstance.post(
        `${baseUrl}/api/users/finalBookingDetails/${user._id}`,

        {
          selectedSeats: manipulatedSelectedSeats,

          totalAmount: (state?.totalAmount * (1 - offer / 100)).toFixed(1),
          roomId,
          shopOwner,
          shopId,
          shopName,
          ownerEmail,
          ownerNumber,
          bookId,
          user,
          link,
          dates,
          type,
          subCategory,
          superCategory,
        },
        { withCredentials: true }
      );
      if (status === 201) {
        const {
          data: { key },
        } = await axiosInstance.get(`${baseUrl}/api/getkey`);

        try {
          const {
            data: { order },
          } = await axiosInstance.post(
            `${baseUrl}/api/payments/checkout`,
            {
              // amount: totalAmount,
              amount: ConvenienceFee,
              // amount: 1,
            },
            { withCredentials: true }
          );
          const token = localStorage.getItem("access_token");
          const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "Saalons",
            description: "SAALONS",
            image: "https://avatars.githubusercontent.com/u/25058652?v=4",
            order_id: order.id,
            // callback_url: `${baseUrl}/api/payments/paymentverification?token=${token}&userId=${user._id}`,
            redirect: false,
            handler: async function (response) {
              // Step 3: Call backend to verify payment
              try {
                const verifyRes = await axiosInstance.post(
                  `${baseUrl}/api/payments/paymentverification?token=${token}&userId=${user._id}`,
                  {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    userId: user._id,
                  }
                );
                // console.log(verifyRes, "verifyRes");
                if (verifyRes.data.success) {
                  setLoading(false);
                  navigate("/", {
                    state: { referenceNum: response.razorpay_payment_id },
                  });
                } else {
                  window.location.href = `/payment-failure`;
                }
              } catch (err) {
                console.error("Verification failed", err);
                window.location.href = `/payment-failure`;
              }
            },

            notes: {
              address: "EasyTym Corporate Office",
            },

            theme: {
              color: "#121212",
            },

            modal: {
              ondismiss: function () {
                // setLoading(false);
              },
            },
          };

          const razor = new window.Razorpay(options);
          razor.open();
          // setLoading(false);
        } catch (err) {
          toast("Token expired! Please login");
          setLoading(false);
          console.log(err);
          //   setTimeout(() => {
          //     navigate("/login", { state: { destination: `/shops/${shopId}` } });
          //   }, 3000);
        }
      } else {
        toast("something went wrong!");
        setLoading(false);
      }
    } catch (err) {
      toast("Token expired! Please login");
      alert(JSON.stringify(err));
      setLoading(false);
      console.log(err);
      setTimeout(() => {
        navigate("/login", { state: { destination: `/shops/${shopId}` } });
      }, 3000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY >= 80) {
        setHeight(true);
      } else {
        setHeight(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="md:pb-0 pb-20">
      <div
        className=" min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/duk9xkcp5/image/upload/v1687704167/pexels-pixabay-219677_kgdqgm.jpg')",
        }}
      >
        <h2 className=" text-lg  py-5 md:pl-[4.2rem] pl-4 text-left text-white font-extrabold">
          {t("orderPreview")}
        </h2>

        <div className="grid md:grid-cols-5 lg:grid-cols-4 lg:gap-5 md:gap-5  md:w-[90vw] w-[95.5vw] mx-auto">
          <div className="overflow-x-auto lg:col-span-3 md:col-span-3">
            {showPreviewServices?.map((seat, i) => {
              // console.log(seat.show, "seat.show");
              return (
                seat.show.length > 0 && (
                  <div className="card overflow-x-auto p-5" key={i}>
                    <h2 className="mb-2 text-lg">
                      {/* Selected Items - Seat {seat.index + 1} */}
                      {t("selectedSeats", { seatNum: seat.index + 1 })}
                    </h2>
                    <table className="min-w-full ">
                      <thead className="border-b bg-gray-300 ">
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left md:text-md text-sm md:p-5 p-4">
                            {t("serviceName")}
                          </th>
                          <th className=" md:p-5 p-4 md:text-md text-sm text-right">
                            {t("price")}
                          </th>

                          <th className="md:p-5 p-4  md:text-md text-sm text-right">
                            {t("duration")}
                          </th>
                          <th className="md:p-5 p-4  md:text-md text-sm text-right">
                            {t("gender")}
                          </th>
                          <th className="md:p-5 p-4  md:text-md text-sm text-right">
                            Barber/Beautician
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {seat.show.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b-2 border-gray-200"
                          >
                            <td className="md:text-md text-sm p-5">
                              {t("service", { name: item.service })}
                            </td>
                            <td className="p-5 text-right md:text-md text-sm">
                              &#8377;{" "}
                              {t("price1", {
                                price: Number(
                                  item.offer > 0
                                    ? (
                                        item.price *
                                        (1 - item.offer / 100)
                                      ).toFixed(1)
                                    : item.price
                                ),
                              })}
                            </td>

                            <td className="p-5 text-right md:text-md text-sm">
                              {t("duration1", { duration: item.duration })} min
                            </td>
                            <td className="p-5 text-right md:text-md text-sm">
                              {state?.subCategory}
                            </td>
                            {seat?.barber && (
                              <td className="p-5 text-right md:text-md text-sm">
                                {seat?.barber}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              );
            })}
          </div>
          <div className="lg:col-span-1 md:col-span-2">
            <div
              className={`card p-5 ${
                height
                  ? "md:sticky top-24 lg:py-5 transition-all delay-200"
                  : ""
              }`}
            >
              <h2 className="mb-2 text-lg">{t("orderSummary")}</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>{t("date")}</div>
                    <div>{state?.dates[0]?.date}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>{t("time")}</div>
                    <div className="flex flex-col justify-between">
                      {timeRange &&
                        showPreviewServices?.map((seat, i) => {
                          console.log(timeRange[i], "timeRange[i]");
                          if (seat.show.length > 0) {
                            return (
                              <div>
                                Seat{seat.index + 1} : {state?.dates[0]?.time} -{" "}
                                {
                                  timeRange[
                                    seat.index > 1 ? seat.index - 1 : seat.index
                                  ]?.value
                                }
                              </div>
                            );
                          }
                        })}
                    </div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>{t("totalAmount")}</div>
                    <div className="text-white">
                      <span
                        className={`${
                          offer > 0 ? "line-through text-red-400" : ""
                        } text-green-400 mr-2`}
                      >
                        ₹ {state?.totalAmount}
                      </span>
                      {offer > 0 && (
                        <span className="text-green-500">
                          &#8377;{" "}
                          {(
                            Number(state?.totalAmount) *
                            (1 - Number(offer) / 100)
                          ).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 mr-2 flex justify-between">
                    <div>Convenience Fee</div>
                    <div>&#8377; {ConvenienceFee} </div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 mr-2 flex justify-between text-green-600">
                    <div>{t("total")}</div>
                    <div>
                      &#8377;{" "}
                      {(
                        Number(state?.totalAmount) * (1 - Number(offer) / 100) +
                        Number(ConvenienceFee)
                      ).toFixed(1)}
                    </div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between heartbeat">
                    <div className="text-red-500">
                      Note* - We charge only convenience fee and it is
                      calculated on total amount excluded on overall shop
                      discount offer, Kindly pay the remaining amount &#8377;
                      {(state?.totalAmount * (1 - Number(offer) / 100)).toFixed(
                        1
                      )}{" "}
                      at the shop.
                    </div>
                  </div>
                </li>

                <li>
                  {!loading ? (
                    <button
                      disabled={loading}
                      onClick={placeOrderHandler}
                      className="primary-button flex items-center justify-center  w-full"
                    >
                      <>Book Now</>
                    </button>
                  ) : (
                    <button
                      className="primary-button flex items-center justify-center  w-full"
                      disabled={loading}
                    >
                      {" "}
                      Book Now
                      {loading && <span className="buttonloader ml-2"></span>}
                    </button>
                  )}
                </li>
                <li>
                  <button
                    onClick={() => setPreview(false)}
                    className="primary-button w-full my-2"
                  >
                    {t("forgotSomething")}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
