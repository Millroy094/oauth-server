// PasswordField.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest'; // Use `vi` instead of `jest`
import PasswordField from './PasswordField';
import { UseFormRegister } from 'react-hook-form';

// Mock register function from react-hook-form
const mockRegister = vi.fn() as unknown as UseFormRegister<any>;

describe('PasswordField', () => {
  const defaultProps = {
    register: mockRegister,
    name: 'password',
    label: 'Password',
    error: false,
    helperText: ''
  };

  it('renders PasswordField with correct label', () => {
    render(<PasswordField {...defaultProps} />);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('displays helper text and error state', () => {
    render(
      <PasswordField
        {...defaultProps}
        error={true}
        helperText='Password is required'
      />
    );
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('toggles password visibility when icon is clicked', () => {
    render(<PasswordField {...defaultProps} />);
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const visibilityToggle = screen.getByRole('button', {
      name: /toggle password visibility/i
    });

    // Default state should be type="password"
    expect(passwordInput.type).toBe('password');

    // Click to show password
    fireEvent.click(visibilityToggle);
    expect(passwordInput.type).toBe('text');

    // Click to hide password
    fireEvent.click(visibilityToggle);
    expect(passwordInput.type).toBe('password');
  });

  it('registers the input with react-hook-form', () => {
    render(<PasswordField {...defaultProps} />);
    expect(mockRegister).toHaveBeenCalledWith(defaultProps.name);
  });
});
