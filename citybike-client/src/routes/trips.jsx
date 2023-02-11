import { ThemeProvider } from "@mui/material/styles";
import { gridLocaleFin, gridLocaleSwe, gridLocaleEng } from "../theming/cityBikeTheme";
import { useLanguageContext } from "../context/languageContext";
import TripsTable from "../components/tripsTable";
import TripsInfo from "../components/tripsInfo";
import NewTripDialog from "../components/newTripDialog";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import translations from "../translations.json";
import { useState } from "react";

export default function Trips() {
     const { language } = useLanguageContext();
     const [dialogOpen, setDialogOpen] = useState(false);
     const [isFabExtended, setFabExtended] = useState(false);

     const handleCloseDialog = () => {
          setDialogOpen(false);
     };

     return (
          <>
               <TripsInfo />
               <ThemeProvider theme={language === "fin" ? gridLocaleFin : language === "swe" ? gridLocaleSwe : gridLocaleEng}>
                    <TripsTable />
               </ThemeProvider>
               <Fab
                    sx={{ position: "absolute", bottom: 20, right: 20 }}
                    color="secondary"
                    variant={isFabExtended ? "extended" : "circular"}
                    onClick={() => setDialogOpen(true)}
                    onMouseEnter={() => setFabExtended(true)}
                    onMouseLeave={() => setFabExtended(false)}
               >
                    <AddIcon sx={{ color: "black" }} />
                    {isFabExtended ? translations.addNewTrip[language] : null}
               </Fab>
               <NewTripDialog
                    dialogOpen={dialogOpen}
                    handleCloseDialog={handleCloseDialog}
               />
          </>
     );
}
