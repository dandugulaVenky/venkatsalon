import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  city: JSON.parse(localStorage.getItem("bookingDetails"))
    ? JSON.parse(localStorage.getItem("bookingDetails")).city
    : "",
  date: JSON.parse(localStorage.getItem("bookingDetails"))
    ? JSON.parse(localStorage.getItem("bookingDetails")).date
    : "",
  time: JSON.parse(localStorage.getItem("bookingDetails"))
    ? JSON.parse(localStorage.getItem("bookingDetails")).time
    : "",
  open: false,
  pincode: JSON.parse(localStorage.getItem("bookingDetails"))
    ? JSON.parse(localStorage.getItem("bookingDetails")).pincode
    : "",
  type: JSON.parse(localStorage.getItem("bookingDetails"))
    ? JSON.parse(localStorage.getItem("bookingDetails")).type
    : "salon",
  timeDifferenceInDays: JSON.parse(localStorage.getItem("bookingDetails"))
    ? JSON.parse(localStorage.getItem("bookingDetails")).timeDifferenceInDays
    : 0,
};

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      const city = action.payload.destination;
      const pincode = action.payload.pincode;
      const date = action.payload.value;
      const time = action.payload.time;
      const type = action.payload.type;
      const timeDifferenceInDays = action.payload.timeDifferenceInDays;

      // console.log("payload", action.payload);
      localStorage.setItem(
        "bookingDetails",
        JSON.stringify({
          city,
          date,
          time,
          type,
          timeDifferenceInDays,
          pincode,
        })
      );
      return { ...state, date, city, time, type, timeDifferenceInDays };
    case "RESET_SEARCH":
      return INITIAL_STATE;
    case "SIDEBAR_OPEN":
      return { ...state, open: action.payload };
    default:
      return state;
  }
};

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

  return (
    <SearchContext.Provider
      value={{
        city: state.city,
        date: state.date,
        time: state.time,
        open: state.open,
        type: state.type,
        timeDifferenceInDays: state.timeDifferenceInDays,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
