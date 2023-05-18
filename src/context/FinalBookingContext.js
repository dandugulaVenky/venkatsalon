// import axios from "axios";
// import { createContext, useEffect, useReducer } from "react";

// const INITIAL_STATE = {
//   selectedSeats: [{}],
//   totalAmount: 0,

//   shopOwner: "",
//   shopId: "",
//   roomId: "",
//   shopName: "",
//   ownerEmail: "",
//   ownerNumber: "",
//   bookId: "",
//   user: {},

//   link: "",
//   dates: [],
// };

// export const FinalBookingContext = createContext(INITIAL_STATE);

// // const FinalBookingReducer = async (state, action) => {
// //   switch (action.type) {
// //     case "NEW_FINALBOOKING":
// //       // console.log("payload", action.payload);

// //       return { ...state };
// //     case "RESET_FINALBOOKING":
// //       localStorage.removeItem("FinalBookingDetails");
// //       localStorage.removeItem("bookingDetails");
// //       return INITIAL_STATE;

// //     default:
// //       return state;
// //   }
// // };

// export const FinalBookingContextProvider = ({ children }) => {
//   // const [state, dispatch] = useReducer(FinalBookingReducer, INITIAL_STATE);

//   return (
//     <FinalBookingContext.Provider
//       value={{
//         dispatch,
//       }}
//     >
//       {children}
//     </FinalBookingContext.Provider>
//   );
// };
