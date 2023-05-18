// import axios from "axios";
// import moment from "moment";
// import { useState } from "react";

// import { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import { AuthContext } from "../context/AuthContext";
// import useFetch from "../hooks/useFetch";

// const AdminItem = ({ item, k }) => {
//   const navigate = useNavigate();

//   const [isLoaded, setIsLoaded] = useState(false);
//   const [disable, setDisable] = useState(false);
//   const { user } = useContext(AuthContext);
//   const { date, time, bookId } = item;

//   // console.log("date, time, bookId", { date, time, bookId });
//   let seats = [];

//   let [acceptIds, setAcceptIds] = useState([]);

//   const { data, loading, error } = useFetch(`/api/hotels/room/${item.shopId}`);
//   const {
//     data: data1,
//     loading: loading1,
//     error: error1,
//   } = useFetch(`/api/users/getBookings/${item.user}`);

//   // console.log(`data1111111111111 ${k}`, data1);

//   const {
//     data: shopData,
//     loading: shopLoading,
//     error: shopError,
//   } = useFetch(`/hotels/find/${item.shopId}`);

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
//     console.log(ampm);
//     if (ampm === "P" && hours !== 12) {
//       hours += 12;
//     }
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     date.setSeconds(0);
//     return date.getTime();
//   }

//   data[0]?.roomNumbers?.map((seat) => {
//     if (seat._id === item.selectedRooms[0]) {
//       seats.push(seat.number);
//     } else if (seat._id === item.selectedRooms[1]) {
//       seats.push(seat.number);
//     }
//   });

//   //This is to send request with unailvalabledateId to backend for updating
//   const isAvailable = (data, date, time, bookId) => {
//     // console.log(`data mak ${k}`, data);
//     const isFound = data.unavailableDates.map((item, i) => {
//       if (item?.date.includes(date)) {
//         if (item?.time.includes(time)) {
//           if (item.bookId === bookId) {
//             acceptIds.push({
//               unavailableDateId: item._id,
//               seat: data.number,
//               seatId: data._id,
//             });
//           }
//         }
//       }
//     });
//   };

//   const handleCancel = async (user) => {
//     try {
//       const { email, phone } = user;
//       const mail = await axios.post("/api/sendmail", {
//         email: item.email,
//         userNumber: item.phone,

//         type: "cancel",
//         shopName: shopData.name,
//         ownerEmail: email,
//         ownerNumber: phone,
//         link: "https://main--profound-babka-e67f58.netlify.app/history",
//       });
//     } catch (err) {
//       console.log(err);
//     }

//     toast("Rejected Successfully");
//     navigate("/admin");
//   };

//   const handleClick = async (uniqueArr, uniqueArr1) => {
//     // console.log("I am clicked", { uniqueArr, uniqueArr1 });

//     let result = convertToMilliseconds(time);
//     let result2 = compareTimeDiff(result);

//     let day1 = date;
//     let day2 = moment(new Date()).format("MMM Do YY");

//     if (day1 === day2 && result2 >= 0) {
//       return toast("Cannot approve past times!");
//     }

//     try {
//       await Promise.all(
//         uniqueArr.map((item) => {
//           axios.put(
//             `/api/rooms/updateAvailabilityStatus/${item.unavailableDateId}`,
//             {
//               isAccepted: true,
//             }
//           );
//         })
//       );
//       try {
//         await Promise.all(
//           uniqueArr1.map((item) => {
//             axios.put(`/api/users/updateUserApprovalStatus/${item}`, {
//               isAccepted: true,
//             });
//           })
//         );
//       } catch (err) {
//         toast(err);
//       }

//       try {
//         const { email, phone } = user;
//         const mail = await axios.post("/api/sendmail", {
//           email: item.email,
//           userNumber: item.phone,
//           //shopName we are using already in backend
//           shopName: shopData.name,
//           ownerEmail: email,
//           ownerNumber: phone,
//           link: "https://main--profound-babka-e67f58.netlify.app/history",
//         });
//       } catch (err) {
//         console.log(err);
//       }
//       toast("Reserved Successfully");
//       navigate("/admin");
//     } catch (err) {
//       toast(err);
//     }
//   };

//   const mapData = data[0];
//   // console.log("seats", seats);
//   for (let i = 0; i < mapData?.roomNumbers.length; i++) {
//     if (date && time) {
//       isAvailable(mapData?.roomNumbers[i], date, time, bookId);
//     }
//   }

//   async function myPromiseFunction() {
//     let id = acceptIds[0];
//     let result = await new Promise((resolve, reject) => {
//       setTimeout(async () => {
//         let results = await axios.get(
//           `/api/rooms/getUnavailabledates/${id.unavailableDateId}`
//         );

//         resolve({
//           results,
//         });
//       }, 100);
//     });
//     return result;
//   }

//   if (!isLoaded) {
//     acceptIds[0] &&
//       myPromiseFunction()
//         .then((result) => {
//           if (result.results.data.isAccepted === "true") {
//             setDisable(true);
//             setIsLoaded(true);
//             // console.log(`i am accepted ${k}`, result.results.data.isAccepted);
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//   }

//   const [userBookingIds, setUserBookingsIds] = useState([]);

//   const mapUserBookingIds = (data1) => {
//     data1.map((booking) => {
//       if (booking.bookId === item.bookId) {
//         userBookingIds.push(booking._id);
//         // console.log(`Foundroooooo ${k}`, booking.bookId);
//       }
//     });
//   };

//   if (data1) {
//     mapUserBookingIds(data1);
//   }

//   const uniqueArr = Array.from(
//     new Set(acceptIds.map((item) => JSON.stringify(item)))
//   ).map((item) => JSON.parse(item));

//   const uniqueArr1 = Array.from(new Set(userBookingIds));

//   return (
//     <div className="card p-5">
//       <div className="space-y-2">
//         <div className="flex space-x-2">
//           <img
//             src="https://picsum.photos/800/600?random=2"
//             alt=""
//             className="siImg"
//           />

//           <div className="flex flex-col md:space-y-2 space-y-2 text-blue-900">
//             <h1 className=" text-xs md:text-[15px] ">
//               {" "}
//               BookedDate : {item.date}
//             </h1>
//             <span className="text-xs md:text-[15px]">
//               BookedTime : {item.time}
//             </span>
//             <span className="text-xs md:text-sm">
//               Seat Numbers :{" "}
//               {seats.map((seat, i) => {
//                 return (
//                   <span className="text-xs md:text-[15px]" key={i}>
//                     {seat}&nbsp;
//                   </span>
//                 );
//               })}
//             </span>

//             <span className="text-xs md:text-[15px] siTaxiOp px-2">
//               {item.username}
//             </span>
//           </div>
//         </div>
//         <div className="flex flex-col space-y-1 ">
//           <div>
//             <span className="text-xs md:text-[15px] siTaxiOp mr-1">
//               Paid status : {item.isPaid === true ? "paid" : "Not paid"}
//             </span>
//             {item.referenceNumber && (
//               <span className="text-xs md:text-[15px] siTaxiOp">
//                 Reference No:{item.referenceNumber}
//               </span>
//             )}
//           </div>
//           <div>
//             <span className="text-xs md:text-[15px] siTaxiOp px-2">
//               {item.email}
//             </span>
//             <span className="text-xs md:text-[15px] siTaxiOp px-2 ml-1">
//               {item.phone}
//             </span>
//           </div>
//         </div>
//         <div className="space-x-3">
//           <button
//             className={
//               disable ? "siCheckButton bg-blue-400 px-4" : "primary-button"
//             }
//             onClick={() => {
//               !disable && handleClick(uniqueArr, uniqueArr1);
//             }}
//             disabled={disable}
//           >
//             {disable ? "Accepted" : "Mark Done"}
//           </button>
//           <button
//             className={
//               disable ? "siCheckButton bg-red-400 px-4" : "danger-button"
//             }
//             onClick={() => handleCancel(user)}
//             disabled={disable}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminItem;
