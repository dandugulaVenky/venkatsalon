// LanguageContext.js
import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lng, setLng] = useState('te'); // Default language

  const updateLng = (newLng) => {
    console.log(newLng,"new");
    setLng(newLng);
  };

  return (
    <LanguageContext.Provider value={{ lng, updateLng }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
