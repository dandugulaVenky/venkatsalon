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
    <div className="searchItem list ">
      <div className="siDesc">
        {/* <h1 id="report" className="text-red-500 text-xs">
          .
        </h1> */}
        <div className="flex space-x-2">
          <img src={item.photos[0]} alt="" className="siImg" />

          <div className="flex flex-col md:space-y-2 space-y-0.5 ">
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
        </div>

        <div className="flex items-center justify-start space-x-2">
          <span className="siCancelOp">Free cancellation </span>
        </div>
        <span className="siFeatures">{item.desc}</span>

        {/* <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span> */}
      </div>
      <div className="siDetails">
        <div className="siDetailTexts">
          <span className="md:text-lg text-sm">Rs.{item.cheapestPrice}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <Link to={`/shops/${item._id}`}>
            <button className="siCheckButton jello-horizontal">Book</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
