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
import { useEffect, useState } from "react";
import { useLanguageContext } from "../context/languageContext";
import CityBikeDialog from "./cityBikeDialog";
import translations from "../translations.json";

export default function StationsDialog(props) {
     const { dialogOpen, stationInDialog, handleCloseDialog } = props;
     const [dialogTab, setDialogTab] = useState(0);
     const { language } = useLanguageContext();

     const getDialogHeader = () => {
          switch (language) {
               case "swe":
                    return stationInDialog.nameSwe;
               case "eng":
                    return stationInDialog.nameEng;
               default:
                    return stationInDialog.nameFin;
          }
     };

     const getAddressTranslation = () => {
          switch (language) {
               case "swe":
                    return stationInDialog.addressSwe;
               default:
                    return stationInDialog.addressFin;
          }
     };

     const getCityTranslation = () => {
          switch (language) {
               case "swe":
                    return stationInDialog.citySwe;
               default:
                    return stationInDialog.cityFin;
          }
     };

     const handleDialogTabChange = (event, newValue) => {
          setDialogTab(newValue);
     };

     useEffect(() => {
          setDialogTab(0);
     }, [dialogOpen]);

     return (
          <CityBikeDialog
               dialogOpen={dialogOpen}
               handleCloseDialog={handleCloseDialog}
               title={getDialogHeader()}
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
                         <Typography sx={{ marginTop: "1em", marginBottom: "1em" }}>Aseman perustietoja</Typography>
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
                                   <Typography>{getAddressTranslation()}</Typography>
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
                                   <Typography>{getCityTranslation()}</Typography>
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
                    <div>Statistiikkaa tänne</div>
               </div>
               <div hidden={dialogTab !== 2}>
                    <StationsOnMap
                         markerOne={{ xCoordinate: stationInDialog.xCoordinate, yCoordinate: stationInDialog.yCoordinate }}
                         // markerTwo={{ xCoordinate: "24.8559544008311", yCoordinate: "60.2071192920000" }}
                    />
               </div>
          </CityBikeDialog>
     );
}
