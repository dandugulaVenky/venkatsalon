import React from "react";

import Footer from "../../components/footer/Footer";
import { useEffect } from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../utils/client";

import { toast } from "react-toastify";

const SalonPreview = (props) => {
  const { state, setSalonPreview } = props;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [height, setHeight] = useState(false);

  const [showPreviewServices, setShowPreviewServices] = useState();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY >= 80) {
        console.log(scrollY);
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

  useEffect(() => {
    const showPreviewServicess = state?.selectedSeats.map((seat, i) => {
      const push = state.previewServices.filter((item) =>
        seat.options.includes(item.service)
      );
      // console.log(push,"push")
      if (push) {
        return {
          id: seat.id,
          options: seat.options,
          index: seat.index,
          show: push,
        };
      }
    });
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
    } = state;
    try {
      const { status } = await axios.post(
        `${baseUrl}/api/users/finalBookingDetails/${user._id}`,

        {
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
              ondismiss: function () {
                setLoading(false);
              },
            },
          };

          const razor = new window.Razorpay(options);
          razor.open();
          setLoading(false);
        } catch (err) {
          toast("Token expired! Please login");
          setLoading(false);
          console.log(err);
          setTimeout(() => {
            navigate("/login", { state: { destination: `/shops/${shopId}` } });
          }, 3000);
        }
      } else {
        setLoading(false);
        toast("something went wrong!");
      }
    } catch (err) {
      setLoading(false);
      toast("Token expired! Please login");
      console.log(err);
      setTimeout(() => {
        navigate("/login", { state: { destination: `/shops/${shopId}` } });
      }, 3000);
    }
  };

  return (
    <>
      <div
        className="pb-20 min-h-screen  bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/duk9xkcp5/image/upload/v1687704167/pexels-pixabay-219677_kgdqgm.jpg')",
        }}
      >
        <h2 className="mb-2 text-lg font-bold py-5 text-left md:px-10 px-2.5">
          Order Preview
        </h2>

        <div className="grid  md:grid-cols-5 lg:grid-cols-4 lg:gap-5 md:gap-5 h-auto px-2 md:px-10 ">
          <div className="overflow-x-auto lg:col-span-3 md:col-span-3">
            {showPreviewServices?.map((seat, i) => {
              return (
                seat.show.length > 0 && (
                  <div className="card overflow-x-auto p-5" key={i}>
                    <h2 className="mb-2 text-lg">
                      Selected Items - Seat {seat.index + 1}
                    </h2>
                    <table className="min-w-full">
                      <thead className="border-b bg-gray-300">
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left p-5">Service Name</th>
                          <th className=" p-5 text-right">Price</th>
                          <th className="p-5 text-right">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seat.show.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b-2 border-gray-200"
                          >
                            <td className="p-5">{item.service}</td>
                            <td className="p-5 text-right">
                              &#8377; {item.price}
                            </td>
                            <td className="p-5 text-right">
                              {item.duration} min
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
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Date</div>
                    <div>{state?.dates[0]?.date}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Time</div>
                    <div>{state?.dates[0]?.time}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total Amount</div>
                    <div>&#8377; {state?.totalAmount}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>&#8377; 30</div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>&#8377; 700</div>
                  </div>
                </li>

                <li>
                  {!loading ? (
                    <button
                      onClick={placeOrderHandler}
                      className="primary-button flex items-center justify-center  w-full"
                    >
                      <>Place Order</>
                    </button>
                  ) : (
                    <button className="primary-button flex items-center justify-center  w-full">
                      {" "}
                      Place Order{" "}
                      {loading && <span className="buttonloader ml-2"></span>}
                    </button>
                  )}
                </li>
                <li>
                  <button
                    onClick={() => setSalonPreview(false)}
                    className="primary-button w-full my-2"
                  >
                    Forgot Something?
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SalonPreview;
