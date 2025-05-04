import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";

const AuthModal = ({ open, mode, onClose, onSwitchMode }) => {
  const { login, register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        onClose();
      } else {
        await register(form.username, form.email, form.password);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        className:
          "bg-gradient-to-br from-white to-gray-100 shadow-xl rounded-xl overflow-hidden border border-gray-100",
        sx: {
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <DialogTitle className="relative pt-6">
        <Typography
          variant="h5"
          className="gradient-text text-center font-bold text-2xl"
        >
          {mode === "login" ? "Welcome Back!" : "Create Account"}
        </Typography>
        <IconButton
          onClick={onClose}
          className="absolute top-2 right-2 hover:bg-gray-200 transition-colors"
          size="small"
          sx={{
            borderRadius: "50%",
            padding: "4px",
            position: "absolute",
            right: "8px",
            top: "8px",
            zIndex: 1,
          }}
        >
          <CloseIcon className="text-gray-700" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3 }}>
        <Box className="mt-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
                size="small"
                className="bg-white/80 rounded-lg hover:bg-white transition-colors"
                InputProps={{
                  className: "rounded-lg",
                  endAdornment: (
                    <InputAdornment position="end">
                      <PersonIcon className="text-blue-500" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              className="bg-white/80 rounded-lg hover:bg-white transition-colors"
              InputProps={{
                className: "rounded-lg",
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon className="text-blue-500" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              className="bg-white/80 rounded-lg hover:bg-white transition-colors"
              InputProps={{
                className: "rounded-lg",
                endAdornment: (
                  <InputAdornment position="end">
                    <LockIcon className="text-blue-500" />
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography
                color="error"
                className="text-sm text-center bg-red-50 p-2 rounded-md"
              >
                {error}
              </Typography>
            )}
          </form>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }} className="flex flex-col gap-3">
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disabled={loading}
          className="h-12 rounded-lg font-semibold text-lg normal-case"
          sx={{
            background: "linear-gradient(to right, #1976d2, #8b5cf6)",
            "&:hover": {
              background: "linear-gradient(to right, #1565c0, #7c3aed)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            },
            textTransform: "none",
          }}
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "SIGN IN"
            : "CREATE ACCOUNT"}
        </Button>

        <Divider className="w-full my-2">
          <Typography variant="caption" className="text-gray-500 px-2">
            OR
          </Typography>
        </Divider>

        <Box className="w-full text-center mt-1">
          <Typography variant="body2" className="text-gray-600">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <Button
                  color="primary"
                  size="small"
                  onClick={() => onSwitchMode("register")}
                  className="font-semibold"
                  sx={{ textTransform: "none" }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button
                  color="primary"
                  size="small"
                  onClick={() => onSwitchMode("login")}
                  className="font-semibold"
                  sx={{ textTransform: "none" }}
                >
                  Sign In
                </Button>
              </>
            )}
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;
