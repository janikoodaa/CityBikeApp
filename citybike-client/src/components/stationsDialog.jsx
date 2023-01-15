import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import StationsOnMap from "./stationsOnMap";
import Box from "@mui/material/Box";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import { useLanguageContext } from "../context/languageContext";
import CityBikeDialog from "./cityBikeDialog";
import translations from "../translations.json";

const emptyStationDetails = {
     stationId: null,
     tripsCountFromStation: null,
     tripsCountToStation: null,
     averageDistanceFromStation: null,
     averageDistanceToStation: null,
     topFiveDestinationsFromStation: [],
     topFiveOriginsToStation: [],
};

export default function StationsDialog(props) {
     const { dialogOpen, stationInDialog, handleCloseDialog } = props;
     const [dialogTab, setDialogTab] = useState(0);
     const [stationDetails, setStationDetails] = useState(emptyStationDetails);
     const [detailsTimeFrame, setDetailsTimeFrame] = useState({ start: null, end: null });
     const [loadingDetails, setLoadingDetails] = useState(false);
     const { language } = useLanguageContext();

     const handleDialogTabChange = (event, newValue) => {
          setDialogTab(newValue);
     };

     const distanceFormatter = (distance) => {
          switch (language) {
               case "eng":
                    return (distance / 1000).toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
               default:
                    return (distance / 1000).toLocaleString("fi-FI", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
          }
     };

     const TopFiveDestinations = () => {
          return (
               <ol>
                    {stationDetails.topFiveDestinationsFromStation.map((station) => {
                         return <li key={station.id}>{`${station.name[language]} (${station.countOfTrips} ${translations.trips[language]})`}</li>;
                    })}
               </ol>
          );
     };

     const TopFiveOrigins = () => {
          return (
               <ol>
                    {stationDetails.topFiveOriginsToStation.map((station) => {
                         return <li key={station.id}>{`${station.name[language]} (${station.countOfTrips} ${translations.trips[language]})`}</li>;
                    })}
               </ol>
          );
     };

     useEffect(() => {
          setDialogTab(0);
     }, [dialogOpen]);

     useEffect(() => {
          if (stationInDialog.id !== null) {
               setLoadingDetails(true);
               const controller = new AbortController();
               const signal = controller.signal;
               let endpoint = `${import.meta.env.VITE_BACKEND_URL}stations/details/${stationInDialog.id}?statsfrom=${
                    detailsTimeFrame.start || ""
               }&statsto=${detailsTimeFrame.end || ""}`;

               const getData = async () => {
                    try {
                         let response = await fetch(endpoint, {
                              method: "GET",
                              mode: "cors",
                              signal: signal,
                         });

                         if (response.status === 200) {
                              let data = await response.json();
                              setStationDetails(data);
                         }
                         if (response.status === 404) {
                              setStationDetails(emptyStationDetails);
                         }
                    } catch (error) {
                         setStationDetails(emptyStationDetails);
                         if (error.name !== "AbortError") {
                              console.error(error.message);
                         }
                    }
               };
               getData();
               setLoadingDetails(false);

               return () => {
                    controller.abort();
                    setLoadingDetails(false);
               };
          }
     }, [stationInDialog.id]);

     return (
          <CityBikeDialog
               dialogOpen={dialogOpen}
               handleCloseDialog={handleCloseDialog}
               title={stationInDialog.name[language]}
          >
               <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: ".5em" }}>
                    <Tabs
                         variant="fullWidth"
                         value={dialogTab}
                         onChange={handleDialogTabChange}
                    >
                         <Tab icon={<InfoOutlinedIcon />} />
                         <Tab icon={<InsightsOutlinedIcon />} />
                         <Tab icon={<MapOutlinedIcon />} />
                    </Tabs>
               </Box>
               <div hidden={dialogTab !== 0}>
                    <Stack
                         gap={"1em"}
                         divider={<Divider orientation="horizontal" />}
                    >
                         <Grid container>
                              <Grid
                                   item
                                   xs={4}
                              >
                                   <Typography variant="subtitle2">{translations.stationAddress[language]}</Typography>
                              </Grid>
                              <Grid
                                   item
                                   xs={8}
                              >
                                   <Typography>{stationInDialog.address[language]}</Typography>
                              </Grid>
                         </Grid>
                         <Grid container>
                              <Grid
                                   item
                                   xs={4}
                              >
                                   <Typography variant="subtitle2">{translations.city[language]}</Typography>
                              </Grid>
                              <Grid
                                   item
                                   xs={8}
                              >
                                   <Typography>{stationInDialog.city[language]}</Typography>
                              </Grid>
                         </Grid>
                         <Grid container>
                              <Grid
                                   item
                                   xs={4}
                              >
                                   <Typography variant="subtitle2">{translations.capacity[language]}</Typography>
                              </Grid>
                              <Grid
                                   item
                                   xs={8}
                              >
                                   <Typography>{stationInDialog.capacity}</Typography>
                              </Grid>
                         </Grid>
                         <Grid container>
                              <Grid
                                   item
                                   xs={4}
                              >
                                   <Typography variant="subtitle2">{translations.operator[language]}</Typography>
                              </Grid>
                              <Grid
                                   item
                                   xs={8}
                              >
                                   <Typography>{stationInDialog.operator}</Typography>
                              </Grid>
                         </Grid>
                    </Stack>
               </div>
               <div hidden={dialogTab !== 1}>
                    {loadingDetails ? (
                         <LinearProgress color="inherit" />
                    ) : (
                         <Stack
                              gap={".5em"}
                              divider={<Divider orientation="horizontal" />}
                         >
                              <Grid container>
                                   <Grid
                                        item
                                        xs={8}
                                   >
                                        <Typography variant="subtitle2">{translations.tripsCountFromStation[language]}</Typography>
                                   </Grid>
                                   <Grid
                                        item
                                        xs={4}
                                   >
                                        <Typography>{stationDetails.tripsCountFromStation}</Typography>
                                   </Grid>
                              </Grid>
                              <Grid container>
                                   <Grid
                                        item
                                        xs={8}
                                   >
                                        <Typography variant="subtitle2">{translations.tripsCountToStation[language]}</Typography>
                                   </Grid>
                                   <Grid
                                        item
                                        xs={4}
                                   >
                                        <Typography>{stationDetails.tripsCountToStation}</Typography>
                                   </Grid>
                              </Grid>
                              <Grid container>
                                   <Grid
                                        item
                                        xs={8}
                                   >
                                        <Typography variant="subtitle2">{translations.averageDistanceFromStation[language]}</Typography>
                                   </Grid>
                                   <Grid
                                        item
                                        xs={4}
                                   >
                                        <Typography>{distanceFormatter(stationDetails.averageDistanceFromStation)}</Typography>
                                   </Grid>
                              </Grid>
                              <Grid container>
                                   <Grid
                                        item
                                        xs={8}
                                   >
                                        <Typography variant="subtitle2">{translations.averageDistanceToStation[language]}</Typography>
                                   </Grid>
                                   <Grid
                                        item
                                        xs={4}
                                   >
                                        <Typography>{distanceFormatter(stationDetails.averageDistanceToStation)}</Typography>
                                   </Grid>
                              </Grid>
                              <Grid container>
                                   <Grid
                                        item
                                        xs={4}
                                   >
                                        <Typography variant="subtitle2">{translations.topDestinationsFromStation[language]}</Typography>
                                   </Grid>
                                   <Grid
                                        item
                                        xs={8}
                                   >
                                        {stationDetails.topFiveDestinationsFromStation[0] ? <TopFiveDestinations /> : null}
                                   </Grid>
                              </Grid>
                              <Grid container>
                                   <Grid
                                        item
                                        xs={4}
                                   >
                                        <Typography variant="subtitle2">{translations.topOriginsToStation[language]}</Typography>
                                   </Grid>
                                   <Grid
                                        item
                                        xs={8}
                                   >
                                        {stationDetails.topFiveOriginsToStation[0] ? <TopFiveOrigins /> : null}
                                   </Grid>
                              </Grid>
                         </Stack>
                    )}
               </div>
               <div hidden={dialogTab !== 2}>
                    <StationsOnMap markerOne={{ xCoordinate: stationInDialog.xCoordinate, yCoordinate: stationInDialog.yCoordinate }} />
               </div>
          </CityBikeDialog>
     );
}
