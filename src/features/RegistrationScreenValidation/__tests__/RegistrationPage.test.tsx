import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RegistrationPage } from '../pages/RegistrationPage';

describe('RegistrationPage', () => {
  test('renders registration form', () => {
    render(
      <Router>
        <RegistrationPage />
      </Router>
    );
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/ })).toBeInTheDocument();
  });

  test('validates the form fields', () => {
    render(
      <Router>
        <RegistrationPage />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /Register/ }));

    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('opens Facebook when clicked', () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => {});

    render(
      <Router>
        <RegistrationPage />
      </Router>
    );

    fireEvent.click(screen.getByText(/Open Facebook/));
    expect(open).toHaveBeenCalledWith('https://facebook.com', '_blank');
    open.mockRestore();
  });

  test('navigates to login page when Sign In is clicked', () => {
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

    render(
      <Router>
        <RegistrationPage />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /Sign In/ }));
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
