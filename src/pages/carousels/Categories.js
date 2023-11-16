import React, { memo, useContext, useState } from "react";
import Carousel from "react-grid-carousel";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";

import { useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBuilding } from "@fortawesome/free-solid-svg-icons";
import baseUrl from "../../utils/client";
import { useTranslation } from "react-i18next";

import Skeleton from "../../utils/Skeleton";
import GetSize from "../../utils/GetSize";
import { useQuery } from "@tanstack/react-query";
import LanguageContext from "../../context/LanguageContext";
const Categories = ({ type }) => {
  const { type: type1, dispatch } = useContext(SearchContext);

  const [data, setData] = useState([]);
  const { t } = useTranslation();

  const size = GetSize();
  const { locale, setLocale } = useContext(LanguageContext);

  // Queries

  const shopsCount = async () => {
    return await axios.get(
      `${baseUrl}/api/hotels/countByCity?cities=shadnagar, telangana 509216, india-kothur, telangana 509228, india-thimmapur, telangana 509325, india-shamshabad, telangana 501218, india&&type=${type1}`
    );
  };

  const query = useQuery({
    queryKey: ["countshops", { type: type1 }],
    queryFn: shopsCount,
  });

  const navigate = useNavigate();

  const handleSearch = (destination) => {
    dispatch({
      type: "NEW_SEARCH",
      payload: { type: type1, destination },
    });
    navigate("/shops");
  };

  const handleAllCities = () => {
    navigate("/cities");
  };
  return (
    <div className=" mt-8 text-black min-w-full ">
      <div className="flex flex-row justify-between">
        <h1 className="px-2.5 md:px-5  md:text-xl font-semibold ">
          {t("browseAreaWise")}{" "}
          {type1
            ? // ? type1?.charAt(0)?.toUpperCase() + type1?.slice(1) + "s"
              // t("browseAreaWiseType", {
              //   type1: type1?.charAt(0)?.toUpperCase(), type2: type1?.slice(1),
              // }) 
              locale === "en" ?
              t('browseAreaWiseType',{ type1: type1?.charAt(0)?.toUpperCase(), type2: type1?.slice(1)}) 
              : locale === "te" ?  t('browseAreaWiseType',{type1:type1 === "saloon" ? "సెలూన్లు"  : "పార్లర్లు" })
              :  t('browseAreaWiseType',{type1:type1 === "saloon" ? "सैलून" : "पार्लर"})
            : "loading"}
        </h1>
        <button
          className="px-5 text-2xl font-semibold pb-2.5"
          onClick={handleAllCities}
        >
          <FontAwesomeIcon icon={faArrowRight} color="#00ccbb" />
        </button>
      </div>
      {query?.data?.data?.length > 0 ? (
        <div className="">
          <Carousel cols={4} rows={1} gap={7}>
            <Carousel.Item>
              <div
                className="relative   h-auto w-full cursor-pointer rounded-md"
                id="section-id"
                onClick={() => {
                  handleSearch("shadnagar, telangana 509216, india");
                }}
                style={{ cursor: "pointer" }}
              >
                <img
                  src="https://picsum.photos/800/600?random=5"
                  alt="images"
                  style={{
                    width: "98%",
                    height: 170,
                    // filter: "brightness(70%) drop-shadow(0px 0px 2px black)",
                    boxShadow: "1px 1.5px 2px black",

                    objectFit: "cover",
                    objectPosition: "right bottom",
                    borderRadius: 7,
                  }}
                />
                <p className="absolute md:bottom-[2.65rem] bottom-10 left-4 text-white font-bold  text-xl ">
                  {t("shadnagar")}
                </p>
                <p className="absolute  bottom-4 left-4 text-white flex items-center justify-center space-x-2  ">
                  <FontAwesomeIcon icon={faBuilding} size="lg" />
                  <span className="font-semibold">
                    {query?.data?.data?.length > 0
                      ? query?.data?.data[0]
                      : "Loading"}{" "}
                    {t("shops")}
                  </span>
                </p>
              </div>
            </Carousel.Item>

            {/* ... */}

            <Carousel.Item>
              <div
                className="relative   h-44 w-full cursor-pointer rounded-md"
                id="section-id"
                onClick={() => {
                  handleSearch("kothur, telangana 509228, india");
                }}
                style={{ cursor: "pointer" }}
              >
                <img
                  src="https://picsum.photos/800/600?random=4"
                  alt="images"
                  style={{
                    width: "98%",
                    height: 170,
                    boxShadow: "1px 1.5px 2px black",

                    objectFit: "cover",
                    objectPosition: "right bottom",
                    borderRadius: 8,
                  }}
                />
                <p className="absolute md:bottom-[2.65rem] bottom-10 left-4 text-white font-bold  text-xl ">
                  {t("kothur")}
                </p>
                <p className="absolute  bottom-4 left-4 text-white flex items-center justify-center space-x-2  ">
                  <FontAwesomeIcon icon={faBuilding} size="lg" />
                  <span className="font-semibold">
                    {query?.data?.data?.length > 0
                      ? query?.data?.data[1]
                      : "Loading"}{" "}
                    {t("shops")}
                  </span>
                </p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div
                className="relative   h-44 w-full cursor-pointer rounded-md"
                id="section-id"
                onClick={() => {
                  handleSearch("thimmapur, telangana 509325, india");
                }}
                style={{ cursor: "pointer" }}
              >
                <img
                  src="https://picsum.photos/800/600?random=3"
                  alt="images"
                  style={{
                    width: "98%",
                    height: 170,
                    boxShadow: "1px 1.5px 2px black",

                    objectFit: "cover",
                    objectPosition: "right bottom",
                    borderRadius: 8,
                  }}
                />
                <p className="absolute md:bottom-[2.65rem] bottom-10 left-4 text-white font-bold  text-xl ">
                  {t("thimmapur")}
                </p>
                <p className="absolute  bottom-4 left-4 text-white flex items-center justify-center space-x-2  ">
                  <FontAwesomeIcon icon={faBuilding} size="lg" />
                  <span className="font-semibold">
                    {query?.data?.data?.length > 0
                      ? query?.data?.data[2]
                      : "Loading"}{" "}
                    {t("shops")}
                  </span>
                </p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div
                className="relative   h-44 w-full cursor-pointer rounded-md"
                id="section-id"
                onClick={() => {
                  handleSearch("shamshabad, telangana 501218, india");
                }}
                style={{ cursor: "pointer" }}
              >
                <img
                  src="https://picsum.photos/800/600?random=2"
                  alt="images"
                  style={{
                    width: "98%",
                    height: 170,
                    boxShadow: "1px 1.5px 2px black",

                    objectFit: "cover",
                    objectPosition: "right bottom",
                    borderRadius: 8,
                  }}
                />
                <p className="absolute md:bottom-[2.65rem] bottom-10 left-4 text-white font-bold  text-xl ">
                  {t("shamshabad")}
                </p>
                <p className="absolute  bottom-4 left-4 text-white flex items-center justify-center space-x-2  ">
                  <FontAwesomeIcon icon={faBuilding} size="lg" />
                  <span className="font-semibold">
                    {query?.data?.data?.length > 0
                      ? query?.data?.data[3]
                      : "Loading"}{" "}
                    {t("shops")}
                  </span>
                </p>
              </div>
            </Carousel.Item>

            {/* ... */}
          </Carousel>
        </div>
      ) : !query?.isError ? (
        <Skeleton cards={size} />
      ) : (
        "Fetching Error!"
      )}
    </div>
  );
};

export default memo(Categories);