import { useState, useReducer } from "react";
import StationsInfo from "../components/stationsInfo";
import StationsTable from "../components/stationsTable";

const demoData = [
     {
          id: 388,
          nameFin: "Kaustisentie",
          nameSwe: "Kaustbyvägen",
          nameEng: "Kaustisentie",
          addressFin: "Pelimannintie",
          addressSwe: "Spelmansvägen",
          cityFin: "Helsinki",
          citySwe: "Helsingfors",
          operator: "CityBike Finland",
          capacity: 16,
          xCoordinate: 24.8814517125501,
          yCoordinate: 60.2378065223104,
     },
     {
          id: 88,
          nameFin: "Kiskontie",
          nameSwe: "Kiskovägen",
          nameEng: "Kiskontie",
          addressFin: "Mannerheimintie 99",
          addressSwe: "Mannerheimvägen 99",
          cityFin: "Helsinki",
          citySwe: "Helsingfors",
          operator: "CityBike Finland",
          capacity: 20,
          xCoordinate: 24.9012350212612,
          yCoordinate: 60.1990120683446,
     },
     {
          id: 39,
          nameFin: "Ooppera",
          nameSwe: "Nationaloperan",
          nameEng: "Opera",
          addressFin: "Mannerheimintie 62",
          addressSwe: "Mannerheimvägen 62",
          cityFin: "Helsinki",
          citySwe: "Helsingfors",
          operator: "CityBike Finland",
          capacity: 24,
          xCoordinate: 24.9266869997467,
          yCoordinate: 60.182552891987,
     },
     {
          id: 34,
          nameFin: "Kansallismuseo",
          nameSwe: "Nationalmuseum",
          nameEng: "National Museum",
          addressFin: "Mannerheimintie 30",
          addressSwe: "Mannerheimvägen 30",
          cityFin: "Helsinki",
          citySwe: "Helsingfors",
          operator: "CityBike Finland",
          capacity: 16,
          xCoordinate: 24.9328983153441,
          yCoordinate: 60.173956898526,
     },
     {
          id: 106,
          nameFin: "Korppaanmäentie",
          nameSwe: "Korpasbackavägen",
          nameEng: "Korppaanmäentie",
          addressFin: "Mannerheimintie 170",
          addressSwe: "Mannerheimvägen",
          cityFin: "Helsinki",
          citySwe: "Helsingfors",
          operator: "CityBike Finland",
          capacity: 16,
          xCoordinate: 24.898929699376,
          yCoordinate: 60.2034734922503,
     },
];

const initialQueryParams = {
     name: "",
     address: "",
     city: "",
     sortBy: "name",
     sortDir: "asc",
     rowsPerPage: 100,
     page: 1,
};

const ACTION_TYPES = Object.freeze({
     UPDATE_NAME: "update_name",
     UPDATE_ADDRESS: "update_address",
     UPDATE_CITY: "update_city",
     UPDATE_SORT_BY: "update_sortBy",
     UPDATE_SORT_DIR: "update_sortDir",
     UPDATE_ROWS_PER_PAGE: "update_rowsPerPage",
     UPDATE_PAGE: "update_page",
});

function updateQueryParams(queryParams, action) {
     switch (action.type) {
          case ACTION_TYPES.UPDATE_NAME:
               return { ...queryParams, name: action.payload };
          case ACTION_TYPES.UPDATE_ADDRESS:
               return { ...queryParams, address: action.payload };
          case ACTION_TYPES.UPDATE_CITY:
               return { ...queryParams, city: action.payload };
          case ACTION_TYPES.UPDATE_SORT_BY:
               return { ...queryParams, sortBy: action.payload };
          case ACTION_TYPES.UPDATE_SORT_DIR:
               return { ...queryParams, sortDir: action.payload };
          case ACTION_TYPES.UPDATE_ROWS_PER_PAGE:
               return { ...queryParams, rowsPerPage: action.payload };
          case ACTION_TYPES.UPDATE_PAGE:
               return { ...queryParams, page: action.payload };
          default:
               return { ...queryParams };
     }
}

export default function Stations() {
     const [stations, setStations] = useState(demoData);
     const [queryParams, dispatchQueryParams] = useReducer(updateQueryParams, initialQueryParams);

     return (
          <>
               <StationsInfo />
               <StationsTable
                    stations={stations}
                    setStations={setStations}
                    queryParams={queryParams}
                    dispatchQueryParams={dispatchQueryParams}
                    ACTION_TYPES={ACTION_TYPES}
               />
          </>
     );
}
