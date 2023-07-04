import React, { useContext, useEffect } from "react";
import {
  parlourCategories,
  parlourServices,
} from "../../utils/parlourServices";
import { salonCategories, salonServices } from "../../utils/salonServices";

import axios from "axios";
import { useState } from "react";
import Layout from "../../components/navbar/Layout";
import Greeting from "../../components/navbar/Greeting";
import Footer from "../../components/footer/Footer";
import baseUrl from "../../utils/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const AddServices = () => {
  const [categoriesOptions, setCategoriesOptions] = useState();
  const [category, setCategory] = useState();
  const { user } = useContext(AuthContext);
  const [allServices, setAllServices] = useState({});
  const [shopServices, setShopServices] = useState([]);
  const [disabled, setIsDisabled] = useState(false);
  const [shopType, setShopType] = useState();
  const [roomId, setRoomId] = useState();
  const navigate = useNavigate();
  const categories =
    shopType === "parlour" ? parlourCategories : salonCategories;
  const services = shopType === "parlour" ? parlourServices : salonServices;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/hotels/find/${user?.shopId}`
        );
        setShopType(data?.type);
      } catch (err) {
        toast("Something wrong!");
        console.log(err);
      }
    };
    fetchData();
  }, [user?.shopId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/hotels/room/${user?.shopId}`
        );

        setRoomId(data[0]?._id);
      } catch (err) {
        toast("Something wrong!");
        console.log(err);
      }
    };
    fetchData();
  }, [user?.shopId]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    const result = categories.filter((category, i) =>
      category.category === e.target.value ? category.services : null
    );
    setCategoriesOptions(result[0].services);
  };

  const allHandleChange = (e, option) => {
    let value = e.target.value;
    if (option === "price" || option === "duration") {
      value = Number(value);
    }
    setAllServices((prev) => ({ ...prev, [option]: value }));
  };

  const handleSubmit = (e) => {
    setIsDisabled(true);
    if (
      category === "" ||
      allServices.service === "" ||
      allServices.price === "" ||
      allServices.price === 0 ||
      allServices.duration === "" ||
      allServices.duration === 0
    ) {
      toast("Please check all fields!");

      return;
    }

    let result = {
      category: category,
      services: allServices,
    };

    if (shopServices.length > 0) {
      const res = shopServices.map((shopService) => {
        if (shopService.category === category) {
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
      console.log(res);
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

  const handleClick = async (e) => {
    e.preventDefault();
    setIsDisabled(true);

    if (shopServices?.length === 0) {
      setIsDisabled(false);

      return alert("Please include all fields!");
    }

    let a = shopServices;

    let groupedServices = a.reduce((accumulator, item) => {
      const { category, services } = item;

      if (!accumulator[category]) {
        accumulator[category] = {
          category: category,
          services: [],
        };
      }

      accumulator[category].services.push(services);

      return accumulator;
    }, {});

    // Step 2: Convert the grouped services object into an array
    let mergedServices = Object.values(groupedServices);

    const finalMergedServices = mergedServices.map((mergedService) => {
      const ans = mergedService.services.map((service) => {
        return {
          ...service,
          category: mergedService.category, // Add a new key-value pair
        };
      });

      return {
        category: mergedService.category,
        services: ans,
      };
    });

    try {
      const res = await axios.post(
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
      alert(`This services are already present { ${show} }`);
      //   alert(err);
    }
  };
  let w = window.innerWidth;
  return (
    <div>
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}
      <div className="md:py-10 px-5 min-h-screen">
        <div className="flex md:flex-row flex-col flex-wrap items-center justify-around py-10 md:space-y-0 space-y-3">
          <div className="space-x-2">
            <span className=" bg-[#00ccbb] rounded-full px-3 py-1.5 text-white">
              1
            </span>
            <select
              onChange={handleCategoryChange}
              className="border-2 border-[#00ccbb] w-full md:w-auto "
              value={category}
            >
              <option selected value="">
                Select a category
              </option>
              {services.map((service, i) => {
                return <option key={i}>{service}</option>;
              })}
            </select>
          </div>
          <div className="space-x-2">
            <span className=" bg-[#00ccbb] rounded-full px-3 py-1.5 text-white">
              2
            </span>
            <select
              onChange={(e) => allHandleChange(e, "service")}
              className="border-2 border-[#00ccbb] w-full md:w-auto"
              value={allServices?.service}
            >
              <option selected>Select a service</option>
              {categoriesOptions?.map((service, i) => {
                return <option key={i}>{service.name}</option>;
              })}
            </select>
          </div>

          <div className="space-x-2">
            <span className=" bg-[#00ccbb] rounded-full px-3 py-1.5 text-white">
              3
            </span>
            <select
              onChange={(e) => allHandleChange(e, "price")}
              className="border-2 border-[#00ccbb] w-full md:w-auto"
              value={allServices?.price}
            >
              <option selected>Select price</option>
              {[
                100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200,
                1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000,
              ].map((price, i) => {
                return <option key={i}>{price}</option>;
              })}
            </select>
          </div>

          <div className="space-x-2">
            <span className=" bg-[#00ccbb] rounded-full px-3 py-1.5 text-white">
              4
            </span>
            <select
              onChange={(e) => allHandleChange(e, "duration")}
              className="border-2 border-[#00ccbb] w-full md:w-auto"
              value={allServices?.duration}
            >
              <option selected>Select duration in minutes</option>
              {[
                10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140,
                150,
              ].map((duration, i) => {
                return <option key={i}>{duration}</option>;
              })}
            </select>
          </div>
          <button className="primary-button" onClick={handleSubmit}>
            Add To Table
          </button>
        </div>
        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 ">
            <thead class="text-xs text-white uppercase bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Category Name{" "}
                </th>
                <th scope="col" class="px-6 py-3">
                  Service Name
                </th>
                <th scope="col" class="px-6 py-3">
                  Price
                </th>
                <th scope="col" class="px-6 py-3">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {shopServices?.length > 0
                ? shopServices.map((service, i) => {
                    return (
                      <tr class="border-b bg-gray-800 text-white" key={i}>
                        <th
                          scope="row"
                          class="px-6 py-4 font-medium  whitespace-nowrap text-white"
                        >
                          {service.category}
                        </th>
                        <td class="px-6 py-4 ">{service.services.service}</td>
                        <td class="px-6 py-4">{service.services.price}</td>
                        <td class="px-6 py-4">{service.services.duration}</td>
                      </tr>
                    );
                  })
                : "Not Found"}
            </tbody>
          </table>
        </div>
        <button
          className="primary-button my-4"
          onClick={handleClick}
          disabled={disabled}
        >
          Confirm
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default AddServices;
