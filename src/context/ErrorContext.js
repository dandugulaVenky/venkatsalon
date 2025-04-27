import { createContext, useState } from "react";

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [globalError, setGlobalError] = useState(null);

  const clearGlobalError = () => setGlobalError(null);

  return (
    <ErrorContext.Provider
      value={{ globalError, setGlobalError, clearGlobalError }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
