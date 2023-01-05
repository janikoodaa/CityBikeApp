import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const languages = {
     fin: {
          value: "fin",
          description: "suomi",
          flag: (
               <img
                    src="/fi-flag.gif"
                    height={15}
               />
          ),
     },
     swe: {
          value: "swe",
          description: "svenska",
          flag: (
               <img
                    src="/sw-flag.gif"
                    height={15}
               />
          ),
     },
     eng: {
          value: "eng",
          description: "english",
          flag: (
               <img
                    src="/uk-flag.gif"
                    height={15}
               />
          ),
     },
};

export function useLanguageContext() {
     return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
     const [language, setLanguage] = useState(languages.fin.value);
     return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}
