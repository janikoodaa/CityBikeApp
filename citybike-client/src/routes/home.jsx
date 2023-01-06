import { useLanguageContext } from "../context/languageContext";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const translations = {
     welcome: {
          fin: "Tervetuloa",
          swe: "Välkommen",
          eng: "Welcome",
     },
     content1: {
          fin: "Tämä on citybike-sovelluksen etusivu.",
          swe: "Den här är citybike-apps hemsidan.",
          eng: "This is the homepage of citybike-app.",
     },
     content2: {
          fin: "Tällä sivulla ei ole juuri nähtävää, mutta katso, mitä löydät navbarin linkkien kautta.",
          swe: "Här är inte mycket att se, men kolla, vad kan du hitta via navbar länkar.",
          eng: "Here's not much to see, but see, what you can find through navbar links.",
     },
};

export default function Home() {
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
                         {translations.welcome[language]}
                    </Typography>
                    <Typography paragraph>{translations.content1[language]}</Typography>
                    <Typography paragraph>{translations.content2[language]}</Typography>
               </Paper>
          </Container>
     );
}
