import { useLanguageContext } from "../context/languageContext";
import InfoContainer from "../components/infoContainer";
import Typography from "@mui/material/Typography";
import translations from "../translations.json";

export default function StationsInfo() {
     const { language } = useLanguageContext();
     return (
          <InfoContainer>
               <Typography variant="h6">{translations.stationsInfoText1[language]}</Typography>
               <Typography>{translations.stationsInfoText2[language]}</Typography>
          </InfoContainer>
     );
}
