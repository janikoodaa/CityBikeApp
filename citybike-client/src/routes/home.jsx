import { useLanguageContext } from "../context/languageContext";

export default function Home() {
     const { language } = useLanguageContext();

     switch (language) {
          case "fin":
               return <p>Tämä on citybike-sovelluksen etusivu.</p>;
          case "swe":
               return <p>Den här är citybike-apps hemsidan.</p>;
          default:
               return <p>This is the homepage of the citybike-app.</p>;
     }
}
