import "./hotel.css";

import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleArrowUp,
  faCircleXmark,
  faLocationDot,
  faScissors,
  faSpa,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState, useCallback } from "react";
import useFetch from "../../hooks/useFetch";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";
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

const Hotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [comment, setComment] = useState();
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loadingg, setLoadingg] = useState(false);

  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [opacity, setOpacity] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { user } = useContext(AuthContext);
  const { city, date, time } = useContext(SearchContext);
  const [value, setValue] = useState(date ? date : new Date());
  const [timeReserve, setTimeReserve] = useState(time ? time : "");
  const [datra, setDatra] = useState([]);
  const { type, dispatch } = useContext(SearchContext);
  const { open: sidebar } = useContext(SearchContext);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const w = window.innerWidth;

  const [minutesValues, setMinutesvalues] = useState([]);

  const { data, loading } = useFetch(`${baseUrl}/api/hotels/find/${id}`);
  const fetchReviews = async () => {
    return await axios
      .get(`${baseUrl}/api/hotels/getReviews/${id}`)
      .then((res) => {
        // console.log("reviewsfromdb", res.data);
        setReviews(res.data);
      })
      .catch((err) => toast.error(err));
  };

  const handleChange = (date) => {
    if (date === null) {
      setValue(null);
    }
    if (isTuesday(date)) {
      // Handle the case where Tuesday is selected
      return;
    }
    setValue(date);
    // Perform additional logic or actions based on the selected date
  };

  const isTuesday = (date) => {
    return date?.getDay() === 2; // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  };

  function tileClassName({ date, view }) {
    return isTuesday(date) ? "disabled-tuesday" : null;
  }

  useEffect(() => {
    const scroll = () => {
      w > 800
        ? window.scrollTo(0, window.innerHeight / 2)
        : window.scrollTo(0, 0);
    };
    const fetchData = async () => {
      const { data } = await axios.get(`${baseUrl}/api/hotels/room/${id}`);
      setServices(data[0]?.services);

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

      setDatra(res);
    };
    scroll();
    fetchData();
    fetchReviews();
  }, [value, w]);

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
    if (new Date(value).getDay() === 2) {
      return toast("Tuesdays are holidays !");
    }
    let result = convertToMilliseconds(timeReserve);
    let result2 = compareTimeDiff(result);

    let day1 = moment(value).format("MMM Do YY");
    let day2 = moment(new Date()).format("MMM Do YY");

    if (day1 === day2 && result2 >= 0) {
      return toast("Please select a valid time!");
    }
    dispatch({
      type: "NEW_SEARCH",
      payload: { type, destination: city, value, time: timeReserve },
    });

    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login", { state: { destination: `/shops/${id}` } });
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
        `${baseUrl}/api/hotels/createReview/${id}`,
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

        navigate(`/shops/${id}`);
      })
      .catch((err) => {
        setLoadingg(false);
        toast.error(err.response.data.message);
      });
  };

  const minValues = useCallback(() => {
    let min10 = [];
    let min20 = [];
    let min30 = [];
    let min40 = [];
    let min50 = [];
    let min60 = [];
    let min70 = [];
    let min80 = [];
    let min90 = [];
    let min100 = [];
    let min110 = [];
    let min120 = [];
    let min130 = [];
    let min140 = [];
    let min150 = [];
    let min160 = [];
    let min170 = [];
    let min180 = [];
    let min190 = [];
    let min200 = [];
    let min210 = [];
    let min220 = [];
    let min230 = [];
    let min240 = [];
    let min250 = [];
    let min260 = [];
    let min270 = [];
    let min280 = [];
    let min290 = [];
    let min300 = [];
    for (let i = 0; i < options.length; i++) {
      if (timeReserve === options[i].value && options[i].id === i) {
        min10 = [i];
        min20 = [i, i + 1];
        min30 = [i, i + 1, i + 2];
        min40 = [i, i + 1, i + 2, i + 3];
        min50 = [i, i + 1, i + 2, i + 3, i + 4];
        min60 = [i, i + 1, i + 2, i + 3, i + 4, i + 5];
        min70 = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6];
        min80 = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7];
        min90 = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8];
        min100 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
        ];
        min110 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
        ];
        min120 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
        ];
        min130 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
        ];
        min140 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
        ];
        min150 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
        ];
        min160 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
        ];
        min170 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
        ];
        min180 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
        ];
        min190 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
          i + 18,
        ];
        min200 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
          i + 18,
          i + 19,
        ];
        min210 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
          i + 18,
          i + 19,
          i + 20,
        ];

        min220 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
          i + 18,
          i + 19,
          i + 20,
          i + 21,
        ];

        min230 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
          i + 18,
          i + 19,
          i + 20,
          i + 21,
          i + 22,
        ];

        min240 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
          i + 18,
          i + 19,
          i + 20,
          i + 21,
          i + 22,
          i + 23,
        ];

        min250 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
          i + 18,
          i + 19,
          i + 20,
          i + 21,
          i + 22,
          i + 23,
          i + 24,
        ];

        min260 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
          i + 18,
          i + 19,
          i + 20,
          i + 21,
          i + 22,
          i + 23,
          i + 24,
          i + 25,
        ];

        min270 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
          i + 18,
          i + 19,
          i + 20,
          i + 21,
          i + 22,
          i + 23,

          i + 24,
          i + 25,
          i + 26,
        ];

        min280 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
          i + 18,
          i + 19,
          i + 20,
          i + 21,
          i + 22,
          i + 23,

          i + 24,
          i + 25,
          i + 26,
          i + 27,
        ];

        min290 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
          i + 18,
          i + 19,
          i + 20,
          i + 21,
          i + 22,
          i + 23,

          i + 24,
          i + 25,
          i + 26,
          i + 27,
          i + 28,
        ];

        min300 = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
          i + 5,
          i + 6,
          i + 7,
          i + 8,
          i + 9,
          i + 10,
          i + 11,
          i + 12,
          i + 13,
          i + 14,
          i + 15,
          i + 16,
          i + 17,
          i + 18,
          i + 19,
          i + 20,
          i + 21,
          i + 22,
          i + 23,

          i + 24,
          i + 25,
          i + 26,
          i + 27,
          i + 28,
          i + 29,
        ];
      }
    }
    return {
      min10,
      min20,
      min30,
      min40,
      min50,
      min60,
      min70,
      min80,
      min90,
      min100,
      min110,
      min120,
      min130,
      min140,
      min150,
      min160,
      min170,
      min180,
      min190,
      min200,
      min210,
      min220,
      min230,
      min240,
      min250,
      min260,
      min270,
      min280,
      min290,
      min300,
    };
  }, [timeReserve]);
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
  const today = moment(value).format("MMM Do YY");

  let filter = [];
  datra.map((date) => {
    const answer = date.dates.filter((item) => today === item.date);
    filter.push(answer);
  });

  const mergedReady = [];
  filter.map((item, i) => {
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

  // this is to mark tuesdays in red colors

  return (
    <div>
      {sidebar && <Sidebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}
      <CarouselBanner />
      <div className="px-4 ">
        <div className="w-full bg-[#00ccbb] rounded-md  p-5 flex items-center justify-center flex-col mt-4 ">
          <div className="flex items-center justify-center space-x-5 pt-5 md:-ml-0 -ml-2.5 text-white ">
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

          <div className="pt-5 pb-5 space-y-2 flex md:flex-row flex-col md:space-x-2 md:-ml-0 -ml-3">
            <div>
              <div className="-mt-1">
                <DatePicker
                  onChange={handleChange}
                  tileClassName={tileClassName}
                  value={value}
                  minDate={new Date()}
                  maxDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
                  className="bg-slate-100 text-blue-400 p-2.5 rounded-md md:w-[14.3rem] w-[14.3rem] z-10 mt-3"
                />
              </div>
            </div>
            <div className="flex md:flex-row px-4  items-center space-x-2">
              {
                <div className="">
                  <select
                    onChange={(e) => {
                      setTimeReserve(e.target.value);
                      const selectedOption = options.find(
                        (option) => option.value === e.target.value
                      );
                      setselectValue(selectedOption.id);
                    }}
                    className="md:p-3 p-2.5 bg-slate-100 md:w-[14rem] w-[6.8rem] md:-ml-5 lg:-ml-0"
                    value={timeReserve}
                  >
                    <option value="" selected disabled>
                      select time
                    </option>
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
                          <option
                            key={i}
                            value={option.value}
                            id={option.id}
                            className={!finalBooked && ` text-red-500 `}
                          >
                            <span className="flex space-x-20">
                              <span> {option.value}</span>
                              <span>
                                &nbsp;&nbsp;&nbsp;{" "}
                                {isbooked.includes(true) &&
                                  falseIndexes.map((item) => {
                                    return (
                                      <span>
                                        S{item + 1}&nbsp;✓ &nbsp;&nbsp;
                                      </span>
                                    );
                                  })}
                              </span>
                            </span>
                          </option>
                        );
                      })}
                  </select>
                </div>
              }

              <div className="">
                <button
                  className="headerBtn md:p-3 p-2.5 lg:ml-1 jello-horizontal"
                  onClick={() => {
                    handleClick();
                  }}
                >
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div />
      {services?.length > 0 ? <Test services={services} /> : ""}
      {loading || opacity ? (
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
            <Link to="/">
              <p className="bg-blue-900 max-w-[130px] px-4 py-2 text-white rounded">
                Go to Home
              </p>
            </Link>
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
              {/* <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data.title}</h1>
                <p className="hotelDesc">{data.desc}</p>
              </div> */}
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
                    <Link to={`/login?redirect=/shops/${id}`}>
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

      {openModal && (
        <Reserve
          setOpen={setOpenModal}
          open={open}
          shopId={id}
          shopName={data.name}
          shopOwner={data.shopOwnerId}
          setOpacity={setOpacity}
          min10={minutesValues.min10}
          min20={minutesValues.min20}
          min30={minutesValues.min30}
          min40={minutesValues.min40}
          min50={minutesValues.min50}
          min60={minutesValues.min60}
          min70={minutesValues.min70}
          min80={minutesValues.min80}
          min90={minutesValues.min90}
          min100={minutesValues.min100}
          min110={minutesValues.min110}
          min120={minutesValues.min120}
          min130={minutesValues.min130}
          min140={minutesValues.min140}
          min150={minutesValues.min150}
          min160={minutesValues.min160}
          min170={minutesValues.min170}
          min180={minutesValues.min180}
          min190={minutesValues.min190}
          min200={minutesValues.min200}
          min210={minutesValues.min210}
          min220={minutesValues.min220}
          min230={minutesValues.min230}
          min240={minutesValues.min240}
          min250={minutesValues.min250}
          min260={minutesValues.min260}
          min270={minutesValues.min270}
          min280={minutesValues.min280}
          min290={minutesValues.min290}
          min300={minutesValues.min300}
          selectedValue={selectValue}
          value={value}
          options={options}
        />
      )}
    </div>
  );
};

export default Hotel;
