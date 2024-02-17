import React from "react";

import { useEffect } from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../utils/client";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import time from "../../utils/time";

const Preview = (props) => {
  // const { state,setPreview } = useLocation();

  const { state, setPreview, mergedServices } = props;

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
      }, [])
      .filter((item) => item.subCategory === state.subCategory);

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
        };
      }
    });

    let totalTime = 0;
    showPreviewServices?.forEach((seat, i) => {
      seat.show.length > 0 &&
        (totalTime += seat.show.reduce((acc, show) => acc + show.duration, 0));
    });

    console.log(totalTime);

    const findIdOfTime = time.find(
      (item, i) => item.value === state?.dates[0]?.time
    );

    const timeRanges = time.find(
      (item, i) => item.id === findIdOfTime.id + totalTime / 10
    );

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
    } = state;

    const manipulatedSelectedSeats = selectedSeats.map((seat) => {
      if (seat.options.length > 0) {
        const mappedOptions = seat.options.map((option) =>
          mergedServices.find((service) => service.service === option)
        );
        return { ...seat, options: mappedOptions };
      } else {
        return seat;
      }
    });

    try {
      const { status } = await axios.post(
        `${baseUrl}/api/users/finalBookingDetails/${user._id}`,

        {
          selectedSeats: manipulatedSelectedSeats,

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
        },
        { withCredentials: true }
      );
      if (status === 201) {
        const {
          data: { key },
        } = await axios.get(`${baseUrl}/api/getkey`);

        try {
          const {
            data: { order },
          } = await axios.post(
            `${baseUrl}/api/payments/checkout`,
            {
              amount: totalAmount,
            },
            { withCredentials: true }
          );

          const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "EASYTYM",
            description: "SALOONS",
            image: "https://avatars.githubusercontent.com/u/25058652?v=4",
            order_id: order.id,
            callback_url: `${baseUrl}/api/payments/paymentverification`,
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
          setLoading(false);
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
                              &#8377; {t("price1", { price: item.price })}
                            </td>

                            <td className="p-5 text-right md:text-md text-sm">
                              {t("duration1", { duration: item.duration })} min
                            </td>
                            <td className="p-5 text-right md:text-md text-sm">
                              {state?.subCategory}
                            </td>
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
                    <div>
                      {state?.dates[0]?.time} - {timeRange?.value}
                    </div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>{t("totalAmount")}</div>
                    <div>&#8377; {state?.totalAmount}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>{t("tax")}</div>
                    <div>&#8377; 30</div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <div>{t("total")}</div>
                    <div>&#8377; {state?.totalAmount + 30}</div>
                  </div>
                </li>

                <li>
                  {!loading ? (
                    <button
                      disabled={loading}
                      onClick={placeOrderHandler}
                      className="primary-button flex items-center justify-center  w-full"
                    >
                      <>{t("placeOrder")}</>
                    </button>
                  ) : (
                    <button className="primary-button flex items-center justify-center  w-full">
                      {" "}
                      {t("placeOrder")}{" "}
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
