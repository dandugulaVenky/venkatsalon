import "./hotel.css";
import { useSSR, useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleArrowUp,
  faCircleXmark,
  faClose,
  faLocationDot,
  faScissors,
  faSpa,
  faStar,
  faTags,
} from "@fortawesome/free-solid-svg-icons";

import { faHeart as faHeart1 } from "@fortawesome/free-solid-svg-icons";

import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  useContext,
  useEffect,
  useState,
  useCallback,
  memo,
  useRef,
} from "react";
import useFetch from "../../hooks/useFetch";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";

import { ListItem, TextField } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import DatePicker from "react-date-picker";
import CarouselBanner from "../../components/CarouselBanner";
import moment from "moment";
import { toast } from "react-toastify";

import options from "../../utils/time";
// import Test from "../../utils/Test";
import baseUrl from "../../utils/client";

import useEffectOnce from "../../utils/UseEffectOnce";
import { FinalBookingContext } from "../../context/FinalBookingContext";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../components/axiosInterceptor";
import ShareButton from "./ShareButton";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getCurrentTimeRounded() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  // Round the minutes down to the nearest 10
  const roundedMinutes = Math.floor(minutes / 10) * 10;

  // If the minutes are already a multiple of 10, keep the same, otherwise round down
  minutes = roundedMinutes === minutes ? minutes : roundedMinutes;

  // Convert hours to 12-hour format and determine AM/PM
  const amOrPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Handle midnight (0) as 12 AM

  // Construct the formatted time string
  const roundedTime = `${hours === 0 ? "12" : hours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${amOrPm}`;
  return roundedTime;
}

const Hotel = ({ smallBanners }) => {
  const location = useLocation();

  const shopIdLocation = location.pathname.split("/")[2];

  const { data, loading } = useFetch(
    `${baseUrl}/api/hotels/find/${shopIdLocation}`
  );
  let requests = data?.requests || [];

  // console.log(data, "daaaaaaaaaaaaaata");+

  const [comment, setComment] = useState();
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loadingg, setLoadingg] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [mergedServices, setMergedServices] = useState();
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);

  //Appointment or Booking

  const [appointment, setAppointment] = useState("booking");

  const [higlightBookingBox, setHighlightBookingBox] = useState(false);

  const { user } = useContext(AuthContext);

  const { city, timeDifferenceInDays, time, dispatch, lat, lng } =
    useContext(SearchContext);
  const [value, setValue] = useState(
    moment().add(timeDifferenceInDays, "days").toDate()
  );

  const [timeReserve, setTimeReserve] = useState(time ? time : "");

  const { dispatch: appointmentDispatch } = useContext(FinalBookingContext);

  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const w = window.innerWidth;
  let images = [];

  w >= 539
    ? (images = [
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734979201/2_ojl5nt.svg",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734979205/3_jeyh64.svg",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734979556/com_1_h7kdal.svg",
      ])
    : (images = [
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734180221/2_l4nngn.svg",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734180240/1_vn4gd1.svg",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734180222/5_i5nu2y.svg",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734180218/4_wyl4vp.svg",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734180217/3_vwo4mk.svg",
      ]);

  const lunch = data?.lunchTimeArray || [];
  const [breakTime, setBreakTime] = useState();
  const [fav, setFav] = useState(false);
  const [block, setBlock] = useState();
  const [minutesValues, setMinutesvalues] = useState([]);
  const today = moment(value).format("MMM Do YY");
  const [matchedArrays, setMatchedArrays] = useState();
  const { t } = useTranslation();
  const pickerRef = useRef(null);

  function isSpecificDate(value, targetDate) {
    return value.toString() === targetDate.toString();
  }

  const handleChange = (value) => {
    if (value === null) {
      setValue(null);
      return;
    } else if (isTuesday(value)) {
      // alert("Tuesdays are not selectable!");
      alert(t("tuesdaysNotSelectable"));
      return;
    } else {
      if (block?.length > 0) {
        const isBlockedDate = block.find((blockedDate) =>
          isSpecificDate(moment(value).format("MMM Do YY"), blockedDate)
        );

        if (isBlockedDate) {
          alert(t("ownerNotAvailable"));
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

    if (block?.length > 0) {
      const isBlockedDate = block.find((blockedDate) =>
        isSpecificDate(formattedDate, blockedDate)
      );
      if (isBlockedDate) {
        return "yellow-date";
      }
    }

    return null;
  }

  const fetchReviews = useCallback(async () => {
    return await axiosInstance
      .get(`${baseUrl}/api/hotels/getReviews/${shopIdLocation}`)
      .then((res) => {
        // console.log("reviewsfromdb", res.data);
        setReviews(res.data);
      })
      .catch((err) => toast.error(err));
  }, [shopIdLocation]);
  useEffectOnce(() => {
    window.scrollTo(0, 0);
    const inputs = pickerRef.current?.querySelectorAll("input");
    inputs?.forEach((input) => {
      input.setAttribute("readOnly", true); // Prevent typing
      input.classList.add("cursor-pointer"); // Optional: show pointer cursor
    });
    fetchReviews();
    const favTrueOrNot = user?.favourites.find(
      (item) => item.shopId === shopIdLocation
    );

    console.log(favTrueOrNot);

    // if (favTrueOrNot) {
    //   setFav((favTrueOrNot) => (favTrueOrNot?.includes(true) ? true : false));
    // }

    setFav(favTrueOrNot ? true : false);
  }, [fetchReviews]);

  useEffect(() => {
    setLoadingg(true);
    appointmentDispatch({
      type: "RESET_APPOINTMENT",
    });
    try {
      const fetchData = async () => {
        const { data } = await axiosInstance.get(
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

        const totalTimeOfServices = mergedPreviewServices?.reduce(
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

              dates: id?.unavailableDates?.map((item) => {
                return { date: item.date, values: item.values };
              }),
            };
          });

        let filter = [];
        res?.forEach((date) => {
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
        setLoadingg(false);
      };

      fetchData();
    } catch (err) {
      console.log(err);

      setLoadingg(false);
    }
    // filterOptions();
  }, [appointmentDispatch, navigate, shopIdLocation, today, value]);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber =
        slideNumber === 0 ? data?.images?.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === data?.images?.length - 1 ? 0 : slideNumber + 1;
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
    if (!selectValue) {
      window.scrollTo(0, 0);
      return toast("Please select time");
    }
    let day1 = moment(value).format("MMM Do YY");
    let day2 = moment(new Date()).format("MMM Do YY");

    if (block.length > 0) {
      const isBlockedDate = block.find((blockedDate) =>
        isSpecificDate(day1, blockedDate)
      );
      if (isBlockedDate) {
        // alert("Owner is not available");
        alert(t("ownerNotAvailable"));
        return null;
      }
    }

    if (isTuesday(value)) {
      // alert("Tuesdays are not selectable!");
      alert(t("tuesdaysNotSelectable"));
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
      return toast("Please select tomorrow's date");
    }
    const timeDifferenceInMilliseconds = value - new Date();

    // Calculate the time difference in days
    const timeDifferenceInDays = Math.ceil(
      timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    dispatch({
      type: "NEW_SEARCH",
      payload: {
        type: data.type,
        destination: city,
        value,
        lat,
        lng,
        time: timeReserve,
        timeDifferenceInDays:
          timeDifferenceInDays > 0 ? timeDifferenceInDays : 0,
      },
    });

    if (user) {
      navigate(`/shops/${shopIdLocation}/${data.type}-reserve`, {
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
          lunch,
          type: data.type,
          subType: data.subType,
          barbers: data.barbers,
          requests,
        },
      });
      // } else if (user && type === "parlour") {
      //   navigate(`/shops/${shopIdLocation}/parlour-reserve`, {
      //     state: {
      //       shopId: shopIdLocation,
      //       shopName: data.name,
      //       shopOwner: data.shopOwnerId,
      //       mergedServices,

      //       selectedValue: selectValue,
      //       minValuesObj: minutesValues.minValuesObj,
      //       value: value,
      //       options: options,
      //       breakTime,
      //       type: data.type,
      //     },
      //   });
    } else {
      navigate("/login", {
        state: { destination: `/shops/${shopIdLocation}` },
      });
    }
  };

  const reviewHandler = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      setLoadingg(false);
      return toast.error("Please enter all fields");
    }
    setLoadingg(true);
    await axiosInstance
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
    setShowTimings(false);
    document.body.style.overflow = "unset";
  };
  const [showTimings, setShowTimings] = useState(false);

  // const ShowAppointmentModals = useCallback(() => {
  //   const appointmentPayment = async () => {
  //     if (!user) {
  //       navigate("/login", {
  //         state: { destination: `/shops/${shopIdLocation}` },
  //       });
  //       return;
  //     }

  //     appointmentDispatch({
  //       type: "NEW_APPOINTMENT",
  //       payload: {
  //         totalAmount: 20,
  //         date: moment(value).format("MMM Do YY"),
  //         shopName: data.name,
  //         city: data.city,
  //         phone: data.alternatePhone,
  //         id: data._id,
  //         status: "pending",
  //       },
  //     });

  //     try {
  //       await axiosInstance.post(
  //         `${baseUrl}/api/users/checkAppointmentExists/${user?._id}`,
  //         { date: moment(value).format("MMM Do YY") },
  //         { withCredentials: true }
  //       );
  //     } catch (error) {
  //       console.log(error);
  //       return alert(error.response.data.message);
  //     }

  //     const {
  //       data: { key },
  //     } = await axiosInstance.get(`${baseUrl}/api/getkey`);
  //     try {
  //       const {
  //         data: { order },
  //       } = await axiosInstance.post(
  //         `${baseUrl}/api/payments/appointment/checkout`,
  //         {
  //           amount: 20,
  //         },
  //         { withCredentials: true }
  //       );
  //       const token = sessionStorage.getItem("access_token");

  //       const options = {
  //         key,
  //         amount: order.amount,
  //         currency: "INR",
  //         name: "EASYTYM",
  //         description: "SALONS & PARLOURS",
  //         image: "https://avatars.githubusercontent.com/u/25058652?v=4",
  //         order_id: order.id,
  //         callback_url: `${baseUrl}/api/payments/appointment/paymentverification?token=${token}`,
  //         prefill: {
  //           name: "Test Team",
  //           email: "test.test@example.com",
  //           contact: "9999999999",
  //         },
  //         notes: {
  //           address: "EasyTym Corporate Office",
  //         },
  //         theme: {
  //           color: "#121212",
  //         },
  //         modal: {
  //           ondismiss: function () {},
  //         },
  //       };
  //       const razor = new window.Razorpay(options);
  //       razor.open();
  //     } catch (err) {
  //       alert(err.response.data.message);
  //     }
  //   };
  //   return (
  //     <div className="reserve  overscroll-none">
  //       <FontAwesomeIcon
  //         icon={faClose}
  //         size="xl"
  //         color="black"
  //         onClick={() => {
  //           setAppointment("null");
  //           document.body.style.overflow = "unset";
  //         }}
  //         className="absolute md:top-10 top-5 lg:right-52 md:right-20 right-6 bg-white rounded-full px-2.5 py-[0.30rem] cursor-pointer"
  //       />

  //       <div className="flex relative slide-in-right items-center justify-center space-y-3 px-4 flex-col h-[50%] md:w-[40%] w-[75%] my-auto  mx-auto bg-white text-black overflow-auto rounded-md">
  //         <p className="font-bold font-verdana text-center">
  //           Date Selected - {moment(value).format("MMM Do YY")}
  //         </p>
  //         <p>
  //           Note: If confirmed, you will recieve a call from shop owner to know
  //           about the services and your convenient time! We will collect a
  //           amount of 20 rs/- for booking confirmation.
  //         </p>
  //         <p className="pb-4">
  //           In case of any queries, please
  //           <Link to="/contact-us" className="text-[#00ccbb]">
  //             &nbsp; contact us
  //           </Link>
  //           .
  //         </p>
  //         <button className="primary-button mt-4" onClick={appointmentPayment}>
  //           Confirm
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }, [
  //   appointmentDispatch,
  //   data._id,
  //   data.alternatePhone,
  //   data.city,
  //   data.name,
  //   navigate,
  //   shopIdLocation,
  //   user,
  //   value,
  // ]);

  const ShowTheTimings = () => {
    document.body.style.overflow = "hidden";
    const roundedTime = getCurrentTimeRounded();
    let id =
      moment(value).format("Do MM") === moment(new Date()).format("Do MM")
        ? options.find((option) => option.value === roundedTime)?.id
        : 0;

    // console.log(id, "idddddddddddddd");
    return (
      <div className="reserve  overscroll-none">
        <FontAwesomeIcon
          icon={faClose}
          size="xl"
          color="black"
          onClick={() => {
            setShowTimings(false);
            document.body.style.overflow = "unset";
          }}
          className="absolute md:top-10 top-2.5 lg:right-52 md:right-20 right-6 bg-white rounded-full px-2.5 py-[0.30rem] cursor-pointer"
        />

        <div className="-top-8 flex relative slide-in-right items-start flex-col h-[80%] md:w-[50%] w-[85%] my-auto  mx-auto bg-white text-black overflow-auto rounded-md">
          <p
            className={classNames(
              `text-white text-center block z-10  md:text-lg text-[1rem] font-bold cursor-pointer bg-[#00ccbb] slide-in-left  py-2 sticky top-0 w-[100%]`
            )}
          >
            <FontAwesomeIcon icon={faCircle} color="green " size="sm" /> -{" "}
            <span className="md:text-[1rem] text-xs">
              {"All Seats Available"}
            </span>
            &nbsp;&nbsp; &nbsp;&nbsp;
            <FontAwesomeIcon icon={faCircle} color="orange " size="sm" /> -{" "}
            <span className=" md:text-[1rem] text-xs">
              {t("seatsAvailable")}
            </span>
          </p>

          <div className="px-6 pt-2 pb-2 w-[100%] z-0">
            {matchedArrays?.length > 0 &&
              options.map((option, i) => {
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
                  (i >= id + 6 || id === undefined) && (
                    <div
                      onClick={() => handleTime(option)}
                      className={classNames(
                        // timeReserve === option.value
                        //   ? "bg-gray-500 text-white py-0.5 text-md font-bold cursor-pointer w-[100%]"
                        //   : "text-gray-700",
                        `grid grid-cols-10 px-4  text-md font-bold cursor-pointer  space-x-5 hover:bg-gray-200 w-[100%] rounded-full relative ${
                          isbooked?.includes(true) &&
                          falseIndexes.length > 0 &&
                          "bg-gray-100  my-2"
                        }`
                      )}
                    >
                      <span
                        className={`${!finalBooked && " text-red-500"}  ${
                          lunch.includes(option.id) && ` text-red-500 `
                        } ${
                          breakTime?.block.includes(option.id) &&
                          ` text-red-500 `
                        } col-span-3 py-1`}
                      >
                        {option.value}
                        {breakTime?.block.includes(option.id) &&
                          (breakTime.block[0] === option.id ||
                          breakTime.block[breakTime.block.length - 1] ===
                            option.id ? (
                            <span>&nbsp;&nbsp; blocked</span>
                          ) : (
                            <span>&nbsp;&nbsp; .</span>
                          ))}
                      </span>
                      <section className="text-gray-800 py-1 col-span-7 overflow-auto">
                        <span>
                          {isbooked?.includes(true) &&
                            falseIndexes?.map((item) => {
                              return (
                                <span className={``}>
                                  S{item + 1}&nbsp;
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    color="orange "
                                    size="xs"
                                  />
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                </span>
                              );
                            })}
                        </span>
                        <span className="">
                          {finalBooked &&
                            !isbooked?.includes(true) &&
                            !lunch.includes(option.id) &&
                            !breakTime?.block.includes(option.id) && (
                              <FontAwesomeIcon
                                icon={faCircle}
                                color="green "
                                size="xs"
                              />
                            )}
                        </span>
                      </section>
                    </div>
                  )
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  // console.log(higlightBookingBox);

  const handleFavourites = async () => {
    if (!user) {
      return alert("Please login to add to favourites!");
    }

    try {
      const favs = await axiosInstance.post(
        `${baseUrl}/api/users/favourites`,
        {
          shopId: shopIdLocation,
          shopName: data.name,
          shopLocation: data.city,
          userId: user._id,
          image: data?.images[0] || {
            public_id: "default_id",
            url: "https://th.bing.com/th/id/OIP.vJPMDs4fhLFH1an0goJdcwHaE8?w=225&h=180&c=7&r=0&o=7&cb=iwp1&dpr=1.3&pid=1.7&rm=3",
          },
          addingOrRemoving: fav ? "remove" : "add",
        },
        {
          withCredentials: true,
        }
      );

      if (favs.status === 200) {
        alert("Added to favs!");
        setFav(true);
        let favs = user.favourites.find(
          (item) => item.shopId === shopIdLocation
        );

        if (!fav) {
          if (favs) return;
          user.favourites.push({
            shopId: shopIdLocation,
            shopName: data.name,
            shopLocation: data.city,
            userId: user._id,
            image: data.images[0] || "null",
          });
          secureLocalStorage.setItem("easytym-user", user);
        }

        // dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      } else if (favs.status === 201) {
        alert("removed from favs!");
        setFav(false);
        user.favourites = user.favourites.filter(
          (item) => item.shopId !== shopIdLocation
        );

        secureLocalStorage.setItem("easytym-user", user);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Error occured!");
    }
  };

  return (
    <div className="pt-6 pb-8 resp">
      <div className={` w-full mx-auto  md:rounded md:px-4 `}>
        <CarouselBanner autoSlide={true}>
          {images.map((s) => {
            return (
              <img
                src={s}
                className="md:rounded rounded-sm"
                style={{
                  backgroundPosition: "center",

                  backgroundSize: "cover",
                  width: "100%",
                }}
                alt="carousel-img"
              />
            );
          })}
        </CarouselBanner>
      </div>

      {/* {appointment === "appointment" && <ShowAppointmentModals />} */}

      <div
        className={`md:px-4   px-3 my-4 ${
          higlightBookingBox ? "heartbeat" : ""
        }`}
      >
        <div
          className="w-full bg-white rounded-xl md:p-6 p-4 border border-gray-300  flex flex-col items-center justify-center"
          style={{ borderRadius: 8 }}
        >
          {/* Header options */}
          <div className="flex items-center justify-center space-x-6 text-gray-800 font-semibold text-base md:text-lg mb-6">
            {appointment !== "null" ? (
              <div className="flex items-center gap-2 text-[#00ccbb] font-bold">
                {/* {appointment} */} Select Date and Time
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="ml-2 cursor-pointer text-gray-400 hover:text-red-500 hidden"
                  size="lg"
                  onClick={() => setAppointment("null")}
                />
              </div>
            ) : (
              <>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    data.type === "salon"
                      ? "bg-[#00ccbb]/20 text-[#00ccbb] font-bold"
                      : "text-gray-600"
                  }`}
                >
                  <FontAwesomeIcon icon={faScissors} />
                  <span>{t("saloonShops")}</span>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    data.type === "parlour"
                      ? "bg-[#00ccbb]/20 text-[#00ccbb] font-bold"
                      : "text-gray-600"
                  }`}
                >
                  <FontAwesomeIcon icon={faSpa} />
                  <span>{t("beautyParlours")}</span>
                </div>
              </>
            )}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-12 gap-4 w-[80%] mx-auto -mt-2">
            {/* Calendar */}
            <div className="md:col-span-4 col-span-12 relative z-10">
              <div ref={pickerRef}>
                <DatePicker
                  onChange={handleChange}
                  tileClassName={tileClassName}
                  value={value}
                  minDate={new Date()}
                  maxDate={new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)}
                  className="bg-white text-[#00ccbb] p-3 rounded-lg w-full shadow-sm border border-gray-300 drop-shadow-md focus:outline-none focus:ring-2 focus:ring-[#00ccbb] transition-all duration-200"
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="md:col-span-4 col-span-12">
              {loading || loadingg ? (
                <div className="p-3 w-full bg-gray-100 text-gray-500 text-center rounded-lg shadow-sm">
                  {t("loading")}
                </div>
              ) : appointment === "booking" ? (
                <button
                  onClick={() => setShowTimings(true)}
                  className="w-full  bg-white text-gray-800 p-3 rounded-lg flex items-center justify-between shadow-sm border border-gray-300 drop-shadow-md"
                >
                  {timeReserve ? (
                    <span
                      className={
                        lunch.includes(options[selectValue].id)
                          ? "text-red-500"
                          : ""
                      }
                    >
                      {timeReserve}
                    </span>
                  ) : (
                    <span>{t("selectTime")}</span>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500"
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
                </button>
              ) : appointment === "appointment" ? (
                <div className="text-center text-[#00ccbb] font-semibold">
                  Book an appointment!
                </div>
              ) : (
                <select
                  className="hidden w-full p-3 text-base bg-gray-100 border border-gray-300 rounded-lg shadow-sm"
                  onChange={(e) => setAppointment(e.target.value)}
                >
                  <option value={"null"} disabled selected>
                    Select Booking Type
                  </option>
                  <option value={"booking"}>Book an appointment</option>
                </select>
              )}
            </div>

            {/* Timings */}
            {showTimings && <ShowTheTimings />}

            {/* Select Services */}
            <div className="md:col-span-4 col-span-12">
              <button
                className="w-full bg-[#00ccbb] text-white p-3 rounded-lg font-semibold hover:bg-[#00b3a4] transition jello-horizontal"
                onClick={handleClick}
              >
                Select Services
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <h1 className="hotelTitle px-4 pt-4">Popular Packages</h1>
      {services?.length > 0 ? (
        <Test
          services={services}
          smallBanners={smallBanners}
          setHighlightBookingBox={setHighlightBookingBox}
          higlightBookingBox={higlightBookingBox}
        />
      ) : (
        ""
      )} */}
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
                    src={data?.images[slideNumber]?.url}
                    alt=""
                    className="sliderImg"
                    style={{
                      backgroundSize: "cover",
                      objectFit: "contain",
                      backgroundPosition: "center",
                      maxHeight: 400,
                    }}
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
          <div className="hotelWrapper">
            <div className="md:flex space-y-4 items-center justify-between">
              <div className="hotelWrapper">
                <h1 className="hotelTitle">
                  {t("salonName", { name: data.name })}
                </h1>
                <div className="space-x-3">
                  <FontAwesomeIcon icon={faLocationDot} color="#00ccbb" />

                  <a
                    className="text-[#00ccbb]"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.google.com/maps/dir/?api=1&origin=${
                      lat && lng ? `${lat},${lng}` : "My+Location"
                    }&destination=${data?.latLong?.coordinates[1]},${
                      data?.latLong?.coordinates[0]
                    }`}
                  >
                    {t("getDirectionsToShop")}
                  </a>
                </div>
                <span className="hotelDistance">Excellent location</span>
                {data?.individualOffer?.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 mt-2">
                    <span className="text-xl font-semibold text-center ">
                      {" "}
                      <FontAwesomeIcon icon={faTags} className="text-white" />
                      Offers on Individual Services
                    </span>
                    {data.individualOffer?.map((item1, index) => (
                      <div
                        key={index}
                        onClick={handleClick}
                        className="bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-4 rounded-xl shadow-md transition-all hover:scale-[1.02]"
                      >
                        <div className="flex justify-between items-center ">
                          <h3 className="text-md font-bold">
                            {item1?.service}
                          </h3>
                          <span className="bg-white text-[#00ccbb] text-xs font-bold px-2 py-1 rounded-full">
                            {item1?.offer}% OFF
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <>
                  {data?.overallShopOffer > 0 && (
                    <div className="my-3 space-y-6">
                      {" "}
                      <span className="text-xl font-semibold text-center ">
                        Hurrayyyy! 🎉🎉🎉 Shop Provides :
                      </span>
                      <div
                        onClick={handleClick}
                        className="bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-4 rounded-xl shadow-md transition-all hover:scale-[1.02]"
                      >
                        <div className="flex justify-between items-center ">
                          <h3 className="text-md font-bold">
                            Overall Shop Offer
                          </h3>
                          <span className="bg-white text-[#00ccbb] text-xs font-bold px-2 py-1 rounded-full">
                            {data?.overallShopOffer}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <marquee className="text-sm text-gray-600 pt-1">
                    <p
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });
                      }}
                      className="cursor-pointer text-xl font-semibold text-[#00ccbb]"
                    >
                      Click me to select services and book now...
                    </p>
                  </marquee>
                </>
                {data?.fullAddress && (
                  <span className="hotelDistance">
                    Full Address: {data?.fullAddress}
                  </span>
                )}
                {/* <span className="hotelPriceHighlight"> */}
                {/* Book over Rs.{data.cheapestPrice} at this shop and get a free Shaving. */}
                {/* {t("shopAbovePrice", { price: data.cheapestPrice })} */}
                {/* </span> */}
              </div>
              {fav ? (
                <div className="flex  items-center md:space-y-2 space-y-0  space-x-2">
                  <div>
                    <span className="text-xs ">Remove from Favourites</span>
                    <FontAwesomeIcon
                      icon={faHeart1}
                      size="lg"
                      className="cursor-pointer"
                      color="red"
                      onClick={handleFavourites}
                    />
                    <ShareButton />
                  </div>
                </div>
              ) : (
                <div className="flex  items-center md:space-y-2 space-y-0 space-x-2">
                  {" "}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs ">Add to Favourites</span>
                    <FontAwesomeIcon
                      icon={faHeart}
                      size="lg"
                      className="cursor-pointer"
                      onClick={handleFavourites}
                    />
                  </div>
                  <ShareButton />
                </div>
              )}
            </div>
            <div className="hotelImages mt-8">
              {data.images?.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo?.url}
                    alt="shop-img"
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
                <h2 className="font-semibold text-xl mb-3">
                  {t("customerReviews")}
                </h2>
                {reviews?.length === 0 && t("/noReviews")}

                {reviews?.map((review, i) => {
                  return (
                    <div
                      className="space-y-1 flex items-start space-x-5 "
                      key={i}
                    >
                      <div className="space-y-2.5 border-r-2 px-5">
                        {/* <strong>{review.name}</strong> */}
                        <strong>
                          {t("reviewName", { name: review.name })}
                        </strong>
                        {/* <h3>{review.createdAt.substring(0, 10)}</h3> */}
                        <h3>
                          {t("reviewCreated", {
                            created: review.createdAt.substring(0, 10),
                          })}
                        </h3>
                      </div>

                      <div>
                        {/* <Rating value={review.rating} readOnly></Rating> */}
                        <Rating
                          value={t("reviewRating", { rating: review.rating })}
                          readOnly
                        ></Rating>
                        {/* <h3>{review.comment}</h3> */}
                        <h3>
                          {t("reviewComment", { comment: review.comment })}
                        </h3>
                      </div>
                    </div>
                  );
                })}

                {user ? (
                  <form
                    onSubmit={reviewHandler}
                    className="text-black  bg-white rounded-md p-3"
                  >
                    <h1 className="font-semibold ">{t("leaveReview")}</h1>
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
                      {t("submit")}
                    </button>
                  </form>
                ) : (
                  <h1 className="font-semibold text-xl">
                    {t("please")}{" "}
                    <Link to={`/login?redirect=/shops/${shopIdLocation}`}>
                      <span className="text-blue-500">{t("login")}</span>
                    </Link>{" "}
                    {t("toWriteReview")}
                  </h1>
                )}
              </div>
              <div className="w-full bg-gray-200 md:mb-4 mb-14 rounded-md flex flex-col space-y-3 p-5 ">
                <h1>{t("perfectForYou")}</h1>
                <span>{t("shopHasAnExcellentLocationScoreOf9.8")}</span>

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
                    <p>{t("goTopAndReserve")}</p> &nbsp;
                    <FontAwesomeIcon icon={faCircleArrowUp} size="2x" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Hotel);
