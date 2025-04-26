import React, { memo, useContext } from "react";

import Carousel from "react-grid-carousel";
import { SearchContext } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faStar } from "@fortawesome/free-solid-svg-icons";
import "./styles.scss";
import baseUrl from "../../utils/client";

import Skeleton from "../../utils/Skeleton";
import GetSize from "../../utils/GetSize";
import { useTranslation } from "react-i18next";
import LanguageContext from "../../context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../components/axiosInterceptor";

const OffersForYou = ({ smallBanners }) => {
  const columns = smallBanners ? 10 : 4;

  const { type: type1, city, pincode, lat, lng } = useContext(SearchContext);

  const { t } = useTranslation();
  const { locale, setLocale } = useContext(LanguageContext);

  const getBestSalons = async () => {
    return await axiosInstance.get(
      `${baseUrl}/api/hotels/offerShops?type=${type1 ? type1 : "salon"}&lat=${
        lat ? lat : 0.0
      }&lng=${lng ? lng : 0.0}&limit=4`
    );
  };
  const size = GetSize();

  // Queries
  const query = useQuery({
    queryKey: ["bestsalons1", { type: type1, city }],
    queryFn: getBestSalons,
  });

  const navigate = useNavigate();
  const gotoHotel = (hotel) => {
    navigate(`/shops/${hotel}`);
  };

  const handleAllShops = () => {
    navigate(`/shops/with-offers`);
  };
  // mt-8 used to  be there
  return (
    <div className=" mt-8 text-black w-full  ">
      <div className="flex flex-row justify-between">
        <h1 className=" px-2.5 md:px-5 md:text-xl font-semibold pb-3">
          {type1 ? (
            // locale === "en-US" || locale === "en" ? (
            //   t("typeForYou", {
            //     type1: type1?.charAt(0)?.toUpperCase() + type1?.slice(1),
            //   })
            // ) : locale === "te" ? (
            //   t("typeForYou", {
            //     type1:
            //       type1 === "salon"
            //         ? "సెలూన్లు"
            //         : type1 === "parlour"
            //         ? "పార్లర్లు"
            //         : "స్పా",
            //   })
            // ) : (
            //   t("typeForYou", {
            //     type1:
            //       type1 === "salon"
            //         ? "सैलून"
            //         : type1 === "parlour"
            //         ? "पार्लर"
            //         : "स्पा",
            //   })
            // )

            "Offers For You"
          ) : (
            <Skeleton cards={1} />
          )}
        </h1>
        <button
          className="px-5 text-2xl font-semibold pb-2.5"
          onClick={handleAllShops}
        >
          <FontAwesomeIcon icon={faArrowRight} color="#00ccbb" />
        </button>
      </div>
      {query?.isLoading ? (
        <Skeleton cards={size} />
      ) : query?.data?.data?.length > 0 ? (
        <div>
          <Carousel cols={columns} rows={1} gap={7}>
            {query?.data?.data &&
              query?.data?.data?.map((item, i) => {
                const cityName = item.city.split(",")[0];
                return (
                  <Carousel.Item key={i}>
                    <>
                      <div
                        className="relative h-44 w-full cursor-pointer rounded-md slide-in-left"
                        id="section-id"
                        onClick={() => gotoHotel(item._id)}
                      >
                        <img
                          src={
                            item.images[0]?.url ||
                            "https://res.cloudinary.com/duk9xkcp5/image/upload/v1678872396/Hair_cutting_in_salon_illustration_vector_concept_generated_1_ywx6vs.webp"
                          }
                          alt="images"
                          style={{
                            width: "98%",
                            height: 170,
                            boxShadow: "1px 1.5px 2px black",
                            filter: "brightness(70%)",

                            objectFit: "cover",
                            objectPosition: "right top",
                            borderRadius: 8,
                          }}
                        />
                        <p className="absolute md:bottom-[2.55rem] bottom-11 left-4 text-white font-bold  text-xl content break-words">
                          {/* {item.name} */}
                          {t("salonName", { name: item.name })}
                        </p>
                        <p className="absolute right-4 top-3 text-white font-bold  text-xl content break-words">
                          {item?.overallShopOffer > 0 && (
                            <span className="bg-green-500 p-3  rounded-full text-sm text-white">
                              {item?.overallShopOffer}% off/-
                            </span>
                          )}
                        </p>
                        <p className="absolute  bottom-4 left-4 text-white flex items-center justify-center space-x-2  ">
                          <span className="font-semibold">
                            {Math.ceil(item.rating)}{" "}
                          </span>
                          <FontAwesomeIcon icon={faStar} size="lg" />
                        </p>
                      </div>
                      <p className="pl-1 font-semibold text-gray-700 ">
                        {cityName}{" "}
                      </p>
                      {item?.individualOffer?.length > 0 &&
                        item?.individualOffer?.slice(0, 2).map((item1) => {
                          return (
                            <p className="text-xs text-gray-600">
                              {item1?.service} - {item1?.offer}%
                            </p>
                          );
                        })}
                      <span className="text-xs text-gray-600">
                        Click on shop and explore more offers
                      </span>
                    </>
                  </Carousel.Item>
                );
              })}

            {/* ... */}
          </Carousel>
        </div>
      ) : (
        <div className="flex items-center justify-center md:space-x-5 space-x-3 ">
          <img
            src="https://cdn.dribbble.com/userupload/2641500/file/original-b2b4da3f25a13ff275d03cd646d1fec3.png?compress=1&resize=1200x900"
            alt="no results"
            height={100}
            width={200}
            style={{
              borderRadius: 8,
              boxShadow: "1px 1.5px 2px black",
              filter: "brightness(70%)",
            }}
          ></img>
          <p className="text-black md:text-xl text-xs font-semibold">
            {locale === "en-US" || locale === "en"
              ? t("noTypeFound", {
                  type1: type1?.charAt(0)?.toUpperCase() + type1?.slice(1),
                })
              : locale === "te"
              ? t("noTypeFound", {
                  type1: type1 === "salon" ? "సెలూన్లు" : "పార్లర్లు",
                })
              : t("noTypeFound", {
                  type1: type1 === "salon" ? "सैलून" : "पार्लर",
                })}
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(OffersForYou);
