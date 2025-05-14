import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../modals/AuthModal";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setLogoutConfirmOpen(false);
    navigate("/");
  };
  const handleHomeClick = () => {
    // Reset search filters in storage before navigating home
    try {
      localStorage.setItem(
        "worldview_search_filters",
        JSON.stringify({
          searchQuery: "",
          region: "All",
          language: "All",
        })
      );
    } catch (err) {
      console.error("Error resetting search filters:", err);
    }

    // Force a page refresh when clicking home or logo
    window.location.href = "/";
  };

  return (
    <AppBar
      position="static"
      className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
    >
      <Toolbar className="container mx-auto">
        <Typography
          variant="h6"
          component="div"
          className="flex-grow text-white font-bold flex items-center gap-2"
        >
          {" "}
          <PublicIcon className="text-2xl" />
          <Link
            to="/"
            onClick={handleHomeClick}
            className="no-underline text-inherit hover:text-gray-200 transition-colors"
          >
            WorldView
          </Link>
        </Typography>
        <Box className="flex gap-4">
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/favorites"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Favorites
            </Button>
          )}
          <Button
            color="inherit"
            component={Link}
            to="/"
            onClick={handleHomeClick}
            className="text-white hover:text-gray-200 transition-colors"
          >
            Home
          </Button>
          {user ? (
            <Button
              color="inherit"
              onClick={() => setLogoutConfirmOpen(true)}
              className="text-white hover:text-gray-200 transition-colors flex items-center gap-1"
            >
              Logout <AccountCircleIcon />
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={() => {
                setAuthMode("login");
                setAuthOpen(true);
              }}
              className="text-white hover:text-gray-200 transition-colors"
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitchMode={setAuthMode}
      />
      <Dialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          className: "bg-gradient-to-br from-white to-gray-50 shadow-xl",
        }}
      >
        <DialogTitle className="text-center font-bold">
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography className="text-center text-gray-600">
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions className="flex gap-2 px-6 pb-4">
          <Button
            onClick={() => setLogoutConfirmOpen(false)}
            variant="outlined"
            fullWidth
            className="h-10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="primary"
            fullWidth
            className="h-10"
            sx={{
              background: "linear-gradient(to right, #1976d2, #8b5cf6)",
              "&:hover": {
                background: "linear-gradient(to right, #1565c0, #7c3aed)",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              },
              textTransform: "none",
            }}
          >
            LOGOUT
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
