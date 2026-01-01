import React, { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { enUS, trTR } from '@mui/material/locale';
import i18n from './i18n';

const LanguageContext = createContext();

const muiLocales = { en: enUS, tr: trTR };

export function MUIWrapper({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const theme = createTheme(
    {
      colorSchemes: {
        light: true,
        dark: true,
      },
    },
    muiLocales[language]
  );

  const setLangs = (lng) => {
    setLanguage(lng);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLangs }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
