import { createTheme } from "@mui/material/styles";
import { yellow, grey } from "@mui/material/colors";

export const theme = createTheme({
     palette: {
          background: {
               default: grey[200],
          },
     },
     components: {
          MuiAppBar: {
               styleOverrides: {
                    root: {
                         background: yellow["A400"],
                         color: "black",
                         minHeight: "4.5em",
                         position: "fixed",
                    },
               },
          },
          MuiContainer: {
               styleOverrides: {
                    root: {
                         "&.footer": {
                              background: yellow[300],
                              alignItems: "center",
                              justifyContent: "center",
                              display: "flex",
                              minHeight: "2em",
                              maxWidth: "100%",
                         },
                    },
               },
          },
          MuiLink: {
               styleOverrides: {
                    root: {
                         "&.footer": {
                              color: "black",
                         },
                    },
               },
          },
          MuiPaper: {
               styleOverrides: {
                    root: {
                         "&.info-content": {
                              textAlign: "center",
                         },
                    },
               },
          },
     },
});
