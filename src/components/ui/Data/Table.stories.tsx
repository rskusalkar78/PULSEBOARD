import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './Table';
import { Badge } from '../Display/Badge';

/**
 * Basic HTML `Table` primitives for custom tabulating.
 */
const meta: Meta<typeof Table> = {
  title: 'UI/Data/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A summary of your recent workspace projects.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead className="text-right">Tasks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-semibold">PulseBoard Core</TableCell>
          <TableCell>
            <Badge variant="success">Active</Badge>
          </TableCell>
          <TableCell>Alex Rivera</TableCell>
          <TableCell className="text-right">24</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Mobile App</TableCell>
          <TableCell>
            <Badge variant="warning">In Review</Badge>
          </TableCell>
          <TableCell>Sam Chen</TableCell>
          <TableCell className="text-right">18</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Analytics Engine</TableCell>
          <TableCell>
            <Badge variant="primary">Planning</Badge>
          </TableCell>
          <TableCell>Taylor Swift</TableCell>
          <TableCell className="text-right">7</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Active Tasks</TableCell>
          <TableCell className="text-right font-bold">49</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Sarah Connor</TableCell>
            <TableCell>Administrator</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};
