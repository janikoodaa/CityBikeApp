import { useState, useReducer, useEffect, useCallback } from "react";
import { useLanguageContext } from "../context/languageContext";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import TripsFilter from "./tripsFilter";
import TripsDialog from "./tripsDialog";
import translations from "../translations.json";

const emptyData = {
     rowsFrom: 0,
     rowsTo: 0,
     totalRowCount: 0,
     trips: [],
};

const emptyDialog = {
     id: null,
     departureDate: "",
     returnDate: "",
     departureStation: {
          id: 28,
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
     },
     returnStation: {
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
     },
     distanceMeters: null,
     durationSeconds: null,
};

const initialQueryParams = {
     departureDateFrom: null,
     departureDateTo: null,
     departureStation: "",
     returnStation: "",
     sortBy: "departuredate",
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
               return {
                    ...queryParams,
                    departureStation: action.payload.departureStation,
                    returnStation: action.payload.returnStation,
                    departureDateFrom: action.payload.departureDateFrom,
                    departureDateTo: action.payload.departureDateTo,
                    page: 0,
               };
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

export default function TripsTable() {
     const { language } = useLanguageContext();
     const [trips, setTrips] = useState(emptyData);
     const [queryParams, dispatchQueryParams] = useReducer(updateQueryParams, initialQueryParams);
     const [loadingData, setLoadingData] = useState(false);
     const [dialogOpen, setDialogOpen] = useState(false);
     const [tripInDialog, setTripInDialog] = useState(emptyDialog);

     const stationNameCol = (params, type) => {
          switch (language) {
               case "swe":
                    if (type === "departure") return params.row?.departureStation?.nameSwe;
                    return params.row?.returnStation?.nameSwe;
               case "eng":
                    if (type === "departure") return params.row?.departureStation?.nameEng;
                    return params.row?.returnStation?.nameEng;
               default:
                    if (type === "departure") return params.row?.departureStation?.nameFin;
                    return params.row?.returnStation?.nameFin;
          }
     };

     const dateColFormatter = (params, type) => {
          switch (language) {
               case "eng":
                    if (type === "departure") return new Date(params.row?.departureDate).toLocaleString("en-GB");
                    return new Date(params.row?.returnDate).toLocaleString("en-GB");
               default:
                    if (type === "departure") return new Date(params.row?.departureDate).toLocaleString("fi-FI");
                    return new Date(params.row?.returnDate).toLocaleString("fi-FI");
          }
     };

     const distanceFormatter = (params) => {
          switch (language) {
               case "eng":
                    return (params.row?.distanceMeters / 1000).toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
               default:
                    return (params.row?.distanceMeters / 1000).toLocaleString("fi-FI", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
          }
     };

     const durationFormatter = (params) => {
          let minutes = (params.row?.durationSeconds / 60).toFixed(0);
          let seconds = params.row?.durationSeconds % 60;
          return `${minutes.toString()}.${seconds < 10 ? `0${seconds}` : seconds.toString()}`;
     };

     const dataGridColumns = [
          {
               field: "departureDate",
               valueGetter: (params) => dateColFormatter(params, "departure"),
               headerName: translations.departureDate[language],
               type: "dateTime",
               flex: 2,
               hideable: false,
               filterable: false,
          },
          {
               field: "departureStation",
               valueGetter: (params) => stationNameCol(params, "departure"),
               headerName: translations.departureStationName[language],
               flex: 2,
               hideable: false,
               filterable: false,
          },
          {
               field: "returnDate",
               valueGetter: (params) => dateColFormatter(params, "return"),
               headerName: translations.returnDate[language],
               type: "dateTime",
               flex: 2,
               hideable: false,
               filterable: false,
          },
          {
               field: "returnStation",
               valueGetter: (params) => stationNameCol(params, "return"),
               headerName: translations.returnStationName[language],
               flex: 2,
               hideable: false,
               filterable: false,
          },
          {
               field: "distanceMeters",
               valueGetter: (params) => distanceFormatter(params),
               headerName: translations.distance[language],
               width: 115,
               hideable: false,
               filterable: false,
               type: "number",
          },
          {
               field: "durationSeconds",
               valueGetter: (params) => durationFormatter(params),
               headerName: translations.duration[language],
               width: 115,
               hideable: false,
               filterable: false,
               type: "number",
          },
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
          let newPage = (trips.rowsFrom / newPageSize).toFixed(0);
          dispatchQueryParams({ type: ACTION_TYPES.UPDATE_ROWS_PER_PAGE, payload: { newPageSize: newPageSize, newPage: newPage } });
     });

     const handleOpenDialog = (props) => {
          setTripInDialog(props.row);
          setDialogOpen(true);
     };

     const handleCloseDialog = () => {
          setDialogOpen(false);
          setTripInDialog(emptyDialog);
     };

     useEffect(() => {
          setLoadingData(true);

          const controller = new AbortController();
          const signal = controller.signal;
          let headers = { clientLanguage: language };
          let dateFromString = queryParams.departureDateFrom && new Date(queryParams.departureDateFrom)?.toISOString().substring(0, 10);
          let dateToString = queryParams.departureDateTo && new Date(queryParams.departureDateTo)?.toISOString().substring(0, 10);
          let endpoint =
               `${import.meta.env.VITE_BACKEND_URL}trips/list?departureDateFrom=${dateFromString || ""}` +
               `&departureDateTo=${dateToString || ""}&departurestationname=${queryParams.departureStation}` +
               `&returnstationname=${queryParams.returnStation}&sortby=${queryParams.sortBy}` +
               `&sortdir=${queryParams.sortDir}&rowsPerPage=${queryParams.rowsPerPage}&page=${queryParams.page}`;

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
                         setTrips(data);
                    }
                    if (response.status === 404) {
                         setTrips(emptyData);
                    }
               } catch (error) {
                    setTrips(emptyData);
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
               <TripsFilter
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
                         rows={trips.trips}
                         rowHeight={50}
                         loading={loadingData}
                         page={parseInt(queryParams.page)}
                         rowCount={trips.totalRowCount}
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
               <TripsDialog
                    dialogOpen={dialogOpen}
                    tripInDialog={tripInDialog}
                    handleCloseDialog={handleCloseDialog}
               />
          </>
     );
}
