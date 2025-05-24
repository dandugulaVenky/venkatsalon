import React from "react";
import ReactDOM from "react-dom/client";
// import i18n from 'i18next';
import App from "./App";

import { AuthContextProvider } from "./context/AuthContext";
import { FinalBookingContextProvider } from "./context/FinalBookingContext";

import { SearchContextProvider } from "./context/SearchContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SearchContextProvider>
          <FinalBookingContextProvider>
            <App />
          </FinalBookingContextProvider>
        </SearchContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
