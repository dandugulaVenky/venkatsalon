import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { AuthContextProvider } from "./context/AuthContext";

import { SearchContextProvider } from "./context/SearchContext";
import { StoreProvider } from "./pages/ironing/ironing-utils/Store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SearchContextProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </SearchContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
