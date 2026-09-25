/**
 * DataTable.test.tsx — Comprehensive unit tests for Enterprise DataTable Infrastructure
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { DataTable } from '@/components/ui/Data/DataTable';
import type { ColumnDef, BulkAction } from '@/types/table';

interface TestUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const mockUsers: TestUser[] = Array.from({ length: 25 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 === 0 ? 'Admin' : 'Developer',
  status: i % 3 === 0 ? 'inactive' : 'active',
}));

const columns: ColumnDef<TestUser>[] = [
  { id: 'id', header: 'ID', accessorKey: 'id', enableSorting: true },
  { id: 'name', header: 'Name', accessorKey: 'name', enableSorting: true },
  { id: 'email', header: 'Email', accessorKey: 'email', enableSorting: true },
  { id: 'role', header: 'Role', accessorKey: 'role', enableSorting: true },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: (ctx) => <span className={`badge-${ctx.value}`}>{String(ctx.value)}</span>,
  },
];

describe('DataTable Infrastructure', () => {
  it('renders table headers and data correctly', () => {
    render(<DataTable columns={columns} data={mockUsers} getRowId={(r) => r.id} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('User 1')).toBeInTheDocument();
  });

  it('handles sorting when header is clicked', () => {
    render(<DataTable columns={columns} data={mockUsers} getRowId={(r) => r.id} />);

    const nameHeader = screen.getByTitle('Sort by Name');
    fireEvent.click(nameHeader);

    // After first click, should sort ASC
    expect(nameHeader.closest('th')).toHaveAttribute('aria-sort', 'ascending');
  });

  it('filters data via global search input', async () => {
    render(<DataTable columns={columns} data={mockUsers} getRowId={(r) => r.id} />);

    const searchInput = screen.getByPlaceholderText('Search…');
    fireEvent.change(searchInput, { target: { value: 'user10@example.com' } });

    await waitFor(
      () => {
        expect(screen.getByText('user10@example.com')).toBeInTheDocument();
        expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  it('paginates data correctly', () => {
    render(
      <DataTable columns={columns} data={mockUsers} getRowId={(r) => r.id} defaultPageSize={10} />
    );

    // First page should show user 1 to 10
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 10')).toBeInTheDocument();
    expect(screen.queryByText('User 11')).not.toBeInTheDocument();

    // Click next page
    const nextBtn = screen.getByLabelText('Next page');
    fireEvent.click(nextBtn);

    expect(screen.getByText('User 11')).toBeInTheDocument();
    expect(screen.queryByText('User 1')).not.toBeInTheDocument();
  });

  it('supports row selection and triggers bulk actions', () => {
    const handleBulkDelete = vi.fn();
    const bulkActions: BulkAction<TestUser>[] = [
      {
        id: 'delete',
        label: 'Delete Selected',
        variant: 'danger',
        onAction: handleBulkDelete,
      },
    ];

    render(
      <DataTable
        columns={columns}
        data={mockUsers}
        getRowId={(r) => r.id}
        enableRowSelection
        bulkActions={bulkActions}
      />
    );

    // Select row 1
    const row1Checkbox = screen.getByLabelText('Select row 1');
    fireEvent.click(row1Checkbox);

    // Bulk actions bar should appear
    expect(screen.getByText('Delete Selected')).toBeInTheDocument();

    // Trigger bulk action
    fireEvent.click(screen.getByText('Delete Selected'));
    expect(handleBulkDelete).toHaveBeenCalledWith([mockUsers[0]]);
  });

  it('renders loading skeleton when isLoading is true', () => {
    render(<DataTable columns={columns} data={[]} getRowId={(r) => r.id} isLoading={true} />);

    expect(document.querySelectorAll('.dt-skeleton').length).toBeGreaterThan(0);
  });

  it('renders custom empty state when data is empty', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        getRowId={(r) => r.id}
        emptyStateTitle="No users found"
        emptyStateDescription="Try adjusting your filters."
      />
    );

    expect(screen.getByText('No users found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters.')).toBeInTheDocument();
  });
});
