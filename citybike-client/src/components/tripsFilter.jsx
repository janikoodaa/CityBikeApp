import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import Tooltip from "@mui/material/Tooltip";
import { useLanguageContext } from "../context/languageContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";

const translations = {
     departureStationName: {
          fin: "Lähtöasema",
          swe: "Avgång station",
          eng: "Departure station",
     },
     returnStationName: {
          fin: "Paluuasema",
          swe: "Återkomst station",
          eng: "Return station",
     },
     departureDateFrom: {
          fin: "Lähtö, alkaen",
          swe: "Avgång, från",
          eng: "Departure, from",
     },
     departureDateTo: {
          fin: "Lähtö, päättyen",
          swe: "Avgång, till",
          eng: "Departure, to",
     },
     clearButtonTooltip: {
          fin: "Tyhjennä filtterit",
          swe: "Klara filtren",
          eng: "Clear filters",
     },
};

const onKeyDown = (e) => {
     e.preventDefault();
};

const DayPicker = (props) => {
     const [open, setOpen] = useState(false);
     const { label, name, value, handleDateChange, locale, minDate, maxDate } = props;
     return (
          <LocalizationProvider
               dateAdapter={AdapterDayjs}
               adapterLocale={locale}
          >
               <DesktopDatePicker
                    label={label}
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={value}
                    minDate={minDate}
                    maxDate={maxDate}
                    // Without the below tweak datepicker would return the selected date ± timezone offset
                    // Means, that in Finland (normal time UTC+2), newDate would be previous date at 22.00.
                    onChange={(newDate) => handleDateChange(dayjs(newDate).add(3, "hour"), name)}
                    renderInput={(params) => (
                         <TextField
                              {...params}
                              size="small"
                              fullWidth
                              onKeyDown={onKeyDown}
                              onClick={() => setOpen(!open)}
                         />
                    )}
               />
          </LocalizationProvider>
     );
};

export default function TripsFilter(props) {
     const { queryParams, dispatchQueryParams, ACTION_TYPES } = props;
     const { language } = useLanguageContext();
     const [inputValues, setInputValues] = useState({
          departureStation: queryParams.departureStation,
          returnStation: queryParams.returnStation,
          departureDateFrom: queryParams.departureDateFrom,
          departureDateTo: queryParams.departureDateTo,
     });

     const handleDateChange = (newDate, name) => {
          setInputValues((prev) => {
               return { ...prev, [name]: newDate };
          });
     };

     const handleInputChange = (e) => {
          setInputValues((prev) => {
               return { ...prev, [e.target.name]: e.target.value };
          });
     };

     const handleClearInputs = () => {
          setInputValues({ departureStation: "", returnStation: "", departureDateFrom: null, departureDateTo: null });
     };

     useEffect(() => {
          const delayDispatch = setTimeout(dispatchQueryParams, 600, {
               type: ACTION_TYPES.UPDATE_FILTER_MODEL,
               payload: {
                    departureStation: inputValues.departureStation,
                    returnStation: inputValues.returnStation,
                    departureDateFrom: inputValues.departureDateFrom,
                    departureDateTo: inputValues.departureDateTo,
               },
          });
          return () => {
               clearTimeout(delayDispatch);
          };
     }, [inputValues]);

     return (
          <Container
               maxWidth="xl"
               sx={{ display: "flex", justifyContent: "center", marginTop: "1em" }}
          >
               <Paper sx={{ width: { xs: "100%", md: "79%" } }}>
                    <Grid
                         container
                         columns={{ xs: 4, md: 7 }}
                    >
                         <Grid
                              item
                              xs={3}
                              md={6}
                         >
                              <Grid
                                   container
                                   columnSpacing={1}
                                   columns={{ xs: 2, lg: 4 }}
                              >
                                   <Grid
                                        item
                                        xs={1}
                                   >
                                        <TextField
                                             size="small"
                                             fullWidth
                                             label={translations.departureStationName[language]}
                                             name="departureStation"
                                             value={inputValues.departureStation}
                                             onChange={(e) => handleInputChange(e)}
                                        />
                                   </Grid>
                                   <Grid
                                        item
                                        xs={1}
                                   >
                                        <TextField
                                             size="small"
                                             fullWidth
                                             label={translations.returnStationName[language]}
                                             name="returnStation"
                                             value={inputValues.returnStation}
                                             onChange={(e) => handleInputChange(e)}
                                        />
                                   </Grid>
                                   <Grid
                                        item
                                        xs={1}
                                   >
                                        <DayPicker
                                             label={translations.departureDateFrom[language]}
                                             name="departureDateFrom"
                                             value={inputValues.departureDateFrom}
                                             handleDateChange={handleDateChange}
                                             locale={language === "fin" ? "fi" : language === "swe" ? "sv" : "en"}
                                             minDate={dayjs("2021-04-01")}
                                             maxDate={inputValues.departureDateTo || dayjs()}
                                        />
                                   </Grid>
                                   <Grid
                                        item
                                        xs={1}
                                   >
                                        <DayPicker
                                             label={translations.departureDateTo[language]}
                                             name="departureDateTo"
                                             value={inputValues.departureDateTo}
                                             handleDateChange={handleDateChange}
                                             locale={language === "fin" ? "fi" : language === "swe" ? "sv" : "en"}
                                             minDate={inputValues.departureDateFrom || dayjs("2021-04-01")}
                                             maxDate={dayjs()}
                                        />
                                   </Grid>
                              </Grid>
                         </Grid>
                         <Grid
                              item
                              xs={1}
                              sx={{ textAlign: "center" }}
                         >
                              <Tooltip title={translations.clearButtonTooltip[language]}>
                                   <IconButton onClick={handleClearInputs}>
                                        <BackspaceOutlinedIcon />
                                   </IconButton>
                              </Tooltip>
                         </Grid>
                    </Grid>
               </Paper>
          </Container>
     );
}
