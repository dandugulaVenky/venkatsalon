import React, { memo, useContext, useState } from "react";
import Carousel from "react-grid-carousel";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBuilding } from "@fortawesome/free-solid-svg-icons";
import baseUrl from "../../utils/client";
import { useTranslation } from "react-i18next";

import Skeleton from "../../utils/Skeleton";
import GetSize from "../../utils/GetSize";
import { useQuery } from "@tanstack/react-query";
import LanguageContext from "../../context/LanguageContext";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../components/axiosInterceptor";
const Categories = ({ type }) => {
  const { type: type1, dispatch } = useContext(SearchContext);

  const { t } = useTranslation();

  const size = GetSize();

  const { user } = useContext(AuthContext);
  // Queries

  const allCitiesArray = [
    {
      cityName: "shadnagar, telangana 509216, india",
      latLng: { lat: 17.065974, lng: 78.2020139 },
    },
    {
      cityName: "kothur, telangana 509228, india",
      latLng: { lat: 17.1544274, lng: 78.2785622 },
    },
    {
      cityName: "thimmapur, telangana 509325, india",
      latLng: { lat: 17.168843, lng: 78.2861414 },
    },
    {
      cityName: "shamshabad, telangana 501218, india",
      latLng: { lat: 17.2444338, lng: 78.3849922 },
    },
  ];

  const shopsCount = async () => {
    return await axiosInstance.get(
      `${baseUrl}/api/hotels/countByCity?cities=shadnagar, telangana 509216, india-kothur, telangana 509228, india-thimmapur, telangana 509325, india-shamshabad, telangana 501218, india&&type=${type1}&&userId=${
        user ? user._id : null
      }`
    );
  };

  const query = useQuery({
    queryKey: ["countshops", { type: type1 }],
    queryFn: shopsCount,
  });

  console.log(query?.data?.data?.list);
  const navigate = useNavigate();

  const handleSearch = (destination) => {
    const destinationCity = allCitiesArray.find(
      (city) => city.cityName === destination
    );
    console.log(destinationCity, "destination");
    const { lat, lng } = destinationCity?.latLng;
    dispatch({
      type: "NEW_SEARCH",
      payload: { type: type1, destination, lat, lng },
    });
    navigate("/shops");
  };

  const handleAllCities = () => {
    navigate("/cities");
  };

  return (
    <>
      <div className=" mt-8 text-black min-w-full ">
        <div className="flex flex-row justify-between">
          <h1 className="px-2.5 md:px-5  md:text-xl font-semibold ">
            {/* {t("browseAreaWise")}{" "} */}
            {type1
              ? // ? locale === "en-US" || locale === "en"
                //   ? t("browseAreaWiseType", {
                //       type1: type1?.charAt(0)?.toUpperCase() + type1?.slice(1),
                //     }) + "s"
                //   : locale === "te"
                //   ? t("browseAreaWiseType", {
                //       type1: type1 === "salon" ? "సెలూన్లు" : "పార్లర్లు",
                //     })
                //   : t("browseAreaWiseType", {
                //       type1: type1 === "salon" ? "सैलून" : "पार्लर",
                //     })

                "Browse Area Wise" +
                " " +
                type1?.charAt(0)?.toUpperCase() +
                type1?.slice(1) +
                "s"
              : "loading"}
          </h1>
          <button
            className="px-5 text-2xl font-semibold pb-2.5"
            onClick={handleAllCities}
          >
            <FontAwesomeIcon icon={faArrowRight} color="#00ccbb" />
          </button>
        </div>
        {query?.data?.data?.list?.length > 0 ? (
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
                      {query?.data?.data?.list?.length > 0
                        ? query?.data?.data?.list[0]
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
                      {query?.data?.data?.list?.length > 0
                        ? query?.data?.data?.list[1]
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
                      {query?.data?.data?.list?.length > 0
                        ? query?.data?.data?.list[2]
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
                      {query?.data?.data?.list?.length > 0
                        ? query?.data?.data?.list[3]
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

      {query?.data?.data?.favourites?.length > 0 ? (
        <div className=" mt-8 text-black min-w-full ">
          <div className="flex flex-row justify-between">
            <h1 className="px-2.5 md:px-5  md:text-xl font-semibold ">
              Your Favourites
            </h1>
            <button
              className="px-5 text-2xl font-semibold pb-2.5"
              onClick={handleAllCities}
            >
              <FontAwesomeIcon icon={faArrowRight} color="#00ccbb" />
            </button>
          </div>

          <div className="">
            <Carousel cols={4} rows={1} gap={7}>
              {query?.data?.data?.favourites?.map((item) => {
                console.log(item);
                return (
                  <Carousel.Item>
                    <div
                      className="relative   h-auto w-full cursor-pointer rounded-md"
                      id="section-id"
                      onClick={() => {
                        navigate(`/shops/${item.shopId}`);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={
                          item?.image?.url ||
                          "https://res.cloudinary.com/duk9xkcp5/image/upload/v1678872396/Hair_cutting_in_salon_illustration_vector_concept_generated_1_ywx6vs.webp"
                        }
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
                      <p className="absolute md:bottom-[2.5rem] bottom-10 left-4 text-white font-bold  text-xl ">
                        {item.shopName}
                      </p>
                      <p className="absolute  bottom-3 left-4 text-white flex items-center justify-center space-x-2  ">
                        {item?.shopLocation?.split(",")[0]}
                      </p>
                    </div>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </div>
        </div>
      ) : !query?.isError ? (
        ""
      ) : (
        <Skeleton cards={size} />
      )}
    </>
  );
};

export default memo(Categories);
