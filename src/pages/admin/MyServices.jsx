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
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";

const MyServices = () => {
  const [categoriesOptions, setCategoriesOptions] = useState();
  const [categories, setCategories] = useState();

  const { user } = useContext(AuthContext);

  let w = window.innerWidth;

  const [loading, setLoading] = useState(false);

  const [height, setHeight] = useState(false);

  const [parlourServices, setParlourServices] = useState();

  const [edit, setEdit] = useState(false);

  const [showInclusions, setShowInclusions] = useState();

  const [addRemoveServices, setAddRemoveServices] = useState([]);

  //these cann add services are used to only select which are not there in the admin provided services

  const [canAddServices, setCanAddServices] = useState([]);

  const [allServices, setAllServices] = useState([]);
  const [roomId, setRoomId] = useState();
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();
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
      const { data } = await axios.get(
        `${baseUrl}/api/hotels/room/${user?.shopId}`
      );
      const parlourServices = (data[0]?.parlourServices || []).reduce(
        (arr, item) => {
          arr.push(item.category);
          return arr;
        },
        []
      );

      const mergedServices = data[0]?.parlourServices
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
      setParlourServices(parlourServices);
      setCategories(data[0]?.parlourServices);
      setLoading(true);
    };
    fetchData();
  }, [user?.shopId, showInclusions, edit, deleted]);

  const handleChange = (e) => {
    const result = categories.filter((category, i) =>
      category.category === e.target.value ? category.services : null
    );
    setCategoriesOptions(result[0]?.services);
  };

  const handleEdit = (j, option) => {
    setEdit(j);
    setEditedService({
      service: option.service,
      price: option.price,
      duration: option.duration,
    });
  };
  const [editedService, setEditedService] = useState({});

  const handleDelete = async (option) => {
    const confirmed = window.confirm("Are you sure you want to delete?");

    if (confirmed) {
      const res = await axios.post(
        `${baseUrl}/api/rooms/deleteRoomService/${roomId}`,
        {
          service: option,
        },
        { withCredentials: true }
      );

      if (res.status === 201) {
        setShowInclusions(null);
        setEdit(null);
        toast("deleted successfully!");
        setDeleted(!deleted);
      } else {
        toast(res.data.message);
        return;
      }
    } else {
      return;
    }
  };

  const handleInput = (e, option) => {
    let value = e.target.value;
    if (option === "price" || option === "duration") {
      value = Number(value);
    }
    setEditedService((prev) => ({ ...prev, [option]: value }));
  };

  // to add edited service data to backend

  const handleAdd = async (e) => {
    e.preventDefault();

    const category = allServices.find(
      (service) => service.service === editedService.service
    );
    const { status } = await axios.post(
      `${baseUrl}/api/rooms/updateRoomService/${roomId}`,
      {
        editedService,
        category: category.category,
      },
      { withCredentials: true }
    );

    if (status === 201) {
      toast("Service edited successfully!");
      setEdit(null);
      setDeleted(!deleted);
    } else {
      toast("something went wrong!");
    }
  };

  // to add inclusions to show package inclusions

  const handleInclusions = (e, option) => {
    e.preventDefault();

    setShowInclusions({
      inclusions: option.inclusions,
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
    const finalArr = {
      services: addRemoveServices,
    };

    if (finalArr.services.length >= 2) {
      try {
        const { status } = await axios.post(
          `${baseUrl}/api/rooms/updateRoomPackageServices/${roomId}`,
          { finalArr, updatePackage: showInclusions.package },
          { withCredentials: true }
        );
        if (status === 201) {
          toast("Edited Successfully!");
          setShowInclusions(null);
          setAddRemoveServices(null);
          setCategoriesOptions(null);
          setCanAddServices(null);
        }
      } catch (err) {
        toast("Something wrong!");
      }
    } else {
      return toast("Please add atleast two services!");
    }
  };

  return (
    <>
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}
      {showInclusions?.inclusions?.length > 0 ? (
        <div className="reserve">
          <div className="overflow-x-auto  ">
            <FontAwesomeIcon
              icon={faClose}
              size="lg"
              onClick={() => {
                setShowInclusions(null);
                setCanAddServices(null);
                setAddRemoveServices(null);
              }}
              className="float-right text-white"
            />
            {addRemoveServices?.length > 0 ? (
              <>
                {canAddServices?.length > 0 && (
                  <select
                    className="my-2 p-2 ml-2"
                    onChange={(e) => {
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
                    <option>Select a service</option>
                    {canAddServices.map((service, i) => {
                      return (
                        <option value={service.service} key={i}>
                          {service.service}
                        </option>
                      );
                    })}
                  </select>
                )}
                <table className="min-w-[70vw] ">
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

                      <th className="md:p-5 p-4  md:text-md text-sm text-right">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {addRemoveServices?.map((option, j) => {
                      return (
                        <tr key={j} className="border-b-2 border-white">
                          <td className="md:text-md text-sm flex items-center justify-start p-5 space-x-2">
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
                              {option.duration} min
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
                  Confirm Add Services
                </button>
              </>
            ) : (
              <>
                <button
                  className="primary-button my-3"
                  onClick={handleAddOrRemove}
                >
                  Add / Remove Service
                </button>
                <table className="min-w-[70vw] ">
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
                    {showInclusions?.inclusions?.map((option, j) => {
                      return (
                        <tr key={j} className="border-b-2 border-white">
                          <td className="md:text-md text-sm flex items-center justify-start p-5 space-x-2">
                            <label className="text-white">
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
                              {option.duration} min
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
        <div className="pb-10 min-h-screen md:w-[90vw] w-[95.5vw] mx-auto">
          <p className="float-right bg-gray-50 p-4 rounded-md font-bold">
            Total Services : {allServices?.length}
          </p>
          <div className="mb-2 py-5 flex items-center justify-start flex-wrap min-w-full">
            <h2 className="text-lg font-bold  text-left text-black ml-2">
              <p className="py-1 text-md text-black font-semibold">
                Categories
              </p>

              <select className="w-52" onChange={handleChange}>
                <option selected>Select a category</option>
                {parlourServices?.map((service, i) => {
                  return <option key={i}>{service}</option>;
                })}
              </select>
            </h2>
          </div>
          <div className="grid md:grid-cols-5 lg:grid-cols-4 lg:gap-5 md:gap-5   ">
            {allServices?.length > 0 ? (
              <>
                {" "}
                <div className="overflow-x-auto  col-span-5">
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
                        {
                          <th className="md:p-5 p-4  md:text-md text-sm text-right">
                            Inclusions
                          </th>
                        }
                        <th className="md:p-5 p-4  md:text-md text-sm text-right">
                          Edit
                        </th>{" "}
                        <th className="md:p-5 p-4  md:text-md text-sm text-right">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriesOptions?.map((option, j) => {
                        return (
                          <tr key={j} className="border-b-2 border-white">
                            <td className="md:text-md text-sm flex items-center justify-start p-5 space-x-2">
                              <label className="text-gray-900 font-extrabold">
                                {option.service}
                              </label>
                            </td>
                            <td className="p-5 text-right md:text-md text-sm">
                              {edit === j ? (
                                <input
                                  type="text"
                                  value={editedService.price}
                                  onChange={(e) => handleInput(e, "price")}
                                />
                              ) : (
                                <label className="text-gray-900">
                                  &#8377; {option.price}
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
                                  {option.duration} min
                                </label>
                              )}
                            </td>
                            {option.category === "packages" ? (
                              <td className="p-5 text-right md:text-md text-sm">
                                {
                                  <label
                                    className="text-gray-900 underline"
                                    onClick={(e) => handleInclusions(e, option)}
                                  >
                                    show inclusions
                                  </label>
                                }
                              </td>
                            ) : (
                              <td className="p-5 text-right md:text-md text-sm">
                                <label>No inclusions</label>
                              </td>
                            )}
                            <td className="p-5 text-right md:text-md text-sm">
                              {edit === j ? (
                                <div className="flex items-center justify-end space-x-1">
                                  <button
                                    className="px-3 py-1.5 bg-blue-600 rounded-md"
                                    onClick={handleAdd}
                                  >
                                    Add
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
                              <FontAwesomeIcon
                                icon={faTrash}
                                size="lg"
                                onClick={() => handleDelete(option)}
                              />
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
                  No Packages found!
                  <br />
                  <Link
                    className="underline text-blue-600"
                    to="/admin/add-services"
                  >
                    Click here to add services
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
