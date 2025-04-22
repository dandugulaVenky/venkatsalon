import React, { useEffect, useState } from "react";
import baseUrl from "../../utils/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInterceptor";

const OfferPreview = (props) => {
  const {
    services,
    services1,
    setPreview,
    packageName,
    price,
    duration,
    roomId,
  } = props;
  const [disabled, setIsDisabled] = useState(false);

  const [height, setHeight] = useState(false);
  const navigate = useNavigate();

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

  const createHandler = async () => {
    setIsDisabled(true);
    let serviceNames = services.map((service) => {
      return { service: service.service, free: false };
    });

    let serviceNames1 = services1.map((service) => {
      return { service: service.service, free: true };
    });

    let finalArr = {
      category: "offers",
      subCategory: services[0]?.subCategory,
      superCategory: services[0]?.superCategory,

      services: {
        service: packageName,
        price: services.reduce((acc, option) => acc + option.price, 0),
        duration:
          services.reduce((acc, option) => acc + option.duration, 0) +
          services1.reduce((acc, option) => acc + option.duration, 0),
        category: "offers",
        subCategory: services[0]?.subCategory,
        superCategory: services[0]?.superCategory,
        inclusions: serviceNames.concat(serviceNames1),
      },
    };

    try {
      const { status } = await axiosInstance.post(
        `${baseUrl}/api/rooms/addRoomOffersServices/${roomId}`,
        { services: finalArr },
        { withCredentials: true }
      );
      if (status === 201) {
        toast("package added succesfully!");

        setTimeout(() => navigate("/admin/my-services"), 2000);
      } else {
        toast("something went wrong!");
        setIsDisabled(false);
      }
    } catch (err) {
      console.log(err);
      toast(err.response.data.message);
    }
  };

  return (
    <div className="pt-6 pb-20">
      <div className=" min-h-screen">
        <p className="pb-5 md:pl-[4.5rem] pl-4 text-black font-bold text-xl">
          Preview Of Package
        </p>
        <div className="grid md:grid-cols-5 lg:grid-cols-4 lg:gap-5 md:gap-5   md:w-[90vw] w-[95.5vw] mx-auto">
          <div className="overflow-x-auto   md:col-span-3">
            <h1>Main Services</h1>

            <table className="min-w-full ">
              <thead className="border-b bg-gray-300 ">
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left md:text-md text-sm md:p-5 p-4">
                    Service Name
                  </th>
                  <th className=" md:p-5 p-4 md:text-md text-sm text-right">
                    Price
                  </th>
                  {/* <th className="md:p-5 p-4  md:text-md text-sm text-right">
                                    Category
                                  </th> */}

                  <th className="md:p-5 p-4  md:text-md text-sm text-right">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {services?.map((option, j) => {
                  return (
                    <tr key={j} className="border-b-2 border-white">
                      <td className="md:text-md text-sm flex items-center justify-start p-5 space-x-2">
                        <label className="text-gray-900">
                          {option.service}
                        </label>
                      </td>
                      <td className="p-5 text-right md:text-md text-sm">
                        &#8377; {option.price}
                      </td>

                      {/* <td className="p-5 text-right md:text-md text-sm">
                                          {option.category}
                                        </td> */}
                      <td className="p-5 text-right md:text-md text-sm">
                        {option.duration} min
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="overflow-x-auto   md:col-span-3 mt-5">
              <h1>Free Services</h1>
              <table className="min-w-full ">
                <thead className="border-b bg-gray-300 ">
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left md:text-md text-sm md:p-5 p-4">
                      Service Name
                    </th>
                    <th className=" md:p-5 p-4 md:text-md text-sm text-right">
                      Price
                    </th>
                    {/* <th className="md:p-5 p-4  md:text-md text-sm text-right">
                                    Category
                                  </th> */}

                    <th className="md:p-5 p-4  md:text-md text-sm text-right">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services1?.map((option, j) => {
                    return (
                      <tr key={j} className="border-b-2 border-white">
                        <td className="md:text-md text-sm flex items-center justify-start p-5 space-x-2">
                          <label className="text-gray-900">
                            {option.service}
                          </label>
                        </td>
                        <td className="p-5 text-right md:text-md text-sm">
                          &#8377; {option.price}
                        </td>

                        {/* <td className="p-5 text-right md:text-md text-sm">
                                          {option.category}
                                        </td> */}
                        <td className="p-5 text-right md:text-md text-sm">
                          {option.duration} min
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-1 md:col-span-2">
            <div
              className={`card  p-5 ${
                height
                  ? "md:sticky top-24  lg:py-5 transition-all delay-200"
                  : ""
              }`}
            >
              <h2 className="mb-2 text-lg font-bold">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Offer</div>
                    <div>{packageName}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex flex-col justify-between">
                    <div>Main Services : {services.length} services</div>
                    <div>Free Services : {services1.length} services</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Actual Amount</div>
                    <div>
                      &#8377;{" "}
                      {services.reduce((acc, option) => acc + option.price, 0) +
                        services1.reduce(
                          (acc, option) => acc + option.price,
                          0
                        )}
                    </div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Offer Amount</div>
                    <div>
                      {" "}
                      &#8377;{" "}
                      {services.reduce((acc, option) => acc + option.price, 0)}
                    </div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Duration</div>
                    <div>
                      {" "}
                      {services.reduce(
                        (acc, option) => acc + option.duration,
                        0
                      ) +
                        services1.reduce(
                          (acc, option) => acc + option.duration,
                          0
                        )}{" "}
                      min
                    </div>
                  </div>
                </li>

                <li>
                  <button
                    disabled={disabled}
                    onClick={createHandler}
                    className="primary-button flex items-center justify-center  w-full"
                  >
                    {disabled ? (
                      <span className="buttonloader ml-2"></span>
                    ) : (
                      "Proceed"
                    )}
                    {/* {buttonLoad && <span className="buttonloader"></span>} */}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setPreview(false);
                    }}
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
    </div>
  );
};

export default OfferPreview;
