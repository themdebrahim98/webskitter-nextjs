"use client";
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href="/" passHref>
            <Button color="inherit">Home</Button>
          </Link>
        </Typography>
        {!user ? (
          <Box>
            <Link href="/login" passHref>
              <Button color="inherit">Sign In</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button color="inherit">Sign Up</Button>
            </Link>
          </Box>
        ) : (
          <Box>
            <Typography>{user}</Typography>
            <Link href="/signup" passHref>
              <Button color="inherit" onClick={() => logout()}>
                Logout
              </Button>
            </Link>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
