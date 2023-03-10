import { useRouteError } from "react-router-dom";
import { useLanguageContext } from "./context/languageContext";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const translations = {
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
          <Container
               maxWidth="lg"
               sx={{ display: "flex", justifyContent: "center" }}
          >
               <Paper sx={{ width: "80%", textAlign: "center" }}>
                    <Typography
                         variant="h1"
                         fontFamily={"monospace"}
                         letterSpacing=".25rem"
                    >
                         {translations.head[language]}
                    </Typography>
                    <Typography paragraph>{translations.explanation[language]}</Typography>
                    <Typography paragraph>{error.statusText || error.message}</Typography>
               </Paper>
          </Container>
     );
}
