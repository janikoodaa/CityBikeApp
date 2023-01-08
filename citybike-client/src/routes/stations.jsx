import { ThemeProvider } from "@mui/material/styles";
import { gridLocaleFin, gridLocaleSwe, gridLocaleEng } from "../theming/cityBikeTheme";
import { useLanguageContext } from "../context/languageContext";
import StationsInfo from "../components/stationsInfo";
import StationsTable from "../components/stationsTable";

export default function Stations() {
     const { language } = useLanguageContext();

     return (
          <>
               <StationsInfo />
               <ThemeProvider theme={language === "fin" ? gridLocaleFin : language === "swe" ? gridLocaleSwe : gridLocaleEng}>
                    <StationsTable />
               </ThemeProvider>
          </>
     );
}
