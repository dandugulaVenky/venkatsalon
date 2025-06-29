// import React from "react";
// import { useState } from "react";
// import { useRef } from "react";
// import { useContext } from "react";
// import { useEffect } from "react";
// import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";

// import { AuthContext } from "../context/AuthContext";
// import baseUrl from "../utils/client";
// import { useTranslation } from "react-i18next";
// import axiosInstance from "../components/axiosInterceptor";

// const useEffectOnce = (effect) => {
//   const destroyFunc = useRef();
//   const effectCalled = useRef(false);
//   const renderAfterCalled = useRef(false);
//   const [val, setVal] = useState(0);

//   if (effectCalled.current) {
//     renderAfterCalled.current = true;
//   }

//   useEffect(() => {
//     // only execute the effect first time around
//     if (!effectCalled.current) {
//       destroyFunc.current = effect();
//       effectCalled.current = true;
//     }

//     // this forces one render after the effect is run
//     setVal((val) => val + 1);

//     return () => {
//       // if the comp didn't render since the useEffect was called,
//       // we know it's the dummy React cycle
//       if (!renderAfterCalled.current) {
//         return;
//       }
//       if (typeof destroyFunc.current === "function") {
//         destroyFunc.current();
//       }
//     };
//   }, []);
// };

// const PaymentSuccess = () => {
//   const seachQuery = useSearchParams()[0];
//   const location = useLocation();
//   console.log(location, "location from payment success page");
//   const { user: mainUser } = useContext(AuthContext);
//   console.log(mainUser, "user from context");
//   // const userId = seachQuery.get("userId");
//   const referenceNum = location.state?.reference;
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const getFinalBookingDetails = async () => {
//     try {
//       const { data, status } = await axiosInstance.get(
//         `${baseUrl}/api/users/getFinalBookingDetails/${mainUser?._id}`,
//         { withCredentials: true }
//       );
//       if (status === 201) {
//         return data[0];
//       } else {
//         return null;
//       }
//     } catch (err) {
//       toast.error(err.response.data.message);

//       return null;
//     }
//   };

//   useEffectOnce(async () => {
//     let finalBookingDetails = await getFinalBookingDetails();

//     if (finalBookingDetails) {
//       handleBooking(finalBookingDetails);
//     } else {
//       return alert(t("somethingWentWrong"));
//     }

//     return () => console.log("My effect is destroying");
//   }, []);

//   const bookNow = async (finalBookingDetails) => {
//     const selectedSeats1 = finalBookingDetails?.selectedSeats.filter((seat) => {
//       return seat.options.length > 0;
//     });

//     try {
//       await axiosInstance.post(
//         `${baseUrl}/api/hotels/updateRequests/${finalBookingDetails?.shopId}`,
//         {
//           dates: finalBookingDetails.dates,
//           user: finalBookingDetails?.user,
//           selectedSeats: selectedSeats1,
//           type: finalBookingDetails?.type,
//           subCategory: finalBookingDetails?.subCategory,
//           superCategory: finalBookingDetails?.superCategory,

//           totalAmount: finalBookingDetails?.totalAmount,
//           shopId: finalBookingDetails?.shopId,
//           shopName: finalBookingDetails?.shopName,
//           bookId: finalBookingDetails?.bookId,
//           isPaid: true,
//           isDone: "false",
//           referenceNumber: referenceNum,
//         },
//         { withCredentials: true }
//       );

//       await axiosInstance.post(
//         `${baseUrl}/api/users/bookings/${finalBookingDetails?.user._id}`,
//         {
//           dates: finalBookingDetails.dates,
//           shopId: finalBookingDetails?.shopId,
//           shopName: finalBookingDetails?.shopName,
//           bookId: finalBookingDetails?.bookId,
//           selectedSeats: selectedSeats1,
//           type: finalBookingDetails?.type,
//           subCategory: finalBookingDetails?.subCategory,
//           superCategory: finalBookingDetails?.superCategory,
//           email: finalBookingDetails?.user.email,
//           totalAmount: finalBookingDetails?.totalAmount,
//           isPaid: true,
//           isDone: "false",
//           referenceNumber: referenceNum,
//         },
//         { withCredentials: true }
//       );

//       await axiosInstance.post(
//         `${baseUrl}/api/users/clearfinalBookingDetails/${mainUser?._id}`,
//         null,
//         {
//           withCredentials: true,
//         }
//       );

//       await axiosInstance.post(
//         `${baseUrl}/api/sendmail`,
//         {
//           email: finalBookingDetails?.user.email,
//           userName: finalBookingDetails?.user.username,
//           userNumber: finalBookingDetails?.user.phone,
//           dates: finalBookingDetails?.dates,
//           shopName: finalBookingDetails?.shopName,
//           ownerEmail: finalBookingDetails?.ownerEmail,
//           ownerNumber: finalBookingDetails?.ownerNumber,
//           totalAmount: finalBookingDetails?.totalAmount,
//           selectedSeats: selectedSeats1,
//           referenceNumber: referenceNum,
//           type: "newBooking",
//           link: "https://saalons.com/history",
//         },
//         { withCredentials: true }
//       );

//       navigate("/", {
//         state: { referenceNum: referenceNum },
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.message);
//     }
//   };

//   let isExecuted = false;
//   const handleBooking = async (finalBookingDetails) => {
//     await Promise.all(
//       finalBookingDetails?.selectedSeats.map((room, i) => {
//         const correctDate = finalBookingDetails?.dates.filter((date) => {
//           return date.findId === room.id;
//         });

//         return (
//           room.options.length > 0 &&
//           axiosInstance
//             .put(
//               `${baseUrl}/api/rooms/availability/${room.id}`,
//               {
//                 dates: correctDate,
//               },
//               { withCredentials: true }
//             )
//             .then((res) => {
//               if (
//                 (!isExecuted && finalBookingDetails !== null) ||
//                 (!isExecuted && finalBookingDetails !== undefined)
//               ) {
//                 bookNow(finalBookingDetails);

//                 isExecuted = true;
//               }
//               return console.log(res.status);
//             })
//             .catch((err) => {
//               isExecuted = true;
//               localStorage.removeItem("count");

//               return (
//                 err.response.status === 400 &&
//                 navigate("/failure", { state: { referenceNum: referenceNum } })
//               );
//             })
//         );
//       })
//     );
//   };

//   return (
//     <div className="">
//       <div className="md:h-[75vh] h-[65vh] flex flex-col items-center justify-center">
//         {t("referenceNo")}.{referenceNum}
//         <p className="text-xl text-red-600 font-bold">
//           Please do not refresh ❌❌
//         </p>
//         <div className="md:min-h-[65vh] min-h-[45vh] flex items-center justify-center">
//           <span className="loader  "></span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;
