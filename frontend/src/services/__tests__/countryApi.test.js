import { describe, it, expect, afterEach, vi } from 'vitest';
import axios from 'axios';
import { countryApi } from '../countryApi';

// Mock axios module
vi.mock('axios');

describe('CountryAPI Service', () => {
  afterEach(() => {
    // Clear mocks between tests
    vi.clearAllMocks();
    // Clear the cache between tests
    countryApi.clearCache();
  });

  describe('getAllCountries', () => {
    const mockCountries = [{ name: { common: 'Finland' } }, { name: { common: 'Sweden' } }];

    it('should fetch and return all countries', async () => {
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      
      const result = await countryApi.getAllCountries();
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
      expect(result).toEqual(mockCountries);
    });

    it('should return cached data on subsequent calls', async () => {
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      
      // First call should make a network request
      await countryApi.getAllCountries();
      
      // Second call should use cached data
      await countryApi.getAllCountries();
      
      // Axios should only be called once
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the API call fails', async () => {
      const errorMsg = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMsg));
      
      await expect(countryApi.getAllCountries()).rejects.toThrow(`Failed to fetch countries: ${errorMsg}`);
    });
  });

  describe('getCountryByName', () => {
    const countryName = 'Finland';
    const mockCountry = [{ name: { common: 'Finland' } }];

    it('should fetch country by name', async () => {
      axios.get.mockResolvedValueOnce({ data: mockCountry });
      
      const result = await countryApi.getCountryByName(countryName);
      
      expect(axios.get).toHaveBeenCalledWith(`https://restcountries.com/v3.1/name/${countryName}`);
      expect(result).toEqual(mockCountry);
    });

    it('should throw an error if name parameter is missing', async () => {
      await expect(countryApi.getCountryByName()).rejects.toThrow('Country name is required');
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('should return an empty array when country is not found (404)', async () => {
      const error = new Error('Not Found');
      error.response = { status: 404 };
      axios.get.mockRejectedValueOnce(error);
      
      const result = await countryApi.getCountryByName('NonExistentCountry');
      
      expect(result).toEqual([]);
    });
  });

  describe('getCountriesByRegion', () => {
    const region = 'Europe';
    const mockCountries = [{ name: { common: 'Finland' } }, { name: { common: 'Sweden' } }];

    it('should fetch countries by region', async () => {
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      
      const result = await countryApi.getCountriesByRegion(region);
      
      expect(axios.get).toHaveBeenCalledWith(`https://restcountries.com/v3.1/region/${region}`);
      expect(result).toEqual(mockCountries);
    });

    it('should throw an error if region parameter is missing', async () => {
      await expect(countryApi.getCountriesByRegion()).rejects.toThrow('Region is required');
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('should throw an error when the API call fails', async () => {
      const errorMsg = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMsg));
      
      await expect(countryApi.getCountriesByRegion(region)).rejects.toThrow(
        `Failed to fetch countries in region ${region}: ${errorMsg}`
      );
    });
  });

  describe('getCountryByCode', () => {
    const countryCode = 'FIN';
    const mockCountry = [{ name: { common: 'Finland' } }];

    it('should fetch country by code', async () => {
      axios.get.mockResolvedValueOnce({ data: mockCountry });
      
      const result = await countryApi.getCountryByCode(countryCode);
      
      expect(axios.get).toHaveBeenCalledWith(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      expect(result).toEqual(mockCountry);
    });

    it('should throw an error if code parameter is missing', async () => {
      await expect(countryApi.getCountryByCode()).rejects.toThrow('Country code is required');
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('should return an empty array when country code is not found (404)', async () => {
      const error = new Error('Not Found');
      error.response = { status: 404 };
      axios.get.mockRejectedValueOnce(error);
      
      const result = await countryApi.getCountryByCode('ZZZ');
      
      expect(result).toEqual([]);
    });
  });

  describe('clearCache', () => {
    it('should clear the API cache', async () => {
      const mockCountries = [{ name: { common: 'Finland' } }];
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      
      // Call once to cache the data
      await countryApi.getAllCountries();
      
      // Clear the cache
      countryApi.clearCache();
      
      // Call again should make a new request
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      await countryApi.getAllCountries();
      
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });
});