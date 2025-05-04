import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams, useNavigate } from 'react-router-dom';
import CountryDetail from '../CountryDetail';
import { countryApi } from '../../services/countryApi';

// Mock the countryApi service
vi.mock('../../services/countryApi');

// Mock sample country data
const mockCountryData = [
  {
    name: {
      common: 'Finland',
      nativeName: {
        fin: { common: 'Suomi' }
      }
    },
    flags: {
      png: 'https://example.com/flag.png'
    },
    population: 5530719,
    region: 'Europe',
    subregion: 'Northern Europe',
    capital: ['Helsinki'],
    tld: ['.fi'],
    currencies: {
      EUR: { name: 'Euro' }
    },
    languages: {
      fin: 'Finnish',
      swe: 'Swedish'
    },
    borders: ['NOR', 'SWE', 'RUS']
  }
];

describe('CountryDetail Component (Unit Tests)', () => {
  // Setup for each test
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Default mock implementations
    useParams.mockReturnValue({ code: 'FIN' });
    useNavigate.mockReturnValue(vi.fn());
    countryApi.getCountryByCode.mockResolvedValue(mockCountryData);
  });

  it('should fetch and display country details', async () => {
    render(<CountryDetail />);
    
    // Should show loading state initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(countryApi.getCountryByCode).toHaveBeenCalledWith('FIN');
      expect(screen.getByText('Finland')).toBeInTheDocument();
    });
    
    // Check that key details are displayed
    expect(screen.getByText('Population :')).toBeInTheDocument();
    expect(screen.getByText(/5,530,719/)).toBeInTheDocument();
    expect(screen.getByText('Region :')).toBeInTheDocument();
    expect(screen.getByText(/Europe/)).toBeInTheDocument();
    expect(screen.getByText('Capital :')).toBeInTheDocument();
    expect(screen.getByText(/Helsinki/)).toBeInTheDocument();
  });

  it('should display an error message when API call fails', async () => {
    // Mock API error
    countryApi.getCountryByCode.mockRejectedValue(new Error('API Error'));
    
    render(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch country details. Please try again later.')).toBeInTheDocument();
    });
  });

  it('should display "Country not found" when no country data is returned', async () => {
    // Mock empty response
    countryApi.getCountryByCode.mockResolvedValue([]);
    
    render(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Country not found')).toBeInTheDocument();
    });
  });

  it('should navigate back when back button is clicked', async () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
    
    render(<CountryDetail />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Finland')).toBeInTheDocument();
    });
    
    // Click the back button
    const backButton = screen.getByText('Back');
    userEvent.click(backButton);
    
    // Check that navigate was called with -1
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should handle missing optional country data gracefully', async () => {
    // Mock country with missing optional fields
    const incompleteCountry = [{
      name: {
        common: 'Test Country',
        nativeName: {}
      },
      flags: {
        png: 'https://example.com/flag.png'
      },
      population: 1000000,
      region: 'Test Region',
      subregion: null,
      capital: undefined,
      tld: [],
      currencies: {},
      languages: {},
      borders: undefined
    }];
    
    countryApi.getCountryByCode.mockResolvedValue(incompleteCountry);
    
    render(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Country')).toBeInTheDocument();
    });
    
    // Check fallback values for missing data
    expect(screen.getByText(/Native Name :/)).toBeInTheDocument();
    expect(screen.getByText(/N\/A/)).toBeInTheDocument();
    expect(screen.queryByText('Border Countries :')).not.toBeInTheDocument();
  });
});