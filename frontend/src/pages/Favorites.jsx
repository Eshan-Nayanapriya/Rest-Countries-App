import React, { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";
import { favoritesApi } from "../services/authApi";
import CountryList from "../components/countries/CountryList";
import { useAuth } from "../context/AuthContext";
import { countryApi } from "../services/countryApi";

const Favorites = () => {
  const { user } = useAuth();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const favRes = await favoritesApi.get();
        const allCountries = await countryApi.getAllCountries();
        const favCountries = allCountries.filter((c) =>
          favRes.data.favorites.includes(c.cca3)
        );
        setCountries(favCountries);
        setError(null);
      } catch (err) {
        setError("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);
  if (loading)
    return (
      <Container className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Container>
    );
  if (error)
    return (
      <Container className="py-8">
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  return (
    <Container maxWidth="xl" className="min-h-screen">
      <Typography
        variant="h4"
        className="mt-16 mb-10 py-2 text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 border-b-2 border-gray-200 pb-4 w-fit mx-auto"
      >
        Favorite Countries
      </Typography>
      <CountryList countries={countries} />
    </Container>
  );
};

export default Favorites;
