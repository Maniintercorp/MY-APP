import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginAndSignupSplitPanel } from '../components/LoginAndSignupSplitPanel';

describe('LoginAndSignupSplitPanel Component', () => {
  it('renders signup heading', () => {
    render(<LoginAndSignupSplitPanel />);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('renders social buttons', () => {
    render(<LoginAndSignupSplitPanel />);
    expect(screen.getByRole('button', { name: /facebook/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /twitter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /linkedin/i })).toBeInTheDocument();
  });

  it('handles form submit', () => {
    render(<LoginAndSignupSplitPanel />);
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    // Add expectations related to signup in the future
  });
});