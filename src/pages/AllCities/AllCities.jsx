import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AllCities = () => {
  const { type: type1, dispatch } = useContext(SearchContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allCitiesArray = [
    { cityName: "shadnagar, telangana 509216, india" },
    { cityName: "kothur, telangana 509228, india" },
    { cityName: "thimmapur, telangana 509325, india" },
    { cityName: "shamshabad, telangana 501218, india" },
  ];

  const [userInput, setUserInput] = useState("");
  const { t } = useTranslation();

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
    navigate("/shops");
  };

  return (
    <div className="pt-6 pb-20">
      <div className="w-full md:mx-auto md:max-w-xl lg:max-w-3xl xl:max-w-6xl">
        <div className="flex pb-8 items-centerspace-x-2 md:mx-0 mx-3">
          <label>{t("city")}:</label>
          <input
            type="text"
            className="w-full md:w-[80%] mx-auto col-span-12 rounded-full p-2 text-center"
            style={{
              filter: " drop-shadow(0px 0px 0.35px gray)",
              border: "2.4px solid gray",
              caretColor: "#00ccbb",
            }}
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
            placeholder={t("searchCityName")}
          />
        </div>

        <div className=" min-h-screen w-full pb-24 md:pt-0 pt-2 ">
          <>
            <div className="grid grid-cols-12 md:gap-6 gap-4 md:mx-0 mx-3">
              {filteredArray.map((city, i) => {
                return (
                  <div
                    className={`flex items-center justify-center md:h-14 h-14 lg:col-span-4 md:col-span-5 col-span-6 
                          cursor-pointer
                         rounded-lg hover:shadow-2xl hover:scale-105 transition duration-300
                         border-2 shadow-custom border-gray-200
                         `}
                    // style={{
                    //   filter: "drop-shadow(0px 0px 5px black)",
                    // }}
                    onClick={() => handleNavigateCity(city.cityName)}
                  >
                    <p className="text-black font-bold  text-xl w-full text-center content break-words ">
                      {city.cityName.split(",")[0]}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        </div>
      </div>
    </div>
  );
};
export default AllCities;
