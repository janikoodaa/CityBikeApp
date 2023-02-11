import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import { useLanguageContext } from "../context/languageContext";
import CityBikeDialog from "./cityBikeDialog";
import translations from "../translations.json";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";

const tripObject = {
     departureDate: null,
     returnDate: dayjs(),
     departureStation: null,
     returnStation: null,
     distanceKiloMeters: 0,
};

const onKeyDown = (e) => {
     e.preventDefault();
};

const DayPicker = (props) => {
     const [open, setOpen] = useState(false);
     const { label, name, value, handleDateChange, locale, minDate, maxDate, error, helperText } = props;
     return (
          <LocalizationProvider
               dateAdapter={AdapterDayjs}
               adapterLocale={locale}
          >
               <DateTimePicker
                    label={label}
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={value}
                    minDate={minDate}
                    maxDate={maxDate}
                    onChange={(newDate) => handleDateChange(newDate, name)}
                    renderInput={(params) => (
                         <TextField
                              {...params}
                              size="small"
                              fullWidth
                              onKeyDown={onKeyDown}
                              error={error}
                              helperText={helperText}
                              onClick={() => setOpen(!open)}
                         />
                    )}
               />
          </LocalizationProvider>
     );
};

export default function NewTripDialog(props) {
     const { dialogOpen, handleCloseDialog } = props;
     const { enqueueSnackbar } = useSnackbar();
     const [loadingData, setLoadingData] = useState(false);
     const [stationOptions, setStationOptions] = useState([]);
     const [isSaving, setIsSaving] = useState(false);
     const [newTrip, setNewTrip] = useState(tripObject);
     const [departureStationInput, setDepartureStationInput] = useState("");
     const [returnStationInput, setReturnStationInput] = useState("");
     const [areDatesValid, setAreDatesValid] = useState({
          departureDateHasError: false,
          departureDateError: null,
          returnDateHasError: false,
          returnDateError: null,
     });
     const { language } = useLanguageContext();

     const validateDepartureDate = (departureDate, returnDate) => {
          if (departureDate === null) {
               setAreDatesValid((prev) => {
                    return { ...prev, departureDateHasError: true, departureDateError: "Lähtöaika puuttuu." };
               });
               return;
          }
          if (returnDate && dayjs(departureDate) >= dayjs(returnDate)) {
               setAreDatesValid((prev) => {
                    return { ...prev, departureDateHasError: true, departureDateError: "Lähtöajan on oltava aiempi, kuin paluuaika." };
               });
               return;
          }
          setAreDatesValid((prev) => {
               return { ...prev, departureDateHasError: false, departureDateError: null };
          });
     };

     const validateReturnDate = (departureDate, returnDate) => {
          if (!returnDate) {
               setAreDatesValid((prev) => {
                    return { ...prev, returnDateHasError: true, returnDateError: "Paluuaika puuttuu." };
               });
               return;
          }
          if (departureDate !== null && dayjs(departureDate) >= dayjs(returnDate)) {
               setAreDatesValid((prev) => {
                    return { ...prev, returnDateHasError: true, returnDateError: "Paluuajan on oltava myöhäisempi, kuin lähtöaika." };
               });
               return;
          }
          if (returnDate > dayjs()) {
               setAreDatesValid((prev) => {
                    return { ...prev, returnDateHasError: true, returnDateError: "Paluuaika ei voi olla tulevaisuudessa." };
               });
               return;
          }
          setAreDatesValid((prev) => {
               return { ...prev, returnDateHasError: false, returnDateError: null };
          });
     };

     const handleDateChange = (newDate, name) => {
          setNewTrip((prev) => {
               if (name === "departureDate") {
                    validateDepartureDate(newDate, prev.returnDate);
                    validateReturnDate(newDate, prev.returnDate);
               } else {
                    validateDepartureDate(prev.departureDate, newDate);
                    validateReturnDate(prev.departureDate, newDate);
               }
               return { ...prev, [name]: newDate };
          });
     };

     const handleDistanceChange = (e) => {
          setNewTrip((prev) => {
               return { ...prev, distanceKiloMeters: e.target.value };
          });
     };

     const handleAutocompleteChange = (station, inputName) => {
          setNewTrip((prev) => {
               return { ...prev, [inputName]: station || null };
          });
     };

     const saveNewTrip = async () => {
          setIsSaving(true);
          let tripToSave = {
               departureDate: dayjs(newTrip.departureDate).add(dayjs(newTrip.departureDate).utcOffset(), "minutes").toISOString().split(".")[0],
               returnDate: dayjs(newTrip.returnDate).add(dayjs(newTrip.returnDate).utcOffset(), "minutes").toISOString().split(".")[0],
               departureStationId: newTrip.departureStation.id,
               returnStationId: newTrip.returnStation.id,
               distanceMeters: newTrip.distanceKiloMeters * 1000,
          };

          try {
               let endpoint = `${import.meta.env.VITE_BACKEND_URL}trips`;
               let options = { method: "POST", headers: { "Content-Type": "application/json" }, mode: "cors", body: JSON.stringify(tripToSave) };
               let response = await fetch(endpoint, options);
               if (response.status === 201) {
                    enqueueSnackbar(translations.tripSaved[language], { variant: "success" });
                    setIsSaving(false);
                    setNewTrip(tripObject);
                    handleCloseDialog();
               } else {
                    enqueueSnackbar(translations.saveFailed[language], { variant: "error" });
                    setIsSaving(false);
               }
          } catch {
               enqueueSnackbar(translations.saveFailed[language], { variant: "error" });
               setIsSaving(false);
          }
     };

     useEffect(() => {
          const controller = new AbortController();
          const signal = controller.signal;
          let headers = { clientLanguage: language };
          let endpoint = `${import.meta.env.VITE_BACKEND_URL}stations?rowsperpage=500&page=0`;

          const getData = async () => {
               setLoadingData(true);
               try {
                    let response = await fetch(endpoint, {
                         method: "GET",
                         headers: headers,
                         mode: "cors",
                         signal: signal,
                    });

                    if (response.status === 200) {
                         let data = await response.json();
                         setStationOptions(data.stations);
                    } else {
                         setStationOptions([]);
                    }
               } catch (error) {
                    setStationOptions([]);
                    if (error.name !== "AbortError") {
                         console.error(error.message);
                    }
               }
               setLoadingData(false);
          };
          dialogOpen && getData();

          return () => {
               controller.abort();
               setLoadingData(false);
          };
     }, [dialogOpen]);

     return (
          <CityBikeDialog
               dialogOpen={dialogOpen}
               handleCloseDialog={() => {
                    setNewTrip(tripObject);
                    handleCloseDialog();
               }}
               title={translations.addNewTrip[language]}
          >
               {loadingData ? <LinearProgress color="inherit" /> : null}
               <div style={{ marginTop: "1em" }}>
                    <Grid
                         container
                         columnSpacing={1}
                         rowSpacing={2}
                         columns={1}
                    >
                         <Grid
                              item
                              xs={1}
                         >
                              <DayPicker
                                   label={translations.departureDate[language]}
                                   name="departureDate"
                                   value={newTrip.departureDate}
                                   handleDateChange={handleDateChange}
                                   locale={language === "fin" ? "fi" : language === "swe" ? "sv" : "en"}
                                   minDate={dayjs().subtract(7, "day")}
                                   maxDate={newTrip.returnDate || dayjs()}
                                   error={areDatesValid.departureDateHasError}
                                   helperText={areDatesValid.departureDateError}
                              />
                         </Grid>
                         <Grid
                              item
                              xs={1}
                         >
                              <DayPicker
                                   label={translations.returnDate[language]}
                                   name="returnDate"
                                   value={newTrip.returnDate}
                                   handleDateChange={handleDateChange}
                                   locale={language === "fin" ? "fi" : language === "swe" ? "sv" : "en"}
                                   minDate={newTrip.departureDate || dayjs().subtract(7, "day")}
                                   maxDate={dayjs()}
                                   error={areDatesValid.returnDateHasError}
                                   helperText={areDatesValid.returnDateError}
                              />
                         </Grid>
                         <Grid
                              item
                              xs={1}
                         >
                              <Autocomplete
                                   size="small"
                                   options={stationOptions}
                                   name="departureStation"
                                   value={newTrip.departureStation}
                                   onChange={(e, option) => handleAutocompleteChange(option, "departureStation")}
                                   inputValue={departureStationInput}
                                   onInputChange={(e, value) => setDepartureStationInput(value)}
                                   isOptionEqualToValue={(option, value) => option.id == value.id}
                                   getOptionLabel={(option) => `${option.name[language]}, ${option.address[language]}, ${option.city[language]}`}
                                   renderInput={(params) => (
                                        <TextField
                                             {...params}
                                             label={translations.departureStationName[language]}
                                        />
                                   )}
                              />
                         </Grid>
                         <Grid
                              item
                              xs={1}
                         >
                              <Autocomplete
                                   size="small"
                                   options={stationOptions}
                                   name="returnStation"
                                   value={newTrip.returnStation}
                                   onChange={(e, option) => handleAutocompleteChange(option, "returnStation")}
                                   inputValue={returnStationInput}
                                   onInputChange={(e, value) => setReturnStationInput(value)}
                                   isOptionEqualToValue={(option, value) => option.id == value.id}
                                   getOptionLabel={(option) => `${option.name[language]}, ${option.address[language]}, ${option.city[language]}`}
                                   renderInput={(params) => (
                                        <TextField
                                             {...params}
                                             label={translations.returnStationName[language]}
                                        />
                                   )}
                              />
                         </Grid>
                         <Grid
                              item
                              xs={1}
                         >
                              <TextField
                                   size="small"
                                   fullWidth
                                   type={"number"}
                                   label={translations.distance[language]}
                                   name="distanceKiloMeters"
                                   value={newTrip.distanceKiloMeters}
                                   onChange={(e) => handleDistanceChange(e)}
                              />
                         </Grid>
                         <Grid
                              item
                              xs={1}
                              textAlign="center"
                         >
                              <Button
                                   variant="contained"
                                   disabled={
                                        !newTrip.departureDate ||
                                        !newTrip.returnDate ||
                                        !newTrip.departureStation ||
                                        !newTrip.returnStation ||
                                        newTrip.distanceKiloMeters < 0.01 ||
                                        areDatesValid.departureDateHasError ||
                                        areDatesValid.returnDateHasError ||
                                        isSaving
                                   }
                                   onClick={saveNewTrip}
                              >
                                   {translations.save[language]}
                              </Button>
                         </Grid>
                    </Grid>
               </div>
          </CityBikeDialog>
     );
}
