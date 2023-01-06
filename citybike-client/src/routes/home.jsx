import { useLanguageContext } from "../context/languageContext";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const translations = {
     fin: {
          welcome: "Tervetuloa",
          content1: "Tämä on citybike-sovelluksen etusivu.",
          content2: "Tällä sivulla ei ole juuri nähtävää, mutta katso, mitä löydät navbarin linkkien kautta.",
     },
     swe: {
          welcome: "Välkommen",
          content1: "Den här är citybike-apps hemsidan.",
          content2: "Här är inte mycket att se, men kolla, vad kan du hitta via navbar länkar.",
     },
     eng: {
          welcome: "Welcome",
          content1: "This is the homepage of citybike-app.",
          content2: "Here's not much to see, but see, what you can find through navbar links.",
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
                         {translations[language].welcome}
                    </Typography>
                    <Typography paragraph>{translations[language].content1}</Typography>
                    <Typography paragraph>{translations[language].content2}</Typography>
               </Paper>
          </Container>
     );
}
