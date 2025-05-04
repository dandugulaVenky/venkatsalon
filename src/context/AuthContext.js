import { createContext, useEffect, useReducer } from "react";
import secureLocalStorage from "react-secure-storage";

const INITIAL_STATE = {
  user: secureLocalStorage.getItem("easytym-user") || null,
  loading: false,

  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,

        error: null,
      };
    case "LOGIN_SUCCESS":
      // Store the token in localStorage (or secureLocalStorage)
      localStorage.setItem("access_token", action.payload.token); // assuming token is in response
      localStorage.setItem("refresh_token", action.payload.refreshToken); // assuming token is in response

      return {
        user: action.payload.user, // store user data
        loading: false,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,

        error: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("easytym-user");
      localStorage.removeItem("access_token");

      localStorage.removeItem("refresh_token");

      return {
        user: null,
        loading: false,
        error: null,
      };
    case "UPDATE_SHOP_ID":
      return {
        ...state,
        user: {
          ...state.user,
          shopId: action.payload, // just update the shopId field
        },
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    secureLocalStorage.setItem("easytym-user", state.user);
    // localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,

        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
