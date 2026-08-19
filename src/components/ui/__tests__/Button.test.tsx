import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { Plus } from 'lucide-react';

describe('Button Primitive', () => {
  it('renders button children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when isLoading is true', () => {
    render(<Button isLoading>Loading State</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders left and right icons when provided', () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      >
        With Icons
      </Button>
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });
});

describe('IconButton Primitive', () => {
  it('requires and renders aria-label', () => {
    render(<IconButton icon={<Plus />} aria-label="Add item" />);
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });
});
