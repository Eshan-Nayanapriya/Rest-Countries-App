import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { countryApi } from "../services/countryApi";

const CountryDetail = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountryDetails();
  }, [code]);

  const fetchCountryDetails = async () => {
    try {
      setLoading(true);
      const data = await countryApi.getCountryByCode(code);
      setCountry(data[0]);
      setError(null);
    } catch (err) {
      setError("Failed to fetch country details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!country) {
    return (
      <Container className="py-8">
        <Alert severity="warning">Country not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8 px-8 md:px-12 lg:px-16">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        className="mb-8 hover:bg-gray-100 transition-colors duration-300 font-medium"
        color="primary"
        sx={{
          borderRadius: "8px",
          padding: "8px 16px",
          marginBottom: "3rem", // Added more bottom margin
        }}
      >
        Back
      </Button>

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <img
            src={country.flags.png}
            alt={country.name.common}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="p-10">
            <Typography variant="h3" className="font-bold" sx={{ mb: 2 }}>
              {country.name.common}
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="mb-2">
                  <span className="font-semibold">Native Name : </span>{" "}
                  {Object.values(country.name.nativeName)[0]?.common || "N/A"}
                </Typography>
                <Typography variant="body1" className="mb-2">
                  <span className="font-semibold">Population :</span>{" "}
                  {country.population.toLocaleString()}
                </Typography>
                <Typography variant="body1" className="mb-2">
                  <span className="font-semibold">Region :</span>{" "}
                  {country.region}
                </Typography>
                <Typography variant="body1" className="mb-2">
                  <span className="font-semibold">Sub Region :</span>{" "}
                  {country.subregion || "N/A"}
                </Typography>
                <Typography variant="body1" className="mb-2">
                  <span className="font-semibold">Capital :</span>{" "}
                  {country.capital?.[0] || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="mb-2">
                  <span className="font-semibold">Top Level Domain :</span>{" "}
                  {country.tld?.[0] || "N/A"}
                </Typography>
                <Typography variant="body1" className="mb-2">
                  <span className="font-semibold">Currencies :</span>{" "}
                  {Object.values(country.currencies || {})
                    .map((curr) => curr.name)
                    .join(", ") || "N/A"}
                </Typography>
                <Typography variant="body1" className="mb-2">
                  <span className="font-semibold">Languages :</span>{" "}
                  {Object.values(country.languages || {}).join(", ") || "N/A"}
                </Typography>
              </Grid>
            </Grid>

            {country.borders && (
              <Box className="mt-8">
                <Typography variant="h6" className="mb-4">
                  Border Countries :
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  {country.borders.map((border) => (
                    <Chip
                      key={border}
                      label={border}
                      onClick={() => navigate(`/country/${border}`)}
                      className="cursor-pointer"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CountryDetail;
