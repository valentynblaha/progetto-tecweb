/* eslint-disable no-unused-vars */
import React, { useState, forwardRef } from "react";
import { Link, Outlet, useNavigation } from "react-router-dom";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Menu,
  IconButton,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
  ListItemIcon,
  LinearProgress,
  Badge,
} from "@mui/material";

import { Menu as MenuIcon, Logout, ShoppingCart } from "@mui/icons-material";
import LinkBehavior from "../utils/LinkBehaviour";
import useAuth from "../hooks/useAuth";

export default function Root() {
  const navigation = useNavigation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [auth, setAuth] = useAuth();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h4"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              FITCOURSE
            </Typography>
            <Box sx={{ flexGrow: 1, display: "flex" }}>
              <Button
                component={LinkBehavior}
                to="/courses"
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                }}
              >
                Corsi
              </Button>
              <Button
                component={LinkBehavior}
                to="/products"
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                }}
              >
                Prodotti
              </Button>
              <Button
                component={LinkBehavior}
                to="/"
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                }}
              >
                Info
              </Button>
            </Box>

            {auth.email && (
              <Box sx={{ flexGrow: 0, display: "flex" }}>
                <Tooltip title="Opzioni utente">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="http://localhost:8000/media/images/profilepictures/stock_profile_img.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={() => {
                      localStorage.removeItem("accesstoken");
                      localStorage.removeItem("refreshtoken");
                      setAuth({});
                      window.location.href = "/"
                    }}
                  >
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}
            {auth.email && (
              <Box flexGrow={0} display="flex">
                <Tooltip title="Carrello">
                  <IconButton component={LinkBehavior} to="/cart" sx={{ p: 0, marginLeft: 2 }}>
                    <Badge
                      badgeContent={1}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#ff7588",
                          boxShadow: "1px 1px 1px #00000054"
                        },
                      }}
                    >
                      <ShoppingCart sx={{ color: "white", fontSize: "2rem" }} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            {!auth.email && (
              <Button
                component={LinkBehavior}
                to="/login"
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                }}
              >
                Accedi
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {navigation.state === "loading" && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <Outlet />
    </>
  );
}
