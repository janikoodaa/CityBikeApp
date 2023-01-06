import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./errorPage";
import Home from "./routes/home";
import Root from "./routes/root";
import Stations from "./routes/stations";
import Trips from "./routes/trips";

export const routeLinks = {
     home: {
          linkTo: "/",
          linkText: {
               fin: "Koti",
               swe: "Hem",
               eng: "Home",
          },
     },
     trips: {
          linkTo: "/trips",
          linkText: {
               fin: "Matkat",
               swe: "Tripper",
               eng: "Trips",
          },
     },
     stations: {
          linkTo: "/stations",
          linkText: {
               fin: "Asemat",
               swe: "Stationer",
               eng: "Stations",
          },
     },
};

const router = createBrowserRouter([
     {
          path: "/",
          element: <Root />,
          errorElement: <ErrorPage />,
          children: [
               {
                    errorElement: <ErrorPage />,
                    children: [
                         { path: "/", element: <Home /> },
                         { path: "trips", element: <Trips /> },
                         { path: "stations", element: <Stations /> },
                    ],
               },
          ],
     },
]);

export default router;
