import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dialog, DialogHeader, DialogTitle, DialogContent } from '../Overlay/Dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Navigation/Tabs';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '../Overlay/Dropdown';

describe('Overlay & Navigation Primitives', () => {
  describe('Dialog', () => {
    it('renders when isOpen is true and calls onClose on Escape', () => {
      const handleClose = vi.fn();
      render(
        <Dialog isOpen={true} onClose={handleClose}>
          <DialogHeader>
            <DialogTitle>Test Modal</DialogTitle>
          </DialogHeader>
          <DialogContent>Modal Content</DialogContent>
        </Dialog>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();

      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
      expect(handleClose).toHaveBeenCalled();
    });

    it('does not render when isOpen is false', () => {
      render(
        <Dialog isOpen={false} onClose={() => {}}>
          <DialogContent>Hidden Content</DialogContent>
        </Dialog>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Tabs', () => {
    it('switches tabs correctly', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('tab', { name: /tab 2/i }));
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });
  });

  describe('Dropdown', () => {
    it('opens content on trigger click', () => {
      render(
        <Dropdown>
          <DropdownTrigger>Open Menu</DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
  });
});
