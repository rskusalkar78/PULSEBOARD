import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import type { ColumnDef } from '@/types/table';
import { Badge } from '../Display/Badge';
import { Button } from '../Button/Button';

interface SampleItem {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Pending' | 'Archived';
  budget: number;
}

const sampleColumns: ColumnDef<SampleItem>[] = [
  { id: 'name', header: 'Project Name', accessorKey: 'name', enableSorting: true },
  { id: 'category', header: 'Category', accessorKey: 'category', enableSorting: true },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    enableSorting: true,
    cell: (ctx) => {
      const variantMap = { Active: 'success', Pending: 'warning', Archived: 'default' } as const;
      const status = ctx.row.status;
      return (
        <Badge variant={variantMap[status] || 'default'} dot>
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'budget',
    header: 'Budget',
    accessorKey: 'budget',
    enableSorting: true,
    cell: (ctx) => `$${ctx.row.budget.toLocaleString()}`,
  },
];

const sampleData: SampleItem[] = [
  {
    id: '1',
    name: 'Design System Migration',
    category: 'Frontend',
    status: 'Active',
    budget: 15000,
  },
  { id: '2', name: 'GraphQL API Server', category: 'Backend', status: 'Active', budget: 24000 },
  { id: '3', name: 'Mobile App Refactor', category: 'Mobile', status: 'Pending', budget: 18000 },
  { id: '4', name: 'Legacy Data Cleanup', category: 'DevOps', status: 'Archived', budget: 5000 },
  {
    id: '5',
    name: 'Security Audit & Compliance',
    category: 'Security',
    status: 'Active',
    budget: 30000,
  },
];

/**
 * `DataTable` is an enterprise data table supporting sorting, global search filtering, column visibility, row selection, pagination, and bulk actions.
 */
const meta: Meta<typeof DataTable> = {
  title: 'UI/Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  render: () => (
    <DataTable<SampleItem>
      columns={sampleColumns}
      data={sampleData}
      getRowId={(row) => row.id}
      enableRowSelection
      enablePagination
    />
  ),
};

export const LoadingState: Story = {
  render: () => (
    <DataTable<SampleItem>
      columns={sampleColumns}
      data={[]}
      isLoading={true}
      loadingSkeletonRows={5}
    />
  ),
};

export const EmptyState: Story = {
  render: () => (
    <DataTable<SampleItem>
      columns={sampleColumns}
      data={[]}
      emptyStateTitle="No projects available"
      emptyStateDescription="Create a new project to start populating your table."
      emptyStateAction={
        <Button variant="primary" size="sm">
          New Project
        </Button>
      }
    />
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl">
      <DataTable<SampleItem>
        columns={sampleColumns}
        data={sampleData}
        getRowId={(row) => row.id}
        enableRowSelection
      />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-lg border p-4 rounded-xl">
      <DataTable<SampleItem>
        columns={sampleColumns}
        data={sampleData.slice(0, 3)}
        getRowId={(row) => row.id}
      />
    </div>
  ),
};
