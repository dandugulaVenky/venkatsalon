import React, { useCallback, useContext, useMemo } from "react";

import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { SearchContext } from "../context/SearchContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import baseUrl from "../utils/client";
import { toast } from "react-toastify";
import useFetch from "../hooks/useFetch";

const Test1 = (props) => {
  const [categoriesOptions, setCategoriesOptions] = useState();
  const [categories, setCategories] = useState();
  const {
    setOpen,
    minValuesObj,
    shopId,
    shopName,
    shopOwner,

    selectedValue,
    value,
    options,
  } = useMemo(() => props, [props]);

  const [loading, setLoading] = useState(false);

  const [durationBySeat, setDurationBySeat] = useState([]);

  const [show, setShow] = useState(false);
  const [durations, setDurations] = useState([]);

  const [previewServices, setPreviewServices] = useState();

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
    const fetchData = async () => {
      const { data } = await axios.get(`${baseUrl}/api/hotels/room/${shopId}`);
      // console.log(data[0].roomNumbers);

      const res =
        data &&
        data[0]?.roomNumbers?.map((id, i) => {
          return { id: id._id, options: [], index: i };
        });

      setSeats(res);
      setPreviewServices(data[0]?.parlourServices);

      const parlourServices = (data[0]?.parlourServices || []).reduce(
        (arr, item) => {
          arr.push(item.category);
          return arr;
        },
        []
      );

      const mergedPreviewServices = data[0]?.parlourServices
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

      setParlourServices(parlourServices);
      setCategories(data[0]?.parlourServices);
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

    if (event.target.name === service.service) {
      if (event.target.checked) {
        newAmount += service.price;
        newDuration += service.duration;
      } else {
        newAmount -= service.price;
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
    (total) => {
      const hours = Math.floor(total / 60);
      const remainingMinutes = total % 60;
      if (total >= 60) {
        return `${hours} h, ${remainingMinutes} min`;
      } else {
        return ` ${remainingMinutes} min`;
      }
    },
    [durationBySeat]
  );

  if (error) {
    return navigate("/login", { state: { destination: `/shops/${shopId}` } });
  }

  const previewHandler = async (amount, e) => {
    e.preventDefault();
    if (amount < 10) {
      return alert("Please select atleast an option!");
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
          alert(
            `You can only book until ${
              options[options.length - 1].value
            }, so please select only ${(num1 - num2) * 10} mins in Seat No.${
              item.seatNo + 1
            } `
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
            ? alert(
                `Others have a booking at ${
                  options[selectedValue + item1 / 10].value
                }. Please choose only a option which is of ${hours} hours and ${remainingMinutes} minutes in seat${
                  item2 + 1
                } `
              )
            : alert(
                `Others have a booking at ${
                  options[selectedValue + item1 / 10].value
                }. Please choose only a option which is of ${item1} minutes in seat${
                  item2 + 1
                } `
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
          navigate(`/shops/${shopId}/parlour-preview`, {
            state: {
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
            },
          });
        } else {
          toast("something wrong!");
          return;
        }
      }
    }
  };

  return (
    <div className="reserve1">
      <div className="flex flex-col items-center  justify-center space-y-5 border-2 border-white rounded-md p-3">
        <div className="md:flex md:mx-auto bo">
          <div className="px-2 ">
            <p className="py-2 text-md text-white font-semibold">Categories</p>

            <select className="w-52" onChange={handleChange}>
              <option selected>Select a category</option>
              {parlourServices?.map((service, i) => {
                return <option key={i}>{service}</option>;
              })}
            </select>
          </div>{" "}
        </div>

        {show && categoriesOptions?.length > 0 ? (
          <div className="md:w-[70vw]  rContainer2 scrollable-container mx-auto w-[98vw]">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="absolute top-0 right-0 text-white "
              onClick={() => setOpen(false)}
            />
            <p className="py-3 text-xl font-semibold text-white">
              Select Services
            </p>
            <strong className="pb-2 font-semibold text-sm text-white">
              Note* You can select multiple seats at a time
            </strong>

            <div>
              <p className="text-center mb-1 text-white">
                {" "}
                Amount : &#8377; {totalAmount}
              </p>
              <p className="text-center mb-1 text-white">
                Selected Time : {options[selectedValue].value}
              </p>
            </div>

            {seats?.map((seat, i) => {
              return (
                <div class="relative overflow-x-auto rounded-md py-3">
                  <span>
                    <h3 className="text-md font-bold px-5 pt-2 pb-2 text-white">
                      Seat {i + 1}
                    </h3>
                    <h3 className="font-extrabold px-5 text-white pb-2">
                      {durationBySeat.length > 0 &&
                      seat.id === durationBySeat[i]?.id
                        ? getTotalTime(durationBySeat[i]?.value)
                        : "0 min"}
                    </h3>
                  </span>
                  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" class="px-6 py-3">
                          Product name
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Category
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {show &&
                        categoriesOptions?.map((option, j) => {
                          const selectedOptions = new Set(seat.options);
                          return (
                            <tr
                              key={j}
                              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                              <th
                                scope="row"
                                class="px-6 py-4 font-medium text-white whitespace-nowrap flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  name={option.service}
                                  checked={selectedOptions.has(option.service)}
                                  className="h-6 w-6"
                                  onChange={(event) =>
                                    handleOptionChange(
                                      event,
                                      seat.id,
                                      option,
                                      seat.index
                                    )
                                  }
                                  disabled={isAvailable(i)}
                                />
                                <label className="text-white">
                                  {option.service}
                                </label>
                              </th>
                              <td class="px-6 py-4">{option.price}</td>
                              <td class="px-6 py-4">{option.category}</td>
                              <td class="px-6 py-4">{option.duration}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              );
            })}
            <button
              onClick={(e) => {
                previewHandler(totalAmount, e);
              }}
              className="primary-button flex items-center justify-evenly"
            >
              Preview
            </button>
          </div>
        ) : (
          "Nothing"
        )}
      </div>
    </div>
  );
};

export default Test1;
