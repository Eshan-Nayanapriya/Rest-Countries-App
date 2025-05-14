import React, { useState, useEffect, useCallback } from "react";
import { Container, CircularProgress, Alert } from "@mui/material";
import { useLocation } from "react-router-dom";
import SearchAndFilter from "../components/countries/SearchAndFilter";
import CountryList from "../components/countries/CountryList";
import ImageSlider from "../components/home/ImageSlider";
import { countryApi } from "../services/countryApi";
import { getSearchFilters, saveSearchFilters } from "../utils/storage";

/**
 * Home page component
 * Displays country search, filters, and list of countries
 */
const Home = () => {
  // Load saved filters from localStorage or use defaults
  const savedFilters = getSearchFilters();
  
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState(savedFilters.searchQuery || "");
  const [region, setRegion] = useState(savedFilters.region || "All");
  const [language, setLanguage] = useState(savedFilters.language || "All");
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Fetch countries data from API
  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      const data = await countryApi.getAllCountries();
      setCountries(data);
      setFilteredCountries(data);

      // Extract unique languages from all countries
      const uniqueLanguages = new Set();
      data.forEach((country) => {
        if (country.languages) {
          Object.values(country.languages).forEach((lang) =>
            uniqueLanguages.add(lang)
          );
        }
      });
      setLanguages(Array.from(uniqueLanguages).sort());

      setError(null);
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to fetch countries. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear filters when navigating to home
  useEffect(() => {
    if (location.pathname === "/") {
      setSearchQuery("");
      setRegion("All");
      setLanguage("All");
      setFilteredCountries(countries);
    }
  }, [location.pathname, countries]);

  // Initial data fetching
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);
  // Apply filters when search, region, or language changes
  useEffect(() => {
    let filtered = [...countries];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((country) =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply region filter
    if (region !== "All") {
      filtered = filtered.filter((country) => country.region === region);
    }

    // Apply language filter
    if (language !== "All") {
      filtered = filtered.filter(
        (country) =>
          country.languages &&
          Object.values(country.languages).includes(language)
      );
    }

    // Save current filters to localStorage for persistence
    saveSearchFilters({
      searchQuery,
      region,
      language
    });
    
    setFilteredCountries(filtered);
  }, [searchQuery, region, language, countries]);

  // Loading state
  if (loading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="py-8">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      className="min-h-screen overflow-x-hidden px-8 md:px-12 lg:px-16"
    >
      <div className="py-8">
        <ImageSlider />
      </div>
      <SearchAndFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        region={region}
        setRegion={setRegion}
        language={language}
        setLanguage={setLanguage}
        languages={languages}
      />
      <CountryList countries={filteredCountries} />
    </Container>
  );
};

export default Home;
