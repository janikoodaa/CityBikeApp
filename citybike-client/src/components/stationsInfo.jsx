import { useLanguageContext } from "../context/languageContext";
import InfoContainer from "../components/infoContainer";
import Typography from "@mui/material/Typography";

const translations = {
     infoText1: {
          fin: "Tällä sivulla näet City Bike -asemat.",
          swe: "I den här sidan du kan se City Bike -stationerna.",
          eng: "On this page you can see the City Bike -stations.",
     },
     infoText2: {
          fin: "Voit filtteröidä asemia taulukon päällä olevien tekstikenttien avulla kirjoittamalla osan esim. aseman nimestä. Sorttaus onnistuu sarakkeiden otsikkokenttien avulla. Lisätietoa asemasta löytyy klikkaamalla riviä.",
          swe: "Du kan filter stationer med hjälp av text fälten över tabelln. Sort stationer med klick av kolumn rubrikerna. Mer information om stationen hittar du genom att klicka på en rad.",
          eng: "You can filter stations with text fields above table by writing e.g. part of the station name. Sort stations by clicking column headers. More info about station can be found by clicking a row.",
     },
};

export default function StationsInfo() {
     const { language } = useLanguageContext();
     return (
          <InfoContainer>
               <Typography variant="h6">{translations.infoText1[language]}</Typography>
               <Typography>{translations.infoText2[language]}</Typography>
          </InfoContainer>
     );
}
