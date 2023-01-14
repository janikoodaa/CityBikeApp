import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { yellow } from "@mui/material/colors";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";

export default function CityBikeDialog(props) {
     const { dialogOpen, handleCloseDialog, children, title } = props;
     return (
          <Dialog
               maxWidth="xl"
               open={dialogOpen}
               onClose={() => handleCloseDialog()}
          >
               <DialogTitle sx={{ backgroundColor: yellow["A400"] }}>{title}</DialogTitle>
               <DialogContent>
                    <Box sx={{ width: { sm: 500, md: 700 }, height: 550 }}>{children}</Box>
               </DialogContent>
          </Dialog>
     );
}
