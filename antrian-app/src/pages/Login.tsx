import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { login } from "../api/api";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.accessToken);
      navigate("/admin");
    } catch (err) {
      setError("Incorrect username or password");
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        color: "#09132E",
        backgroundColor: "#09132E",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      }}
    >
      <Paper
        sx={{
          height: "50%",
          p: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          minWidth: "30%",
          background: "linear-gradient(145deg, #0b215e, #1E293B)",
        }}
        elevation={3}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Selamat Datang
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Username"
              name="username"
              type="text"
              fullWidth
              variant="outlined"
              value={form.username}
              onChange={handleChange}
              sx={{
                input: { color: "white" },
                label: { color: "white" },
                borderRadius: "8px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
                "& .MuiFilledInput-root": {
                  backgroundColor: "transparent",
                },
                "& .MuiFilledInput-root:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                "& .MuiFilledInput-root.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              variant="outlined"
              value={form.password}
              onChange={handleChange}
              sx={{
                input: { color: "white" },
                label: { color: "white" },
                borderRadius: "8px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
                "& .MuiFilledInput-root": {
                  backgroundColor: "transparent",
                },
                "& .MuiFilledInput-root:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                "& .MuiFilledInput-root.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            {error && (
              <Typography color="error" fontSize="0.9rem">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#FBDC05",
                color: "#0D1B2A",
                fontWeight: 700,
                fontSize: "1rem",
                py: 1.5,
                px: 3,
                borderRadius: 2,
                textTransform: "uppercase",
                fontFamily: "Inter, sans-serif",
                boxShadow: "0 4px 12px rgba(251, 220, 5, 0.3)",
                "&:hover": {
                  backgroundColor: "#E5C504",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(251, 220, 5, 0.4)",
                },
              }}
            >
              Login
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
