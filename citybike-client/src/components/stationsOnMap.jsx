import Typography from "@mui/material/Typography";
import { useLanguageContext } from "../context/languageContext";
import translations from "../translations.json";

export default function StationsOnMap(props) {
     const { markerOne, markerTwo } = props;
     const { language } = useLanguageContext();

     let url = "";
     if (!import.meta.env.VITE_MAPS_API_KEY) {
          url =
               "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.5352203143086!2d24.9388467778476!3d60.171872875033294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bcd11e392db%3A0x560b9edee0bf2199!2sHelsingin%20p%C3%A4%C3%A4rautatieasema!5e0!3m2!1sfi!2sfi!4v1673704086164!5m2!1sfi!2sfi";
          return (
               <>
                    <iframe
                         width="100%"
                         height="450"
                         style={{ border: 0 }}
                         loading="lazy"
                         allowFullScreen
                         src={url}
                    ></iframe>
                    <Typography>{translations.mapNoApiKeyMessage[language]}</Typography>
               </>
          );
     }
     if (!markerTwo) {
          url = `https://www.google.com/maps/embed/v1/place?q=${markerOne.yCoordinate}%2C%20${markerOne.xCoordinate}&key=${
               import.meta.env.VITE_MAPS_API_KEY
          }`;
     } else {
          url = `https://www.google.com/maps/embed/v1/directions?origin=${markerOne.yCoordinate}%2C%20${markerOne.xCoordinate}&destination=${
               markerTwo.yCoordinate
          }%2C%20${markerTwo.xCoordinate}&mode=bicycling&key=${import.meta.env.VITE_MAPS_API_KEY}`;
     }

     return (
          <>
               <iframe
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={url}
               ></iframe>
               {markerTwo ? <Typography>{translations.mapNote[language]}</Typography> : null}
          </>
     );
}
