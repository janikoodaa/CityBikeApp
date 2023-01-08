import { useLanguageContext } from "../context/languageContext";
import InfoContainer from "../components/infoContainer";
import Typography from "@mui/material/Typography";

const translations = {
     description: {
          fin: "Tänne tulee data grid, jossa on matkat.",
          swe: "Här ska komma data grid, som innehåller tripperna.",
          eng: "Here will be a data grid, which will display the trips.",
     },
};

export default function Trips() {
     const { language } = useLanguageContext();

     return (
          <InfoContainer>
               <Typography>{translations.description[language]}</Typography>
          </InfoContainer>
     );
}
