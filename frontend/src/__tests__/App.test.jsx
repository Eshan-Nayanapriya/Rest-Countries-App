import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the components used in App
vi.mock('../components/layout/Navbar', () => ({
  default: function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  }
}));

vi.mock('../components/layout/Footer', () => ({
  default: function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  }
}));

vi.mock('../pages/Home', () => ({
  default: function MockHome() {
    return <div data-testid="home-page">Home Page</div>;
  }
}));

vi.mock('../pages/CountryDetail', () => ({
  default: function MockCountryDetail() {
    return <div data-testid="country-detail-page">Country Detail Page</div>;
  }
}));

vi.mock('../pages/Favorites', () => ({
  default: function MockFavorites() {
    return <div data-testid="favorites-page">Favorites Page</div>;
  }
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ children }) => <div>{children}</div>,
    MemoryRouter: ({ children }) => <div>{children}</div>,
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({ code: 'USA' }),
  };
});

// Prevent Material UI warning during tests
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

describe('App Component', () => {
  it('should render the app with navbar and footer', () => {
    render(<App />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
  
  it('should render the Home page on the root route', () => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useLocation: () => ({ pathname: '/' }),
      };
    });
    
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
  
  it('should render the CountryDetail page on the /country/:code route', () => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useLocation: () => ({ pathname: '/country/USA' }),
      };
    });
    
    render(<App />);
    expect(screen.getByTestId('country-detail-page')).toBeInTheDocument();
  });
  
  it('should render the Favorites page on the /favorites route', () => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useLocation: () => ({ pathname: '/favorites' }),
      };
    });
    
    render(<App />);
    expect(screen.getByTestId('favorites-page')).toBeInTheDocument();
  });
});