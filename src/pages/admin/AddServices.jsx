import React, { useContext, useEffect } from "react";
import { parlourCategories } from "../../utils/parlourServices";
import { salonCategories } from "../../utils/salonServices";
import { useTranslation } from "react-i18next";

import { useState } from "react";

import baseUrl from "../../utils/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { spaCategories } from "../../utils/spaServices";
import axiosInstance from "../../components/axiosInterceptor";

const AddServices = () => {
  const [categoriesOptions, setCategoriesOptions] = useState();
  const [category, setCategory] = useState();
  const [superCategory, setSuperCategory] = useState();
  const [superCategories, setSuperCategories] = useState();
  const { user } = useContext(AuthContext);
  const [allServices, setAllServices] = useState({
    service: "",
    price: "",
    duration: "",
  });
  const [shopServices, setShopServices] = useState([]);
  const [disabled, setIsDisabled] = useState(false);
  const [shopType, setShopType] = useState();
  const [roomId, setRoomId] = useState();
  const [typeOfPerson, setTypeOfPerson] = useState(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState();

  // useEffect(() => {
  //   const categories =
  //     shopType?.type === "parlour"
  //       ? parlourCategories[typeOfPerson]
  //       : shopType?.type === "salon"
  //       ? salonCategories[typeOfPerson]
  //       : spaCategories[typeOfPerson];

  //   setSuperCategories(categories);

  //   setSuperCategory("regular");
  //   const result = categories?.filter((superCategory, i) =>
  //     superCategory.superCategory === "regular" ? superCategory.services : null
  //   );
  //   setCategories(result);
  // }, [shopType, typeOfPerson]);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(
          `${baseUrl}/api/hotels/find/${user?.shopId}`
        );
        setShopType({
          type: data?.type,
          subType: data?.subType,
        });

        setTypeOfPerson(data?.subType === "unisex" ? "men" : data?.subType);
        const categories =
          shopType?.type === "parlour"
            ? parlourCategories[typeOfPerson]
            : shopType?.type === "salon"
            ? salonCategories[typeOfPerson]
            : spaCategories[typeOfPerson];

        setSuperCategories(categories);

        setSuperCategory("regular");
        const result = categories?.filter((superCategory, i) =>
          superCategory.superCategory === "regular"
            ? superCategory.services
            : null
        );
        setCategories(result);
      } catch (err) {
        toast("Something wrong!");
        console.log(err);
      }
    };
    fetchData();
  }, [shopType?.type, user?.shopId]);

  useEffect(() => {
    console.log("hii");
    const categories =
      shopType?.type === "parlour"
        ? parlourCategories[typeOfPerson]
        : shopType?.type === "salon"
        ? salonCategories[typeOfPerson]
        : spaCategories[typeOfPerson];

    setSuperCategories(categories);

    setSuperCategory("regular");
    const result = categories?.filter((superCategory, i) =>
      superCategory.superCategory === "regular" ? superCategory.services : null
    );
    setCategories(result);
  }, [shopType?.type, typeOfPerson]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(
          `${baseUrl}/api/hotels/room/${user?.shopId}`
        );

        setRoomId(data[0]?._id);
      } catch (err) {
        toast("Something wrong!");
        navigate("/login");
        console.log(err);
      }
    };
    fetchData();
  }, [navigate, user?.shopId]);

  // const handleCategoryChange = (e) => {
  //   setCategory(e.target.value);
  //   const result = categories.filter((category, i) =>
  //     category.superCategory === e.target.value ? category.services : null
  //   );
  //   console.log(result, "res");
  //   setCategoriesOptions(result[0].services);
  // };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    const result = categories.filter((category, i) =>
      category.category === e.target.value ? category.services : null
    );
    setCategoriesOptions(result[0].services);
  };

  const handleSuperCategoryChange = (e) => {
    setSuperCategory(e.target.value);
    const result = superCategories.filter((superCategory, i) =>
      superCategory.superCategory === e.target.value
        ? superCategory.services
        : null
    );
    setCategories(result);
  };

  // const allHandleChange = (e, option) => {
  //   let value = e.target.value;
  //   if (option === "price" || option === "duration") {
  //     value = Number(value);
  //   }
  //   setAllServices((prev) => ({ ...prev, [option]: value }));
  // };
  const allHandleChange = (e, option) => {
    let value = e.target.value;
    setAllServices((prev) => ({ ...prev, [option]: value }));
  };

  const handleSubmit = (e) => {
    if (
      !superCategory ||
      category === "" ||
      allServices.service === "" ||
      Number(allServices.price) === 0 ||
      Number(allServices.duration) === 0
    ) {
      toast("Please check all fields!");

      return;
    }
    const payload = {
      ...allServices,
      price: Number(allServices.price),
      duration: Number(allServices.duration),
    };
    let result = {
      category: category,
      subCategory: typeOfPerson,
      services: payload,
      superCategory,
    };

    if (shopServices?.length > 0) {
      const res = shopServices.map((shopService) => {
        if (
          shopService.category === category &&
          shopService.subCategory === typeOfPerson &&
          shopService.superCategory === superCategory
        ) {
          const existing = shopService.services.service === allServices.service;

          if (existing) {
            toast(`already added! ${shopService.services.service}`);

            return 0;
          } else {
            return 1;
          }
        } else {
          return 1;
        }
      });

      if (res.includes(0)) {
        return null;
      }
    }
    setShopServices((prevServices) => [...prevServices, result]);

    setAllServices({
      service: "",
      price: "",
      duration: "",
    });
  };

  const handleRemove = (removeService) => {
    // console.log(shopServices);
    // console.log(removeService);

    let result = shopServices.filter(
      (item) =>
        !(
          item.category === removeService.category &&
          item.superCategory === removeService.superCategory &&
          item.subCategory === removeService.subCategory &&
          item.services.service === removeService.services.service
        )
    );

    setShopServices(result);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setIsDisabled(true);

    if (shopServices?.length === 0) {
      setIsDisabled(false);

      return alert(t("pleaseIncludeAllFields"));
    }

    let a = shopServices;

    const mergedObj = {};

    a.forEach((item) => {
      const key = JSON.stringify({
        category: item.category,
        subCategory: item.subCategory,
        superCategory: item.superCategory,
      });
      if (mergedObj[key]) {
        mergedObj[key].services.push(item.services);
      } else {
        mergedObj[key] = { ...item, services: [item.services] };
      }
    });

    // Convert the merged object back to an array
    const mergedArray = Object.values(mergedObj).map((item) => {
      item.services = item.services.flat(); // Flatten the services array
      return item;
    });

    const finalMergedServices = mergedArray.map((mergedService) => {
      const ans = mergedService.services.map((service) => {
        return {
          ...service,
          category: mergedService.category,
          subCategory: mergedService.subCategory,
          superCategory: mergedService.superCategory,
        };
      });

      return {
        category: mergedService.category,
        subCategory: mergedService.subCategory,
        superCategory: mergedService.superCategory,

        services: ans,
      };
    });

    try {
      const res = await axiosInstance.post(
        `${baseUrl}/api/rooms/addRoomServices/${roomId}`,
        {
          services: finalMergedServices,
        }
      );

      if (res.status === 201) {
        toast("added successfully!");
        setAllServices(null);
        setIsDisabled(false);

        setTimeout(() => navigate("/admin"), 2000);
      } else {
        toast("Something wrong!");
        setIsDisabled(false);

        return;
      }
    } catch (err) {
      const message = err.response.data.existingServices;
      setIsDisabled(false);

      const show = message.map((res) => res.service);
      // alert(`This services are already present { ${show} }`);
      alert(t("servicesAlreadyPresent", { show: show }));
      //   alert(err);
    }
  };

  const handleTypeOfPerson = (e) => {
    setTypeOfPerson(e.target.value);
    setCategories(null);
    setCategory(null);
    setCategoriesOptions(null);
    setAllServices({
      service: "",
      price: 0,
      duration: 0,
    });
  };

  return (
    <div className="pt-6 pb-20">
      <div className=" md:px-5 px-2.5 min-h-screen">
        <div className="flex md:flex-row flex-col flex-wrap items-center justify-around pb-4 md:space-y-0 space-y-3">
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
              {(shopType?.subType === "unisex" ||
                shopType?.subType === "men") && (
                <option value="men">{t("men")}</option>
              )}
              {(shopType?.subType === "unisex" ||
                shopType?.subType === "women") && (
                <option value="women">{t("women")}</option>
              )}
            </select>
          </div>
          <div className="md:w-auto w-full">
            <div className="flex items-center justify-between">
              <p className="py-2 font-semibold text-lg  ">{t("category")} </p>
              <span className=" bg-[#00ccbb] rounded-full md:px-3.5 px-2.5   md:py-1.5 py-0.5 text-white">
                1
              </span>
            </div>

            <select
              onChange={handleSuperCategoryChange}
              className="border-2 border-[#00ccbb] hidden md:w-auto w-full mx-1"
              value={superCategory}
            >
              <option selected value="">
                Super category
              </option>
              {/* {superCategories?.map((superCategory, i) => {
                return <option key={i}>{superCategory.superCategory}</option>;
              })} */}
              <option>regular</option>;
            </select>
            <select
              onChange={handleCategoryChange}
              className="border-2 border-[#00ccbb]  md:w-auto w-full md:mt-0 mt-3"
              value={category}
            >
              <option selected value="">
                {t("selectCategory")}
              </option>
              {categories?.map((category, i) => {
                return <option key={i}>{category.category}</option>;
              })}
            </select>
          </div>
          <div className="text-lg  text-left text-black md:w-auto w-full">
            <div className="flex items-center justify-between">
              <p className="py-2 font-semibold text-lg  ">
                {t("serviceTitle")}{" "}
              </p>
              <span className=" bg-[#00ccbb] rounded-full md:px-3.5 px-2.5   md:py-1.5 py-0.5 text-white">
                2
              </span>
            </div>
            <select
              onChange={(e) => allHandleChange(e, "service")}
              className="border-2 border-[#00ccbb] w-full md:w-auto"
              value={allServices?.service}
            >
              <option selected>{t("selectService")}</option>
              {categoriesOptions?.map((service, i) => {
                return <option key={i}>{service.name}</option>;
              })}
            </select>
          </div>

          <div className="text-lg  text-left text-black md:w-auto w-full">
            <div className="flex items-center justify-between">
              <p className="py-2 font-semibold text-lg  ">{t("price")} </p>
              <span className=" bg-[#00ccbb] rounded-full md:px-3.5 px-2.5   md:py-1.5 py-0.5 text-white">
                3
              </span>
            </div>
            <input
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  allHandleChange(e, "price");
                }
              }}
              className="border-2 border-[#00ccbb] w-full md:w-auto"
              value={allServices?.price || ""}
              inputMode="numeric" // Suggests numeric keyboard on mobile
              pattern="[0-9]*" // Helps with validation
            />
          </div>

          <div className="text-lg  text-left text-black md:w-auto w-full">
            <div className="flex items-center justify-between">
              <p className="py-2 font-semibold text-lg  ">{t("duration")} </p>
              <span className=" bg-[#00ccbb] rounded-full md:px-3.5 px-2.5   md:py-1.5 py-0.5 text-white">
                4
              </span>
            </div>
            <select
              onChange={(e) => allHandleChange(e, "duration")}
              className="border-2 border-[#00ccbb] w-full md:w-auto"
              value={allServices?.duration}
            >
              <option selected>{t("selectDurationMinutes")}</option>
              {[
                10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140,
                150,
              ].map((duration, i) => {
                return <option key={i}>{duration}</option>;
              })}
            </select>
          </div>
          <div className=" md:w-auto w-full">
            <div className="flex items-center justify-between">
              <p className="py-2 font-semibold md:text-lg ">{t("add")}</p>
              <span className=" bg-[#00ccbb] rounded-full md:px-3.5 px-2.5   md:py-1.5 py-1 text-white">
                5
              </span>
            </div>
            <button
              className="primary-button md:w-auto w-full "
              onClick={handleSubmit}
            >
              {t("addToTable")}
            </button>
          </div>
        </div>
        <p className="py-2 text-red-500">
          Note: Try adding one super category at a time
        </p>
        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 ">
            <thead class="text-xs text-white uppercase bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3">
                  {t("gender")}
                </th>
                <th scope="col" class="px-6 py-3">
                  Super Category
                </th>
                <th scope="col" class="px-6 py-3">
                  {t("categoryName")}{" "}
                </th>
                <th scope="col" class="px-6 py-3">
                  {t("serviceName")}
                </th>
                <th scope="col" class="px-6 py-3">
                  {t("price")}
                </th>
                <th scope="col" class="px-6 py-3">
                  {t("duration")}
                </th>
                <th scope="col" class="px-6 py-3">
                  {t("delete")}
                </th>
              </tr>
            </thead>
            <tbody>
              {shopServices?.length > 0 ? (
                shopServices?.map((service, i) => {
                  return (
                    <tr class="border-b bg-gray-800 text-white" key={i}>
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium  whitespace-nowrap text-white"
                      >
                        {service.subCategory}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium  whitespace-nowrap text-white"
                      >
                        {service.superCategory}
                      </th>
                      <th class="px-6 py-4 ">{service.category}</th>
                      <td class="px-6 py-4 ">{service.services.service}</td>
                      <td class="px-6 py-4">{service.services.price}</td>
                      <td class="px-6 py-4">{service.services.duration}</td>
                      <td class="px-6 py-4">
                        {" "}
                        <FontAwesomeIcon
                          icon={faDeleteLeft}
                          onClick={() => handleRemove(service)}
                          size="lg"
                          color="#00ccbb"
                          className="cursor-pointer"
                        />{" "}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <td className="p-5">{t("notFound")}</td>
              )}
            </tbody>
          </table>
        </div>
        <button
          className="primary-button my-4"
          onClick={handleClick}
          disabled={disabled}
        >
          {disabled ? <span className="buttonloader"></span> : t("confirm")}
        </button>
      </div>
    </div>
  );
};

export default AddServices;
