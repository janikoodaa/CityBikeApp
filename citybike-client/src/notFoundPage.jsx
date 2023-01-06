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
          fin: "Tätä sivua ei ole olemassa.",
          swe: "Den här sidan är inte existenrande.",
          eng: "This page doesn't exist.",
     },
};

export default function NotFoundPage() {
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
               </Paper>
          </Container>
     );
}
