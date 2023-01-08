import { createTheme } from "@mui/material/styles";
import { yellow, grey } from "@mui/material/colors";
import { fiFI, svSE } from "@mui/x-data-grid";

// const getDataGridLocale = () => {
//      switch (sessionStorage.getItem("citybikelanguage")) {
//           case "fin":
//                return fiFI;
//           case "swe":
//                return svSE;
//           default:
//                return null;
//      }
// };

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

export const gridLocaleFin = createTheme(fiFI);
export const gridLocaleSwe = createTheme(svSE);
export const gridLocaleEng = createTheme();
