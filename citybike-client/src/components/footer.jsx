import { yellow } from "@mui/material/colors";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

export default function Footer() {
     return (
          <Container className="footer">
               <Link
                    className="footer"
                    underline="none"
                    target="_blank"
                    rel="noreferrer noopener"
                    href="https://github.com/janikoodaa"
               >
                    janikoodaa@Github
               </Link>
          </Container>
     );
}
