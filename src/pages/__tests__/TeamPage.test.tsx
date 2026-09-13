import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { TeamPage } from '../TeamPage';

function renderTeamPage() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <TeamPage />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

/** Opens the More menu for a specific member by aria-label. */
function openMenuFor(name: string) {
  const btn = screen.getByRole('button', { name: new RegExp(`more actions for ${name}`, 'i') });
  fireEvent.click(btn);
  return btn;
}

describe('TeamPage Integration Tests', () => {
  it('renders page header, search input, and member rows', () => {
    renderTeamPage();

    expect(screen.getByRole('heading', { name: /team roster & access/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search members or roles\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.getByText('Marcus Vance')).toBeInTheDocument();
    expect(screen.getByText('Elena Rostova')).toBeInTheDocument();
  });

  it('renders a More (⋯) menu button for each team member', () => {
    renderTeamPage();
    const menuButtons = screen.getAllByRole('button', { name: /more actions for/i });
    expect(menuButtons).toHaveLength(4);
  });

  it('opens the dropdown and shows all action items when More button is clicked', async () => {
    renderTeamPage();

    openMenuFor('Alex Morgan');

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /view profile/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /edit role/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /send email/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /remove member/i })).toBeInTheDocument();
    });
  });

  it('closes the dropdown when Escape is pressed', async () => {
    renderTeamPage();

    openMenuFor('Alex Morgan');

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('opens the Edit Role dialog when Edit Role is clicked', async () => {
    renderTeamPage();

    openMenuFor('Sarah Chen');

    await waitFor(() => screen.getByRole('menuitem', { name: /edit role/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /edit role/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /edit role/i })).toBeInTheDocument();
    });
  });

  it('shows a confirmation dialog before removing a member (does not remove immediately)', async () => {
    renderTeamPage();

    // Member is present before the action
    expect(screen.getByText('Elena Rostova')).toBeInTheDocument();

    openMenuFor('Elena Rostova');
    await waitFor(() => screen.getByRole('menuitem', { name: /remove member/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /remove member/i }));

    // Confirmation dialog must appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: /remove team member/i })
    ).toBeInTheDocument();
    // The member name appears inside the confirmation panel (may be split across text nodes)
    expect(within(dialog).getByText(/Elena Rostova/)).toBeInTheDocument();

    // Member row still present in the table — not yet removed
    expect(screen.getAllByText('Elena Rostova').length).toBeGreaterThan(0);
  });

  it('removes the member only after confirming in the dialog', async () => {
    renderTeamPage();

    openMenuFor('Elena Rostova');
    await waitFor(() => screen.getByRole('menuitem', { name: /remove member/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /remove member/i }));

    await waitFor(() => screen.getByRole('dialog'));

    // Confirm removal
    const dialog = screen.getByRole('dialog');
    const confirmBtn = within(dialog).getByRole('button', { name: /remove member/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.queryByText('Elena Rostova')).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('cancels removal when Cancel is clicked in the confirmation dialog', async () => {
    renderTeamPage();

    openMenuFor('Marcus Vance');
    await waitFor(() => screen.getByRole('menuitem', { name: /remove member/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /remove member/i }));

    await waitFor(() => screen.getByRole('dialog'));

    const dialog = screen.getByRole('dialog');
    const cancelBtn = within(dialog).getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      // Member must still be present
      expect(screen.getByText('Marcus Vance')).toBeInTheDocument();
    });
  });

  it('opens invite member modal when Invite Member button is clicked', async () => {
    renderTeamPage();

    const inviteBtn = screen.getByRole('button', { name: /invite member/i });
    fireEvent.click(inviteBtn);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /invite new team member/i })).toBeInTheDocument();
    });
  });

  it('filters members by search query', () => {
    renderTeamPage();

    const searchInput = screen.getByPlaceholderText(/search members or roles\.\.\./i);
    fireEvent.change(searchInput, { target: { value: 'Sarah' } });

    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.queryByText('Alex Morgan')).not.toBeInTheDocument();
    expect(screen.queryByText('Marcus Vance')).not.toBeInTheDocument();
    expect(screen.queryByText('Elena Rostova')).not.toBeInTheDocument();
  });

  it('shows empty state message when no members match the search', () => {
    renderTeamPage();

    const searchInput = screen.getByPlaceholderText(/search members or roles\.\.\./i);
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });

    expect(screen.getByText(/no team members found matching/i)).toBeInTheDocument();
  });
});
