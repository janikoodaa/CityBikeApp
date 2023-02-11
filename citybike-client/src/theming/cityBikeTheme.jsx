import { createTheme } from "@mui/material/styles";
import { yellow, grey } from "@mui/material/colors";
import { fiFI as DataGridFiFI, svSE as DataGridSvSE } from "@mui/x-data-grid";
import { fiFI as DatePickerFiFI, svSE as DatePickerSvSE } from "@mui/x-date-pickers";
import "dayjs/locale/fi";
import "dayjs/locale/sv";

export const theme = createTheme({
     palette: {
          background: {
               default: grey[200],
          },
          secondary: {
               main: yellow["A400"],
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
          MuiFab: {
               styleOverrides: {
                    // root: {
                    //      background: yellow["A400"],
                    // },
                    // primary: {
                    //      background: yellow,
                    // },
               },
          },
     },
});

export const gridLocaleFin = createTheme(DataGridFiFI, DatePickerFiFI);
export const gridLocaleSwe = createTheme(DataGridSvSE, DatePickerSvSE);
export const gridLocaleEng = createTheme();
