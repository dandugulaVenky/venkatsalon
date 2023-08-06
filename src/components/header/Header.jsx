// import { faScissors, faSearch, faSpa } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useContext, useState } from "react";
// import $ from "jquery";
// import { useNavigate } from "react-router-dom";
// import { SearchContext } from "../../context/SearchContext";
// import { Combobox } from "@headlessui/react";
// import DatePicker from "react-date-picker";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import moment from "moment";
// import { useEffect } from "react";
// import useFetch from "../../hooks/useFetch";
// import { Autocomplete } from "@react-google-maps/api";

// const Header = () => {
//   const { data, loading, error } = useFetch(`/api/hotels/getDistinctCities`);
//   let { city, time: time1, type, dispatch } = useContext(SearchContext);

//   const cities = data;

//   const [query, setQuery] = useState("");

//   const filteredCities =
//     query === ""
//       ? cities
//       : cities.filter((person) => {
//           return person.toLowerCase().includes(query.toLowerCase());
//         });

//   const [destination, setDestination] = useState(city ? city : "");

//   const navigate = useNavigate();

//   const [value, onChange] = useState(new Date());
//   const [time, setTime] = useState(time1 ? time1 : "9:00 AM");
//   // const options = [
//   //   { id: 0, value: "9:00 AM" },
//   //   { id: 1, value: "9:10 AM" },
//   //   { id: 2, value: "9:20 AM" },
//   //   { id: 3, value: "9:40 AM" },
//   //   { id: 4, value: "10:00 AM" },
//   //   { id: 5, value: "10:10 AM" },
//   //   { id: 6, value: "10:20 AM" },
//   //   { id: 7, value: "10:30 AM" },
//   //   { id: 8, value: "10:40 AM" },
//   //   { id: 9, value: "10:50 AM" },
//   //   { id: 10, value: "11:00 AM" },
//   //   { id: 11, value: "11:10 AM" },
//   //   { id: 12, value: "11:20 AM" },
//   //   { id: 13, value: "11:30 AM" },
//   //   { id: 14, value: "11:40 AM" },
//   //   { id: 15, value: "11:50 AM" },
//   //   { id: 16, value: "12:00 PM" },
//   //   { id: 17, value: "12:10 PM" },
//   //   { id: 18, value: "12:20 PM" },
//   //   { id: 19, value: "12:30 PM" },
//   //   { id: 20, value: "12:40 PM" },
//   //   { id: 21, value: "12:50 PM" },
//   //   { id: 22, value: "1:00 PM" },
//   //   { id: 23, value: "1:10 PM" },
//   //   { id: 24, value: "1:20 PM" },
//   //   { id: 25, value: "1:30 PM" },
//   //   { id: 26, value: "1:40 PM" },
//   //   { id: 27, value: "1:50 PM" },
//   //   { id: 28, value: "2:00 PM" },
//   //   { id: 29, value: "2:10 PM" },
//   //   { id: 30, value: "2:20 PM" },
//   //   { id: 31, value: "2:30 PM" },
//   //   { id: 32, value: "2:40 PM" },
//   //   { id: 33, value: "2:50 PM" },
//   //   { id: 34, value: "3:00 PM" },
//   //   { id: 35, value: "3:10 PM" },
//   //   { id: 36, value: "3:20 PM" },
//   //   { id: 37, value: "3:30 PM" },
//   //   { id: 38, value: "3:40 PM" },
//   //   { id: 39, value: "3:50 PM" },
//   //   { id: 40, value: "4:00 PM" },
//   //   { id: 41, value: "4:10 PM" },
//   //   { id: 42, value: "4:20 PM" },
//   //   { id: 43, value: "4:30 PM" },
//   //   { id: 44, value: "4:40 PM" },
//   //   { id: 45, value: "4:50 PM" },
//   //   { id: 46, value: "5:00 PM" },
//   //   { id: 47, value: "5:10 PM" },
//   //   { id: 48, value: "5:20 PM" },
//   //   { id: 49, value: "5:30 PM" },
//   //   { id: 50, value: "5:40 PM" },
//   //   { id: 51, value: "5:50 PM" },
//   //   { id: 52, value: "6:00 PM" },
//   //   { id: 53, value: "6:10 PM" },
//   //   { id: 54, value: "6:20 PM" },
//   //   { id: 55, value: "6:30 PM" },
//   //   { id: 56, value: "6:40 PM" },
//   //   { id: 57, value: "6:50 PM" },
//   //   { id: 58, value: "7:00 PM" },
//   //   { id: 59, value: "7:10 PM" },
//   //   { id: 60, value: "7:20 PM" },
//   //   { id: 61, value: "7:30 PM" },
//   //   { id: 62, value: "7:40 PM" },
//   //   { id: 63, value: "7:50 PM" },
//   //   { id: 64, value: "8:00 PM" },
//   //   { id: 65, value: "8:10 PM" },
//   //   { id: 66, value: "8:20 PM" },
//   //   { id: 67, value: "8:30 PM" },
//   //   { id: 68, value: "8:40 PM" },
//   //   { id: 69, value: "8:50 PM" },
//   //   { id: 70, value: "9:00 PM" },
//   // ];

//   // Print given phrases to element

//   // Start typing

//   useEffect(() => {
//     // Add something to given element placeholder
//     function addToPlaceholder(toAdd, el) {
//       el.attr("placeholder", el.attr("placeholder") + toAdd);
//       // Delay between symbols "typing"
//       return new Promise((resolve) => setTimeout(resolve, 150));
//     }

//     // Cleare placeholder attribute in given element
//     function clearPlaceholder(el) {
//       el.attr("placeholder", "");
//     }

//     // Print one phrase
//     function printPhrase(phrase, el) {
//       return new Promise((resolve) => {
//         // Clear placeholder before typing next phrase
//         clearPlaceholder(el);
//         let letters = phrase.split("");
//         // For each letter in phrase
//         letters.reduce(
//           (promise, letter, index) =>
//             promise.then((_) => {
//               // Resolve promise when all letters are typed
//               if (index === letters.length - 1) {
//                 // Delay before start next phrase "typing"
//                 setTimeout(resolve, 3000);
//               }
//               return addToPlaceholder(letter, el);
//             }),
//           Promise.resolve()
//         );
//       });
//     }
//     function printPhrases(phrases, el) {
//       // For each phrase
//       // wait for phrase to be typed
//       // before start typing next
//       phrases.reduce(
//         (promise, phrase) => promise.then((_) => printPhrase(phrase, el)),
//         Promise.resolve()
//       );
//     }
//     function run() {
//       let phrases = [
//         "Search Shadnagar...",
//         "Search Kothur...",
//         "Search Thimmapur...",
//       ];

//       printPhrases(phrases, $("#search"));
//     }
//     run();
//   }, []);

//   function compareTimeDiff(time) {
//     let time1 = time;
//     // do some task
//     let time2 = new Date().getTime();
//     let difference = time2 - time1;
//     let diffInHours = difference / (1000 * 60 * 60);
//     return Math.floor(diffInHours);
//   }

//   function convertToMilliseconds(time) {
//     var date = new Date();
//     var timeArray = time.split(":");
//     var hours = parseInt(timeArray[0]) % 12;
//     var minutes = parseInt(timeArray[1]);
//     var ampm = timeArray[1].split("")[3];

//     if (ampm === "P" && hours !== 12) {
//       hours += 12;
//     }
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     date.setSeconds(0);
//     return date.getTime();
//   }

//   const [autocomplete, setAutocomplete] = useState(null);

//   const onLoad = (autocomplete) => {
//     setAutocomplete(autocomplete);
//   };

//   const onPlaceSelect = () => {
//     onPlaceChanged(autocomplete.getPlace());
//   };

//   const handleSearch = () => {
//     if (new Date(value).getDay() === 2) {
//       return toast("Tuesdays are holidays !");
//     }

//     let result = convertToMilliseconds(time);
//     let result2 = compareTimeDiff(result);

//     let day1 = moment(value).format("MMM Do YY");
//     let day2 = moment(new Date()).format("MMM Do YY");

//     if (day1 === day2 && result2 >= 0) {
//       return toast("Please select a valid time!");
//     }
//     dispatch({
//       type: "NEW_SEARCH",
//       payload: { type, destination, value, time },
//     });
//     navigate("/hotels", { state: { type, destination, value, time } });
//   };

//   return (
//     <div className="px-4 mb-4 ">
//       <div className="w-full shadow-2xl bg-blue-900 rounded-md p-5 flex items-center justify-center flex-col mt-4 ">
//         <div className="flex items-center justify-center space-x-5 md:-ml-0 -ml-2  pt-5 text-white">
//           <div
//             className={type === "saloon" ? `active  space-x-2` : `space-x-2`}
//           >
//             <FontAwesomeIcon icon={faScissors} />
//             <span
//               className="text-xs md:text-lg md:cursor-pointer"
//               onClick={(e) => {
//                 dispatch({
//                   type: "NEW_SEARCH",
//                   payload: { type: "saloon" },
//                 });
//               }}
//             >
//               Saloon Shops
//             </span>
//           </div>
//           <div
//             className={type === "parlour" ? `active  space-x-2` : `space-x-2 `}
//           >
//             <FontAwesomeIcon icon={faSpa} />
//             <span
//               className="text-xs md:text-lg md:cursor-pointer"
//               onClick={(e) =>
//                 dispatch({
//                   type: "NEW_SEARCH",
//                   payload: { type: "parlour" },
//                 })
//               }
//             >
//               Beauty Parlours
//             </span>
//           </div>
//         </div>

//         <div className=" flex items-center justify-center md:flex-row md:space-y-0 space-y-2 pt-7 pb-5 md:space-x-2 flex-col -ml-2">
//           <div className="relative inline-block bg-slate-100 rounded-md  text-black items-center ">
//             <Combobox value={destination} onChange={setDestination}>
//               <Combobox.Input
//                 onChange={(event) => setQuery(event.target.value)}
//                 className="md:p-3 p-2.5 md:w-[13.5rem] w-[12rem] "
//                 id="search"
//               />
//               <FontAwesomeIcon icon={faSearch} className="text-xs px-3 " />
//               <Combobox.Options
//                 style={{ zIndex: 999 }}
//                 className="absolute top-[3.2rem]  cursor-pointer text-gray-500 bg-gray-100 md:p-3 p-2.5 md:w-[13.5rem] w-[12rem] rounded  md:max-h-32 max-h-48 border border-gray-300 shadow-md  overflow-y-auto"
//               >
//                 {filteredCities.map((person) => (
//                   <Combobox.Option key={person} value={person} className="p-1">
//                     {person}
//                   </Combobox.Option>
//                 ))}
//                 {filteredCities.length <= 0 && (
//                   <Combobox.Option>OOPS! We did not found!</Combobox.Option>
//                 )}
//               </Combobox.Options>
//             </Combobox>
//           </div>
//           <div>
//             <div className="">
//               <DatePicker
//                 onChange={onChange}
//                 value={value}
//                 minDate={new Date()}
//                 maxDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
//                 className="bg-slate-100 text-black p-2.5 rounded-md md:w-[14.3rem] w-[14.2rem] z-10"
//               />
//             </div>
//           </div>
//           <Autocomplete
//             onLoad={onLoad}
//             onPlaceChanged={onPlaceSelect}
//             options={{
//               types: ["(cities)"],
//               componentRestrictions: { country: "us" },
//             }}
//             fields={["address_components", "geometry", "name"]}
//             apiKey="AIzaSyBUCT5A2vWjzvWNdUQ7bdBv8RxX_Ip_KhQ"
//           >
//             <input
//               type="text"
//               placeholder="Enter a location"
//               style={{ width: "100%" }}
//             />
//           </Autocomplete>
//           {/* <div className="flex md:flex-row items-center space-x-2">
//             <div className="">
//               <select
//                 onChange={(e) => setTime(e.target.value)}
//                 className="md:p-3 p-2.5 bg-slate-100 w-[9.4rem] md:-ml-5 lg:-ml-0.5"
//               >
//                 {time ? (
//                   <option selected value={time}>
//                     {time}
//                   </option>
//                 ) : (
//                   <option selected disabled>
//                     select time
//                   </option>
//                 )}
//                 {options?.map((option, i) => {
//                   return (
//                     <option key={i} value={option.value} id={option.id}>
//                       {option.value}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>

//             <div className="">
//               <button
//                 className="headerBtn md:p-3 p-2.5 jello-horizontal"
//                 onClick={handleSearch}
//               >
//                 Search
//               </button>
//             </div>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;

import React, { memo, useMemo } from "react";

import "./header.css";
import AutoComplete from "../AutoComplete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const Header = (props) => {
  const { setHeader, setAddress, dispatch, type, city, register, header } =
    useMemo(() => props, [props]);

  if (header === null) {
    return;
  }
  return (
    header !== null && (
      <div
        className={`header slide-right z-20 ${
          header === null
            ? "hidden"
            : header
            ? "slide-right-in"
            : "slide-right-out"
        }`}
      >
        <p className="text-center  md:text-lg text-xs space-x-1  font-semibold">
          <FontAwesomeIcon icon={faLocationDot} size="lg" color="#00ccbb" />
          <span>{city}</span>
        </p>

        <AutoComplete
          setHeader={setHeader}
          setAddress={setAddress}
          dispatch={dispatch}
          type={type}
          register={register}
        />
      </div>
    )
  );
};

export default memo(Header);
