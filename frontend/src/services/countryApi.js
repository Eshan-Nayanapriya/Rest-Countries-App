import axios from "axios";

//Base URL for the REST Countries API
const BASE_URL = "https://restcountries.com/v3.1";

//Simple in-memory cache for API responses
const apiCache = {
  cache: {},

  /**
   * Get a cached response by key
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null if not found
   */
  get: (key) => {
    const item = apiCache.cache[key];
    if (!item) return null;

    // If cached item is expired, remove it
    if (item.expiry < Date.now()) {
      delete apiCache.cache[key];
      return null;
    }

    return item.data;
  },

  /**
   * Set a value in cache with expiration
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttlMinutes - Time to live in minutes
   */
  set: (key, data, ttlMinutes = 15) => {
    const expiry = Date.now() + ttlMinutes * 60 * 1000;
    apiCache.cache[key] = { data, expiry };
  },

  /**
   * Clear all cached data
   */
  clear: () => {
    apiCache.cache = {};
  },
};

/**
 * API client for REST Countries API
 */
export const countryApi = {
  /**
   * Get all countries
   * @returns {Promise<Array>} Array of country objects
   */
  getAllCountries: async () => {
    const cacheKey = "all-countries";
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(`${BASE_URL}/all`);
      apiCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all countries:", error);
      throw new Error(`Failed to fetch countries: ${error.message}`);
    }
  },

  /**
   * Get country by name
   * @param {string} name - Country name
   * @returns {Promise<Array>} Array of matching country objects
   */
  getCountryByName: async (name) => {
    if (!name) throw new Error("Country name is required");

    const cacheKey = `country-name-${name}`;
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/name/${encodeURIComponent(name)}`
      );
      apiCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching country by name '${name}':`, error);
      if (error.response && error.response.status === 404) {
        return []; // Return empty array for not found instead of throwing
      }
      throw new Error(`Failed to fetch country ${name}: ${error.message}`);
    }
  },

  /**
   * Get countries by region
   * @param {string} region - Region name
   * @returns {Promise<Array>} Array of countries in the specified region
   */
  getCountriesByRegion: async (region) => {
    if (!region) throw new Error("Region is required");

    const cacheKey = `region-${region}`;
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/region/${encodeURIComponent(region)}`
      );
      apiCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching countries by region '${region}':`, error);
      throw new Error(
        `Failed to fetch countries in region ${region}: ${error.message}`
      );
    }
  },

  /**
   * Get country by code
   * @param {string} code - Country code (alpha2, alpha3)
   * @returns {Promise<Array>} Country object or empty array if not found
   */
  getCountryByCode: async (code) => {
    if (!code) throw new Error("Country code is required");

    const cacheKey = `country-code-${code}`;
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/alpha/${encodeURIComponent(code)}`
      );
      apiCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching country by code '${code}':`, error);
      if (error.response && error.response.status === 404) {
        return []; // Return empty array for not found instead of throwing
      }
      throw new Error(
        `Failed to fetch country with code ${code}: ${error.message}`
      );
    }
  },

  /**
   * Clear API cache
   */
  clearCache: () => {
    apiCache.clear();
  },
};
