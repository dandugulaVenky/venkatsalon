import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  totalAmount: JSON.parse(localStorage.getItem("appointmentDetails"))
    ? JSON.parse(localStorage.getItem("appointmentDetails")).totalAmount
    : "",

  shopName: JSON.parse(localStorage.getItem("appointmentDetails"))
    ? JSON.parse(localStorage.getItem("appointmentDetails")).shopName
    : "",
  city: JSON.parse(localStorage.getItem("appointmentDetails"))
    ? JSON.parse(localStorage.getItem("appointmentDetails")).city
    : "",
  date: JSON.parse(localStorage.getItem("appointmentDetails"))
    ? JSON.parse(localStorage.getItem("appointmentDetails")).date
    : "",

  phone: JSON.parse(localStorage.getItem("appointmentDetails"))
    ? JSON.parse(localStorage.getItem("appointmentDetails")).phone
    : "",
  id: JSON.parse(localStorage.getItem("appointmentDetails"))
    ? JSON.parse(localStorage.getItem("appointmentDetails")).id
    : "",
  status: "pending",
};

export const FinalBookingContext = createContext(INITIAL_STATE);

const FinalBookingReducer = async (state, action) => {
  switch (action.type) {
    case "NEW_APPOINTMENT":
      const city = action.payload.city;
      const date = action.payload.date;
      const shopName = action.payload.shopName;
      const phone = action.payload.phone;
      const totalAmount = action.payload.totalAmount;
      const id = action.payload.id;
      localStorage.setItem(
        "appointmentDetails",
        JSON.stringify({ city, date, shopName, phone, totalAmount, id })
      );

      return { ...state };
    case "RESET_APPOINTMENT":
      localStorage.removeItem("appointmentDetails");
      return INITIAL_STATE;

    default:
      return state;
  }
};

export const FinalBookingContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(FinalBookingReducer, INITIAL_STATE);

  return (
    <FinalBookingContext.Provider
      value={{
        dispatch,
        state,
      }}
    >
      {children}
    </FinalBookingContext.Provider>
  );
};
