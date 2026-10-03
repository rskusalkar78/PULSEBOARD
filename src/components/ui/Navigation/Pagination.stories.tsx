import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import type { PaginationProps } from './Pagination';
import { Pagination } from './Pagination';

/**
 * `Pagination` allows users to navigate across large multi-page datasets.
 */
const meta: Meta<typeof Pagination> = {
  title: 'UI/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    currentPage: { control: 'number' },
    totalPages: { control: 'number' },
    showPageDetails: { control: 'boolean' },
  },
  args: {
    currentPage: 3,
    totalPages: 10,
    showPageDetails: true,
    totalItems: 100,
    itemsPerPage: 10,
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const DefaultPaginationDemo: React.FC<PaginationProps> = (args) => {
  const [page, setPage] = useState(args.currentPage);
  return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
};

export const Default: Story = {
  render: (args) => <DefaultPaginationDemo {...args} />,
};

const ManyPagesPaginationDemo: React.FC = () => {
  const [page, setPage] = useState(5);
  return (
    <Pagination
      currentPage={page}
      totalPages={25}
      onPageChange={setPage}
      showPageDetails
      totalItems={250}
      itemsPerPage={10}
    />
  );
};

export const ManyPagesWithTruncation: Story = {
  render: () => <ManyPagesPaginationDemo />,
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl">
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={() => {}}
        showPageDetails
        totalItems={50}
        itemsPerPage={10}
      />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-md border p-4 rounded-xl">
      <Pagination
        currentPage={1}
        totalPages={4}
        onPageChange={() => {}}
        showPageDetails
        totalItems={40}
        itemsPerPage={10}
      />
    </div>
  ),
};
