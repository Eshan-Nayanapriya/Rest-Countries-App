import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Component for searching and filtering countries
 */
const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  region,
  setRegion,
  language,
  setLanguage,
  languages,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Predefined list of regions
  const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

  // Debounce search input to prevent too many filter operations while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [localSearchQuery, setSearchQuery]);

  // Update local search query when the prop changes (e.g., when cleared from parent)
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  return (
    <Box className="py-10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        {/* Search input */}
        <div className="w-full md:w-1/3">
          <TextField
            fullWidth
            label="Search for a country..."
            variant="outlined"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            placeholder="Type to search..."
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto mt-4 md:mt-0">
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="region-filter-label">Filter by Region</InputLabel>
            <Select
              labelId="region-filter-label"
              id="region-filter"
              value={region}
              label="Filter by Region"
              onChange={(e) => setRegion(e.target.value)}
            >
              {regions.map((regionOption) => (
                <MenuItem key={regionOption} value={regionOption}>
                  {regionOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="language-filter-label">
              Filter by Language
            </InputLabel>
            <Select
              labelId="language-filter-label"
              id="language-filter"
              value={language}
              label="Filter by Language"
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="All">All Languages</MenuItem>
              {languages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </Box>
  );
};

SearchAndFilter.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  region: PropTypes.string.isRequired,
  setRegion: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SearchAndFilter;
