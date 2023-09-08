import React, { useContext, useState, Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";

import { SearchContext } from "../../context/SearchContext";
import SIdebar from "../../components/navbar/SIdebar";
import Layout from "../../components/navbar/Layout";
import Greeting from "../../components/navbar/Greeting";
import Footer from "../../components/footer/Footer";
import moment from "moment";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Import the default styles
import "react-date-range/dist/theme/default.css"; // Import the default theme styles
import options from "../../utils/time";
import { toast } from "react-toastify";
import baseUrl from "../../utils/client";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useTranslation } from 'react-i18next';


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function formatDateToBackendFormat(date) {
  const formattedDate = new Date(date);
  console.log(formattedDate);
  const c = moment(formattedDate).format("MMM Do YY");

  return c;
}
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

function Break() {
  let w = window.innerWidth;
  const { open } = useContext(SearchContext);
  const { user } = useContext(AuthContext);

  const [value, setValue] = useState(new Date());

  const lunch = [24, 25, 26, 27, 28, 29];

  const navigate = useNavigate();

  const initialSelectedDates = [
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ];

  const [selectedDates, setSelectedDates] = useState(initialSelectedDates);
  const [timeReserve, setTimeReserve] = useState();
  const [timeReserve1, setTimeReserve1] = useState();
  const [timeBlockArray, setTimeBlockArray] = useState();
  const [disabledDates, setDisabledDates] = useState();
  const [matchedArrays, setMatchedArrays] = useState();

  const today = moment(value).format("MMM Do YY");
  const { data: shopData } = useFetch(
    `${baseUrl}/api/hotels/find/${user?.shopId}`
  );
  const { t } = useTranslation();


  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${baseUrl}/api/hotels/room/${user?.shopId}`
      );

      const res =
        data &&
        data[0]?.roomNumbers?.map((id, i) => {
          const filter = id.unavailableDates.filter(
            (item1) => item1.isAccepted !== "cancelled"
          );
          return {
            id: id._id,

            dates: filter?.map((item) => {
              return { date: item.date, values: item.values };
            }),
          };
        });

      let filter = [];
      res.map((date) => {
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
      setMatchedArrays(matchedArrays);
      setTimeBlockArray(
        data[0]?.blockTimings.find((item) => item.date === today)
      );
      setDisabledDates(
        data[0].blockDays.map((dateStr) =>
          moment(dateStr, "MMM Do YY").toDate()
        )
      );
    };
    // filterOptions();

    fetchData();
  }, [today, user?.shopId, timeReserve, selectedDates]);

  const handleSelect = (ranges) => {
    setSelectedDates([ranges.selection]);
  };
  const submit = async () => {
    let confirm = window.confirm(t('sureToBlockTheseDates?'));

    if (!confirm) {
      return;
    }

    const formattedDates1 = [];
    const startDate = selectedDates[0].startDate;
    const endDate = selectedDates[0].endDate;
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      console.log(currentDate, "currentDate");
      console.log(typeof currentDate);

      formattedDates1.push(formatDateToBackendFormat(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log(formattedDates1);
    if (formattedDates1 !== undefined) {
      try {
        await axios.post(
          `${baseUrl}/api/rooms/updateBlockDays/${shopData.rooms[0]}`,
          {
            formattedDates1,
          },
          { withCredentials: true }
        );
      } catch (err) {
        if (err.response.status === 401) {
          navigate("/login", {
            state: { destination: `/admin/break` },
          });
        }
        console.log(err);
      }
    }

    setSelectedDates(initialSelectedDates);
  };

  const submitTimings = async () => {
    let confirm = window.confirm(t('sureToBlockTheseTimings?'));

    if (!confirm) {
      return;
    }

    if (timeReserve === "" || timeReserve1 === "") {
      return toast("Please select start and end time correctly!");
    }
    let result = convertToMilliseconds(timeReserve);
    let result2 = compareTimeDiff(result);

    if (result2 >= 0) {
      return toast("Please select a valid time!");
    }

    const selectedOption = options.find(
      (option) => option.value === timeReserve1
    );
    const selectedOption1 = options.find(
      (option) => option.value === timeReserve
    );

    if (
      lunch.includes(selectedOption1.id) ||
      lunch.includes(selectedOption.id)
    ) {
      return alert(t('messingUpYourLunchTime!',{time1:selectedOption1.value, time2 : selectedOption.value}))
      //  alert(
      //   `You cannot select ${selectedOption1.value}- ${selectedOption.value} because it is messing up your lunch time!`
      // );
    }

    console.log(selectedOption.id - selectedOption1.id);
    if (selectedOption.id - selectedOption1.id < 0) {
      return alert('plsEnsureToSelectInOrder!');
    } else if (
      (selectedOption.id - selectedOption1.id) * 10 < 59 ||
      (selectedOption.id - selectedOption1.id) * 10 === 0
    ) {
      return alert(t('selectMoreThanOrEqualToAnHour!'));
    }

    //finnaly

    let blockArray = [];
    let count = selectedOption1.id;
    while (count < selectedOption.id) {
      blockArray.push(count);
      count = count + 1;
    }

    console.log({
      date: moment(new Date()).format("MMM Do YY"),
      block: blockArray,
    });
    let matchFound = false;

    if (matchedArrays) {
      for (const item of matchedArrays) {
        for (const item1 of item) {
          if (item1 === selectedOption.id) {
            matchFound = true;
           alert(t('cannotSelectBczOfAppointment!',{time1:selectedOption1.value, time2 : selectedOption.value}))
            // alert(`You cannot select ${selectedOption1.value} - ${selectedOption.value} because you have an appointment!`);
            break; // Exit from the innermost loop
          } else if (item1 === selectedOption1.id) {
            matchFound = true;
           alert(t('cannotSelectBczOfAppointment!',{time1:selectedOption1.value, time2 : selectedOption.value}))
            // alert(`You cannot select ${selectedOption1.value} - ${selectedOption.value} because you have an appointment!`);
            break; // Exit from the innermost loop
          } else if (blockArray.includes(item1)) {
            matchFound = true;
            alert(t('cannotSelectBczOfAppointmentBetween!',{time1:selectedOption1.value, time2 : selectedOption.value}))

            // alert(
            //   `You cannot select ${selectedOption1.value} - ${selectedOption.value} because you have an appointment in between!`
            // );
            break; // Exit from the innermost loop
          } else if (lunch.includes(item1)) {
            matchFound = true;
            alert(t('cannotSelectBczOfAppointmentBetween!',{time1:selectedOption1.value, time2 : selectedOption.value}))
            // alert(
            //   `You cannot select ${selectedOption1.value} - ${selectedOption.value} because you have an appointment in between!`
            // );
            break; // Exit from the innermost loop
          }
        }
      }
      if (matchFound) {
        return; // Exit from the outer loop
      }
    }
    let blockageFound = false;
    for (let i = 0; i < timeBlockArray?.block.length; i++) {
      if (blockArray.includes(timeBlockArray.block[i])) {
        blockageFound = true;
        alert(t('cannotSelectBczOfAppointmentBetween!',{time1:selectedOption1.value, time2 : selectedOption.value}))
        // alert(
        //   `You cannot select ${selectedOption1.value} - ${selectedOption.value} because there might be something blocking in between!`
        // );
        break;
      }
    }
    if (blockageFound) {
      return;
    }

    if (blockArray.length > 0) {
      try {
        await axios.post(
          `${baseUrl}/api/rooms/updateBlockTimings/${shopData.rooms[0]}`,
          {
            date: moment(new Date()).format("MMM Do YY"),
            block: blockArray,
          },
          { withCredentials: true }
        );
      } catch (err) {
        if (err.response.status === 401) {
          navigate("/login", {
            state: { destination: `/admin/break` },
          });
        }
        console.log(err);
      }
    }
    console.log({
      date: moment(new Date()).format("MMM Do YY"),
      block: blockArray,
    });
    setTimeReserve(null);
    setTimeReserve1(null);
  };

  const handleTime = (item) => {
    setTimeReserve(item.value);
  };

  const handleTime1 = (item) => {
    setTimeReserve1(item.value);
  };

  return (
    <div className="">
      {open && <SIdebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}
      <div className="p-10 min-h-[80vh]  mx-auto border-2 border-slate-50 mt-5 mb-10 rounded-md max-w-sm  md:max-w-[1200px]">
        <div className="grid grid-cols-6  gap-2">
          <div className=" md:col-span-3 col-span-6">
            <div className="grid place-items-center gap-5">
              <p className="text-2xl font-bold">{t('onlyForToday')}</p>
              <div>
                <div className="pb-6">
                  <p>{t('startTimingToBlock')}</p>
                  <div className="flex md:flex-row flex-col    items-start">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex justify-start  p-[0.8rem] text-sm font-medium text-gray-700 bg-slate-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none w-[12rem]">
                          <div className="w-full flex items-center justify-between">
                            <span className="md:text-md ">
                              {timeReserve ? (
                                <p>{timeReserve}</p>
                              ) : (
                                t('selectTime')
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
                        <Menu.Items className="h-96  overflow-auto absolute z-50 md:right-0  md:w-[20rem]  mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <p
                                  className={classNames(
                                    `text-gray-400 block px-4 py-0.5 text-md font-bold cursor-pointer`
                                  )}
                                >
                                {t('selectTime')}
                                </p>
                              )}
                            </Menu.Item>

                            {matchedArrays?.length > 0
                              ? options?.map((option, i) => {
                                  const isbooked = matchedArrays?.map((item) =>
                                    // console.log(item?.includes(i))
                                    item?.includes(i)
                                  );
                                  const finalBooked = isbooked.includes(false);

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
                                            className={`  ${
                                              (timeBlockArray?.block.includes(
                                                option.id
                                              ) ||
                                                lunch.includes(option.id) ||
                                                !finalBooked) &&
                                              ` text-red-500 `
                                            }`}
                                          >
                                            {option.value}
                                          </span>
                                          <span className="w-auto overflow-x-auto">
                                            {isbooked.includes(true) &&
                                              "Appointment"}

                                            {timeBlockArray?.block.includes(
                                              option.id
                                            ) &&
                                              (timeBlockArray.block[0] ===
                                                option.id ||
                                              timeBlockArray.block[
                                                timeBlockArray.block.length - 1
                                              ] === option.id ? (
                                                "blocked"
                                              ) : (
                                                <span>&nbsp;&nbsp; .</span>
                                              ))}
                                          </span>
                                        </div>
                                      )}
                                    </Menu.Item>
                                  );
                                })
                              : "Loading"}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="pb-6">
                  <p>{t('endTimingToBlock')}</p>
                  <div className="flex md:flex-row flex-col    items-start">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex justify-start  p-[0.8rem] text-sm font-medium text-gray-700 bg-slate-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none w-[12rem]">
                          <div className="w-full flex items-center justify-between">
                            <span className="md:text-md ">
                              {timeReserve1 ? (
                                <p>{timeReserve1}</p>
                              ) : (
                                t('selectTime')
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
                        <Menu.Items className="h-96  overflow-auto absolute z-50 md:right-0  md:w-[20rem]  mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <p
                                  className={classNames(
                                    `text-gray-400 block px-4 py-0.5 text-md font-bold cursor-pointer`
                                  )}
                                >
                                  {t('selectTime')}
                                </p>
                              )}
                            </Menu.Item>

                            {matchedArrays?.length > 0
                              ? options?.map((option, i) => {
                                  const isbooked = matchedArrays?.map((item) =>
                                    // console.log(item?.includes(i))
                                    item?.includes(i)
                                  );
                                  const finalBooked = isbooked.includes(false);

                                  return (
                                    <Menu.Item key={i} id={option.id}>
                                      {({ active }) => (
                                        <div
                                          onClick={() => handleTime1(option)}
                                          className={classNames(
                                            active
                                              ? "bg-gray-100 text-black py-0.5 text-md font-bold cursor-pointer "
                                              : "text-gray-700",
                                            ` px-4 py-0.5 text-md font-bold cursor-pointer flex space-x-5`
                                          )}
                                        >
                                          <span
                                            className={`  ${
                                              (timeBlockArray?.block.includes(
                                                option.id
                                              ) ||
                                                lunch.includes(option.id) ||
                                                !finalBooked) &&
                                              ` text-red-500 `
                                            }`}
                                          >
                                            {option.value}
                                          </span>
                                          <span className="w-auto overflow-x-auto">
                                            {isbooked.includes(true) &&
                                              t('appointment')}

                                            {timeBlockArray?.block.includes(
                                              option.id
                                            ) &&
                                              (timeBlockArray.block[0] ===
                                                option.id ||
                                              timeBlockArray.block[
                                                timeBlockArray.block.length - 1
                                              ] === option.id ? (
                                                t('blocked')
                                              ) : (
                                                <span>&nbsp;&nbsp; .</span>
                                              ))}
                                          </span>
                                        </div>
                                      )}
                                    </Menu.Item>
                                  );
                                })
                              : t('loading')}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>

                <div className="mx-auto">
                  <button
                    className="headerBtn  jello-horizontal px-5"
                    onClick={submitTimings}
                  >
                    {t('submit')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="  md:col-span-3 col-span-6 md:border-l-2 md:border-t-0 border-t-2  border-black">
            <div className="grid place-items-center gap-3 mt-5 md:mt-0">
              <p className="text-2xl font-bold">{t('onlyFromTomorrow')}</p>
              <div>
                <p>{t('datesYouWantToBlock?')}</p>
              </div>
              <div className="flex md:flex-row flex-col items-start md:space-x-3 space-x-0 space-y-4 md:space-y-0">
                <DateRange
                  ranges={selectedDates}
                  onChange={handleSelect}
                  minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                  maxDate={new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)}
                  disabledDates={disabledDates}
                />
                <button onClick={submit} className="primary-button">
                {t('submit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mx-auto my-10">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=venkatdandugulayou%40gmail.com&ctz=Asia%2FKolkata"
          width="100%"
          height="800"
          frameborder="0"
          scrolling="no"
          title="myCalender"
        ></iframe>
      </div>
      <Footer />
    </div>
  );
}

export default Break;

// eslint-disable-next-line no-lone-blocks
{
  /* <div>
                <p>Select End Timing you want to block?</p>
                <div className="flex items-start space-x-3">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex justify-start  p-[0.8rem] text-sm font-medium text-gray-700 bg-slate-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none w-[12rem]">
                        <div className="w-full flex items-center justify-between">
                          <span className="md:text-md ">
                            {timeReserve.endTime
                              ? timeReserve.endTime
                              : "Select Time"}
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
                      <Menu.Items className="h-96  overflow-auto absolute z-50 md:right-0  md:w-[20rem]  mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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

                          {options?.map((option, i) => {
                            return (
                              <Menu.Item key={i} id={option.id}>
                                {({ active }) => (
                                  <div
                                    onClick={() =>
                                      handleTime(option, "endTime")
                                    }
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-black py-0.5 text-md font-bold cursor-pointer "
                                        : "text-gray-700",
                                      ` px-4 py-0.5 text-md font-bold cursor-pointer flex space-x-5`
                                    )}
                                  >
                                    <span>{option.value}</span>{" "}
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
                <button onClick={submitTimings} className="primary-button my-4">
                  Submit
                </button>
              </div>  */
}
