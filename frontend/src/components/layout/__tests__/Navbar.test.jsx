import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { useAuth } from '../../../context/AuthContext';

// Mock the AuthContext
vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the AuthModal component
vi.mock('../../modals/AuthModal', () => ({
  default: function MockAuthModal({ open, mode, onClose }) {
    return open ? (
      <div data-testid="auth-modal" data-mode={mode}>
        <button onClick={onClose} data-testid="close-modal">Close Modal</button>
      </div>
    ) : null;
  }
}));

// Mock router hooks
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to, onClick }) => (
    <a href={to} onClick={onClick} data-testid={`link-${to.replace(/\//g, '')}`}>
      {children}
    </a>
  ),
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Default auth context with no user
    useAuth.mockReturnValue({
      user: null,
      logout: vi.fn(),
    });
  });

  it('should render logo and navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
      // Check logo and navigation links
    expect(screen.getByText('WorldView')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
  
  it('should show login button when user is not authenticated', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    expect(screen.queryByText('Favorites')).not.toBeInTheDocument();
  });
  
  it('should show logout button and favorites link when user is authenticated', () => {
    // Mock authenticated user
    useAuth.mockReturnValue({
      user: { id: '123', name: 'Test User' },
      logout: vi.fn(),
    });
    
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });
  
  it('should open auth modal when login is clicked', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    
    // Click login button
    fireEvent.click(screen.getByText('Login'));
    
    // Check if modal appears
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
    expect(screen.getByTestId('auth-modal').getAttribute('data-mode')).toBe('login');
  });
  
  it('should open logout confirmation dialog when logout is clicked', () => {
    // Mock authenticated user
    useAuth.mockReturnValue({
      user: { id: '123', name: 'Test User' },
      logout: vi.fn(),
    });
    
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    
    // Click logout button
    fireEvent.click(screen.getByText('Logout'));
    
    // Check if confirmation dialog appears
    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to logout?')).toBeInTheDocument();
  });
  
  it('should call logout function when confirming logout', async () => {
    const mockLogout = vi.fn().mockResolvedValue(undefined);
    
    // Mock authenticated user
    useAuth.mockReturnValue({
      user: { id: '123', name: 'Test User' },
      logout: mockLogout,
    });
    
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    
    // Click logout button
    fireEvent.click(screen.getByText('Logout'));
    
    // Click confirm logout button
    fireEvent.click(screen.getByText('LOGOUT'));
    
    // Verify logout was called
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
  
  it('should close logout dialog when cancel is clicked', () => {
    // Mock authenticated user
    useAuth.mockReturnValue({
      user: { id: '123', name: 'Test User' },
      logout: vi.fn(),
    });
    
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    
    // Click logout button to open dialog
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
    
    // Click cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Dialog should be closed
    expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
  });
});