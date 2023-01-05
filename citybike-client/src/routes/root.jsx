import { Outlet, Link } from "react-router-dom";
import { useLanguageContext } from "../context/languageContext";
import SelectLanguage from "../selectLanguage";
// Navbar background color #E8E402

export default function Root() {
     const { language } = useLanguageContext();

     switch (language) {
          case "fin":
               return (
                    <>
                         <h2>Root-komponenttiin tulee navbar.</h2>
                         <Link to="/">Koti</Link>
                         <Link to="/trips">Matkat</Link>
                         <Link to="/stations">Asemat</Link>
                         <SelectLanguage />
                         <Outlet />
                    </>
               );
          case "swe":
               return (
                    <>
                         <h2>Root-component ska ha navbar.</h2>
                         <Link to="/">Hem</Link>
                         <Link to="/trips">Tripper</Link>
                         <Link to="/stations">Stationer</Link>
                         <SelectLanguage />
                         <Outlet />
                    </>
               );
          default:
               return (
                    <>
                         <h2>Root component will contain navbar.</h2>
                         <Link to="/">Hem</Link>
                         <Link to="/trips">Trips</Link>
                         <Link to="/stations">Stations</Link>
                         <SelectLanguage />
                         <Outlet />
                    </>
               );
     }
}
