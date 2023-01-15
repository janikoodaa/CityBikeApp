import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import Tooltip from "@mui/material/Tooltip";
import { useLanguageContext } from "../context/languageContext";
import translations from "../translations.json";

export default function StationsFilter(props) {
     const { queryParams, dispatchQueryParams, ACTION_TYPES } = props;
     const { language } = useLanguageContext();
     const [inputValues, setInputValues] = useState({ name: queryParams.name, address: queryParams.address, city: queryParams.city });

     const handleInputChange = (e) => {
          setInputValues((prev) => {
               return { ...prev, [e.target.name]: e.target.value };
          });
     };

     const handleClearInputs = () => {
          setInputValues({ name: "", address: "", city: "" });
     };

     useEffect(() => {
          const delayDispatch = setTimeout(dispatchQueryParams, 600, {
               type: ACTION_TYPES.UPDATE_FILTER_MODEL,
               payload: { name: inputValues.name, address: inputValues.address, city: inputValues.city },
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
                                   columns={{ xs: 1, md: 3 }}
                              >
                                   <Grid
                                        item
                                        xs={1}
                                   >
                                        <TextField
                                             size="small"
                                             fullWidth
                                             label={translations.stationName[language]}
                                             name="name"
                                             value={inputValues.name}
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
                                             label={translations.stationAddress[language]}
                                             name="address"
                                             value={inputValues.address}
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
                                             label={translations.city[language]}
                                             name="city"
                                             value={inputValues.city}
                                             onChange={(e) => handleInputChange(e)}
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
