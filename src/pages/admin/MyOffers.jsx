import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../../components/axiosInterceptor";
import baseUrl from "../../utils/client";
import OfferPreview from "../../components/admin/OfferPreview";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";

const MyOffers = () => {
  const [offerPercentage, setOfferPercentage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const { user } = useContext(AuthContext);
  const [roomId, setRoomId] = useState(null);
  const [currentOffer, setCurrentOffer] = useState(null);
  const handleSaveOffer = async () => {
    if (!offerPercentage) {
      alert("Please select an offer percentage.");
      return;
    }

    setIsDisabled(true);
    // Replace with actual backend request
    console.log("Saving offer:", offerPercentage);

    try {
      const [shopRes, roomRes] = await Promise.all([
        axiosInstance.post(
          `${baseUrl}/api/hotels/updateOfferInShop/${user?.shopId}`,
          { offer: Number(offerPercentage), type: "overallOffer" },
          { withCredentials: true }
        ),
        axiosInstance.post(
          `${baseUrl}/api/rooms/updateRoomOfferService/${roomId}`,
          { offer: offerPercentage },
          { withCredentials: true }
        ),
      ]);

      console.log(shopRes);

      if (roomRes.status === 201) {
        toast("Offer added successfully!");
        setOfferPercentage("");
      } else {
        toast("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      toast(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsDisabled(false);
    }
  };

  // Generate options dynamically from 5 to 100 with step of 5
  const offerOptions = Array.from({ length: 15 }, (_, i) => i * 5);

  //Free Services - Strategy

  const Packages = () => {
    const [categoriesOptions, setCategoriesOptions] = useState();
    const [categories, setCategories] = useState();
    const [price, setPrice] = useState(0);

    const [duration, setDuration] = useState(0);
    const [typeOfPerson, setTypeOfPerson] = useState(null);

    const [loading, setLoading] = useState(false);

    const [height, setHeight] = useState(false);

    const [services, setServices] = useState();
    // const [roomId, setRoomId] = useState();
    const [packageName, setPackageName] = useState();
    const [preview, setPreview] = useState(false);
    const { t } = useTranslation();

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
          const { data } = await axiosInstance.get(
            `${baseUrl}/api/hotels/room/${user?.shopId}`
          );

          const { data: data1 } = await axiosInstance.get(
            `${baseUrl}/api/hotels/find/${user?.shopId}`
          );

          setTypeOfPerson(data1?.subType);
          setCurrentOffer(data[0]?.offer);
          // const services = (data[0]?.services || []).reduce((arr, item) => {
          //   arr.push(item.category);
          //   return arr;
          // }, []);
          // const packageRemovedServices = services.filter(
          //   (service) => service !== "packages"
          // );

          setRoomId(data[0]?._id);

          // setServices(packageRemovedServices);
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
    const [all1, setAll1] = useState([]);

    //this function is used to change the services according to user selected category
    const handleChange = (e) => {
      const result = categories.filter((category, i) =>
        category.category === e.target.value &&
        category.subCategory === typeOfPerson
          ? category.services
          : null
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
    const handleOptionChange1 = (event, option) => {
      if (event.target.checked) {
        setAll1([...all1, option]);
      } else {
        let ax = all1.filter((option1) => option.service !== option1.service);
        setAll1(ax);
      }
    };

    //afterf entering details to show Preview page

    const previewHandler = (e) => {
      e.preventDefault();

      // console.log({ packageName, all, price, duration });
      if (
        packageName?.length > 5 &&
        all?.length >= 1 &&
        all1?.length >= 1 &&
        duration === 0
      ) {
        setPreview(true);
      } else {
        toast("Did u miss something?");
      }
    };

    useEffect(() => {
      const categories1 = categories?.filter(
        (item) => item.subCategory === typeOfPerson
      );
      const services = (categories1 || []).reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = item.category;
        }
        return acc;
      }, {});

      const arr = Object.keys(services);

      const packageRemovedServices = arr.filter(
        (service) => service !== "packages"
      );

      setServices(packageRemovedServices);
    }, [typeOfPerson]);

    const getTotalDuration = () => {
      const duration = all?.reduce((acc, service) => acc + service.duration, 0);
      return duration ? duration : 0;
    };

    const getTotalPrice = () => {
      const duration = all?.reduce((acc, service) => acc + service.price, 0);
      return duration ? duration : 0;
    };
    const getTotalPrice1 = () => {
      const duration = all1?.reduce((acc, service) => acc + service.price, 0);
      return duration ? duration : 0;
    };

    const handleTypeOfPerson = (e) => {
      setTypeOfPerson(e.target.value);
      setCategoriesOptions(null);
      setServices(null);
    };

    return (
      <div className="pt-6 pb-20">
        {preview ? (
          <div>
            <OfferPreview
              services={all}
              services1={all1}
              setPreview={setPreview}
              packageName={packageName}
              price={price}
              duration={getTotalDuration()}
              shopId={user?.shopId}
              roomId={roomId}
            />
          </div>
        ) : (
          <div className="min-h-screen md:w-[90vw] w-[95.5vw] mx-auto">
            <div className="  flex items-center justify-around flex-wrap flex-grow basis-full pb-5">
              <div className="md:w-auto w-full">
                <div className="flex items-center justify-between">
                  <p className="py-2 font-semibold text-lg  ">{t("gender")}</p>
                  <span className=" bg-[#00ccbb] rounded-full md:px-3.5 px-2.5   md:py-1.5 py-0.5 text-white">
                    0
                  </span>
                </div>
                <select
                  onChange={handleTypeOfPerson}
                  className="border-2 border-[#00ccbb]  md:w-auto w-full"
                  value={typeOfPerson}
                >
                  <option selected>{t("selectType")}</option>
                  {(typeOfPerson === "unisex" || typeOfPerson === "men") && (
                    <option value="men">{t("men")}</option>
                  )}
                  {(typeOfPerson === "unisex" || typeOfPerson === "women") && (
                    <option value="women">{t("women")}</option>
                  )}
                </select>
              </div>
              <div className="md:w-auto w-full">
                <div className="flex items-center justify-between">
                  <p className="py-2 font-semibold text-lg  ">Offer Name</p>
                  <span className=" bg-[#00ccbb] rounded-full md:px-3.5 px-2.5   md:py-1.5 py-0.5 text-white">
                    1
                  </span>
                </div>
                <input
                  type="text"
                  className="h-8 w-full"
                  placeholder={t("package")}
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                ></input>
              </div>
              <div className="text-lg  text-left text-black md:w-auto w-full">
                <div className="flex items-center justify-between py-1">
                  <p className="py-1 text-md text-black font-semibold">
                    {t("categories")}
                  </p>
                  <span className=" bg-[#00ccbb] rounded-full md:px-3.5 px-2.5   md:py-1.5 py-0.5 text-white">
                    2
                  </span>
                </div>

                <select className="w-full" onChange={handleChange}>
                  <option selected>{t("selectCategory")}</option>
                  {services?.map((service, i) => {
                    return <option key={i}>{service}</option>;
                  })}
                </select>
              </div>

              <div className="text-lg font-bold  text-left text-black md:w-auto w-full">
                <div className="flex items-center justify-between py-1">
                  <p className=" text-md text-black font-semibold">
                    {t("price")}
                  </p>
                  <span className=" bg-[#00ccbb] rounded-full md:px-3.5 px-2.5   md:py-1.5 py-0.5 text-white">
                    3
                  </span>
                </div>
                <input
                  type="text"
                  className="h-8 w-full"
                  placeholder="price"
                  value={getTotalPrice()}
                  readOnly
                  // onChange={(e) => setPrice(Number(e.target.value))}
                ></input>
              </div>
              <div className="text-lg font-bold  text-left text-black md:w-auto w-full">
                <p className="py-1 text-md text-black font-semibold">
                  {t("duration")}
                </p>

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
                <p>Main Services</p>
                <table className="min-w-full ">
                  <thead className="border-b bg-gray-300 ">
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left md:text-md text-sm md:p-5 p-4">
                        {t("serviceName")}
                      </th>
                      <th className=" md:p-5 p-4 md:text-md text-sm text-right">
                        {t("price")}
                      </th>
                      {/* <th className="md:p-5 p-4  md:text-md text-sm text-right">
                                    Category
                                  </th> */}

                      <th className="md:p-5 p-4  md:text-md text-sm text-right">
                        {t("duration")}
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
                            {option.duration} {t("min")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="overflow-x-auto  lg:col-span-3 md:col-span-3 mt-4">
                  <p>Free Services</p>
                  <table className="min-w-full ">
                    <thead className="border-b bg-gray-300 ">
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left md:text-md text-sm md:p-5 p-4">
                          {t("serviceName")}
                        </th>
                        <th className=" md:p-5 p-4 md:text-md text-sm text-right">
                          {t("price")}
                        </th>
                        {/* <th className="md:p-5 p-4  md:text-md text-sm text-right">
                                    Category
                                  </th> */}

                        <th className="md:p-5 p-4  md:text-md text-sm text-right">
                          {t("duration")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriesOptions?.map((option, j) => {
                        const ans = all1.map((option) => option.service);

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
                                  handleOptionChange1(event, option)
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
                              {option.duration} {t("min")}
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
                  <h2 className="mb-2 text-lg font-bold">
                    {t("selectedServices")}
                  </h2>
                  <ul>
                    <li>
                      <div className="mb-2 flex justify-between">
                        <div>{t("count")}</div>
                        <div>
                          {all?.length} {"Main Services"}
                          {all1?.length} {"Free Services"}
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="mb-2 flex justify-between bg-[#00ccbb] p-2 rounded text-white font-bold">
                        <div>{t("costOfServices")}</div>
                        <div>
                          {all?.length > 0
                            ? all?.reduce(
                                (acc, option) => acc + option.price,
                                0
                              )
                            : 0}{" "}
                          {t("rs")}/-
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="mb-2 flex justify-between bg-green-500 rounded text-white font-bold p-2">
                        <div>Free Services</div>
                        <div>
                          {getTotalPrice1()} {t("rs")}/-
                        </div>
                      </div>
                    </li>

                    <li>
                      <div className="mb-2 flex justify-between bg-green-500 rounded text-white font-bold p-2">
                        <div>Final Price</div>
                        <div>
                          {getTotalPrice() || 0} {t("rs")}/-
                        </div>
                      </div>
                    </li>

                    <li>
                      <button
                        // disabled={buttonLoad}
                        onClick={previewHandler}
                        className="primary-button flex items-center justify-center  w-full"
                      >
                        {t("preview")}{" "}
                        {/* {buttonLoad && <span className="buttonloader"></span>} */}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {" "}
      <div className="p-6  mx-auto space-y-8">
        {/* Section 1: Offer Percentage Selection */}
        <div className="bg-white shadow-md p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            Select Offer Percentage
          </h2>

          <h2 className="text-xl font-semibold mb-4">
            Current Offer: {currentOffer || 0} %
          </h2>
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-medium">Offer:</label>
            <select
              value={offerPercentage}
              onChange={(e) => setOfferPercentage(e.target.value)}
              className="border px-4 py-2 rounded-md"
            >
              <option value="">Select</option>
              {offerOptions.map((value) => (
                <option key={value} value={value}>
                  {value}%
                </option>
              ))}
            </select>
            <button
              onClick={handleSaveOffer}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save Offer
            </button>
          </div>
        </div>
      </div>
      {/* Section 2: Manual Data Entry */}
      <Packages />
    </>
  );
};

export default MyOffers;
