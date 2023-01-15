import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import StationsOnMap from "./stationsOnMap";
import Box from "@mui/material/Box";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useLanguageContext } from "../context/languageContext";
import CityBikeDialog from "./cityBikeDialog";

export default function TripsDialog(props) {
     const { dialogOpen, tripInDialog, handleCloseDialog } = props;
     const { language } = useLanguageContext();

     return (
          <CityBikeDialog
               dialogOpen={dialogOpen}
               handleCloseDialog={handleCloseDialog}
               title={`${tripInDialog.departureStation.name[language]} - ${tripInDialog.returnStation.name[language]}`}
          >
               <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: ".5em" }}>
                    <Tabs
                         variant="fullWidth"
                         value={0}
                    >
                         <Tab
                              disableTouchRipple
                              icon={<MapOutlinedIcon />}
                         />
                    </Tabs>
               </Box>
               <div>
                    <StationsOnMap
                         markerOne={{
                              xCoordinate: tripInDialog.departureStation.xCoordinate,
                              yCoordinate: tripInDialog.departureStation.yCoordinate,
                         }}
                         markerTwo={{
                              xCoordinate: tripInDialog.returnStation.xCoordinate,
                              yCoordinate: tripInDialog.returnStation.yCoordinate,
                         }}
                    />
               </div>
          </CityBikeDialog>
     );
}
