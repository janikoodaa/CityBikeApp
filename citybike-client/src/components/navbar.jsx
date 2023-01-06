import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import SelectLanguage from "../selectLanguage";
import { routeLinks } from "../router";
import { useLanguageContext } from "../context/languageContext";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
     const { language } = useLanguageContext();
     const [anchorElNav, setAnchorElNav] = useState(null);

     const handleOpenNavMenu = (event) => {
          setAnchorElNav(event.currentTarget);
     };

     const handleCloseNavMenu = () => {
          setAnchorElNav(null);
     };

     return (
          <AppBar>
               <Container maxWidth="xl">
                    <Toolbar disableGutters>
                         <DirectionsBikeIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
                         <Typography
                              variant="h6"
                              noWrap
                              component={Link}
                              to={routeLinks.home.linkTo}
                              sx={{
                                   mr: 2,
                                   display: { xs: "none", md: "flex" },
                                   fontFamily: "monospace",
                                   fontWeight: 700,
                                   letterSpacing: ".25rem",
                                   color: "inherit",
                                   textDecoration: "none",
                              }}
                         >
                              Helsinki City Bike
                         </Typography>

                         <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                              <IconButton
                                   size="large"
                                   onClick={handleOpenNavMenu}
                                   color="inherit"
                              >
                                   <MenuIcon />
                              </IconButton>
                              <Menu
                                   id="menu-appbar"
                                   anchorEl={anchorElNav}
                                   anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                   }}
                                   keepMounted
                                   transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                   }}
                                   open={Boolean(anchorElNav)}
                                   onClose={handleCloseNavMenu}
                                   sx={{
                                        display: { xs: "block", md: "none" },
                                   }}
                              >
                                   <MenuItem
                                        key={1}
                                        onClick={handleCloseNavMenu}
                                        component={Link}
                                        to={routeLinks.trips.linkTo}
                                   >
                                        <Typography textAlign="center">{routeLinks.trips.linkText[language]}</Typography>
                                   </MenuItem>
                                   <MenuItem
                                        key={2}
                                        onClick={handleCloseNavMenu}
                                        component={Link}
                                        to={routeLinks.stations.linkTo}
                                   >
                                        <Typography textAlign="center">{routeLinks.stations.linkText[language]}</Typography>
                                   </MenuItem>
                              </Menu>
                         </Box>
                         <DirectionsBikeIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
                         <Typography
                              variant="h5"
                              noWrap
                              component={Link}
                              to={routeLinks.home.linkTo}
                              sx={{
                                   mr: 2,
                                   display: { xs: "flex", md: "none" },
                                   flexGrow: 1,
                                   fontFamily: "monospace",
                                   fontWeight: 700,
                                   letterSpacing: ".25rem",
                                   color: "inherit",
                                   textDecoration: "none",
                              }}
                         >
                              Helsinki City Bike
                         </Typography>
                         <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                              <Button
                                   component={Link}
                                   to={routeLinks.trips.linkTo}
                                   sx={{ my: 2, display: "block", color: "inherit" }}
                              >
                                   {routeLinks.trips.linkText[language]}
                              </Button>
                              <Button
                                   component={Link}
                                   to={routeLinks.stations.linkTo}
                                   sx={{ my: 2, display: "block", color: "inherit" }}
                              >
                                   {routeLinks.stations.linkText[language]}
                              </Button>
                         </Box>

                         <Box sx={{ flexGrow: 0 }}>
                              <SelectLanguage />
                         </Box>
                    </Toolbar>
               </Container>
          </AppBar>
     );
}
