import React, { useCallback, useContext, useMemo } from "react";

import { useState, useEffect } from "react";
import Select from "../pages/images/select.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faClose } from "@fortawesome/free-solid-svg-icons";
import { SearchContext } from "../context/SearchContext";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import axiosInstance from "axiosInstance";
import baseUrl from "../utils/client";
import { toast } from "react-toastify";
import useFetch from "../hooks/useFetch";
import ParlourPreview from "./preview";
import Layout from "../components/navbar/Layout";
import Greeting from "../components/navbar/Greeting";

const Test1 = (props) => {
  const [categoriesOptions, setCategoriesOptions] = useState();
  const [categories, setCategories] = useState();
  const [reserveState, setReserveState] = useState(null);
  const [parlourPreview, setParlourPreview] = useState(false);

  const { state } = useLocation();
  const { t } = useTranslation();
  const {
    shopId,
    shopName,
    shopOwner,
    minValuesObj,
    selectedValue,
    value,
    options,
    mergedServices,
  } = useMemo(() => state, [state]);

  let w = window.innerWidth;

  const [loading, setLoading] = useState(false);

  const [height, setHeight] = useState(false);

  const [durationBySeat, setDurationBySeat] = useState([]);

  const [show, setShow] = useState(false);
  const [durations, setDurations] = useState([]);
  const [category, setCategory] = useState();
  const [previewServices, setPreviewServices] = useState();
  const [allServices, setAllServices] = useState();
  const [showInclusions, setShowInclusions] = useState();
  const [seats, setSeats] = useState();
  const [parlourServices, setParlourServices] = useState();
  const [totalAmount, setTotalAmount] = useState(0);

  const { data } = useFetch(`${baseUrl}/api/hotels/room/${shopId}`);

  const { date: dater, time } = useContext(SearchContext);

  const { user } = useContext(AuthContext);

  const { data: shopOwnerData, error } = useFetch(
    `${baseUrl}/api/users/getOwnerDetails/${shopOwner}`,
    { credentials: true }
  );

  const navigate = useNavigate();

  const { ownerEmail, ownerNumber } = shopOwnerData;
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [parlourPreview]);

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

      const res =
        data &&
        data[0]?.roomNumbers?.map((id, i) => {
          return { id: id._id, options: [], index: i };
        });

      setSeats(res);
      setPreviewServices(data[0]?.services);

      const parlourServices = (data[0]?.services || []).reduce((arr, item) => {
        arr.push(item.category);
        return arr;
      }, []);

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

      setTotalTime(totalTimeOfServices);
      setAllServices(mergedPreviewServices);
      setParlourServices(parlourServices);
      setCategories(data[0]?.services);
      setLoading(true);
    };
    !loading && fetchData();
  }, [loading, shopId]);

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

          if (roomUnavailableDates.length > 0) {
            unavailableDates.push({
              room: array.number,
              unavailableDates: roomUnavailableDates,
            });
          }
        }

        return unavailableDates;
      };

      const arrays = filteredUnavailableDates();

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

        const smallestNumber = Math.min(...matchedIndexes);

        // dynamically declare and assign boolean variables

        minFound[i] = {};

        for (let l = 1; l < totalTime / 10; l++) {
          minFound[i][`min${l * 10}found${i + 1}`] = smallestNumber === l;
        }
      });

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

      const getDurations = () => {
        return filteredKeys
          .filter((key) => allKeys?.includes(key))
          .map((key) => parseInt(key.match(/\d+/)[0]));
      };

      const durations = getDurations();

      setDurations(durations);
      setShow(true);

      console.log("Done");
    };
    data && data[0]?.roomNumbers && totalTime && findDurationsToBlock();
  }, [data, options, selectedValue, totalTime, value]);

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

  const handleChange = (e) => {
    setCategory(e.target.value);
    const result = categories.filter((category, i) =>
      category.category === e.target.value ? category.services : null
    );
    setCategoriesOptions(result[0].services);
  };
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
      if (event.target.checked) {
        newAmount += service.price;
        seatAmount += service.price;

        newDuration += service.duration;
      } else {
        newAmount -= service.price;
        seatAmount -= service.price;

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
    if (amount < 10) {
      return alert(t("SelectOption"));
    }
    //getting end value from optiond and checking wetherr user is booking beyond the time limit given by owner
    const num1 = Number(options[options.length - 1].id);
    const num2 = Number(
      options.filter((option) => option.id === selectedValue)[0].id
    );

    const check = durationBySeat.map((duration) =>
      duration.value > (num1 - num2) * 10
        ? { seatNo: duration.seatNo, isReachedEnd: true }
        : { seatNo: duration.seatNo, isReachedEnd: false }
    );

    if (check) {
      const showEnd = check.map((item) => {
        if (item.isReachedEnd) {
          // alert(
          //   `You can only book until ${
          //     options[options.length - 1].value
          //   }, so please select only ${(num1 - num2) * 10} mins in Seat No.${
          //     item.seatNo + 1
          //   } `
          // );
          alert(
            t("lessTimeLeft", {
              time: options[options.length - 1].value,
              mins: (num1 - num2) * 10,
              seatNum: item.seatNo + 1,
            })
          );
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
            ? // alert(
              //     `Others have a booking at ${
              //       options[selectedValue + item1 / 10].value
              //     }. Please choose only a option which is of ${hours} hours and ${remainingMinutes} minutes in seat${
              //       item2 + 1
              //     } `
              //   )
              alert(
                t("reachingOthersTime", {
                  time: options[selectedValue + item1 / 10].value,
                  hours: hours,
                  mins: remainingMinutes,
                  seatNum: item2 + 1,
                })
              )
            : // alert(
              //     `Others have a booking at ${
              //       options[selectedValue + item1 / 10].value
              //     }. Please choose only a option which is of ${item1} minutes in seat${
              //       item2 + 1
              //     } `
              //   );
              alert(
                t("reachingOthersTime1", {
                  time: options[selectedValue + item1 / 10].value,
                  mins: item1,
                  seatNum: item2 + 1,
                })
              );

          return 0;
        };
        const error = seats?.map((item) => {
          const output = durationBySeat?.map((item1) => {
            return item?.id === item1?.id
              ? item1?.value > durations[item?.index]
                ? getReturn(durations[item?.index], item?.index)
                : null
              : null;
          });
          return output;
        });
        const mergedArr = [].concat(...error);

        if (mergedArr.includes(0)) {
          return;
        }

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
            link: "https://easytym.com/history",
            dates,
            previewServices,
          });
          setParlourPreview(true);
        } else {
          toast("something wrong!");
          return;
        }
      }
    }
  };

  const handleInclusions = (e, option) => {
    e.preventDefault();

    const inclusions = option.inclusions.map((inclusion) => {
      return allServices.filter(
        (service) => service.service === inclusion.service
      )[0];
    });

    setShowInclusions({
      inclusions: inclusions,
      package: option.service,
    });
  };

  const ShowInclusions = () => {
    return (
      showInclusions?.inclusions?.length > 0 && (
        <div className="reserve">
          <div className="overflow-x-auto  ">
            <FontAwesomeIcon
              icon={faClose}
              size="lg"
              onClick={() => {
                setShowInclusions(null);
              }}
              className="right-40 absolute top-40 text-white"
            />
            <>
              <div className="flex items-center justify-between">
                <p className="text-white">
                  {t("costOfServices")} : &#8377;&nbsp;
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
                      {t("serviceName")}
                    </th>
                    <th className=" md:p-5 p-4 md:text-md text-sm text-right">
                      {t("price")}
                    </th>
                    {/* <th className="md:p-5 p-4  md:text-md text-sm text-right">
                                Category
                              </th> */}
                    <th className="md:p-5 p-4  md:text-md text-sm text-right">
                      {t("duration")}
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
                            {option?.duration} {t("min")}
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
  };

  return (
    <>
      {""}
      <ShowInclusions />
      {parlourPreview && reserveState !== null ? (
        <div className="min-h-screen">
          <ParlourPreview
            state={reserveState}
            setPreview={setParlourPreview}
            mergedServices={mergedServices}
          />
        </div>
      ) : (
        <div className="pb-10">
          <h2 className="mb-2 text-lg font-bold py-5 md:pl-[4.5rem] pl-4 text-left text-black">
            <p className="py-1 text-md text-black font-semibold">
              {t("categories")}
            </p>

            <select className="w-52" onChange={handleChange}>
              <option selected>{t("selectCategory")}</option>
              {parlourServices?.map((service, i) => {
                return <option key={i}>{service}</option>;
              })}
            </select>
          </h2>

          {categoriesOptions?.length > 0 ? (
            <div className="grid md:grid-cols-5 lg:grid-cols-4 lg:gap-5 md:gap-5   md:w-[90vw] w-[95.5vw] mx-auto">
              <div className="overflow-x-auto  lg:col-span-3 md:col-span-3">
                {show ? (
                  seats?.map((seat, i) => {
                    const seatValues = getTotalTime(seat);

                    const isDisabled = isAvailable(i);
                    return (
                      !isDisabled && (
                        <div className="card  md:p-5 p-1.5" key={i}>
                          <h2 className="mb-2 text-lg  flex items-center justify-between text-white font-extrabold bg-[#00ccbb] p-5 w-full">
                            <span>
                              {t("seat")} {i + 1}
                            </span>
                            <span>&#8377; {seat ? seatValues.amount : 0} </span>
                            <span>
                              <FontAwesomeIcon icon={faClock} size="sm" />{" "}
                              {seat ? seatValues.time : 0}
                            </span>
                          </h2>
                          <div className="overflow-x-auto w-full">
                            <table className="w-full">
                              <thead className="border-b bg-gray-300 ">
                                <tr className="border-b-2 border-gray-200">
                                  <th className="text-left md:text-md text-sm md:p-5 p-4">
                                    {t("serviceName")}
                                  </th>
                                  <th className=" md:p-5 p-4 md:text-md text-sm text-right">
                                    {t("price")}
                                  </th>
                                  {category === "packages" && (
                                    <th className="md:p-5 p-4  md:text-md text-sm text-right ">
                                      {t("showinclusions")}
                                    </th>
                                  )}
                                  <th className="md:p-5 p-4  md:text-md text-sm text-right">
                                    {t("duration")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {show &&
                                  categoriesOptions?.map((option, j) => {
                                    const selectedOptions = new Set(
                                      seat.options
                                    );
                                    return (
                                      <tr
                                        key={j}
                                        className="border-b-2 border-gray-200"
                                      >
                                        <td className="md:text-md text-sm flex items-center justify-start p-5 space-x-2">
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
                                            // disabled={isAvailable(i)}
                                          />
                                          <label className="text-gray-900">
                                            {option.service}
                                          </label>
                                        </td>
                                        <td className="p-5 text-right md:text-md text-sm">
                                          &#8377; {option.price}
                                        </td>

                                        {category === "packages" && (
                                          <td className="p-5 text-right md:text-md text-sm">
                                            <label
                                              className="text-gray-900 underline"
                                              onClick={(e) =>
                                                handleInclusions(e, option)
                                              }
                                            >
                                              {t("showinclusions")}
                                            </label>
                                          </td>
                                        )}
                                        <td className="p-5 text-right md:text-md text-sm">
                                          {option.duration} {t("min")}
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
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
                    {t("orderSummary")}
                  </h2>
                  <ul>
                    <li>
                      <div className="mb-2 flex justify-between ">
                        <div>{t("date")}</div>
                        <div className="">
                          {moment(value).format("MMM Do YY")}
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="mb-2 flex justify-between">
                        <div>{t("time")}</div>
                        <div> {options[selectedValue].value}-7:00 PM</div>
                      </div>
                    </li>
                    <li>
                      <div className="mb-2 flex justify-between">
                        <div>{t("total")}</div>
                        <div> &#8377; {totalAmount}</div>
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
            <div className="min-h-[60vh] flex items-center flex-col justify-center">
              <img src={Select} alt="select category" className="h-72" />
              <p className="font-semibold">
                {t("selectCategoryToViewServices")}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Test1;
