import { useLanguageContext } from "../context/languageContext";

export default function Trips() {
     const { language } = useLanguageContext();

     switch (language) {
          case "fin":
               return <p>Tänne tulee data grid, jossa on matkat.</p>;
          case "swe":
               return <p>Här ska komma data grid, som innehåller tripperna.</p>;
          default:
               return <p>Here will be a data grid, which will display the trips.</p>;
     }
}
