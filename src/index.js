import React from "react";
import ReactDOM from "react-dom/client";
// import i18n from 'i18next';
import App from "./App";

import { AuthContextProvider } from "./context/AuthContext";

import { SearchContextProvider } from "./context/SearchContext";
import { StoreProvider } from "./pages/ironing/ironing-utils/Store";

// import i18n from "../src/utils/language";
// import { LanguageProvider } from "./context/LanguageContext";
import i18n from 'i18next';
import teTranslation from '../src/translations/te/translation.json';
import enTranslation from '../src/translations/en/translation.json';
import { I18nextProvider, initReactI18next } from 'react-i18next';

const root = ReactDOM.createRoot(document.getElementById("root"));

// i18n
//   .use(initReactI18next)
//   .init({
//     resources: {
//       en: { translation: enTranslation },
//       te: { translation: teTranslation },
//     },
//     lng: 'te', // Set the default language
//     // lng: 'en',
//     fallbackLng: 'en', // Fallback language in case translation is missing for the selected language
//     interpolation: {
//       escapeValue: false, // React already escapes strings, so no need for extra escaping
//     },
//   });

root.render(
<I18nextProvider i18n={i18n}>
<React.StrictMode>
    <AuthContextProvider>
      <SearchContextProvider>
        <StoreProvider>
        {/* <LanguageProvider> */}
          <App />
        {/* </LanguageProvider> */}
        </StoreProvider>
      </SearchContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
  </I18nextProvider>
  );
