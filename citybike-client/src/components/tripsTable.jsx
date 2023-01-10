import { useState, useReducer, useEffect, useCallback } from "react";
import { useLanguageContext } from "../context/languageContext";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import TripsFilter from "./tripsFilter";

const translations = {
     departureStationName: {
          fin: "Lähtöasema",
          swe: "Start station",
          eng: "Departure station",
     },
     returnStationName: {
          fin: "Paluuasema",
          swe: "Stop station",
          eng: "Return station",
     },
     departureDate: {
          fin: "Lähtö",
          swe: "Start",
          eng: "Departure",
     },
     returnDate: {
          fin: "Paluu",
          swe: "Stop",
          eng: "Return",
     },
     duration: {
          fin: "Kesto (min)",
          swe: "(min)",
          eng: "Duration (min)",
     },
     distance: {
          fin: "Matka (km)",
          swe: "(km)",
          eng: "Distance (km)",
     },
};

const emptyData = {
     rowsFrom: 0,
     rowsTo: 0,
     totalRowCount: 0,
     trips: [],
};

const initialQueryParams = {
     departureDate: null,
     returnDate: null,
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

export default function TripsTable() {
     const { language } = useLanguageContext();
     const [trips, setTrips] = useState(emptyData);
     const [queryParams, dispatchQueryParams] = useReducer(updateQueryParams, initialQueryParams);
     const [loadingData, setLoadingData] = useState(false);

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

     const dataGridColumns = [
          {
               field: "departureDate",
               headerName: translations.departureDate[language],
               type: "dateTime",
               width: 200,
               hideable: false,
               filterable: false,
          },
          {
               field: "departureStation",
               valueGetter: (params) => stationNameCol(params, "departure"),
               headerName: translations.departureStationName[language],
               width: 200,
               hideable: false,
               filterable: false,
          },
          { field: "returnDate", headerName: translations.returnDate[language], type: "dateTime", width: 200, hideable: false, filterable: false },
          {
               field: "returnStation",
               valueGetter: (params) => stationNameCol(params, "return"),
               headerName: translations.departureStationName[language],
               width: 200,
               hideable: false,
               filterable: false,
          },
          { field: "distanceMeters", headerName: translations.distance[language], width: 100, hideable: false, filterable: false, type: "number" },
          { field: "durationSeconds", headerName: translations.duration[language], width: 100, hideable: false, filterable: false, type: "number" },
     ];

     const handleSortModelChange = useCallback((sortModel) => {
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

     useEffect(() => {
          setLoadingData(true);

          const controller = new AbortController();
          const signal = controller.signal;
          let headers = { clientLanguage: language };
          let endpoint =
               `${import.meta.env.VITE_BACKEND_URL}trips/list?departureDateFrom=2021-07-01&sortby=${queryParams.sortBy}` +
               `&sortdir=${queryParams.sortDir}&rowsPerPage=${queryParams.rowsPerPage}&page=${queryParams.page}`;

          const getData = async () => {
               try {
                    let response = await fetch(endpoint, {
                         method: "GET",
                         headers: headers,
                         mode: "cors",
                         signal: signal,
                    });
                    let data = await response.json();
                    console.log(data);
                    setTrips(data);
               } catch (error) {
                    setTrips(emptyData);
                    if (error.name !== "AbortError") {
                         console.log(error.message);
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
                    sx={{ display: "flex", justifyContent: "center", height: 500, width: { xs: "100%", md: "80%" } }}
               >
                    <DataGrid
                         columns={dataGridColumns}
                         rows={trips.trips}
                         rowHeight={60}
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
                         sx={{ backgroundColor: "white" }}
                    />
               </Container>
          </>
     );
}
