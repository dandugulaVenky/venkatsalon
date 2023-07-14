import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";
import SIdebar from "../../components/navbar/SIdebar";
import Greeting from "../../components/navbar/Greeting";
import Footer from "../../components/footer/Footer";
import Layout from "../../components/navbar/Layout";

const AllCities = () => {
  const { type: type1, dispatch } = useContext(SearchContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allCitiesArray = [
    { cityName: "shadnagar" },
    { cityName: "kothur" },
    { cityName: "shamshabad" },
    { cityName: "kothur" },
  ];

  const [userInput, setUserInput] = useState("");
  function filterArray(array, userInput) {
    if (!userInput) {
      return array;
    }
    return array?.filter((city) => {
      return city.cityName.toLowerCase().includes(userInput.toLowerCase());
    });
  }
  const filteredArray = filterArray(allCitiesArray, userInput);
  const handleNavigateCity = (destination) => {
    dispatch({
      type: "NEW_SEARCH",
      payload: { type: type1, destination },
    });
    navigate("/shops", { state: { destination } });
  };

  let w = window.innerWidth;
  const { open } = useContext(SearchContext);

  return (
    <>
      {open && <SIdebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}

      <div className="w-full md:mx-auto md:max-w-xl lg:max-w-3xl xl:max-w-6xl">
        <div className="flex flex-col py-10 space-y-2 mx-3">
          <label> City </label>
          <input
            type="text"
            className="w-64 rounded-md"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
            placeholder="Search city name"
          />
        </div>

        <div className=" min-h-screen w-full pb-24 md:pt-0 pt-2">
          <>
            <div className="grid grid-cols-12 md:gap-3 gap-8 ">
              {filteredArray.map((city) => {
                return (
                  <div
                    className="flex items-center justify-center h-52  lg:col-span-4 md:col-span-5 col-span-12 mx-4  
                          cursor-pointer
                         rounded-lg hover:shadow-2xl hover:scale-105 transition duration-300
                         bg-[url('https://picsum.photos/800/600?random=5')] bg-center bg-cover bg-no-repeat
                         "
                    onClick={() => handleNavigateCity(city.cityName)}
                  >
                    <p className="text-white font-bold  text-xl w-full text-center content break-words ">
                      {city.cityName}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default AllCities;
