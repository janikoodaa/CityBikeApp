import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { LanguageProvider } from "./context/languageContext";
import router from "./router";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theming/cityBikeTheme";
import { SnackbarProvider } from "notistack";
import CssBaseline from "@mui/material/CssBaseline";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
     <React.StrictMode>
          <ThemeProvider theme={theme}>
               <CssBaseline />
               <SnackbarProvider
                    anchorOrigin={{
                         vertical: "top",
                         horizontal: "center",
                    }}
                    autoHideDuration={3000}
               >
                    <LanguageProvider>
                         <RouterProvider router={router} />
                    </LanguageProvider>
               </SnackbarProvider>
          </ThemeProvider>
     </React.StrictMode>
);
