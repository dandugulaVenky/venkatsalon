import { memo } from "react";
import { Link } from "react-router-dom";

import "./searchItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const SearchItem = ({ item }) => {
  return (
    <>
      <Link to={`/shops/${item._id}`}>
        <div
          className=" hover:shadow-xl hover:scale-105 transition duration-300 cursor-pointer mx-4"
          style={{
            filter: " drop-shadow(0px 0px 0.3px gray)",
          }}
        >
          <div className=" list rounded-md">
            <div className="w-full">
              <img
                src={item?.images[0]?.url}
                alt=""
                className="siImg w-full h-52"
              />
            </div>
            <div className=" grid grid-cols-12 p-5  ">
              <div className="space-y-2.5 col-span-8">
                <h1 className=" md:text-md text-sm">
                  {item.name}{" "}
                  <span className="text-xs">
                    <FontAwesomeIcon icon={faCheckCircle} size="sm" />
                  </span>
                </h1>
                <h1 className=" md:flex md:items-center">
                  {" "}
                  <FontAwesomeIcon
                    icon={faMapLocationDot}
                    className="mr-1 lg:text-[20px] md:text-[14px]"
                    size="sm"
                  />
                  <span className="text-sm"> {item.distance}m from center</span>
                </h1>
                <h1 className="text-sm siTaxiOp">
                  Reviews : {item.numReviews}
                </h1>
              </div>
              <div className="siDetail col-span-4">
                <div className="siDetailTexts">
                  <span className="md:text-lg text-sm">
                    Rs.{item.cheapestPrice}
                  </span>
                  <span className="siTaxOp">Includes taxes and fees</span>
                  <span className="siCancelOp">Free cancellation </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
// jello-horizontal;
export default memo(SearchItem);
