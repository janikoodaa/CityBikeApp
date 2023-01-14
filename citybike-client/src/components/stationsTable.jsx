import { useState, useReducer, useEffect, useCallback } from "react";
import { useLanguageContext } from "../context/languageContext";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import StationsFilter from "./stationsFilter";
import StationsDialog from "./stationsDialog";

const translations = {
     stationName: {
          fin: "Aseman nimi",
          swe: "Station namn",
          eng: "Station name",
     },
     stationAddress: {
          fin: "Osoite",
          swe: "Adress",
          eng: "Address",
     },
     city: {
          fin: "Kaupunki",
          swe: "Stad",
          eng: "City",
     },
     operator: {
          fin: "Operaattori",
          swe: "Operator",
          eng: "Operator",
     },
     capacity: {
          fin: "Kapasiteetti",
          swe: "Kapasitet",
          eng: "Capacity",
     },
};

const emptyData = {
     rowsFrom: 0,
     rowsTo: 0,
     totalRowCount: 0,
     stations: [],
};

const emptyDialog = {
     id: null,
     nameFin: "",
     nameSwe: "",
     nameEng: "",
     addressFin: "",
     addressSwe: "",
     cityFin: "",
     citySwe: "",
     operator: "",
     capacity: null,
     xCoordinate: null,
     yCoordinate: null,
};

const initialQueryParams = {
     name: "",
     address: "",
     city: "",
     sortBy: "name",
     sortDir: "asc",
     rowsPerPage: 100,
     page: 0,
};

const ACTION_TYPES = Object.freeze({
     UPDATE_FILTER_MODEL: 1,
     UPDATE_SORT_MODEL: 2,
     UPDATE_ROWS_PER_PAGE: 3,
     UPDATE_PAGE: 4,
});

function updateQueryParams(queryParams, action) {
     switch (action.type) {
          case ACTION_TYPES.UPDATE_FILTER_MODEL: {
               return { ...queryParams, name: action.payload.name, address: action.payload.address, city: action.payload.city };
          }
          case ACTION_TYPES.UPDATE_SORT_MODEL:
               return { ...queryParams, sortBy: action.payload.field, sortDir: action.payload.sort };
          case ACTION_TYPES.UPDATE_ROWS_PER_PAGE:
               return { ...queryParams, rowsPerPage: action.payload.newPageSize, page: action.payload.newPage };
          case ACTION_TYPES.UPDATE_PAGE:
               return { ...queryParams, page: action.payload };
          default:
               return { ...queryParams };
     }
}

const stationNameCol = (language) => {
     switch (language) {
          case "swe":
               return "nameSwe";
          case "eng":
               return "nameEng";
          default:
               return "nameFin";
     }
};

const stationAddressCol = (language) => {
     if (language === "swe") return "addressSwe";
     return "addressFin";
};

const stationCityCol = (language) => {
     if (language === "swe") return "citySwe";
     return "cityFin";
};

export default function StationsTable() {
     const { language } = useLanguageContext();
     const [stations, setStations] = useState(emptyData);
     const [queryParams, dispatchQueryParams] = useReducer(updateQueryParams, initialQueryParams);
     const [loadingData, setLoadingData] = useState(false);
     const [dialogOpen, setDialogOpen] = useState(false);
     const [stationInDialog, setStationInDialog] = useState(emptyDialog);

     const dataGridColumns = [
          { field: stationNameCol(language), headerName: translations.stationName[language], width: 200, hideable: false, filterable: false },
          { field: stationAddressCol(language), headerName: translations.stationAddress[language], flex: 2, hideable: false, filterable: false },
          { field: stationCityCol(language), headerName: translations.city[language], width: 120, hideable: false, filterable: false },
          { field: "operator", headerName: translations.operator[language], width: 150, hideable: false, filterable: false },
          { field: "capacity", headerName: translations.capacity[language], width: 100, hideable: false, filterable: false, type: "number" },
     ];

     const handleSortModelChange = useCallback((sortModel) => {
          if (sortModel.length === 0) {
               dispatchQueryParams({
                    type: ACTION_TYPES.UPDATE_SORT_MODEL,
                    payload: { field: initialQueryParams.sortBy, sort: initialQueryParams.sortDir },
               });
               return;
          }
          let sortField = sortModel[0].field;
          if (sortField.endsWith("Fin") || sortField.endsWith("Swe") || sortField.endsWith("Eng")) {
               sortField = sortField.substring(0, sortField.length - 3);
          }
          dispatchQueryParams({ type: ACTION_TYPES.UPDATE_SORT_MODEL, payload: { field: sortField, sort: sortModel[0].sort } });
     });

     const handlePageChange = useCallback((newPage) => {
          dispatchQueryParams({ type: ACTION_TYPES.UPDATE_PAGE, payload: newPage });
     });

     const handlePageSizeChange = useCallback((newPageSize) => {
          let newPage = (stations.rowsFrom / newPageSize).toFixed(0);
          dispatchQueryParams({ type: ACTION_TYPES.UPDATE_ROWS_PER_PAGE, payload: { newPageSize: newPageSize, newPage: newPage } });
     });

     const handleOpenDialog = (props) => {
          setStationInDialog(props.row);
          setDialogOpen(true);
     };

     const handleCloseDialog = () => {
          setDialogOpen(false);
          setStationInDialog(emptyDialog);
     };

     useEffect(() => {
          setLoadingData(true);

          const controller = new AbortController();
          const signal = controller.signal;
          let headers = { clientLanguage: language, "Access-Control-Allow-Headers": "Accept" };
          let endpoint =
               `${import.meta.env.VITE_BACKEND_URL}stations/list?name=${queryParams.name}&address=${queryParams.address}` +
               `&city=${queryParams.city}&sortby=${queryParams.sortBy}&sortdir=${queryParams.sortDir}` +
               `&rowsperpage=${queryParams.rowsPerPage}&page=${queryParams.page}`;

          const getData = async () => {
               try {
                    let response = await fetch(endpoint, {
                         method: "GET",
                         headers: headers,
                         mode: "cors",
                         signal: signal,
                    });

                    if (response.status === 200) {
                         let data = await response.json();
                         setStations(data);
                    }
                    if (response.status === 404) {
                         setStations(emptyData);
                    }
               } catch (error) {
                    setStations(emptyData);
                    if (error.name !== "AbortError") {
                         console.error(error.message);
                    }
               }
          };
          getData();
          setLoadingData(false);
          return () => {
               controller.abort();
          };
     }, [queryParams]);

     return (
          <>
               <StationsFilter
                    queryParams={queryParams}
                    dispatchQueryParams={dispatchQueryParams}
                    ACTION_TYPES={ACTION_TYPES}
               />
               <Container
                    maxWidth="xl"
                    sx={{
                         display: "flex",
                         justifyContent: "center",
                         height: { xs: "60vh", md: "65vh", lg: "70vh" },
                         width: { xs: "100%", md: "80%" },
                    }}
               >
                    <DataGrid
                         columns={dataGridColumns}
                         rows={stations.stations}
                         rowHeight={50}
                         loading={loadingData}
                         page={parseInt(queryParams.page)}
                         rowCount={stations.totalRowCount}
                         rowsPerPageOptions={[50, 100]}
                         sortingMode="server"
                         onSortModelChange={handleSortModelChange}
                         paginationMode="server"
                         onPageChange={(newPage) => handlePageChange(newPage)}
                         pageSize={queryParams.rowsPerPage}
                         onPageSizeChange={(newPageSize) => handlePageSizeChange(newPageSize)}
                         disableSelectionOnClick
                         disableColumnMenu
                         onRowClick={handleOpenDialog}
                         sx={{ backgroundColor: "white" }}
                    />
               </Container>
               <StationsDialog
                    dialogOpen={dialogOpen}
                    stationInDialog={stationInDialog}
                    handleCloseDialog={handleCloseDialog}
                    translations={translations}
               />
          </>
     );
}
