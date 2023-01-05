import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { languages, useLanguageContext } from "./context/languageContext";

export default function SelectLanguage() {
     const { language, setLanguage } = useLanguageContext();

     return (
          <FormControl>
               <Select
                    sx={{ width: "60px", paddingLeft: "5px" }}
                    variant="standard"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
               >
                    <MenuItem value={languages.fin.value}>{languages.fin.flag}</MenuItem>
                    <MenuItem value={languages.swe.value}>{languages.swe.flag}</MenuItem>
                    <MenuItem value={languages.eng.value}>{languages.eng.flag}</MenuItem>
               </Select>
          </FormControl>
     );
}
