
// Storage keys
export const STORAGE_KEYS = {
  CURRENT_COUNTRY: "worldview_current_country",
  FAVORITE_COUNTRIES: "worldview_favorite_countries",
  SEARCH_FILTERS: "worldview_search_filters",
  AUTH_TOKEN: "authToken" // Keeping the existing key name for compatibility
};


export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error(`Error saving data to localStorage (${key}):`, err);
    return false;
  }
};

export const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`Error getting data from localStorage (${key}):`, err);
    return null;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing data from localStorage (${key}):`, err);
  }
};

export const saveCurrentCountry = (country) => {
  return saveToStorage(STORAGE_KEYS.CURRENT_COUNTRY, country);
};

export const getCurrentCountry = (code) => {
  const country = getFromStorage(STORAGE_KEYS.CURRENT_COUNTRY);
  // Only return if the country matches the requested code
  return country && country.cca3 === code ? country : null;
};

export const saveFavoriteCountries = (countries) => {
  return saveToStorage(STORAGE_KEYS.FAVORITE_COUNTRIES, countries);
};

export const getFavoriteCountries = () => {
  return getFromStorage(STORAGE_KEYS.FAVORITE_COUNTRIES) || [];
};

export const updateFavoriteCountry = (country, isFavorite) => {
  const favorites = getFavoriteCountries();
  
  if (isFavorite) {
    // Add if not already in favorites
    if (!favorites.some(c => c.cca3 === country.cca3)) {
      favorites.push(country);
    }
  } else {
    // Remove from favorites
    const index = favorites.findIndex(c => c.cca3 === country.cca3);
    if (index !== -1) {
      favorites.splice(index, 1);
    }
  }
  
  saveFavoriteCountries(favorites);
};

export const saveSearchFilters = (filters) => {
  saveToStorage(STORAGE_KEYS.SEARCH_FILTERS, filters);
};

export const getSearchFilters = () => {
  return getFromStorage(STORAGE_KEYS.SEARCH_FILTERS) || {
    searchQuery: "",
    region: "All",
    language: "All"
  };
};

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
};
