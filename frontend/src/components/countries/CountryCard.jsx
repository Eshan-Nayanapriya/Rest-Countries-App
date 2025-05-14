import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useAuth } from "../../context/AuthContext";
import { favoritesApi } from "../../services/authApi";
import { updateFavoriteCountry } from "../../utils/storage";

/**
 * Card component displaying a country with basic information
 *
 * @param {Object} country - The country object to display
 */
const CountryCard = ({ country }) => {
  const { user, setUser } = useAuth();
  const [error, setError] = useState(null);
  const isFav = user?.favorites?.includes(country.cca3);

  // Handle adding/removing country from favorites
  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (isFav) {
        const res = await favoritesApi.remove(country.cca3);
        setUser({ ...user, favorites: res.data.favorites });
        
        // Update cached favorites in localStorage
        updateFavoriteCountry(country, false);
      } else {
        const res = await favoritesApi.add(country.cca3);
        setUser({ ...user, favorites: res.data.favorites });
        
        // Update cached favorites in localStorage
        updateFavoriteCountry(country, true);
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
      setError("Failed to update favorites. Please try again.");
    }
  };

  return (
    <>
      <Card className="h-full transition-transform duration-300 hover:scale-105">
        <Link to={`/country/${country.cca3}`} className="no-underline">
          <CardMedia
            component="img"
            height="140"
            image={country.flags.png}
            alt={country.name.common}
            className="h-48 object-cover"
          />
          <CardContent className="p-4">
            <Box className="flex justify-between items-center mb-2">
              <Typography variant="h6" component="div" className="font-bold">
                {country.name.common}
              </Typography>
              {user && (
                <Tooltip
                  title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <IconButton
                    onClick={handleFavorite}
                    color={isFav ? "error" : "default"}
                    aria-label={
                      isFav ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Box className="space-y-2">
              <Typography variant="body2" color="text.secondary">
                <span className="font-semibold">Population:</span>{" "}
                {country.population.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <span className="font-semibold">Region:</span> {country.region}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <span className="font-semibold">Capital:</span>{" "}
                {country.capital?.[0] || "N/A"}
              </Typography>
              <Box className="flex flex-wrap gap-2 mt-2">
                {country.languages &&
                  Object.values(country.languages).map((lang) => (
                    <Chip
                      key={lang}
                      label={lang}
                      size="small"
                      className="bg-gray-100"
                    />
                  ))}
              </Box>
            </Box>
          </CardContent>
        </Link>
      </Card>

      {/* Error alert */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

CountryCard.propTypes = {
  country: PropTypes.shape({
    cca3: PropTypes.string.isRequired,
    name: PropTypes.shape({
      common: PropTypes.string.isRequired,
    }).isRequired,
    flags: PropTypes.shape({
      png: PropTypes.string.isRequired,
    }).isRequired,
    population: PropTypes.number.isRequired,
    region: PropTypes.string.isRequired,
    capital: PropTypes.arrayOf(PropTypes.string),
    languages: PropTypes.object,
  }).isRequired,
};

export default CountryCard;
