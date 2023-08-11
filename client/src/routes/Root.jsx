/* eslint-disable no-unused-vars */
import React, { useState, forwardRef } from "react";
import { Link, Outlet } from "react-router-dom";
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
} from "@mui/material";

import { Menu as MenuIcon, Logout } from "@mui/icons-material";
import LinkBehavior from "../utils/LinkBehaviour";

export default function Root() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

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
      <AppBar position="static">
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
                to="/"
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

            <Box sx={{ flexGrow: 0, display: "flex" }}>
              <Tooltip title="Open settings">
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
                <MenuItem>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
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
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </>
  );
}
