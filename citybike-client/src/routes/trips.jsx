import { ThemeProvider } from "@mui/material/styles";
import { gridLocaleFin, gridLocaleSwe, gridLocaleEng } from "../theming/cityBikeTheme";
import { useLanguageContext } from "../context/languageContext";
import TripsTable from "../components/tripsTable";
import TripsInfo from "../components/tripsInfo";

export default function Trips() {
     const { language } = useLanguageContext();

     return (
          <>
               <TripsInfo />
               <ThemeProvider theme={language === "fin" ? gridLocaleFin : language === "swe" ? gridLocaleSwe : gridLocaleEng}>
                    <TripsTable />
               </ThemeProvider>
          </>
     );
}
