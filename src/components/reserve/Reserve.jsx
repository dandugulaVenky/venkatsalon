import React, { useCallback, useContext } from "react";

import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faClose, faTag } from "@fortawesome/free-solid-svg-icons";

import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

import { useTranslation } from "react-i18next";

import { SearchContext } from "../../context/SearchContext";
import baseUrl from "../../utils/client";
import { AuthContext } from "../../context/AuthContext";

import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import SalonPreview from "../../pages/preview";
import axiosInstance from "../axiosInterceptor";

import MovingIcon from "./MovingIcon";

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
  // console.log(ampm);

  if (ampm === "P" && hours !== 12) {
    hours += 12;
  }
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  return date.getTime();
}

const Reserve = () => {
  const location = useLocation();
  const state = location?.state;
  const {
    shopId,
    shopName,
    shopOwner,
    minValuesObj,
    selectedValue,
    value,
    options,
    mergedServices,
    breakTime,
    lunch,
    type,
    subType,
    barbers,
    requests,
  } = state !== null && state;

  const { date: dater, time } = useContext(SearchContext);
  const barberBlock = requests?.filter(
    (item) =>
      item.date === moment(value).format("MMM Do YY") &&
      item.time === options[selectedValue]?.value &&
      item.shopId === shopId
  );
  let findBarbers;
  // console.log(barberBlock, "barberBlock");
  if (barberBlock?.length > 0) {
    findBarbers = barberBlock.flatMap((item) =>
      item.selectedSeats?.map((seat) => seat.barber._id)
    );
  }

  // const findBarbers =
  //   barberBlock && barberBlock?.selectedSeats.map((item) => item.barber._id);

  // console.log(findBarbers, "findBarbers");

  const [data, setData] = useState();

  const [salonPreview, setSalonPreview] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState();
  const [categories, setCategories] = useState();
  const [reserveState, setReserveState] = useState(null);
  const [allServices, setAllServices] = useState();
  const [offerFound, setOfferFound] = useState(false);
  const [categorizedOffers, setCategorizedOffers] = useState();
  const [showInclusions, setShowInclusions] = useState();
  const [superCategory, setSuperCategory] = useState("regular");
  const [category, setCategory] = useState();
  const [superCategories, setSuperCategories] = useState();
  const [gender, setGender] = useState(subType);

  const [loading, setLoading] = useState(false);

  const [height, setHeight] = useState(false);

  const [durationBySeat, setDurationBySeat] = useState([]);

  const [show, setShow] = useState(false);
  const [durations, setDurations] = useState([]);
  const [sortBy, setSortBy] = useState(null);

  const [previewServices, setPreviewServices] = useState();

  const [seats, setSeats] = useState();
  const [salonServices, setSalonServices] = useState();
  const [totalAmount, setTotalAmount] = useState(0);

  const [unisexType, setUnisexType] = useState("men");

  const { user } = useContext(AuthContext);

  const {
    data: shopOwnerData,
    loading: ownerDetailsLoading,
    error,
  } = useFetch(`${baseUrl}/api/users/getOwnerDetails/${shopOwner}`, {
    credentials: true,
  });

  const navigate = useNavigate();

  const { ownerEmail, ownerNumber } = shopOwnerData;
  const [totalTime, setTotalTime] = useState(0);
  const { t } = useTranslation();

  const [showSeats, setShowSeats] = useState({
    1: false,
    2: false,
    3: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [salonPreview]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY >= 80) {
        setHeight(true);
      } else {
        setHeight(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axiosInstance.get(
        `${baseUrl}/api/hotels/room/${shopId}`
      );
      // console.log(data[0].roomNumbers);
      setData(data);
      const res =
        data &&
        data[0]?.roomNumbers?.map((id, i) => {
          return { id: id._id, options: [], index: i };
        });

      setSeats(res);
      setPreviewServices(data[0]?.services);

      // const services = (data[0]?.services || []).reduce((arr, item) => {
      //   arr.push(item.category);
      //   return arr;
      // }, []);

      const mergedPreviewServices = data[0]?.services
        ?.reduce((arr, item) => {
          arr.push(item.services);
          return arr;
        }, [])
        .reduce((arr, item) => {
          return arr.concat(item);
        }, [])
        .filter(
          (item) =>
            item.subCategory === (gender === "unisex" ? unisexType : gender)
        );

      // console.log(mergedPreviewServices, "mergedPreviewServices");

      const totalTimeOfServices = mergedPreviewServices.reduce(
        (acc, service) => {
          return (acc += service.duration);
        },
        0
      );

      // console.log(totalTimeOfServices);

      setTotalTime(totalTimeOfServices);
      setAllServices(mergedPreviewServices);

      // setSalonServices(services);
      setCategories(data[0]?.services);

      //setting directly main category

      setSuperCategory("regular");
      const result1 = categories.filter((category, i) =>
        category.superCategory === "regular" &&
        category.subCategory === (gender === "unisex" ? unisexType : gender)
          ? category.services
          : null
      );

      const services = result1.reduce((arr, item) => {
        const foundOffer = item.services.find((item) => item.offer > 0);

        setOfferFound((prevOfferFound) => prevOfferFound || foundOffer);

        arr.push({
          category: item.category,
          offer: foundOffer ? true : false,
        });
        return arr;
      }, []);

      const offerss = data[0]?.services
        ?.map((item) => item)
        .map((item) => item.services)
        .flat()
        .filter((item) => item.offer > 0);
      console.log(offerss, "offerss");

      const groupedByCategory = offerss
        .filter((item) => item.offer > 0)
        .reduce((acc, curr) => {
          const { category } = curr;

          if (!acc[category]) {
            acc[category] = {
              category,
              services: [],
            };
          }

          acc[category].services.push(curr);
          return acc;
        }, {});

      // Convert grouped object to array
      const categorizedOffers = Object.values(groupedByCategory);
      setCategorizedOffers(categorizedOffers);
      setSalonServices(services);

      // console.log({ d: data[0]?.services, k: services }, "data[0]?.services");

      //setting directly subcategory
      setCategory(services[0]);
      const result = categories.filter((category, i) =>
        category.category === services[0]?.category &&
        category.subCategory === (gender === "unisex" ? unisexType : gender)
          ? category.services
          : null
      );
      setCategoriesOptions(result[0].services);
      setSuperCategory(() => {
        const result = categories.filter((category, i) =>
          category.category === services[0]?.category &&
          category.subCategory === (gender === "unisex" ? unisexType : gender)
            ? category.superCategory
            : null
        );
        return result[0]?.superCategory || "";
      });
      setLoading(true);
    };
    !loading && gender && fetchData();
  }, [categories, gender, loading, shopId, unisexType]);

  //Second Step----------------------------------------------------------------------------->
  //finding wether there is booking in front of this selected time here
  useEffect(() => {
    const findDurationsToBlock = () => {
      const filteredUnavailableDates = () => {
        const compareDate = moment(value).format("MMM Do YY");
        const unavailableDates = [];

        for (let i = 0; i < data[0]?.roomNumbers.length; i++) {
          const array = data[0]?.roomNumbers[i];

          const roomUnavailableDates = array?.unavailableDates?.filter(
            (item) => {
              return compareDate === item.date;
            }
          );

          if (roomUnavailableDates?.length > 0) {
            unavailableDates.push({
              room: array.number,
              unavailableDates: roomUnavailableDates,
            });
          }
        }

        return unavailableDates;
      };

      const arrays = filteredUnavailableDates();

      // console.log(arrays, "newArrays");

      const minFound = []; // declare an array to store objects

      //here we are storing all the varaibles with the true or false vaiables based on wether the block values found from the unavailableDates

      arrays?.forEach((array, i) => {
        const matchedIndexes = [];
        array?.unavailableDates?.forEach((item, j) => {
          let conditions = [];
          for (let k = 0; k <= totalTime / 10; k++) {
            conditions.push(options[selectedValue + k]);
          }

          conditions?.some((condition, index) => {
            if (condition?.value === item.time) {
              // console.log({ condition, item, index, selectedValue });
              matchedIndexes.push(index);
              return true; // break out of loop
            }
          });
        });

        //here we get all the matched Items from the unaivalable Dates and pushing all the indexes found, and immediately
        //  finding smallest number because if 10min found from options[selectedValue + 1]

        // console.log(matchedIndexes, "matchedIndexes");
        const smallestNumber = Math.min(...matchedIndexes);

        // dynamically declare and assign boolean variables

        minFound[i] = {};

        for (let l = 1; l < totalTime / 10; l++) {
          minFound[i][`min${l * 10}found${i + 1}`] = smallestNumber === l;
        }
      });

      // console.log(minFound, "minFound");

      const allKeys = [];

      for (let i = 0; i < minFound?.length; i++) {
        const keys = Object.keys(minFound[i]);
        allKeys.push(...keys);
      }

      const getFilteredKeys = () => {
        return minFound
          .map((obj) => Object.keys(obj).filter((key) => obj[key]))
          .flat();
      };

      const filteredKeys = getFilteredKeys();

      // console.log({ allKeys, filteredKeys, minFound, seats }, "filteredKeys");

      const getDurations = () => {
        return filteredKeys
          .filter((key) => allKeys?.includes(key))
          .map((key) => {
            return {
              dur: parseInt(key.match(/\d+/)[0]),
              key,
            };
          });
      };

      const durations = getDurations();
      // console.log(durations, "durations");
      setDurations(durations);
      setShow(true);

      console.log("Done");
    };
    data && data[0]?.roomNumbers && totalTime && findDurationsToBlock();
  }, [data, options, selectedValue, totalTime, value]); //wantedly i guesss

  //starting here checking availability of options, if not disable the select boxes accordingly

  //check if the room is available to book or not

  const isAvailable = useCallback(
    (i) => {
      const array = data[0]?.roomNumbers[i];

      const compareDate = moment(value).format("MMM Do YY");

      const found = array.unavailableDates.map((item) => {
        return compareDate === item.date && item.values.includes(selectedValue);
      });

      return found?.includes(true);
    },
    [data, selectedValue, value]
  );

  //Third Step---------------------------------------------------------------------------->

  //update the options with ids corrospondingly with inputs

  useEffect(() => {
    const filtered = categories?.filter((item) => item.subCategory === gender);

    const services = (filtered || []).reduce((arr, item) => {
      arr.push(item.superCategory);
      return arr;
    }, []);

    setSuperCategories(services);
  }, [categories, gender]);

  const handleChange = (e) => {
    setCategory(e.target.value);
    const result = categories.filter((category, i) =>
      category.category === e.target.value &&
      category.subCategory === (gender === "unisex" ? unisexType : gender)
        ? category.services
        : null
    );

    // console.log(result);
    setCategoriesOptions(result[0].services);
    setSuperCategory(() => {
      const result = categories.filter((category, i) =>
        category.category === e.target.value &&
        category.subCategory === (gender === "unisex" ? unisexType : gender)
          ? category.superCategory
          : null
      );
      return result[0]?.superCategory || "";
    });
  };
  const handleSuperCategoryChange = (e) => {
    setSuperCategory(e.target.value);
    const result = categories.filter((category, i) =>
      category.superCategory === e.target.value &&
      category.subCategory === (gender === "unisex" ? unisexType : gender)
        ? category.services
        : null
    );
    const services = result.reduce((arr, item) => {
      arr.push(item.category);
      return arr;
    }, []);

    setSalonServices(services);
    // setCategoriesOptions(result[0].services);
  };

  // const handleSortChange = (e) => {
  //   setSortBy(e.target.value);
  //   setSalonServices(null);

  //   setCategoriesOptions(null);

  //   let currentCategory = superCategories?.filter((item) =>
  //     item.toLowerCase().includes(e.target.value)
  //   );
  //   setSuperCategory(currentCategory[0] || "");

  //   // console.log(superCategories, e.target.value);
  //   // setAllServices()
  // };

  useEffect(() => {
    let result = [];
    const filtered = categories?.filter((item) => item.subCategory === gender);

    const services = (filtered || []).reduce((arr, item) => {
      arr.push(item.category);
      return arr;
    }, []);

    if (sortBy === "spa") {
      result = services?.filter((category, i) => category.includes("spa"));
    } else if (sortBy === "salon") {
      result = services?.filter(
        (category, i) =>
          !category.includes("salon") && !category.includes("spa")
      );
    } else {
      result = services?.filter((category, i) => !category.includes(sortBy));
    }

    setSalonServices(result);
  }, [sortBy]); //this id wantedly kept missing dependencies

  const handleOptionChange = (event, seatId, service, seatIndex) => {
    const updatedSeats = seats.map((seat) => {
      if (seat.id === seatId) {
        if (event.target.checked) {
          seat.options.push(event.target.name);
        } else {
          seat.options = seat.options.filter(
            (option) => option !== event.target.name
          );
        }
      }
      return seat;
    });

    //update the amount and duration according to the roomIds

    let newAmount = totalAmount;
    let existingDuration = durationBySeat.find((d) => d.id === seatId);
    let newDuration = existingDuration ? existingDuration.value : 0;
    let seatAmount = existingDuration ? existingDuration.amount : 0;

    if (event.target.name === service.service) {
      let newPrice = Number(
        service.offer > 0
          ? (service.price * (1 - service.offer / 100)).toFixed(1)
          : service.price
      );

      console.log({ newPrice }, "newPrice");

      if (event.target.checked) {
        newAmount += newPrice;
        seatAmount += newPrice;

        newDuration += service.duration;
      } else {
        newAmount -= newPrice;
        seatAmount -= newPrice;

        newDuration -= service.duration;
      }
    }

    setTotalAmount(newAmount);

    if (existingDuration) {
      setDurationBySeat(
        durationBySeat.map((d) => {
          if (d.id === seatId) {
            return {
              id: seatId,
              value: newDuration,
              amount: seatAmount,

              seatNo: seatIndex,
            };
          } else {
            return d;
          }
        })
      );
    } else {
      setDurationBySeat([
        ...durationBySeat,
        {
          id: seatId,
          value: newDuration,
          amount: seatAmount,

          seatNo: seatIndex,
        },
      ]);
    }
    // console.log(seats, "seats");
    if (!event.target.checked) {
      let clearUpdatedSeats = seats.map((seat) => {
        if (seat.id === seatId) {
          if (seat.options.length === 0) return { ...seat, barber: null };
        }
        return seat;
      });

      setSeats(clearUpdatedSeats);
    } else {
      setSeats(updatedSeats);
    }
  };

  const handleBarberSelection = (selectedBarber, seatId) => {
    const updatedSeats = seats.map((seat) => {
      if (seat.id === seatId) {
        // Assign the selected barber to the current seat
        return { ...seat, barber: selectedBarber };
      } else if (seat.barber?._id === selectedBarber._id) {
        // Remove the barber from other seats if already assigned
        return { ...seat, barber: null };
      }
      return seat;
    });

    setSeats(updatedSeats);
  };

  //generating Id for common id for whole booking process
  const generateRandomString = useCallback((length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }, []);

  const id = generateRandomString(10);

  //getting time selected for individual Seats
  const getTotalTime = useCallback(
    (seat) => {
      const result = durationBySeat?.filter(
        (option) => option.id === seat.id
      )[0];

      let ans = {};

      if (result !== undefined) {
        const hours = Math.floor(result.value / 60);
        const remainingMinutes = result.value % 60;
        if (result?.value >= 60) {
          ans["time"] = `${hours} h, ${remainingMinutes} min`;
          ans["amount"] = result.amount;
        } else {
          ans["time"] = ` ${remainingMinutes} min`;
          ans["amount"] = result.amount;
        }
      } else {
        ans["time"] = 0;
        ans["amount"] = 0;
      }
      return ans;
    },

    [durationBySeat]
  );

  if (error) {
    return navigate("/login", { state: { destination: `/shops/${shopId}` } });
  }

  const previewHandler = async (amount, e) => {
    e.preventDefault();
    let day1 = moment(value).format("MMM Do YY");
    let day2 = moment(new Date()).format("MMM Do YY");

    let result = convertToMilliseconds(time);
    let result2 = compareTimeDiff(result);

    if (day1 === day2 && result2 >= 0) {
      return toast("Please select a valid time!");
    }

    if (amount < 1) {
      return alert(t("SelectOption"));
    }

    //getting end value from optiond and checking wetherr user is booking beyond the time limit given by owner
    const num1 = Number(options[options.length - 1].id);
    const num2 = Number(
      options.filter((option) => option.id === selectedValue)[0].id
    );

    // console.log(breakTime, "breakTime");

    if (breakTime !== undefined) {
      const breakTimeFiltered = breakTime?.block.filter(
        (item) => item > selectedValue
      )[0];

      const check0 = durationBySeat.map((duration) =>
        duration.value > (breakTimeFiltered - selectedValue) * 10
          ? { seatNo: duration.seatNo, isReachedEnd: true }
          : { seatNo: duration.seatNo, isReachedEnd: false }
      );

      const lunch = check0.map((item) => {
        if (item.isReachedEnd) {
          // alert(
          //   `You can only book1 until ${
          //     options[selectedValue + (breakTimeFiltered - selectedValue)].value
          //   } because owner has blocked from next ${
          //     (breakTimeFiltered - selectedValue) * 10
          //   } mins in Seat No.${item.seatNo + 1} `
          // );
          alert(
            t("ownerBlockedTime", {
              time: options[selectedValue + (breakTimeFiltered - selectedValue)]
                .value,
              mins: (breakTimeFiltered - selectedValue) * 10,
              seatNum: item.seatNo + 1,
            })
          );
          return true;
        }
      });

      if (lunch.includes(true)) {
        return null; // Stop execution of the whole function
      }
    }
    // console.log({ num1, num2, durationBySeat, seats }, "durationBySeat");
    const check = durationBySeat.map((duration) =>
      duration.value > (num1 - num2) * 10
        ? { seatNo: duration.seatNo, isReachedEnd: true }
        : { seatNo: duration.seatNo, isReachedEnd: false }
    );

    // console.log(check, "check");
    //this is to compare with the whole shop time
    if (check) {
      const showEnd = check.map((item) => {
        if (item.isReachedEnd) {
          alert(
            `You can only book until ${
              options[options.length - 1].value
            }, so please select only ${(num1 - num2) * 10} mins in Seat No.${
              item.seatNo + 1
            } `
          );

          // alert(
          //   t("lessTimeLeft", {
          //     time: options[options.length - 1].value,
          //     mins: (num1 - num2) * 10,
          //     seatNum: item.seatNo + 1,
          //   })
          // );
          return true;
        } else {
          return false;
        }
      });

      if (showEnd.includes(true)) {
        return null; // Stop execution of the whole function
      } else {
        const getReturn = (item1, item2) => {
          const minutes = item1;
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          item1 > 60
            ? alert(
                t("reachingOthersTime", {
                  time: options[selectedValue + item1 / 10].value,
                  hours: hours,
                  mins: remainingMinutes,
                  seatNum: item2 + 1,
                })
              )
            : alert(
                `Others have a booking at ${
                  options[selectedValue + item1 / 10].value
                }. Please choose only a option which is of ${item1} minutes in seat${
                  item2 + 1
                } `
              );

          // alert(
          //   t("reachingOthersTime1", {
          //     time: options[selectedValue + item1 / 10].value,
          //     mins: item1,
          //     seatNum: item2 + 1,
          //   })
          // );

          return 0;
        };

        const error = seats?.map((item) => {
          if (item.options.length > 0 && !item?.barber) {
            alert(`Please select a barber for seat number ${item?.index + 1}`);
            throw new Error("Please select a barber for seat number");
          }
          const output = durationBySeat?.map((item1) => {
            return item?.id === item1?.id &&
              item.index ===
                Number(
                  durations[durations.length > 1 ? item?.index : 0]?.key
                    .split("")
                    ?.reverse()[0]
                ) -
                  1
              ? item1?.value >
                durations[durations.length > 1 ? item?.index : 0]?.dur
                ? getReturn(
                    durations[durations.length > 1 ? item?.index : 0]?.dur,
                    item?.index
                  )
                : null
              : null;
          });
          return output;
        });
        const mergedArr = [].concat(...error);

        if (mergedArr.includes(0)) {
          return;
        }

        const lunchStart = Number(options[36].id);
        // const lunchEnd = Number(
        //   options.filter((option) => option.id === selectedValue)[0].id
        // );

        const check1 = durationBySeat.map((duration) =>
          lunchStart > selectedValue &&
          lunchStart - selectedValue > 0 &&
          duration.value > (lunchStart - selectedValue) * 10
            ? { seatNo: duration.seatNo, isReachedEnd: true }
            : { seatNo: duration.seatNo, isReachedEnd: false }
        );

        // lunchStart - lunchEnd > 0  because lunch timeat 1pm will be - if we select at 2pm
        if (check1) {
          const lunch = check1.map((item) => {
            if (item.isReachedEnd && lunchStart - selectedValue > 0) {
              // alert(
              //   `You can only book2 until ${
              //     options[selectedValue + 1].value
              //   } because it is lunch time for owner in this shop, so please select only ${
              //     (lunchStart - lunchEnd) * 10
              //   } mins in Seat No.${item.seatNo + 1} `
              // );
              alert(
                t("ownerLunchTime", {
                  time: options[lunchStart].value,
                  mins: (lunchStart - selectedValue) * 10,
                  seatNum: item.seatNo + 1,
                })
              );
              return true;
            } else {
              return false;
            }
          });
          if (lunch.includes(true)) {
            return null;
          }
        }

        // console.log("I am coming!sd");
        //Here the values are used to block the time in dropdown based on id. example : value will be like value:[71,72] which means to block 71--> 8:50 Pm 72--->9:00 Pm from options.
        //update the values option in dates array according to the duration selected by the user from the respective seats from durationBySeat array

        const generateUpdatedDurationBySeat = () => {
          const minLookup = {};

          for (let i = 1; i <= Object.keys(minValuesObj).length; i++) {
            minLookup[i * 10] = minValuesObj[`min${i * 10}`];
          }

          const updatedDurationBySeat = durationBySeat.map((item) => {
            const minValue = minLookup[item.value];

            return minValue ? { ...item, value: minValue } : item;
          });

          return updatedDurationBySeat;
        };

        const updatedDurationBySeat = generateUpdatedDurationBySeat();

        // updates dates with all the options to send to room unavilableDates with all the options to backend.

        // console.log(seats, "mawaaaaa");
        const dates = updatedDurationBySeat?.map((item, i) => {
          return {
            time: time,
            date: moment(dater).format("MMM Do YY"),
            isAccepted: "false",
            bookId: id,
            findId: item.id,
            options: seats
              .filter((ikem) => {
                if (ikem.id === item.id) {
                  return true;
                }
              })
              .map((ikem) => ikem.options)
              .flat(),
            values: updatedDurationBySeat[i]?.value,

            createdAt: new Date().toISOString(),
          };
        });
        // console.log(superCategory, "doneRajaDan");
        if (dates) {
          setReserveState({
            selectedSeats: seats,
            totalAmount,
            roomId: data[0]?._id,
            shopOwner,
            shopId,
            shopName,
            ownerEmail,
            ownerNumber,
            bookId: id,
            user,
            link: "https://saalons.com/history",
            dates,
            previewServices,
            type,
            subCategory: gender,
            superCategory,
          });
          // toast("preview");
          setSalonPreview(true);
        } else {
          toast("something wrong!");
          return;
        }
      }
    }
  };

  const handleInclusions = (e, option) => {
    e.preventDefault();

    // const inclusions = option.inclusions.map((inclusion) => {
    //   return allServices.filter(
    //     (service) =>
    //       service.service === inclusion.service &&
    //       service.subCategory === option.subCategory
    //   )[0];
    // });

    const inclusions = option.inclusions
      .map((inclusion) => {
        const matchedService = allServices.find(
          (service) =>
            service.service === inclusion.service &&
            service.subCategory === option.subCategory
        );

        return matchedService
          ? { ...matchedService, free: inclusion.free }
          : null;
      })
      .filter(Boolean);

    setShowInclusions({
      inclusions: inclusions,
      package: option.service,
      type: option.category,
    });
  };

  const ShowInclusions = () => {
    const freeInclusions = showInclusions?.inclusions?.filter(
      (option) => option.free === true
    );

    const paidInclusions = showInclusions?.inclusions?.filter(
      (option) => option.free !== true
    );

    if (showInclusions?.type === "offers") {
      return (
        showInclusions?.inclusions?.length > 0 && (
          <div className="reserve items-center justify-center p-6">
            <div className="overflow-auto ">
              <FontAwesomeIcon
                icon={faClose}
                size="lg"
                onClick={() => {
                  setShowInclusions(null);
                }}
                className="right-20 absolute top-10 text-white"
              />
              <>
                <div className="flex flex-col gap-4 items-center justify-between h-[10vh] mt-16 ">
                  <p className="text-white">
                    Cost of Free Services : &#8377;&nbsp;
                    {freeInclusions?.reduce(
                      (acc, service) => acc + service?.price,
                      0
                    )}
                  </p>

                  <p className="text-white">
                    Cost of Paid Services : &#8377;&nbsp;
                    {paidInclusions?.reduce(
                      (acc, service) => acc + service?.price,
                      0
                    )}
                  </p>

                  <p className="text-white">
                    You are saving : &#8377;&nbsp;
                    {freeInclusions?.reduce(
                      (acc, service) => acc + service?.price,
                      0
                    )}
                  </p>
                </div>

                {/* Free Services Table */}
                {freeInclusions?.length > 0 && (
                  <div className="mb-10 mt-16">
                    <h2 className="text-lg font-semibold text-white mb-2">
                      Free Services
                    </h2>
                    <table className="min-w-[70vw]">
                      <thead className="border-b bg-gray-300">
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left md:text-md text-sm md:p-5 p-4">
                            Service Name
                          </th>
                          <th className="md:p-5 p-4 md:text-md text-sm text-right">
                            Price
                          </th>
                          <th className="md:p-5 p-4 md:text-md text-sm text-right">
                            Duration
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {freeInclusions.map((option, j) => (
                          <tr
                            key={`free-${j}`}
                            className="border-b-2 border-white"
                          >
                            <td className="md:text-md text-sm flex items-center justify-start p-5 space-x-2">
                              <label className="text-white">
                                {option?.service}
                              </label>
                            </td>
                            <td className="p-5 text-right md:text-md text-sm">
                              <label className="text-white">
                                &#8377; {option?.price}
                              </label>
                            </td>
                            <td className="p-5 text-right md:text-md text-sm">
                              <label className="text-white">
                                {option?.duration} min
                              </label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Paid Services Table */}
                {paidInclusions?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-2">
                      Paid Services
                    </h2>
                    <table className="min-w-[70vw]">
                      <thead className="border-b bg-gray-300">
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left md:text-md text-sm md:p-5 p-4">
                            Service Name
                          </th>
                          <th className="md:p-5 p-4 md:text-md text-sm text-right">
                            Price
                          </th>
                          <th className="md:p-5 p-4 md:text-md text-sm text-right">
                            Duration
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paidInclusions.map((option, j) => (
                          <tr
                            key={`paid-${j}`}
                            className="border-b-2 border-white"
                          >
                            <td className="md:text-md text-sm flex items-center justify-start p-5 space-x-2">
                              <label className="text-white">
                                {option?.service}
                              </label>
                            </td>
                            <td className="p-5 text-right md:text-md text-sm">
                              <label className="text-white">
                                &#8377; {option?.price}
                              </label>
                            </td>
                            <td className="p-5 text-right md:text-md text-sm">
                              <label className="text-white">
                                {option?.duration} min
                              </label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            </div>
          </div>
        )
      );
    } else {
      return (
        showInclusions?.inclusions?.length > 0 && (
          <div className="reserve items-center justify-center">
            <div className="overflow-x-auto  ">
              <FontAwesomeIcon
                icon={faClose}
                size="lg"
                onClick={() => {
                  setShowInclusions(null);
                }}
                className="right-20 absolute top-10 text-white"
              />
              <>
                <div className="flex items-center justify-between h-[10vh]  ">
                  <p className="text-white">
                    Cost of Services : &#8377;&nbsp;
                    {showInclusions?.inclusions.reduce(
                      (acc, service) => acc + service?.price,
                      0
                    )}
                  </p>
                </div>
                <table className="min-w-[70vw] ">
                  <thead className="border-b bg-gray-300 ">
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left md:text-md text-sm md:p-5 p-4">
                        Service Name
                      </th>
                      <th className=" md:p-5 p-4 md:text-md text-sm text-right">
                        Price
                      </th>
                      {/* <th className="md:p-5 p-4  md:text-md text-sm text-right">
                                  Category
                                </th> */}
                      <th className="md:p-5 p-4  md:text-md text-sm text-right">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {showInclusions?.inclusions?.map((option, j) => {
                      return (
                        <tr key={j} className="border-b-2 border-white">
                          <td className="md:text-md text-sm flex items-center justify-start p-5 space-x-2">
                            <label className="text-white">
                              {option?.service}
                            </label>
                          </td>
                          <td className="p-5 text-right md:text-md text-sm">
                            <label className="text-white">
                              &#8377; {option?.price}
                            </label>
                          </td>

                          {/* <td className="p-5 text-right md:text-md text-sm">
                                        {option.category}
                                      </td> */}
                          <td className="p-5 text-right md:text-md text-sm">
                            <label className="text-white">
                              {option?.duration} min
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            </div>
          </div>
        )
      );
    }
  };

  const OffersSection = ({ categorizedOffers }) => {
    return (
      <div className="space-y-6">
        {categorizedOffers?.map((categoryGroup) => (
          <div
            key={categoryGroup.category}
            className="p-4 bg-white shadow-lg rounded-2xl border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-[#00ccbb] mb-3 border-b pb-1">
              {categoryGroup.category} Offers
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryGroup.services.map((service) => (
                <div
                  key={service.service}
                  onClick={() =>
                    window.scrollTo(0, window.innerWidth > 500 ? 200 : 400)
                  }
                  className="bg-gradient-to-br from-orange-500 to-yellow-400 text-white rounded-xl p-4 shadow-md hover:scale-[1.02] transition-transform"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold">{service.service}</h3>
                    <span className="bg-white text-[#00ccbb] px-2 py-1 text-xs rounded-full font-semibold">
                      {service.offer}% OFF
                    </span>
                  </div>
                  {/* <p className="text-sm mb-1">Price: ₹{service.price}</p>
                  <p className="text-sm">Duration: {service.duration} min</p> */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (seats?.length > barbers?.length) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <h1 className="text-center text-2xl text-gray-700">
          Barbers are not available currently!
        </h1>
      </div>
    );
  }

  return (
    <div
      className={`${!(salonPreview && reserveState !== null) && "pt-6 pb-8"}`}
    >
      <ShowInclusions />
      {salonPreview && reserveState !== null ? (
        <div className="min-h-screen">
          <SalonPreview
            state={reserveState}
            setPreview={setSalonPreview}
            mergedServices={mergedServices}
            offer={data && data[0]?.offer}
          />
        </div>
      ) : (
        <div>
          {data && data[0]?.offer ? (
            <p className="text-center text-lg font-semibold text-green-500 mb-2">
              <FontAwesomeIcon icon={faTag} className="mr-2" /> This Salon is
              giving {data && data[0]?.offer}% discount on final booking Price.
            </p>
          ) : (
            ""
          )}
          {categorizedOffers?.length > 0 && (
            <OffersSection categorizedOffers={categorizedOffers} />
          )}
          <div className="flex items-center md:justify-start justify-center flex-wrap space-x-2 min-h-[12vh] md:w-[90vw] w-[95.5vw] mx-auto px-2">
            {/* {!categoriesOptions?.length > 0 && sortBy === null && (
              <select
                className="md:w-52 w-auto"
                onChange={(e) => {
                  setGender(e.target.value);
                  setLoading(false);
                  setCategoriesOptions(null);
                  setSalonServices(null);
                }}
              >
                <option value={null} selected disabled>
                  Select Gender
                </option>
                <option value={"men"}>men</option>
                <option value={"women"}>women</option>
              </select>
            )} */}
            <select
              className="md:w-52 w-auto hidden"
              onChange={handleSuperCategoryChange}
              value={superCategory}
            >
              <option selected value="">
                {t("selectCategory")}
              </option>
              {/* {superCategories?.map((service, i) => {
                return <option key={i}>{service}</option>;
              })} */}
              <option selected>regular</option>
            </select>

            <select
              className={`md:w-52 w-auto ${gender !== "unisex" && "hidden"}`}
              onChange={(e) => {
                setUnisexType(e.target.value);
                setLoading(false);
                setCategoriesOptions(null);
                setSalonServices(null);
                setCategory(null);
                setSuperCategory(null);
                setSortBy(null);
              }}
              value={unisexType}
            >
              <option value="">Select Gender</option>

              <option selected>men</option>
              <option>women</option>
            </select>

            <select
              className="md:w-52 w-auto jello-horizontal"
              onChange={handleChange}
            >
              <option>Select Sub Category</option>

              {salonServices?.map((service, i) => {
                return (
                  <option
                    key={i}
                    selected={service.category === category.category}
                    value={service.category}
                    className={`${
                      service.offer ? "text-green-400" : "text-gray-700"
                    }`}
                  >
                    {service?.category} {service.offer ? "(Discount in %)" : ""}
                  </option>
                );
              })}
            </select>

            {offerFound && (
              <img
                src="https://cdn4.iconfinder.com/data/icons/flat-color-sale-tag-set/512/Accounts_label_promotion_sale_tag_32-512.png"
                alt="offer"
                className="w-20 h-20 absolute -right-3 top-16"
              />
            )}
            {/* {(sortBy !== null || categoriesOptions?.length > 0) && (
              <select className="md:w-52 w-auto" onChange={handleSortChange}>
                <option selected>Sort By</option>
                <option value="salon">salon services</option>
                <option value="spa">spa services</option>
              </select>
            )} */}
            {(sortBy !== null || categoriesOptions?.length > 0) && (
              <p className="bg-[#00ccbb] shadow-custom border-2 border-gray-100 rounded-full px-2 py-1">
                {gender ? gender : ""}
              </p>
            )}
          </div>

          {categoriesOptions?.length > 0 ? (
            <div className="grid md:grid-cols-5 lg:grid-cols-4 lg:gap-5 md:gap-5  pb-10 md:w-[90vw] w-[95.5vw] mx-auto">
              <div className=" lg:col-span-3 md:col-span-3 overflow-x-auto">
                <h1 className="text-md font-semibold my-4">
                  Click below here to select services.
                </h1>

                {show ? (
                  seats?.map((seat, i) => {
                    const seatValues = getTotalTime(seat);
                    const selectedOptions = new Set(seat.options);
                    const isDisabled = isAvailable(i);

                    return (
                      !isDisabled && (
                        <div className="card md:p-5 p-1.5 " key={i}>
                          <h2
                            onClick={() =>
                              setShowSeats((prevSeats) => ({
                                ...prevSeats,
                                [i + 1]: !showSeats[i + 1],
                              }))
                            }
                            className="mb-2 text-lg flex items-center justify-between text-white font-extrabold bg-[#00ccbb] p-5 w-full slide-in-right"
                          >
                            <span>
                              {t("seat")} {i + 1}
                            </span>
                            <span>&#8377; {seat ? seatValues.amount : 0}</span>
                            <p className="flex items-center justify-between">
                              <FontAwesomeIcon icon={faClock} size="sm" />{" "}
                              <span className="ml-1">
                                {seat ? seatValues.time : 0}
                              </span>
                            </p>
                            <div>
                              {showSeats[i + 1] === true ? (
                                <MovingIcon direction="up" side={true} />
                              ) : (
                                <MovingIcon direction="down" side={false} />
                              )}
                            </div>
                          </h2>

                          {showSeats[i + 1] === true && (
                            <div>
                              <div className="overflow-x-auto w-full">
                                <table className="min-w-full">
                                  <thead className="border-b bg-gray-300">
                                    <tr className="border-b-2 border-gray-200">
                                      <th className="text-left md:text-md text-sm md:p-5 p-4">
                                        {t("serviceName")}
                                      </th>
                                      <th className="md:p-5 p-4 md:text-md text-sm text-right">
                                        {t("price")}
                                      </th>
                                      {(category === "packages" ||
                                        category === "offers") && (
                                        <th className="md:p-5 p-4 md:text-md text-sm text-right">
                                          Inclusions
                                        </th>
                                      )}
                                      <th className="md:p-5 p-4 md:text-md text-sm text-right">
                                        {t("duration")}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {show &&
                                      categoriesOptions?.map((option, j) => (
                                        <>
                                          {option.description !== "" && (
                                            <>
                                              <p className="text-green-400  text-sm pt-3 pl-3 pr-3">
                                                *{option.description}
                                              </p>
                                              {option.offer !== 0 && (
                                                <p className="text-green-400  text-sm pt-3 pl-3 pr-3">
                                                  Offer : {option.offer}%
                                                </p>
                                              )}
                                            </>
                                          )}
                                          <tr
                                            key={j}
                                            className="border-b-2 border-gray-200"
                                          >
                                            <td className="md:text-md text-sm flex items-center justify-start p-5 space-x-2">
                                              <MovingIcon
                                                direction="right"
                                                side={true}
                                              />
                                              <input
                                                type="checkbox"
                                                name={option.service}
                                                checked={selectedOptions.has(
                                                  option.service
                                                )}
                                                className="h-6 w-6"
                                                id={option.service}
                                                onChange={(event) =>
                                                  handleOptionChange(
                                                    event,
                                                    seat.id,
                                                    option,
                                                    seat.index
                                                  )
                                                }
                                              />
                                              <label
                                                htmlFor={option.service}
                                                className="text-gray-900 cursor-pointer"
                                              >
                                                {option.service}
                                                {option.offer !== 0 && (
                                                  <>
                                                    {" "}
                                                    <br />
                                                    <span className="text-green-400">
                                                      {option.offer} off/-
                                                    </span>
                                                  </>
                                                )}
                                              </label>
                                            </td>

                                            <td className="p-5 text-right md:text-md text-sm">
                                              <label
                                                htmlFor={option.service}
                                                className="cursor-pointer "
                                              >
                                                {" "}
                                                <span
                                                  className={` ${
                                                    option.offer !== 0 &&
                                                    "line-through"
                                                  } mr-2`}
                                                >
                                                  {" "}
                                                  &#8377; {option.price}
                                                </span>
                                                {option.offer !== 0 && (
                                                  <span>
                                                    {" "}
                                                    &#8377;{" "}
                                                    {(
                                                      option.price *
                                                      (1 - option.offer / 100)
                                                    ).toFixed(1)}
                                                  </span>
                                                )}
                                              </label>
                                            </td>

                                            {(category === "packages" ||
                                              category === "offers") && (
                                              <td className="p-5 text-right md:text-md text-sm">
                                                <label
                                                  className="text-gray-900 underline cursor-pointer"
                                                  onClick={(e) =>
                                                    handleInclusions(e, option)
                                                  }
                                                >
                                                  {t("showinclusions")}
                                                </label>
                                              </td>
                                            )}
                                            <td className="p-5 text-right md:text-md text-sm">
                                              <label
                                                htmlFor={option.service}
                                                className="cursor-pointer"
                                              >
                                                {option.duration} {t("min")}
                                              </label>
                                            </td>
                                          </tr>
                                        </>
                                      ))}
                                  </tbody>
                                </table>
                              </div>

                              <div>
                                <h3 className="text-lg font-bold mt-5">
                                  {t("Select a Barber")}
                                </h3>
                                <div className="grid grid-cols-3 gap-4 mt-3">
                                  {barbers?.map((barber) => {
                                    const isBarberAssigned = seats?.some(
                                      (seat) => seat.barber?._id === barber._id
                                    );

                                    // console.log(barbers, findBarbers, "barber");
                                    const isBooked = findBarbers?.some(
                                      (item) => item === barber._id
                                    );

                                    if (isBooked) {
                                      return null;
                                    }

                                    return (
                                      <div
                                        key={barber._id}
                                        className={`p-3 border rounded-md cursor-pointer  ${
                                          isBarberAssigned
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-white"
                                        }`}
                                        onClick={() => {
                                          if (!isBarberAssigned) {
                                            handleBarberSelection(
                                              barber,
                                              seat.id
                                            );
                                          }
                                        }}
                                      >
                                        <img
                                          src={barber.profileImage}
                                          alt={barber.name}
                                          className="w-16 h-16 rounded-full"
                                        />
                                        <h4 className="mt-2 font-semibold overflow-auto">
                                          {barber.name}
                                        </h4>

                                        <p>
                                          {t("Experience")}: {barber.experience}{" "}
                                          years
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    );
                  })
                ) : (
                  <div className="flex items-start mt-20 justify-center min-h-screen">
                    <span className="buttonloader"></span>
                  </div>
                )}
              </div>
              <div className="lg:col-span-1 md:col-span-2">
                <div
                  className={`card  p-5 ${
                    height
                      ? "md:sticky top-24  lg:py-5 transition-all delay-200"
                      : ""
                  }`}
                >
                  <h2 className="mb-2 text-lg font-bold">
                    {" "}
                    {t("orderSummary")}
                  </h2>
                  <ul>
                    <li>
                      <div className="mb-2 flex justify-between ">
                        <div> {t("date")}</div>
                        <div className="">
                          {moment(value).format("MMM Do YY")}
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="mb-2 flex justify-between">
                        <div> {t("time")}</div>
                        <div> {options?.[selectedValue]?.value}</div>
                      </div>
                    </li>
                    <li>
                      <div className="mb-2 flex justify-between">
                        <div> {t("total")}</div>
                        <div className="text-white">
                          {data && data[0]?.offer && (
                            <span
                              className={`${
                                data &&
                                data[0]?.offer > 0 &&
                                totalAmount > 0 &&
                                "line-through text-red-400"
                              } text-green-400 mr-2`}
                            >
                              ₹ {totalAmount}
                            </span>
                          )}
                          {data && data[0]?.offer > 0 && totalAmount > 0 && (
                            <span className="text-green-400 font-semibold">
                              ₹{" "}
                              {(
                                totalAmount *
                                (1 - (data && data[0]?.offer / 100))
                              ).toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>

                    <li>
                      <button
                        // disabled={buttonLoad}
                        onClick={(e) => previewHandler(totalAmount, e)}
                        className="primary-button flex items-center justify-center  w-full"
                      >
                        {t("preview")}{" "}
                        {/* {buttonLoad && <span className="buttonloader"></span>} */}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="md:min-h-[75vh] min-h-[65vh] flex items-center flex-col justify-center">
              {salonServices?.length <= 0 && categoriesOptions?.length <= 0 ? (
                // !loading && !ownerDetailsLoading ? (
                //   "loading"
                // ) : (
                "Oops no services found !"
              ) : (
                // )
                <>
                  {/* <img src={Select} alt="select category" className="h-72" /> */}
                  <p className="font-semibold">
                    <span className="loader"></span>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reserve;
