import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
// import ErrorPage from "./errorPage";
// import NotFoundPage from "./notFoundPage";
import Root from "./routes/root";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
const Home = lazy(() => import("./routes/home"));
const Stations = lazy(() => import("./routes/stations"));
const Trips = lazy(() => import("./routes/trips"));
const ErrorPage = lazy(() => import("./errorPage"));
const NotFoundPage = lazy(() => import("./notFoundPage"));

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

const LoadingPage = () => {
     return (
          <Container maxWidth="lg">
               <Paper sx={{ width: "80%", textAlign: "center" }}>
                    <LinearProgress color="inherit" />
               </Paper>
          </Container>
     );
};

const router = createBrowserRouter([
     {
          path: "/",
          element: <Root />,
          errorElement: (
               <Suspense fallback={<LoadingPage />}>
                    <ErrorPage />
               </Suspense>
          ),
          children: [
               {
                    errorElement: (
                         <Suspense fallback={<LoadingPage />}>
                              <ErrorPage />
                         </Suspense>
                    ),
                    children: [
                         {
                              path: "/",
                              element: (
                                   <Suspense fallback={<LoadingPage />}>
                                        <Home />
                                   </Suspense>
                              ),
                         },
                         {
                              path: "trips",
                              element: (
                                   <Suspense fallback={<LoadingPage />}>
                                        <Trips />
                                   </Suspense>
                              ),
                         },
                         {
                              path: "stations",
                              element: (
                                   <Suspense fallback={<LoadingPage />}>
                                        <Stations />
                                   </Suspense>
                              ),
                         },
                         {
                              path: "*",
                              element: (
                                   <Suspense fallback={<LoadingPage />}>
                                        <NotFoundPage />
                                   </Suspense>
                              ),
                         },
                    ],
               },
          ],
     },
]);

export default router;
