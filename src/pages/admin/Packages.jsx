import React, { useEffect, useState } from "react";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import baseUrl from "../../utils/client";
import axios from "axios";

import Layout from "../../components/navbar/Layout";
import Greeting from "../../components/navbar/Greeting";
import { toast } from "react-toastify";
import PackagePreview from "../../components/admin/PackagePreview";

const Packages = () => {
  const [categoriesOptions, setCategoriesOptions] = useState();
  const [categories, setCategories] = useState();
  const [price, setPrice] = useState(0);
  const { user } = useContext(AuthContext);
  const [duration, setDuration] = useState(0);
  let w = window.innerWidth;

  const [loading, setLoading] = useState(false);

  const [height, setHeight] = useState(false);

  const [services, setServices] = useState();
  const [roomId, setRoomId] = useState();
  const [packageName, setPackageName] = useState();
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/hotels/room/${user?.shopId}`
        );

        const services = (data[0]?.services || []).reduce((arr, item) => {
          arr.push(item.category);
          return arr;
        }, []);
        const packageRemovedServices = services.filter(
          (service) => service !== "packages"
        );

        setRoomId(data[0]?._id);
        setServices(packageRemovedServices);
        setCategories(data[0]?.services);
        setLoading(true);
      } catch (err) {
        console.log(err);
        toast("something wrong!");
      }
    };
    fetchData();
  }, [user?.shopId]);
  const [all, setAll] = useState([]);

  //this function is used to change the services according to user selected category
  const handleChange = (e) => {
    const result = categories.filter((category, i) =>
      category.category === e.target.value ? category.services : null
    );
    setCategoriesOptions(result[0]?.services);
  };

  const handleOptionChange = (event, option) => {
    if (event.target.checked) {
      setAll([...all, option]);
    } else {
      let ax = all.filter((option1) => option.service !== option1.service);
      setAll(ax);
    }
  };

  //afterf entering details to show Preview page

  const previewHandler = (e) => {
    e.preventDefault();

    console.log({ packageName, all, price, duration });
    if (
      packageName?.length > 5 &&
      all?.length >= 2 &&
      price > 10 &&
      duration === 0
    ) {
      setPreview(true);
    } else {
      toast("Did u miss something?");
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   let result = {
  //     category: category,
  //     services: allServices,
  //   };
  //   setShopServices((prevServices) => [...prevServices, result]);

  //   setAllServices({
  //     service: "",
  //     price: "",
  //     duration: "",
  //   });
  // };

  const getTotalDuration = () => {
    const duration = all?.reduce((acc, service) => acc + service.duration, 0);
    return duration ? duration : 0;
  };
  return (
    <>
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}
      {preview ? (
        <div>
          <PackagePreview
            services={all}
            setPreview={setPreview}
            packageName={packageName}
            price={price}
            duration={getTotalDuration()}
            shopId={user?.shopId}
            roomId={roomId}
          />
        </div>
      ) : (
        <div className="pb-10 min-h-screen md:w-[90vw] w-[95.5vw] mx-auto">
          <div className="mb-2 py-5  flex items-center justify-around flex-wrap flex-grow basis-full">
            <div className="md:w-auto w-full">
              <div className="flex items-center justify-between">
                <p className="py-2 font-semibold text-lg  ">Package name </p>
                <span className=" bg-[#00ccbb] rounded-full md:px-3.5 px-2.5   md:py-1.5 py-0.5 text-white">
                  1
                </span>
              </div>
              <input
                type="text"
                className="h-8 w-full"
                placeholder="package"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
              ></input>
            </div>
            <div className="text-lg  text-left text-black md:w-auto w-full">
              <div className="flex items-center justify-between py-1">
                <p className="py-1 text-md text-black font-semibold">
                  Categories
                </p>
                <span className=" bg-[#00ccbb] rounded-full md:px-3.5 px-2.5   md:py-1.5 py-0.5 text-white">
                  2
                </span>
              </div>

              <select className="w-full" onChange={handleChange}>
                <option selected>Select a category</option>
                {services?.map((service, i) => {
                  return <option key={i}>{service}</option>;
                })}
              </select>
            </div>

            <div className="text-lg font-bold  text-left text-black md:w-auto w-full">
              <div className="flex items-center justify-between py-1">
                <p className=" text-md text-black font-semibold">Price</p>
                <span className=" bg-[#00ccbb] rounded-full md:px-3.5 px-2.5   md:py-1.5 py-0.5 text-white">
                  3
                </span>
              </div>
              <input
                type="text"
                className="h-8 w-full"
                placeholder="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              ></input>
            </div>
            <div className="text-lg font-bold  text-left text-black md:w-auto w-full">
              <p className="py-1 text-md text-black font-semibold">Duration</p>

              <input
                readOnly
                value={getTotalDuration()}
                className="h-8 w-full md:w-52"
                placeholder="duration"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-5 lg:grid-cols-4 lg:gap-5 md:gap-5   md:w-[90vw] w-[95.5vw] mx-auto">
            <div className="overflow-x-auto  lg:col-span-3 md:col-span-3">
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
                  {categoriesOptions?.map((option, j) => {
                    const ans = all.map((option) => option.service);

                    return (
                      <tr key={j} className="border-b-2 border-white">
                        <td className="md:text-md text-sm flex items-center justify-start p-5 space-x-2">
                          <input
                            type="checkbox"
                            name={option.service}
                            checked={ans.includes(option.service)}
                            className="h-6 w-6"
                            id={option.service}
                            onChange={(event) =>
                              handleOptionChange(event, option)
                            }
                          />
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
            <div className="lg:col-span-1 md:col-span-2">
              <div
                className={`card  p-5 ${
                  height
                    ? "md:sticky top-24  lg:py-5 transition-all delay-200"
                    : ""
                }`}
              >
                <h2 className="mb-2 text-lg font-bold">Selected Services</h2>
                <ul>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Count</div>
                      <div>{all?.length} services</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between bg-[#00ccbb] p-2 rounded text-white font-bold">
                      <div>Cost of Services</div>
                      <div>
                        {all?.length > 0
                          ? all?.reduce((acc, option) => acc + option.price, 0)
                          : 0}{" "}
                        Rs/-
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between bg-green-500 rounded text-white font-bold p-2">
                      <div>Package price</div>
                      <div>{price} Rs/-</div>
                    </div>
                  </li>

                  <li>
                    <button
                      // disabled={buttonLoad}
                      onClick={previewHandler}
                      className="primary-button flex items-center justify-center  w-full"
                    >
                      Preview{" "}
                      {/* {buttonLoad && <span className="buttonloader"></span>} */}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Packages;
