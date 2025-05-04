import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import CountryCard from "./CountryCard";

/**
 * Renders a grid of country cards
 *
 * @param {Object[]} countries - Array of country objects to display
 */
const CountryList = ({ countries }) => {
  return (
    <div className="py-8">
      {countries.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No countries found matching your criteria.
        </p>
      ) : (
        <Grid container spacing={4}>
          {countries.map((country) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={country.cca3}>
              <CountryCard country={country} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

CountryList.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CountryList;
