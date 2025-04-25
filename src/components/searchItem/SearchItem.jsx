import { memo } from "react";
import { Link } from "react-router-dom";

import "./searchItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faLocationDot,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const SearchItem = ({ item }) => {
  return (
    <>
      <Link to={`/shops/${item._id}`}>
        <div
          className=" hover:shadow-xl hover:scale-105 transition duration-300 cursor-pointer mx-4 my-4"
          style={{
            filter: " drop-shadow(0px 0px 0.3px gray)",
          }}
        >
          <div className=" rounded-md bg-slate-100 shadow-custom border-2 border-gray-100">
            <div className="w-full relative">
              <img
                src={
                  item?.images[0]?.url ||
                  "https://picsum.photos/800/600?random=5"
                }
                alt=""
                className="siImg  w-[100%] h-52"
                style={{
                  objectPosition: "top",
                }}
              />
              <p className="absolute right-4 top-3 text-white font-bold  text-xl content break-words">
                {item?.overallShopOffer > 0 && (
                  <span className="bg-green-500 p-3  rounded-full text-sm text-white">
                    {item?.overallShopOffer}% off/-
                  </span>
                )}
              </p>
            </div>
            <div className=" grid grid-cols-12 p-4 text-gray-800 ">
              <div className="space-y-2.5 col-span-8">
                <h1 className=" md:text-md text-sm">
                  {item.name}{" "}
                  <span className="text-xs">
                    <FontAwesomeIcon icon={faCheckCircle} size="sm" />
                  </span>
                </h1>
                <h1 className="text-sm">Category: {item.subType}</h1>
                <span className="text-sm">Type: {item.type}</span>

                <h3 className=" md:flex md:items-center">
                  <span className="text-sm">Desc: {item.desc}</span>
                </h3>
                <h1 className="text-sm siTaxiOp">
                  Reviews : {item.numReviews}
                </h1>
                <p>
                  {" "}
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
                </p>
              </div>
              <div className="flex items-center justify-start space-x-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  color="#00ccbb"
                  size="xs"
                  className="flex-1"
                />
                <p>{item.city.split(",")[0]}</p>
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
