import moment from "moment";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import { SearchContext } from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch";
import "./searchItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const SearchItem = ({ item }) => {
  return (
      <div className="grid-flow-row lg:grid-cols-3">
        <div className="col-span-1 list rounded-md grid">
          <div className="">
            <img src={item.photos[0]} alt="" className="siImg" />
          </div>
          <div className="md:space-y-2 space-y-0.5 flex justify-between p-4">
            <div>
              <h1 className=" md:text-lg text-sm">
                {item.name}{" "}
                <span className="text-xs">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
              </h1>
              <span className="siDistance md:flex md:items-center ">
              {" "}
                <FontAwesomeIcon
                    icon={faMapLocationDot}
                    className="mr-1 lg:text-[30px] md:text-[18px]"
                />
              <span> {item.distance}m from center</span>
            </span>
              <span className="siTaxiOp px-2 md:text-sm ">
              Reviews : {item.numReviews}
            </span>
            </div>
            <div className="siDetail">
              <div className="siDetailTexts">
                <span className="md:text-lg text-sm">Rs.{item.cheapestPrice}</span>
                <span className="siTaxOp">Includes taxes and fees</span>
                <span className="siCancelOp">Free cancellation </span>

              </div>
            </div>
          </div>
          <div className="p-4">
            <Link to={`/shops/${item._id}`}>
              <button
                  className="siCheckButton w-full jello-horizontal">Book</button>
            </Link>
          </div>
        </div>
      </div>
  );
};

export default SearchItem;