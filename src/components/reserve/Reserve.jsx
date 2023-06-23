import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faClock } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import baseUrl from "../../utils/client";

const Reserve = (props) => {
  const {
    setOpen,
    setOpacity,
    shopId,
    shopName,
    shopOwner,

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

    selectedValue,
    value,
    options,
  } = useMemo(() => props, [props]);

  const [loading, setLoading] = useState(false);
  const [buttonLoad, setButtonLoad] = useState(false);

  const [seats, setSeats] = useState();
  const [durations, setDurations] = useState([]);
  const [show, setShow] = useState(false);
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

  const [previewServices, setPreviewServices] = useState();

  const [durationBySeat, setDurationBySeat] = useState([]);
  const [duration, setDuration] = useState(0);

  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${baseUrl}/api/hotels/room/${shopId}`);
      setPreviewServices(data[0]?.services);

      const totalTimeOfServices = data[0]?.services.reduce((acc, service) => {
        return (acc += service.duration);
      }, 0);

      setTotalTime(totalTimeOfServices);

      const res =
        data &&
        data[0].roomNumbers?.map((id, i) => {
          return { id: id._id, options: [], index: i };
        });

      setSeats(res);
      setLoading(true);
    };
    !loading && fetchData();
  }, [loading, shopId]);

  //finding wether there is booking in front of this selected time here

  useEffect(() => {
    const findDurationsToBlock = () => {
      const filteredUnavailableDates = () => {
        const compareDate = moment(value).format("MMM Do YY");
        const unavailableDates = [];

        for (let i = 0; i < data[0]?.roomNumbers.length; i++) {
          const array = data[0]?.roomNumbers[i];

          // console.log(array, 'mak');

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

      const ioo = filteredUnavailableDates();

      // console.log(ioo);

      const arrays = ioo;

      const minFound = []; // declare an array to store objects
      const minMaxFound = []; // declare an array to store objects

      //here we are storing all the varaibles with the true or false vaiables based on wether the block values found from the unavailableDates

      arrays?.forEach((array, i) => {
        const matchedIndexes = [];
        array?.unavailableDates?.forEach((item, j) => {
          let conditions = [];
          for (let k = 1; k < totalTime / 10; k++) {
            conditions.push(options[selectedValue + k]);
          }

          // const conditions = [
          //   options[selectedValue + 1],
          //   options[selectedValue + 2],
          //   options[selectedValue + 3],
          //   options[selectedValue + 4],
          //   options[selectedValue + 5],
          //   options[selectedValue + 6],
          //   options[selectedValue + 7],
          //   options[selectedValue + 8],
          //   options[selectedValue + 9],
          //   options[selectedValue + 10],
          //   options[selectedValue + 11],
          //   options[selectedValue + 12],
          //   options[selectedValue + 13],
          //   options[selectedValue + 14],
          //   options[selectedValue + 15],
          //   options[selectedValue + 16],
          //   options[selectedValue + 17],
          //   options[selectedValue + 18],
          //   options[selectedValue + 19],
          //   options[selectedValue + 20],
          //   options[selectedValue + 21],
          //   options[selectedValue + 22],
          //   options[selectedValue + 23],
          //   options[selectedValue + 24],
          //   options[selectedValue + 25],
          //   options[selectedValue + 26],
          //   options[selectedValue + 27],
          //   options[selectedValue + 28],
          //   options[selectedValue + 29],
          //   options[selectedValue + 30],
          // ];
          // console.log(conditions);
          conditions?.some((condition, index) => {
            if (condition?.value === item.time) {
              matchedIndexes.push(index + 1);
              return true; // break out of loop
            }
          });
        });

        // console.log({ matchedIndexes, i }, "matchedIndexes");

        //here we get all the matched Items from the unaivalable Dates and pushing all the indexes found, and immediately
        //  finding smallest number because if 10min found from options[selectedValue + 1]

        const smallestNumber = Math.min(...matchedIndexes);

        // console.log(smallestNumber, "smallestNumber");

        // dynamically declare and assign boolean variables

        minFound[i] = {};
        // minMaxFound[i] = {};

        for (let l = 1; l < totalTime / 10; l++) {
          minFound[i][`min${l * 10}found${i + 1}`] = smallestNumber === l;
        }

        //   minFound[i][`min10found${i + 1}`] = smallestNumber === 1;
        //   minFound[i][`min20found${i + 1}`] = smallestNumber === 2;
        //   minFound[i][`min30found${i + 1}`] = smallestNumber === 3;
        //   minFound[i][`min40found${i + 1}`] = smallestNumber === 4;
        //   minFound[i][`min50found${i + 1}`] = smallestNumber === 5;
        //   minFound[i][`min60found${i + 1}`] = smallestNumber === 6;
        //   minFound[i][`min70found${i + 1}`] = smallestNumber === 7;
        //   minFound[i][`min80found${i + 1}`] = smallestNumber === 8;
        //   minFound[i][`min90found${i + 1}`] = smallestNumber === 9;
        //   minFound[i][`min100found${i + 1}`] = smallestNumber === 10;
        //   minFound[i][`min110found${i + 1}`] = smallestNumber === 11;
        //   minFound[i][`min120found${i + 1}`] = smallestNumber === 12;
        //   minFound[i][`min130found${i + 1}`] = smallestNumber === 13;
        //   minFound[i][`min140found${i + 1}`] = smallestNumber === 14;
        //   minFound[i][`min150found${i + 1}`] = smallestNumber === 15;
        //   minFound[i][`min160found${i + 1}`] = smallestNumber === 16;
        //   minFound[i][`min170found${i + 1}`] = smallestNumber === 17;
        //   minFound[i][`min180found${i + 1}`] = smallestNumber === 18;
        //   minFound[i][`min190found${i + 1}`] = smallestNumber === 19;
        //   minFound[i][`min200found${i + 1}`] = smallestNumber === 20;
        //   minFound[i][`min210found${i + 1}`] = smallestNumber === 21;
        //   minFound[i][`min220found${i + 1}`] = smallestNumber === 22;
        //   minFound[i][`min230found${i + 1}`] = smallestNumber === 23;
        //   minFound[i][`min240found${i + 1}`] = smallestNumber === 24;
        //   minFound[i][`min250found${i + 1}`] = smallestNumber === 25;
        //   minFound[i][`min260found${i + 1}`] = smallestNumber === 26;
        //   minFound[i][`min270found${i + 1}`] = smallestNumber === 27;
        //   minFound[i][`min280found${i + 1}`] = smallestNumber === 28;
        //   minFound[i][`min290found${i + 1}`] = smallestNumber === 29;
        //   minFound[i][`min300found${i + 1}`] = smallestNumber === 30;
      });

      console.log(minFound, "minFound");
      // console.log(minMaxFound, "minMaxFound");

      const allKeys = [];

      for (let i = 0; i < minFound?.length; i++) {
        const keys = Object.keys(minFound[i]);
        allKeys.push(...keys);
      }
      // console.log(allKeys, "allKeys");

      const getFilteredKeys = () => {
        return minFound
          .map((obj) => Object.keys(obj).filter((key) => obj[key]))
          .flat();
      };

      const filteredKeys = getFilteredKeys();
      // console.log(filteredKeys, "filteredKeys");

      const getDurations = () => {
        return filteredKeys
          .filter((key) => allKeys?.includes(key))
          .map((key) => parseInt(key.match(/\d+/)[0]));
      };

      const durations = getDurations();

      setDurations(durations);
      setShow(true);

      // console.log(durations, "durations");
    };
    data && data[0]?.roomNumbers && totalTime && findDurationsToBlock();
  }, [data, options, selectedValue, totalTime, value]);

  //starting here checking availability of options, if not disable the select boxes accordingly

  //check if the room is available to book or not

  const isAvailable = useCallback(
    (seat, i, service) => {
      const array = data[0]?.roomNumbers[i];

      const compareDate = moment(value).format("MMM Do YY");

      const found = array?.unavailableDates.map((item) => {
        return compareDate === item.date && item.values.includes(selectedValue);
      });

      return found?.includes(true);
    },
    [data, selectedValue, value]
  );

  //update the options with ids corrospondingly with inputs

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

    if (event.target.checked) {
      if (event.target.name === service?.service) {
        newAmount += service?.price;
        newDuration += service?.duration;
      }
    } else {
      if (event.target.name === service?.service) {
        newAmount -= service?.price;
        newDuration -= service?.duration;
      }
    }

    setTotalAmount(newAmount);

    const getBlocks = () => {
      let values = [];
      for (let i = 0; i < 30; i++) {
        values.push({ id: selectedValue - (i + 1), value: (i + 1) * 10 });
      }

      return values;
    };

    if (existingDuration) {
      setDurationBySeat(
        durationBySeat.map((d) => {
          if (d.id === seatId) {
            return {
              id: seatId,
              value: newDuration,
              block: getBlocks(),
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
          block: getBlocks(),
          seatNo: seatIndex,
        },
      ]);
    }
    setDuration(newDuration);
    setSeats(updatedSeats);
  };

  // console.log(durationBySeat); // log durationBySeat object to see duration for each seat

  //Here the values are used to block the time in dropdown based on id. example : value will be like value:[71,72] which means to block 71--> 8:50 Pm 72--->9:00 Pm from options.
  //update the values option in dates array according to the duration selected by the user from the respective seats from durationBySeat array

  const generateUpdatedDurationBySeat = useCallback(() => {
    const minLookup = {
      10: min10,
      20: min20,
      30: min30,
      40: min40,
      50: min50,
      60: min60,
      70: min70,
      80: min80,
      90: min90,
      100: min100,
      110: min110,
      120: min120,
      130: min130,
      140: min140,
      150: min150,
      160: min160,
      170: min170,
      180: min180,
      190: min190,
      200: min200,
      210: min210,
      220: min220,
      230: min230,
      240: min240,
      250: min250,
      260: min260,
      270: min270,
      280: min280,
      290: min290,
      300: min300,
    };
    const updatedDurationBySeat = durationBySeat.map((item) => {
      const minValue = minLookup[item.value];
      return minValue ? { ...item, value: minValue } : item;
    });

    return updatedDurationBySeat;
  }, [
    durationBySeat,
    min10,
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
    min20,
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
    min30,
    min300,
    min40,
    min50,
    min60,
    min70,
    min80,
    min90,
  ]);

  const updatedDurationBySeat = generateUpdatedDurationBySeat();

  // console.log(updatedDurationBySeat, "maks");

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

  // updates dates with all the options to send to room unavilableDates with all the options to backend.

  const generateDates = useCallback(() => {
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
        block: durationBySeat[i]?.block,
        createdAt: new Date().toISOString(),
      };
    });

    return dates;
  }, [updatedDurationBySeat, time, dater, id, seats, durationBySeat]);

  const dates = generateDates();

  const getTotalTime = useCallback((total) => {
    const hours = Math.floor(total / 60);
    const remainingMinutes = total % 60;
    if (total >= 60) {
      return `${hours} h, ${remainingMinutes} min`;
    } else {
      return ` ${remainingMinutes} min`;
    }
  }, []);

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
                `Others have booked the extra time already. please choose only a option which is of ${hours} hours and ${remainingMinutes} minutes in seat${
                  item2 + 1
                } `
              )
            : alert(
                `Others have booked the extra time already. please choose only a option which is of ${item1} minutes in seat${
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
        navigate(`/shops/${shopId}/salon-preview`, {
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
      }
    }
  };

  return (
    <form className="reserve flex flex-col space-y-2">
      <span className="text-[12px] text-white font-bold">
        Note : You can select 1 or 2 seats at a time!
      </span>

      <div
        className={`border border-white p-3 rounded-md relative tilt-in-fwd-tr `}
      >
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="absolute top-0 right-0 text-white "
          onClick={() => setOpen(false)}
        />
        <p className="text-center mb-1 text-white">
          {" "}
          Amount : &#8377; {totalAmount}
        </p>
        <div className="flex  flex-col over scrollable-container ">
          {show &&
            seats?.map((seat, i) => (
              <div key={seat.id} className="rContainer">
                <span className="py-2">
                  <h3 className="text-md font-bold px-5 pt-2">Seat {i + 1}</h3>
                  <h3 className="font-extrabold px-5">
                    {durationBySeat.length > 0 &&
                    seat.id === durationBySeat[i]?.id
                      ? getTotalTime(durationBySeat[i]?.value)
                      : "0 min"}
                  </h3>
                </span>
                <div className="flex flex-col items-start mt-3 space-y-2">
                  <div class="relative overflow-x-auto md:w-auto w-[85vw]">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead class="text-xs  uppercase bg-[#00ccbb] text-gray-800">
                        <tr>
                          <th scope="col" class="px-6 py-3">
                            Name
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Price
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Duration
                          </th>
                        </tr>
                      </thead>

                      {data[0]?.services?.map((service, j) => {
                        return (
                          <tbody>
                            <tr class="bg-white border-b dark:bg-gray-300 dark:border-gray-800">
                              <th
                                scope="row"
                                class="px-6 py-4 font-medium  whitespace-nowrap dark:text-white flex items-center justify-start space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  name={service?.service}
                                  checked={seat.options.includes(
                                    service?.service
                                  )}
                                  className="h-6 w-6"
                                  onChange={(event) =>
                                    handleOptionChange(
                                      event,
                                      seat.id,
                                      service,
                                      seat.index
                                    )
                                  }
                                  disabled={isAvailable(
                                    seat,
                                    i,
                                    service?.service
                                  )}
                                />
                                <label className="text-gray-900">
                                  {service?.service}
                                </label>
                              </th>
                              <td class="px-6 py-4 text-gray-900">
                                Rs.{service?.price}{" "}
                              </td>
                              <td class="px-6 py-4 text-gray-900">
                                {service?.duration}{" "}
                                <FontAwesomeIcon icon={faClock} />
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}
                    </table>
                  </div>
                </div>
              </div>
            ))}
          {!loading && <span className="loader  "></span>}
        </div>
      </div>
      <button
        onClick={(e) => {
          previewHandler(totalAmount, e);
        }}
        className="primary-button flex items-center justify-evenly"
      >
        Preview&nbsp;
        {buttonLoad && <span className="buttonloader"></span>}
      </button>
    </form>
    // <>ji</>
  );
};

export default Reserve;
