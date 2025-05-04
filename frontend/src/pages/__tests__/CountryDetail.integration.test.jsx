import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams, useNavigate } from 'react-router-dom';
import CountryDetail from '../CountryDetail';
import axios from 'axios';

// Mock axios to simulate API requests
vi.mock('axios');

// Mock react-router-dom hooks
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useParams: vi.fn(),
  useNavigate: vi.fn()
}));

// Sample country data response
const mockCountryData = [
  {
    name: {
      common: 'Germany',
      official: 'Federal Republic of Germany',
      nativeName: {
        deu: { official: 'Bundesrepublik Deutschland', common: 'Deutschland' }
      }
    },
    flags: {
      png: 'https://example.com/germany-flag.png',
      svg: 'https://example.com/germany-flag.svg'
    },
    population: 83240525,
    region: 'Europe',
    subregion: 'Western Europe',
    capital: ['Berlin'],
    tld: ['.de'],
    currencies: {
      EUR: { name: 'Euro', symbol: '€' }
    },
    languages: {
      deu: 'German'
    },
    borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE']
  }
];

describe('CountryDetail Component (Integration Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    useParams.mockReturnValue({ code: 'DEU' });
    useNavigate.mockReturnValue(vi.fn());
    
    // Setup the default successful API response
    axios.get.mockResolvedValue({ data: mockCountryData });
  });

  it('should integrate with the API to fetch and display country details', async () => {
    render(<CountryDetail />);
    
    // Should show loading initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      // Verify the API was called with the correct URL
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha/DEU');
      expect(screen.getByText('Germany')).toBeInTheDocument();
    });
    
    // Verify key data is displayed
    expect(screen.getByText(/83,240,525/)).toBeInTheDocument(); // Population with formatting
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('Euro')).toBeInTheDocument();
    expect(screen.getByText('German')).toBeInTheDocument();
    
    // Verify border countries are displayed
    expect(screen.getByText('Border Countries :')).toBeInTheDocument();
    expect(screen.getByText('AUT')).toBeInTheDocument();
    expect(screen.getByText('FRA')).toBeInTheDocument();
  });

  it('should navigate to border country when a border chip is clicked', async () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
    
    render(<CountryDetail />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
    });
    
    // Find and click a border country chip
    const borderChip = screen.getByText('FRA');
    userEvent.click(borderChip);
    
    // Check that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/country/FRA');
  });

  it('should handle API errors and display error message', async () => {
    // Mock API error
    axios.get.mockRejectedValue(new Error('Network Error'));
    
    render(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch country details. Please try again later.')).toBeInTheDocument();
    });
  });

  it('should handle 404 not found responses from the API', async () => {
    // Mock 404 response
    const error = new Error('Country not found');
    error.response = { status: 404 };
    axios.get.mockRejectedValue(error);
    
    render(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Country not found')).toBeInTheDocument();
    });
  });

  it('should refetch country details when URL param changes', async () => {
    // First render with DEU
    const { rerender } = render(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha/DEU');
    });
    
    // Change country code param
    useParams.mockReturnValue({ code: 'FRA' });
    
    // Mock response for France
    const franceMockData = [{
      name: {
        common: 'France',
        nativeName: { fra: { common: 'France' } }
      },
      flags: { png: 'https://example.com/france-flag.png' },
      population: 67391582,
      region: 'Europe',
      subregion: 'Western Europe',
      capital: ['Paris'],
      tld: ['.fr'],
      currencies: { EUR: { name: 'Euro' } },
      languages: { fra: 'French' },
      borders: ['AND', 'BEL', 'DEU', 'ITA', 'LUX', 'MCO', 'ESP', 'CHE']
    }];
    
    axios.get.mockResolvedValue({ data: franceMockData });
    
    // Re-render component
    rerender(<CountryDetail />);
    
    // Should make a new API call with updated code
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha/FRA');
      expect(screen.getByText('France')).toBeInTheDocument();
      expect(screen.getByText('Paris')).toBeInTheDocument();
    });
  });
});