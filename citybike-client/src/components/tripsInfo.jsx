import { useLanguageContext } from "../context/languageContext";
import InfoContainer from "../components/infoContainer";
import Typography from "@mui/material/Typography";
import translations from "../translations.json";

export default function TripsInfo() {
     const { language } = useLanguageContext();
     return (
          <InfoContainer>
               <Typography variant="h6">{translations.tripsInfoText1[language]}</Typography>
               <Typography>{translations.tripsInfoText2[language]}</Typography>
          </InfoContainer>
     );
}
