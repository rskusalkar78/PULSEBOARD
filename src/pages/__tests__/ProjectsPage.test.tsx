import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ProjectsPage } from '../ProjectsPage';

function renderProjectsPage() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ProjectsPage />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('ProjectsPage Integration Tests', () => {
  it('renders page header, search filter, and project cards', async () => {
    renderProjectsPage();

    // Check title
    expect(screen.getByRole('heading', { name: /^projects/i })).toBeInTheDocument();

    // Check Create Project button
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();

    // Wait for projects list to render
    await waitFor(() => {
      expect(screen.getByText(/PulseBoard Redesign/i)).toBeInTheDocument();
      expect(screen.getByText(/Analytics Pipeline/i)).toBeInTheDocument();
    });
  });

  it('switches between grid view and table view mode', async () => {
    renderProjectsPage();

    await waitFor(() => {
      expect(screen.getByText(/PulseBoard Redesign/i)).toBeInTheDocument();
    });

    const tableViewBtn = screen.getByLabelText(/table view/i);
    fireEvent.click(tableViewBtn);

    // Table headers should now be present
    expect(screen.getByText(/Due Date/i)).toBeInTheDocument();
  });

  it('opens Create Project modal when Create Project button is clicked', async () => {
    renderProjectsPage();

    const createBtn = screen.getByRole('button', { name: /create project/i });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /create new project/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/project name \*/i)).toBeInTheDocument();
    });
  });
});
