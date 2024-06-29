"use client";
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material";
import { isFormValidate } from "../util";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function Login() {
  const [userInputs, setUserInputs] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { error, loading, loginWithEmailAndPass, logout } = useAuth();

  const login = async (e: any) => {
    e.preventDefault();
    if (!isFormValidate(userInputs.email, userInputs.password)) {
      return;
    }
    await loginWithEmailAndPass(userInputs.email, userInputs.password);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setUserInputs({
      ...userInputs,
      [name]: value,
    });
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        background: "white",
      }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "20px",
        }}
      >
        <LockOutlinedIcon />
        <Typography component="h1" variant="h5" color={"black"}>
          Login
        </Typography>
        <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={userInputs.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={userInputs.password}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Login..." : "Login"}
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signup" passHref>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </Box>
      </Box>
    </Container>
  );
}
