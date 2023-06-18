import React from "react";
import Layout from "../components/navbar/Layout";
import Footer from "../components/footer/Footer";

import useEffectOnce from "../utils/UseEffectOnce";
import { categories, parlourServices } from "../utils/parlourServices";
import { useState, useEffect } from "react";
import Greeting from "../components/navbar/Greeting";
import SIdebar from "../components/navbar/SIdebar";

const Test1 = () => {
  // const [location, setLocation] = useState();
  // const getCurrentPosition = () => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       const geocoder = new window.google.maps.Geocoder();
  //       const latlng = { lat: latitude, lng: longitude };

  //       geocoder.geocode({ location: latlng }, (results, status) => {
  //         if (status === "OK") {
  //           if (results[0]) {
  //             const addressComponents = results[0].address_components;
  //             // Find the colony or locality name
  //             const colony = addressComponents.find(
  //               (component) =>
  //                 component.types.includes("sublocality") ||
  //                 component.types.includes("locality")
  //             );
  //             if (colony) {
  //               alert(colony.long_name);
  //               return colony;
  //             }
  //           } else {
  //             console.log("No results found");
  //           }
  //         } else {
  //           console.log("Geocoder failed due to: " + status);
  //         }
  //       });
  //     },
  //     (error) => {
  //       // Handle any error occurred during geolocation
  //       console.log("Error occurred during geolocation:", error);
  //     },
  //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //   );
  // };

  const [categoriesOptions, setCategoriesOptions] = useState();

  const seats = [1, 2, 3];

  const handleChange = (e) => {
    const result = categories.filter((category, i) =>
      category.category === e.target.value ? category.services : null
    );
    setCategoriesOptions(result[0].services);
  };

  useEffect(() => {
    // getCurrentPosition();
  }, []);

  return (
    <>
      <div className="reserve1 flex flex-col items-start  justify-center space-y-5 ">
        <div className="md:flex md:mx-auto ">
          <div className="px-2 ">
            <p className="py-3 text-xl text-white font-semibold">Categories</p>

            <select className="w-52" onChange={handleChange}>
              <option selected>Select a category</option>
              {parlourServices.map((service, i) => {
                return <option key={i}>{service}</option>;
              })}
            </select>
          </div>{" "}
        </div>

        <div className="  md:w-[70vw]  rContainer2 scrollable-container mx-auto w-[98vw]">
          <p className="py-3 text-xl font-semibold text-white">
            Select Services
          </p>
          <strong className="pb-2 font-semibold text-sm text-red-500">
            Note* You can select multiple seats at a time
          </strong>

          {seats.map((seat, i) => {
            return (
              <div class="relative overflow-x-auto rounded-md py-3">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        Product name
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Price
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Category
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriesOptions?.map((option, i) => {
                      return (
                        <tr
                          key={i}
                          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-white whitespace-nowrap flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              name={option?.name}
                              className="h-6 w-6"
                            />
                            <label className="text-white">{option?.name}</label>
                          </th>
                          <td class="px-6 py-4">{option.price}</td>
                          <td class="px-6 py-4">{option.category}</td>
                          <td class="px-6 py-4">{option.duration}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Test1;
