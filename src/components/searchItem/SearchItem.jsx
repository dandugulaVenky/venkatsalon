import { memo } from "react";
import { Link } from "react-router-dom";

import "./searchItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faLocationDot,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { Rating } from "@material-ui/lab";
import { t } from "i18next";

const SearchItem = ({ item }) => {
  return (
    <>
      <Link to={`/shops/${item._id}`}>
        <div
          className=" hover:shadow-xl hover:scale-105 transition duration-300 cursor-pointer  my-4"
          style={{
            filter: " drop-shadow(0px 0px 0.3px gray)",
          }}
        >
          <div className=" rounded-md  shadow-custom border-2 border-gray-100">
            <div className="w-full relative">
              <img
                src={
                  item?.images[0]?.url ||
                  "https://picsum.photos/800/600?random=5"
                }
                alt=""
                className="siImg h-52"
                style={{
                  objectPosition: "top",
                  objectFit: "cover",
                  width: "100%",
                  height: 200,
                  borderRadius: 8,
                  boxShadow: "1px 1.5px 2px black",
                }}
              />
              <p className="absolute right-4 top-3 text-white font-bold  text-xl content break-words">
                {item?.overallShopOffer > 0 && (
                  <span className="bg-green-500 p-3  rounded-md text-sm text-white">
                    {item?.overallShopOffer}% off/-
                  </span>
                )}
              </p>
              <p className="absolute right-4 top-3 text-white font-bold  text-xl content break-words">
                {item?.individualOffer?.length > 0 && (
                  <span className="bg-green-500 p-3  rounded-md text-sm text-white">
                    Offers on Individual Services Available
                  </span>
                )}
              </p>
            </div>
            <div className=" grid grid-cols-12 p-4 gap-2 text-gray-800 ">
              <div className="space-y-2.5 col-span-8">
                <h1 className=" md:text-md text-sm">
                  {item.name}{" "}
                  <span className="text-xs">
                    <FontAwesomeIcon icon={faCheckCircle} size="sm" />
                  </span>
                </h1>
                <h1 className="text-sm">Category: {item.subType}</h1>
                <span className="text-sm">Type: {item.type}</span>

                {/* <p>
                  {item?.individualOffer?.length > 0 && (
                    <div className="mt-2">
                      <h4 className="py-1 text-[#00ccbb] font-semibold">
                        Offers{" "}
                      </h4>
                      <div className="space-y-2">
                        {item.individualOffer.map((item1, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-1 shadow-sm"
                          >
                            <span className="text-xs text-gray-800 font-medium">
                              {item1.service}
                            </span>
                            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                              {item1.offer}% OFF
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </p> */}
              </div>
              <div className="flex flex-col items-start  space-y-2 justify-start mr-1">
                <div className="flex  items-center  space-x-1 justify-center">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    color="#00ccbb"
                    size="xs"
                  />
                  <p>{item.city.split(",")[0]}</p>
                </div>

                <p className="flex items-center justify-start space-x-2">
                  {" "}
                  <span className=" text-gray-700 font-medium pr-1 pt-0.5">
                    {Math.ceil(item.rating)}.0{" "}
                  </span>
                  <FontAwesomeIcon
                    icon={faStar}
                    size="medium"
                    color="#00ccbb"
                  />
                </p>
              </div>

              {/* <div className="siDetail col-span-4">
                <div className="siDetailTexts">
                  <span className="md:text-lg text-sm">
                    Rs.{item.cheapestPrice}
                  </span>
                  <span className="siTaxOp">Includes taxes and fees</span>
                  <span className="siCancelOp">Free cancellation </span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
// jello-horizontal;
export default memo(SearchItem);
