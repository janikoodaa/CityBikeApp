import { useLanguageContext } from "../context/languageContext";
import InfoContainer from "../components/infoContainer";
import Typography from "@mui/material/Typography";

const translations = {
     infoText1: {
          fin: "Tällä sivulla näet City Bike -pyörillä tehdyt matkat.",
          swe: "I den här sidan du kan se tripper gjord med City Bike -cyklarna.",
          eng: "On this page you can see the trips made with City Bike -bicycles.",
     },
     infoText2: {
          fin: "Voit filtteröidä matkoja taulukon päällä olevien tekstikenttien avulla kirjoittamalla osan esim. aseman nimestä. Sorttaus onnistuu sarakkeiden otsikkokenttien avulla.",
          swe: "Du kan filter tripper med hjälp av text fälten över tabelln. Sort tripper med klick av kolumn rubrikerna.",
          eng: "You can filter trips with text fields above table by writing e.g. part of the station name. Sort trips by clicking column headers.",
     },
};

export default function TripsInfo() {
     const { language } = useLanguageContext();
     return (
          <InfoContainer>
               <Typography variant="h6">{translations.infoText1[language]}</Typography>
               <Typography>{translations.infoText2[language]}</Typography>
          </InfoContainer>
     );
}
