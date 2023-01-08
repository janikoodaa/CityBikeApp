import { useLanguageContext } from "../context/languageContext";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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

const InfoButton = (props) => {
     const { value } = props;
     return (
          <IconButton onClick={() => console.log(value)}>
               <InfoOutlinedIcon />
          </IconButton>
     );
};

export default function StationsTable(props) {
     const { stations, setStations, queryParams, dispatchQueryParams, ACTION_TYPES } = props;
     const { language } = useLanguageContext();

     const dataGridColumns = [
          { field: stationNameCol(language), headerName: translations.stationName[language], width: 200, hideable: false },
          { field: stationAddressCol(language), headerName: translations.stationAddress[language], flex: 2, hideable: false },
          { field: stationCityCol(language), headerName: translations.city[language], width: 120, hideable: false },
          { field: "operator", headerName: translations.operator[language], width: 150, hideable: false },
          { field: "capacity", headerName: translations.capacity[language], width: 100, hideable: false, type: "number" },
          {
               field: "id",
               headerName: "Info",
               width: 100,
               hideable: false,
               headerAlign: "center",
               renderCell: InfoButton,
               align: "center",
          },
     ];

     return (
          <Container
               maxWidth="lg"
               sx={{ display: "flex", justifyContent: "center", height: 500, width: { xs: "100%", md: "80%" }, marginTop: "1em" }}
          >
               <DataGrid
                    columns={dataGridColumns}
                    rows={stations}
                    rowHeight={60}
                    page={queryParams.page - 1}
                    rowCount={stations?.length}
                    sx={{ backgroundColor: "white" }}
               />
          </Container>
     );
}
