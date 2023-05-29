import moment from "moment";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import { SearchContext } from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch";
import "./searchItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCheckCircle,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const SearchItem = ({ item }) => {
  let disable = false;
  const { date, time, city } = useContext(SearchContext);
  const dater = moment(date).format("MMM Do YY");
  const { data, loading, error } = useFetch(`/api/hotels/room/${item._id}`);

  // let htms = "";
  let count = 0;
  const isAvailable = (data, dater, time) => {
    var k = 0;
    k = k + 1;

    const isFound = data.unavailableDates.map((item, i) => {
      let newString = item?.time?.replace(/:/g, "").replace(/\s/g, "");

      let newString1 = time?.replace(/:/g, "").replace(/\s/g, "");

      if (item?.date.includes(dater)) {
        // alert("Sorry, this date and time is already booked.");
        if (newString.includes(newString1)) {
          count += 1;
        }
      }
    });

    if (count === 2) {
      return (disable = true);
      // return (document.getElementById("report").innerHTML = htms);
    }
  };

  const mapData = data[0];
  for (let i = 0; i < mapData?.roomNumbers.length; i++) {
    if (dater && time) {
      isAvailable(mapData?.roomNumbers[i], dater, time);
    }
  }

  // console.log("data from SearchItem", data);
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
          <Link to={`/hotels/${item._id}`}>
            <button
              className={
                disable
                  ? "siCheckButton bg-blue-400"
                  : "siCheckButton jello-horizontal"
              }
              disabled={disable}
            >
              {disable ? "Booked" : "Book 💇‍♂️"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
