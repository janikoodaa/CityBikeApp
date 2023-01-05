import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./errorPage";
import Home from "./routes/home";
import Root from "./routes/root";
import Stations from "./routes/stations";
import Trips from "./routes/trips";

const router = createBrowserRouter([
     {
          path: "/",
          element: <Root />,
          errorElement: <ErrorPage />,
          children: [
               { path: "/", element: <Home /> },
               { path: "trips", element: <Trips /> },
               { path: "stations", element: <Stations /> },
          ],
     },
]);

export default router;
