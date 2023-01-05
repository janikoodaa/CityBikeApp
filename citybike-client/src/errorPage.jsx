import { useRouteError } from "react-router-dom";
import { useLanguageContext } from "./context/languageContext";

const dictionary = {
     head: {
          fin: "Hupsista...",
          swe: "Hoppsan...",
          eng: "Oops...",
     },
     explanation: {
          fin: "Tapahtui virhe. Alla lisätietoa englanniksi.",
          swe: "Ett misstag hänt. Mer info nedanför i engelska.",
          eng: "An error occured. See more info below.",
     },
};

export default function ErrorPage() {
     const error = useRouteError();
     const { language } = useLanguageContext();

     return (
          <div>
               <h1>{dictionary.head[language]}</h1>
               <p>{dictionary.explanation[language]}</p>
               <p>
                    <i>{error.statusText || error.message}</i>
               </p>
          </div>
     );
}
