import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './index';
import { useAuth } from '../../context/AuthProvider';
import { vi } from 'vitest';
import getLoginConfiguration from '../../api/user/get-login-configuration';

vi.mock('../../context/AuthProvider', () => ({
  useAuth: vi.fn()
}));

vi.mock('../../api/user/get-login-configuration');

describe('Login Component', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    (useAuth as vi.Mock).mockReturnValue({ login: mockLogin });
    (getLoginConfiguration as vi.Mock).mockResolvedValue({
      data: { emailVerified: true, mfa: { enabled: false } }
    });
  });

  it('renders the Login component', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  it('submits the login form', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.input(screen.getByLabelText('Email Address'), {
      target: { value: 'test@example.com' }
    });

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(getLoginConfiguration).toHaveBeenCalledWith('test@example.com');
    });

    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        loginWithRecoveryCode: false,
        otp: '',
        email: 'test@example.com',
        password: 'password123',
        mfaType: '',
        recoveryCode: '',
        resetMfa: false
      });
    });
  });

  it('handles MFA flow', async () => {
    (getLoginConfiguration as vi.Mock).mockResolvedValueOnce({
      data: { emailVerified: true, mfa: { enabled: true, type: 'app' } }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.input(screen.getByLabelText('Email Address'), {
      target: { value: 'test@example.com' }
    });

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(getLoginConfiguration).toHaveBeenCalledWith('test@example.com');
    });

    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Please enter the 6 digit one time passcode shown on your chosen authenticator app'
        )
      ).toBeInTheDocument(); // Adjust this based on your actual MFA input
    });
  });
});
