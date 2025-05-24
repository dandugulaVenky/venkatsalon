import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  city: JSON.parse(localStorage.getItem("bookingDetails"))
    ? JSON.parse(localStorage.getItem("bookingDetails")).city
    : "Enter Your Location",
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
  lat: JSON.parse(localStorage.getItem("bookingDetails"))
    ? JSON.parse(localStorage.getItem("bookingDetails")).lat
    : null,
  lng: JSON.parse(localStorage.getItem("bookingDetails"))
    ? JSON.parse(localStorage.getItem("bookingDetails")).lng
    : null,
  timeDifferenceInDays: JSON.parse(localStorage.getItem("bookingDetails"))
    ? JSON.parse(localStorage.getItem("bookingDetails")).timeDifferenceInDays
    : 0,
  range: JSON.parse(localStorage.getItem("bookingDetails"))
    ? JSON.parse(localStorage.getItem("bookingDetails")).range
    : 2,
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
      const lat = action.payload.lat;
      const lng = action.payload.lng;
      const range = action.payload.range;

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
          lat,
          lng,
          range,
        })
      );
      return {
        ...state,
        date,
        city,
        time,
        type,
        timeDifferenceInDays,
        pincode,
        lat,
        lng,
        range,
      };
    case "RESET_SEARCH":
      return INITIAL_STATE;
    case "SIDEBAR_OPEN":
      return { ...state, open: action.payload };
    case "UPDATE_RANGE":
      return { ...state, range: action.payload };
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
        pincode: state.pincode,
        lat: state.lat,
        lng: state.lng,
        range: state.range,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
