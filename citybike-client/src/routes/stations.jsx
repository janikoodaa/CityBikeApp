import { useLanguageContext } from "../context/languageContext";

export default function Stations() {
     const { language } = useLanguageContext();

     switch (language) {
          case "fin":
               return <p>Tänne tulee data grid, jossa on asemat.</p>;
          case "swe":
               return <p>Här ska komma data grid, som innehåller stationerna.</p>;
          default:
               return <p>Here will be a data grid, which will display the stations.</p>;
     }
}
