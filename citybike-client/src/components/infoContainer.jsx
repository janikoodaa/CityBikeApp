import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";

export default function InfoContainer({ children }) {
     return (
          <Container
               maxWidth="lg"
               sx={{ display: "flex", justifyContent: "center" }}
          >
               <Paper
                    className="info-content"
                    sx={{ width: { xs: "100%", md: "80%" } }}
               >
                    {children}
               </Paper>
          </Container>
     );
}
