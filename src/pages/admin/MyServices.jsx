import React from "react";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useEffect } from "react";
import baseUrl from "../../utils/client";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/navbar/Layout";
import Greeting from "../../components/navbar/Greeting";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import { useTranslation } from "react-i18next";
import moment from "moment";

const MyServices = () => {
  const [categoriesOptions, setCategoriesOptions] = useState();
  const [categories, setCategories] = useState();
  const [disabled, setIsDisabled] = useState(false);
  const [deleteItemLoader, setDeleteItemLoader] = useState("");
  const { user } = useContext(AuthContext);

  let w = window.innerWidth;

  const [shopServices, setShopServices] = useState();

  const [edit, setEdit] = useState(false);
  const [roomData, setRoomData] = useState([]);
  const [showInclusions, setShowInclusions] = useState();
  const [seatsShow, setSeatsShow] = useState(false);
  const [addRemoveServices, setAddRemoveServices] = useState([]);

  //these cann add services are used to only select which are not there in the admin provided services

  const [canAddServices, setCanAddServices] = useState([]);

  const [allServices, setAllServices] = useState([]);
  const [roomId, setRoomId] = useState();
  const [deleted, setDeleted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/hotels/room/${user?.shopId}`
        );

        setRoomData(data[0]?.roomNumbers);
        const services = (data[0]?.services || []).reduce((arr, item) => {
          arr.push(item.category);
          return arr;
        }, []);

        const mergedServices = data[0]?.services
          ?.reduce((arr, item) => {
            arr.push(item.services);
            return arr;
          }, [])
          .reduce((arr, item) => {
            return arr.concat(item);
          }, []);

        setRoomId(data[0]?._id);
        setAllServices(mergedServices);
        setCategoriesOptions(mergedServices);
        setShopServices(services);
        setCategories(data[0]?.services);
      } catch (err) {
        console.log(err);
        toast("something wrong!");
      }
    };
    fetchData();
  }, [user?.shopId, showInclusions, edit, deleted, seatsShow]);

  const handleChange = (e) => {
    const result = categories.filter((category, i) =>
      category.category === e.target.value ? category.services : null
    );
    setCategoriesOptions(result[0]?.services);
  };

  const handleInput = (e, option) => {
    let value = e.target.value;
    if (option === "price" || option === "duration") {
      value = Number(value);
    }
    setEditedService((prev) => ({ ...prev, [option]: value }));
  };

  const handleEdit = (j, option) => {
    setEdit(j);
    setEditedService({
      service: option.service,
      oldServiceName: option.service,
      price: option.price,
      duration: option.duration,
      category: option.category,
    });
  };
  const [editedService, setEditedService] = useState({});

  const handleDelete = async (option) => {
    const confirmed = window.confirm("Are you sure you want to delete?");

    if (confirmed) {
      setIsDisabled(true);
      setDeleteItemLoader(option.service);
      try {
        const res = await axios.post(
          `${baseUrl}/api/rooms/deleteRoomService/${roomId}`,
          {
            service: option,
            allServices,
          },
          { withCredentials: true }
        );

        if (res.status === 201) {
          setShowInclusions(null);
          setEdit(null);
          toast("deleted successfully!");
          setDeleted(!deleted);
          setIsDisabled(false);
        } else {
          toast(res.data.message);
          setIsDisabled(false);

          return;
        }
      } catch (err) {
        toast("something wrong!");
        console.log(err);
      }
    } else {
      setIsDisabled(false);

      return;
    }
  };

  // to add edited service data to backend

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsDisabled(true);

    try {
      const { status } = await axios.post(
        `${baseUrl}/api/rooms/updateRoomService/${roomId}`,
        {
          editedService,
          allServices,
        },
        { withCredentials: true }
      );

      if (status === 201) {
        toast("Service edited successfully!");
        setEdit(null);
        setDeleted(!deleted);
        setIsDisabled(false);
      } else {
        toast("something went wrong!");
        setIsDisabled(false);
      }
    } catch (err) {
      toast("something wrong!");
      console.log(err);
    }
  };

  // to add inclusions to show package inclusions

  const handleInclusions = (e, option) => {
    e.preventDefault();

    const inclusions = option.inclusions.map((inclusion) => {
      return allServices.filter(
        (service) => service.service === inclusion.service
      )[0];
    });

    setShowInclusions({
      inclusions: inclusions,
      package: option.service,
    });
  };

  // this is to add a service or remove a service from inclusions and then send data to backend

  //this function is used to remove all the packages and show only the services which admin can add from list of services from his services

  const handleAddOrRemove = () => {
    setAddRemoveServices(showInclusions.inclusions);

    const result = [...allServices, ...showInclusions.inclusions];
    const uniqueServices = result.reduce((unique, service) => {
      const existingService = showInclusions.inclusions.find(
        (s) => s.service === service.service
      );
      if (!existingService) {
        unique.push(service);
      }
      return unique;
    }, []);

    const packageRemovedServices = uniqueServices.filter(
      (service) => service.category !== "packages"
    );

    //these cann add services are used to only select which are not there in the admin provided services

    setCanAddServices(packageRemovedServices);
  };

  //this function is used to remove unwanted services from package inclusions

  const handlePackageServiceDeletion = (option) => {
    const result = addRemoveServices.filter(
      (service) => service.service !== option.service
    );

    setCanAddServices([...canAddServices, option]);
    setAddRemoveServices(result);
  };

  //finally send data to backend to update inclusions in the services of corrosponding package
  const handleEditedPackageServicesToBackend = async () => {
    setIsDisabled(true);

    const finalArr = {
      services: addRemoveServices,
    };

    if (finalArr.services.length >= 2) {
      try {
        const { status } = await axios.post(
          `${baseUrl}/api/rooms/updateRoomPackageServices/${roomId}`,
          { finalArr, updatePackage: showInclusions.package, allServices },
          { withCredentials: true }
        );
        if (status === 201) {
          toast("Edited Successfully!");
          setShowInclusions(null);
          setAddRemoveServices(null);
          setCategoriesOptions(null);
          setCanAddServices(null);
          setIsDisabled(false);
        }
      } catch (err) {
        toast("Something wrong!");
        setIsDisabled(false);
        console.log(err);
      }
    } else {
      setIsDisabled(false);

      return toast("Please add atleast two services!");
    }
  };

  //add remove seats

  const generateDates = () => {
    let arr = [];

    for (let i = 0; i <= 6; i++) {
      const currentDate = moment();
      const futureDate = currentDate.add(i, "days");
      const formattedDate = futureDate.format("MMM Do YY");
      arr.push(formattedDate);
    }
    return arr;
  };
  const addSeat = async (type, seatId = null) => {
    try {
      await axios.post(
        `${baseUrl}/api/rooms/updateRoomSeat/${roomId}`,
        {
          type,
          number: roomData.length + 1,
          dates: generateDates(),
          seatId,
        },
        {
          withCredentials: true,
        }
      );

      setSeatsShow(false);
    } catch (err) {
      console.log(err);
      toast(err.response.data.message);
    }
  };

  const AddRemoveSeats = () => {
    return (
      <>
        <div className="reserve  flex flex-col text-left  ">
          <div className=" relative w-auto space-y-4 ">
            <FontAwesomeIcon
              onClick={() => setSeatsShow(false)}
              icon={faClose}
              color="white"
              size="lg"
              className="absolute -right-10 -top-10"
            />
            <p className="text-white text-lg">
              How many seats do u want in your shop?
            </p>
            <p className=" bg-gray-50 p-2 rounded-md font-bold text-center">
              Total Seats
            </p>
            <div className="block">
              {roomData?.map((seat, i) => {
                return (
                  <div className="text-black card space-x-2 p-2">
                    <span>Id : {seat._id}</span>
                    <span>Number : {i + 1}</span>
                    <div className="flex items-center justify-between py-1">
                      <button
                        className="bg-red-300 p-2 rounded-md"
                        onClick={() => addSeat("delete", seat._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
              <button
                className="bg-green-300 px-5 py-2 rounded-md"
                onClick={() => addSeat("add")}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}
      {showInclusions?.inclusions?.length > 0 ? (
        <div className="reserve relative">
          <div className="overflow-auto  ">
            <FontAwesomeIcon
              icon={faClose}
              size="lg"
              onClick={() => {
                setShowInclusions(null);
                setCanAddServices(null);
                setAddRemoveServices(null);
              }}
              className=" text-white md:right-20 right-10 border-2 rounded-full px-2 py-1 md:top-40 top-32 absolute  border-white"
            />
            {addRemoveServices?.length > 0 ? (
              <>
                {canAddServices?.length > 0 && (
                  <select
                    className="my-2 p-2 ml-2"
                    onChange={(e) => {
                      if (e.target.value === "") {
                        return;
                      }
                      const selectedService = allServices.find(
                        (service) => service.service === e.target.value
                      );

                      const existing = addRemoveServices.find(
                        (service) => service.service === e.target.value
                      );
                      if (existing) {
                        return;
                      }

                      setAddRemoveServices([
                        ...addRemoveServices,
                        selectedService,
                      ]);
                    }}
                  >
                    <option value={""}>{t("selectService")}</option>
                    {canAddServices.map((service, i) => {
                      return (
                        <option value={service.service} key={i}>
                          {service.service}
                        </option>
                      );
                    })}
                  </select>
                )}
                <table className="md:min-w-[70vw] min-w-[95vw] mx-auto">
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

                      <th className="md:p-5 p-4  md:text-md text-sm text-right">
                        {t("delete")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {addRemoveServices?.map((option, j) => {
                      return (
                        <tr key={j} className="border-b-2 border-white">
                          <td className="md:text-md text-sm flex items-start justify-start p-5 space-x-2">
                            <label className="text-white font-bold">
                              {option.service}
                            </label>
                          </td>
                          <td className="p-5 text-right md:text-md text-sm">
                            <label className="text-white">
                              &#8377; {option.price}
                            </label>
                          </td>

                          {/* <td className="p-5 text-right md:text-md text-sm">
                                          {option.category}
                                        </td> */}
                          <td className="p-5 text-right md:text-md text-sm">
                            <label className="text-white">
                              {option.duration} {t("min")}
                            </label>
                          </td>

                          <td className="p-5 text-right md:text-md text-sm">
                            <FontAwesomeIcon
                              icon={faTrash}
                              size="lg"
                              color="white"
                              onClick={() =>
                                handlePackageServiceDeletion(option)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <button
                  className="primary-button my-4"
                  onClick={handleEditedPackageServicesToBackend}
                >
                  {t("confirmAddServices")}
                </button>
              </>
            ) : (
              <>
                <div className="flex md:flex-row flex-col py-2 items-center justify-around ">
                  <button
                    className="primary-button my-3"
                    onClick={handleAddOrRemove}
                  >
                    {t("addRemoveService")}
                  </button>
                  <p className="text-white md:text-md text-xs">
                    {t("costOfServices")}: &#8377;&nbsp;
                    {showInclusions?.inclusions.reduce(
                      (acc, service) => acc + service?.price,
                      0
                    )}
                  </p>
                </div>
                <table className="md:min-w-[70vw] min-w-[95vw] mx-auto ">
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
                    {showInclusions?.inclusions?.map((option, j) => {
                      return (
                        <tr key={j} className="border-b-2 border-white">
                          <td className="md:text-md text-sm flex items-center justify-start p-5 space-x-2">
                            <label className="text-white">
                              {option?.service}
                            </label>
                          </td>
                          <td className="p-5 text-right md:text-md text-sm">
                            <label className="text-white">
                              &#8377; {option?.price}
                            </label>
                          </td>

                          {/* <td className="p-5 text-right md:text-md text-sm">
                                          {option.category}
                                        </td> */}
                          <td className="p-5 text-right md:text-md text-sm">
                            <label className="text-white">
                              {option?.duration} {t("min")}
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="pb-20 min-h-screen md:w-[90vw] w-[95.5vw] mx-auto">
          <p className="float-right bg-gray-50 p-4 rounded-md font-bold">
            {t("totalServices")} : {allServices?.length}
          </p>
          <p className="float-right bg-gray-50 p-4 rounded-md font-bold">
            Total Seats : {roomData?.length}
          </p>
          <div className="mb-2 py-5 flex items-center justify-start flex-wrap min-w-full">
            <h2 className="text-lg font-bold  text-left text-black ml-2 space-x-3">
              <select className="w-52" onChange={handleChange}>
                <option selected>{t("selectCategory")}</option>
                {shopServices?.map((service, i) => {
                  return <option key={i}>{service}</option>;
                })}
              </select>

              <button
                className="primary-button"
                onClick={() => setSeatsShow(true)}
              >
                Add / Remove Seats
              </button>
            </h2>
          </div>

          {seatsShow ? <AddRemoveSeats /> : ""}
          <div className="grid md:grid-cols-5 lg:grid-cols-4 lg:gap-5 md:gap-5   ">
            {allServices?.length > 0 ? (
              <>
                {" "}
                <div className="overflow-x-auto  col-span-5">
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
                        {
                          <th className="md:p-5 p-4  md:text-md text-sm text-right">
                            {t("inclusions")}
                          </th>
                        }
                        <th className="md:p-5 p-4  md:text-md text-sm text-right">
                          {t("edit")}
                        </th>{" "}
                        <th className="md:p-5 p-4  md:text-md text-sm text-right">
                          {t("delete")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriesOptions?.map((option, j) => {
                        return (
                          <tr key={j} className="border-b-2 border-white">
                            <td className="md:text-md text-sm flex items-center justify-start p-5">
                              {edit === j ? (
                                <input
                                  type="text"
                                  value={editedService.service}
                                  onChange={(e) => handleInput(e, "service")}
                                  readOnly={option.category !== "packages"}
                                />
                              ) : (
                                <label className="text-gray-900">
                                  {option.service}
                                </label>
                              )}
                            </td>
                            <td className="p-5 text-right md:text-md text-sm">
                              {edit === j ? (
                                <input
                                  type="text"
                                  value={editedService.price}
                                  onChange={(e) => handleInput(e, "price")}
                                />
                              ) : (
                                <label className="text-gray-900 w-full">
                                  &#8377;{option.price}
                                </label>
                              )}
                            </td>

                            {/* <td className="p-5 text-right md:text-md text-sm">
                                        {option.category}
                                      </td> */}
                            <td className="p-5 text-right md:text-md text-sm">
                              {edit === j ? (
                                <input
                                  type="text"
                                  readOnly={option.category === "packages"}
                                  value={editedService.duration}
                                  onChange={(e) => handleInput(e, "duration")}
                                />
                              ) : (
                                <label className="text-gray-900">
                                  {option.duration} {t("min")}
                                </label>
                              )}
                            </td>
                            {option.category === "packages" ? (
                              <td className="p-5 text-right md:text-md text-sm">
                                {
                                  <label
                                    className="text-gray-900 underline cursor-pointer"
                                    onClick={(e) => handleInclusions(e, option)}
                                  >
                                    {t("showInclusions")}
                                  </label>
                                }
                              </td>
                            ) : (
                              <td className="p-5 text-right md:text-md text-sm">
                                <label>{t("noInclusions")}</label>
                              </td>
                            )}
                            <td className="p-5 text-right md:text-md text-sm">
                              {edit === j ? (
                                <div className="flex items-center justify-end space-x-1">
                                  <button
                                    className="px-3 py-1.5 bg-blue-600 rounded-md"
                                    onClick={handleAdd}
                                  >
                                    {disabled ? (
                                      <span className="buttonloader ml-2"></span>
                                    ) : (
                                      "Save"
                                    )}
                                  </button>
                                  <button
                                    onClick={() => setEdit(null)}
                                    className="px-3 py-1.5 bg-red-400 rounded-md"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  size="lg"
                                  onClick={(e) => handleEdit(j, option)}
                                />
                              )}
                            </td>
                            <td className="p-5 text-right md:text-md text-sm">
                              {disabled &&
                              deleteItemLoader === option.service ? (
                                <span className="buttonloader ml-2"></span>
                              ) : (
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  size="lg"
                                  onClick={() => handleDelete(option)}
                                />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* <div className="lg:col-span-1 md:col-span-2">
                  <div
                    className={`card  p-5 ${
                      height
                        ? "md:sticky top-24  lg:py-5 transition-all delay-200"
                        : ""
                    }`}
                  >
                    <h2 className="mb-2 text-lg font-bold">
                      Selected Services
                    </h2>
                    <ul>
                      <li>
                        <div className="mb-2 flex justify-between">
                          <div>Count</div>
                          <div>{5} services</div>
                        </div>
                      </li>

                      <li>
                        <div className="mb-2 flex justify-between">
                          <div>Selected price</div>
                          <div>{price} Rs/-</div>
                        </div>
                      </li>

                      <li>
                        <button
                         
                          className="primary-button flex items-center justify-center  w-full"
                        >
                          Preview{" "}
                         
                        </button>
                      </li>
                    </ul>
                  </div>
                </div> */}
              </>
            ) : (
              <div className="grid place-items-center">
                <p>
                  {t("noPackagesFound")}
                  <br />
                  <Link
                    className="underline text-blue-600"
                    to="/admin/add-services"
                  >
                    {t("clickToAddServices")}
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default MyServices;
