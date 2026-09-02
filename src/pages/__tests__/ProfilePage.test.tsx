import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProfilePage } from '../ProfilePage';

function renderProfilePage() {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

describe('ProfilePage Integration Tests', () => {
  it('renders profile title, header card, inputs, and tabs', () => {
    renderProfilePage();

    expect(screen.getByRole('heading', { name: /user profile settings/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role \/ title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/timezone/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /profile information/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /preferences & theme/i })).toBeInTheDocument();
  });

  it('allows editing display name and submitting changes', async () => {
    const user = userEvent.setup();
    renderProfilePage();

    const nameInput = screen.getByLabelText(/display name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Alex Morgan Updated');

    const saveButton = screen.getByRole('button', { name: /save profile changes/i });
    expect(saveButton).not.toBeDisabled();

    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });

  it('displays form validation error when email format is invalid', async () => {
    const user = userEvent.setup();
    renderProfilePage();

    const emailInput = screen.getByLabelText(/email address/i);
    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');

    const saveButton = screen.getByRole('button', { name: /save profile changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('switches between tabs and allows changing theme preference', async () => {
    const user = userEvent.setup();
    renderProfilePage();

    const preferencesTab = screen.getByRole('tab', { name: /preferences & theme/i });
    await user.click(preferencesTab);

    expect(screen.getByText(/theme preference/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /light theme/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dark slate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /system default/i })).toBeInTheDocument();

    const lightThemeBtn = screen.getByRole('button', { name: /light theme/i });
    await user.click(lightThemeBtn);

    const saveButton = screen.getByRole('button', { name: /save profile changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });

  it('handles avatar upload file selection', async () => {
    renderProfilePage();

    const fileInput = screen.getByLabelText(/upload avatar image file/i) as HTMLInputElement;
    const file = new File(['mock content'], 'avatar.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/avatar uploaded successfully/i)).toBeInTheDocument();
    });
  });
});
