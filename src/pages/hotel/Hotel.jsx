import "./hotel.css";

import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleArrowUp,
  faCircleXmark,
  faLocationDot,
  faScissors,
  faSpa,
} from "@fortawesome/free-solid-svg-icons";
import {
  useContext,
  useEffect,
  useState,
  useCallback,
  Fragment,
  memo,
} from "react";
import useFetch from "../../hooks/useFetch";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";

import Layout from "../../components/navbar/Layout";

import { ListItem, TextField } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import DatePicker from "react-date-picker";
import CarouselBanner from "../../components/CarouselBanner";
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";

import Greeting from "../../components/navbar/Greeting";
import Sidebar from "../../components/navbar/SIdebar";
import options from "../../utils/time";
import Test from "../../utils/Test";
import baseUrl from "../../utils/client";
import { Menu, Transition } from "@headlessui/react";
import Test1 from "../Test1";
import Login from "../../components/Login1";
import Login1 from "../../components/Login1";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Hotel = () => {
  const location = useLocation();
  const shopIdLocation = location.pathname.split("/")[2];
  const [comment, setComment] = useState();
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loadingg, setLoadingg] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [mergedServices, setMergedServices] = useState();
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [loginUser, setLoginUser] = useState(false);
  const { user } = useContext(AuthContext);
  const { city, date, time } = useContext(SearchContext);
  const [value, setValue] = useState(new Date());
  const [timeReserve, setTimeReserve] = useState();

  const { type, dispatch } = useContext(SearchContext);
  const { open: sidebar } = useContext(SearchContext);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const w = window.innerWidth;
  const lunch = [24, 25, 26, 27, 28, 29];
  const [breakTime, setBreakTime] = useState();

  const [block, setBlock] = useState();
  const [minutesValues, setMinutesvalues] = useState([]);
  const today = moment(value).format("MMM Do YY");
  const [matchedArrays, setMatchedArrays] = useState();

  const { data, loading } = useFetch(
    `${baseUrl}/api/hotels/find/${shopIdLocation}`
  );
  function isSpecificDate(value, targetDate) {
    return value.toString() === targetDate.toString();
  }

  const handleChange = (value) => {
    if (value === null) {
      setValue(null);
      return;
    } else if (isTuesday(value)) {
      alert("Tuesdays are not selectable!");
      return;
    } else {
      if (block.length > 0) {
        const isBlockedDate = block.find((blockedDate) =>
          isSpecificDate(moment(value).format("MMM Do YY"), blockedDate)
        );

        if (isBlockedDate) {
          alert("Owner is not available!");
          return;
        }
      }
      setValue(value);
    }
  };

  const isTuesday = (value) => {
    const dayOfWeek = value?.getDay();
    if (dayOfWeek === 2) {
      return true;
    }
  };

  function tileClassName({ date, value }) {
    const formattedDate = moment(date).format("MMM Do YY");

    if (isTuesday(date)) {
      return "red-tuesday";
    }

    if (block.length > 0) {
      const isBlockedDate = block.find((blockedDate) =>
        isSpecificDate(formattedDate, blockedDate)
      );
      if (isBlockedDate) {
        return "yellow-date";
      }
    }

    return null;
  }
  // const filterOptions = () => {
  //   const date = new Date();
  //   const formattedTime = date.toLocaleString("en-US", {
  //     hour: "numeric",
  //     minute: "numeric",
  //     hour12: true,
  //   });

  //   const values = options.filter((option) => {
  //     return formattedTime.split(":")[0] === option.value.split(":")[0] &&
  //       formattedTime.split(":")[1].split(" ")[1] ===
  //         option.value.split(":")[1].split(" ")[1]
  //       ? option
  //       : null;
  //   });

  //   if (values[0]?.id === 72) {
  //     return setoptions(null);
  //   }
  //   const filteredOptions1 = options.filter((option) => {
  //     return values[0].id <= option.id;
  //   });
  //   setoptions(
  //     moment(value).format("Do MM") === moment(date).format("Do MM")
  //       ? filteredOptions1
  //       : options
  //   );
  // };

  const fetchReviews = useCallback(async () => {
    return await axios
      .get(`${baseUrl}/api/hotels/getReviews/${shopIdLocation}`)
      .then((res) => {
        // console.log("reviewsfromdb", res.data);
        setReviews(res.data);
      })
      .catch((err) => toast.error(err));
  }, [shopIdLocation]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${baseUrl}/api/hotels/room/${shopIdLocation}`
      );
      setServices(data[0]?.services);

      const mergedPreviewServices = data[0]?.services
        ?.reduce((arr, item) => {
          arr.push(item.services);
          return arr;
        }, [])
        .reduce((arr, item) => {
          return arr.concat(item);
        }, []);

      const totalTimeOfServices = mergedPreviewServices.reduce(
        (acc, service) => {
          return (acc += service.duration);
        },
        0
      );

      const res =
        data &&
        data[0]?.roomNumbers?.map((id, i) => {
          return {
            id: id._id,

            dates: id.unavailableDates?.map((item) => {
              return { date: item.date, values: item.values };
            }),
          };
        });

      let filter = [];
      res.forEach((date) => {
        const answer = date.dates.filter((item) => today === item.date);
        filter.push(answer);
      });

      const mergedReady = [];
      filter.forEach((item, i) => {
        const allValues = item.map((date) => {
          return date.values;
        });
        mergedReady.push(allValues);
      });
      // console.log(mergedReady, "mergeready");

      function findMatchingArrays(arr) {
        const matchedArrays = [];
        for (let i = 0; i < arr?.length; i++) {
          const mergedDates = [...new Set(arr[i].flat())];

          matchedArrays.push(mergedDates);
        }
        return matchedArrays;
      }

      const matchedArrays = findMatchingArrays(mergedReady);

      setMatchedArrays(matchedArrays);
      setMergedServices(mergedPreviewServices);
      setTotalTime(totalTimeOfServices);
      setBreakTime(
        data[0]?.blockTimings.find(
          (item) => item.date === moment(value).format("MMM Do YY")
        )
      );
      setBlock(data[0]?.blockDays);
    };
    // filterOptions();

    fetchReviews();
    fetchData();
  }, [fetchReviews, navigate, shopIdLocation, today, type, value]);

  useEffect(() => {
    const scroll = () => {
      window.scrollTo(0, 0);
    };

    scroll();
  }, [loginUser]);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  function compareTimeDiff(time) {
    let time1 = time;
    // do some task
    let time2 = new Date().getTime();
    let difference = time2 - time1;
    let diffInHours = difference / (1000 * 60 * 60);
    return Math.floor(diffInHours);
  }

  function convertToMilliseconds(timeReserve) {
    var date = new Date();
    var timeArray = timeReserve.split(":");
    var hours = parseInt(timeArray[0]) % 12;
    var minutes = parseInt(timeArray[1]);
    var ampm = timeArray[1].split("")[3];
    console.log(ampm);

    if (ampm === "P" && hours !== 12) {
      hours += 12;
    }
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    return date.getTime();
  }

  const handleClick = () => {
    let day1 = moment(value).format("MMM Do YY");
    let day2 = moment(new Date()).format("MMM Do YY");

    if (block.length > 0) {
      const isBlockedDate = block.find((blockedDate) =>
        isSpecificDate(day1, blockedDate)
      );
      if (isBlockedDate) {
        alert("Owner is not available");
        return null;
      }
    }

    if (isTuesday(value)) {
      alert("Tuesdays are not selectable!");
      return;
    }

    if (lunch.includes(selectValue)) {
      return toast(
        "It is lunch time for owner! Please select before or after his lunch time"
      );
    }

    if (breakTime?.block.includes(selectValue) && day1 === day2) {
      return toast("Owner took break!");
    }
    let result = convertToMilliseconds(timeReserve);
    let result2 = compareTimeDiff(result);

    if (day1 === day2 && result2 >= 0) {
      return toast("Please select a valid time!");
    }

    dispatch({
      type: "NEW_SEARCH",
      payload: { type, destination: city, value, time: timeReserve },
    });

    if (user && type === "saloon") {
      navigate(`/shops/${shopIdLocation}/salon-reserve`, {
        state: {
          shopId: shopIdLocation,
          shopName: data.name,
          shopOwner: data.shopOwnerId,
          mergedServices,
          selectedValue: selectValue,
          minValuesObj: minutesValues.minValuesObj,
          value: value,
          options: options,
          breakTime,
        },
      });
    } else if (user && type === "parlour") {
      navigate(`/shops/${shopIdLocation}/parlour-reserve`, {
        state: {
          shopId: shopIdLocation,
          shopName: data.name,
          shopOwner: data.shopOwnerId,
          mergedServices,

          selectedValue: selectValue,
          minValuesObj: minutesValues.minValuesObj,
          value: value,
          options: options,
          breakTime: breakTime,
        },
      });
    } else {
      // navigate("/login", {
      //   state: { destination: `/shops/${shopIdLocation}` },
      // });
      setLoginUser(true);
    }
  };

  const reviewHandler = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      setLoadingg(false);
      return toast.error("Please enter all fields");
    }
    setLoadingg(true);
    await axios
      .post(
        `${baseUrl}/api/hotels/createReview/${shopIdLocation}`,
        {
          user: user._id,
          name: user.username,
          rating,
          comment,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast(res.data.message);
        setLoadingg(false);
        setRating(0);
        setComment("");
        fetchReviews();

        navigate(`/shops/${shopIdLocation}`);
      })
      .catch((err) => {
        setLoadingg(false);
        toast.error(err.response.data.message);
      });
  };

  const minValues = useCallback(() => {
    let minValuesObj = {};
    for (let i = 0; i < options.length; i++) {
      if (timeReserve === options[i].value && options[i].id === i) {
        for (let j = 1; j <= totalTime / 10; j++) {
          minValuesObj[`min${j * 10}`] = [i];
        }
        for (let j = 2; j <= totalTime / 10; j++) {
          let arr = [];
          for (let k = 0; k <= j - 1; k++) {
            arr.push(i + k);
          }

          // console.log(arr);
          minValuesObj[`min${j * 10}`] = arr;
        }
      }
    }

    return {
      minValuesObj,
    };
  }, [timeReserve, totalTime]);

  useEffect(() => {
    const minValues1 = minValues();

    setMinutesvalues(minValues1);
  }, [timeReserve, minValues]);
  //main functions

  const [selectValue, setselectValue] = useState(
    timeReserve
      ? options.find((option) => option.value === timeReserve).id
      : null
  );

  const handleTime = (item) => {
    setTimeReserve(item.value);
    const selectedOption = options.find(
      (option) => option.value === item.value
    );
    setselectValue(selectedOption.id);
  };

  return (
    <div>
      {sidebar && <Sidebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}
      <CarouselBanner />
      {loginUser && (
        <Login1 setLoginUser={setLoginUser} shopId={shopIdLocation} />
      )}
      <div className="md:px-4 px-2 ">
        <div className="w-full bg-[#00ccbb] rounded-md  md:p-5 p-2 flex items-center justify-center flex-col mt-4 ">
          <div className="flex items-center justify-center space-x-5 pt-6 pb-6 md:-ml-0 -ml-2.5 text-white ">
            <div
              className={
                type === "saloon"
                  ? `active scale-in-center space-x-2`
                  : `space-x-2`
              }
            >
              <FontAwesomeIcon icon={faScissors} />
              <span className="text-xs md:text-lg font-bold ">
                Saloon Shops
              </span>
            </div>
            <div
              className={
                type === "parlour"
                  ? `active scale-in-center space-x-2`
                  : `space-x-2`
              }
            >
              <FontAwesomeIcon icon={faSpa} />
              <span className="text-xs md:text-lg font-bold">
                Beauty Parlours
              </span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5 pb-5">
            <div className="md:col-span-4 col-span-12">
              <div className="">
                <DatePicker
                  // onClick={() => w > 820 && window.scrollTo(0, 100)}
                  onChange={handleChange}
                  tileClassName={tileClassName}
                  value={value}
                  minDate={new Date()}
                  maxDate={new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)}
                  className="bg-slate-100 text-blue-400 p-2.5 rounded w-full    "
                />
              </div>
            </div>
            <div className="md:col-span-4 col-span-12">
              <Menu as="div" className="relative inline-block text-left w-full">
                <div>
                  <Menu.Button
                    onClick={() =>
                      w > 820
                        ? window.scrollTo(0, 200)
                        : window.scrollTo(0, 100)
                    }
                    className="inline-flex justify-start w-full p-[0.8rem] text-sm font-medium text-gray-700 bg-slate-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none "
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="md:text-md ">
                        {timeReserve ? (
                          <p
                            className={
                              lunch.includes(options[selectValue].id) &&
                              ` text-red-500 `
                            }
                          >
                            {timeReserve}
                          </p>
                        ) : (
                          "Select Time"
                        )}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 ml-2 -mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="h-96  overflow-auto absolute z-10 md:right-0  md:w-[20rem] w-[16rem] mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <p
                            className={classNames(
                              `text-gray-400 block px-4 py-0.5 text-md font-bold cursor-pointer`
                            )}
                          >
                            Select Time
                          </p>
                        )}
                      </Menu.Item>

                      {matchedArrays?.length > 0 &&
                        options?.map((option, i) => {
                          const isbooked = matchedArrays?.map((item) =>
                            // console.log(item?.includes(i))
                            item?.includes(i)
                          );
                          const finalBooked = isbooked.includes(false);
                          const falseIndexes = [];

                          for (let i = 0; i < isbooked.length; i++) {
                            if (!isbooked[i]) {
                              falseIndexes.push(i);
                            }
                          }

                          return (
                            <Menu.Item key={i} id={option.id}>
                              {({ active }) => (
                                <div
                                  onClick={() => handleTime(option)}
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-black py-0.5 text-md font-bold cursor-pointer "
                                      : "text-gray-700",
                                    ` px-4 py-0.5 text-md font-bold cursor-pointer flex space-x-5`
                                  )}
                                >
                                  <span
                                    className={`${
                                      !finalBooked && " text-red-500"
                                    }  ${
                                      lunch.includes(option.id) &&
                                      ` text-red-500 `
                                    } ${
                                      breakTime?.block.includes(option.id) &&
                                      ` text-red-500 `
                                    }`}
                                  >
                                    {option.value}
                                    {breakTime?.block.includes(option.id) &&
                                      (breakTime.block[0] === option.id ||
                                      breakTime.block[
                                        breakTime.block.length - 1
                                      ] === option.id ? (
                                        <span>&nbsp;&nbsp; blocked</span>
                                      ) : (
                                        <span>&nbsp;&nbsp; .</span>
                                      ))}
                                  </span>
                                  <span className="w-auto overflow-x-auto">
                                    {isbooked?.includes(true) &&
                                      falseIndexes?.map((item) => {
                                        return (
                                          <span>
                                            S{item + 1}&nbsp;
                                            <FontAwesomeIcon
                                              icon={faCircle}
                                              color="green "
                                              size="sm"
                                            />
                                            &nbsp;&nbsp;
                                          </span>
                                        );
                                      })}
                                  </span>
                                </div>
                              )}
                            </Menu.Item>
                          );
                        })}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <div className="md:col-span-4 col-span-12">
              <button
                className="headerBtn w-full p-[0.71rem] jello-horizontal"
                onClick={handleClick}
              >
                Check Services
              </button>
            </div>
          </div>
        </div>
      </div>
      <div />
      {services?.length > 0 ? <Test services={services} /> : ""}
      {loading ? (
        <div className="md:min-h-[65vh] min-h-[45vh] flex items-center justify-center">
          <span className="loader  "></span>
        </div>
      ) : (
        <div className="hotelContainer px-4 ">
          {open && (
            <>
              <div className="slider">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="close"
                  onClick={() => setOpen(false)}
                />
                <FontAwesomeIcon
                  icon={faCircleArrowLeft}
                  className="arrow"
                  onClick={() => handleMove("l")}
                />
                <div className="sliderWrapper">
                  <img
                    src={data.photos[slideNumber]}
                    alt=""
                    className="sliderImg"
                  />
                </div>
                <FontAwesomeIcon
                  icon={faCircleArrowRight}
                  className="arrow"
                  onClick={() => handleMove("r")}
                />
              </div>
            </>
          )}
          <div className="hotelWrapper mt-2">
            <div className="md:flex space-y-4 items-center justify-between">
              <div className="hotelWrapper">
                <h1 className="hotelTitle">{data.name}</h1>
                <div className="hotelAddress">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{data.address}</span>
                </div>
                <span className="hotelDistance">
                  Excellent location – {data.distance}m from center
                </span>
                <span className="hotelPriceHighlight">
                  Book over Rs.{data.cheapestPrice} at this shop and get a free
                  Shaving.
                </span>
              </div>
              <img
                src="https://res.cloudinary.com/duk9xkcp5/image/upload/v1679746627/716z0eWdZjL._SL1500__t4foon.webp"
                alt={data?.title}
                className="opacity-70 sm:h-auto sm:w-auto md:h-36 md:w-36 "
              ></img>
            </div>
            <div className="hotelImages">
              {data.photos?.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>
            <div className="hotelDetails mb-8 mt-4 flex flex-col">
              <div
                id="reviews"
                className="mt-5 space-y-3 p-5 bg-gray-100 shadow-md"
              >
                <h2 className="font-semibold text-xl mb-3">Customer Reviews</h2>
                {reviews?.length === 0 && "No Reviews"}

                {reviews?.map((review, i) => {
                  return (
                    <div
                      className="space-y-1 flex items-start space-x-5 "
                      key={i}
                    >
                      <div className="space-y-2.5 border-r-2 px-5">
                        <strong>{review.name}</strong>
                        <h3>{review.createdAt.substring(0, 10)}</h3>
                      </div>

                      <div>
                        <Rating value={review.rating} readOnly></Rating>
                        <h3>{review.comment}</h3>
                      </div>
                    </div>
                  );
                })}

                {user ? (
                  <form
                    onSubmit={reviewHandler}
                    className="text-black  bg-white rounded-md p-3"
                  >
                    <h1 className="font-semibold ">Please leave a review</h1>
                    <ListItem>
                      <TextField
                        multiline
                        variant="outlined"
                        fullWidth
                        name="review"
                        label="Enter comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></TextField>
                    </ListItem>
                    <ListItem>
                      <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      ></Rating>
                    </ListItem>
                    <button
                      type="submit"
                      className="primary-button ml-5"
                      disabled={loading}
                    >
                      Submit
                    </button>
                  </form>
                ) : (
                  <h1 className="font-semibold text-xl">
                    Please{" "}
                    <Link to={`/login?redirect=/shops/${shopIdLocation}`}>
                      <span className="text-blue-500">login</span>
                    </Link>{" "}
                    to write a review
                  </h1>
                )}
              </div>
              <div className="w-full bg-gray-200 md:mb-4 mb-14 rounded-md flex flex-col space-y-3 p-5 ">
                <h1>Perfect for you!</h1>
                <span>This shop has an excellent location score of 9.8!</span>

                <button
                  className="primary-button"
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <div className="flex items-center justify-center">
                    <p> Go Top and Reserve</p> &nbsp;
                    <FontAwesomeIcon icon={faCircleArrowUp} size="2x" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default memo(Hotel);
