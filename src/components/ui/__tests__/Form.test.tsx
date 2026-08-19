import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../Form/Input';
import { Select } from '../Form/Select';
import { Checkbox } from '../Form/Checkbox';
import { Switch } from '../Form/Switch';
import { RadioGroup, Radio } from '../Form/Radio';

describe('Form Primitives', () => {
  describe('Input', () => {
    it('renders label and input correctly', () => {
      render(<Input label="Username" placeholder="Enter username" />);
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
    });

    it('displays error message when error prop is provided', () => {
      render(<Input label="Email" error="Invalid email address" />);
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  describe('Select', () => {
    it('renders options and selects value', () => {
      const options = [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
      ];
      render(<Select label="Country" options={options} defaultValue="us" />);
      const select = screen.getByLabelText(/country/i) as HTMLSelectElement;
      expect(select.value).toBe('us');
    });
  });

  describe('Checkbox & Switch', () => {
    it('toggles checkbox state', () => {
      const handleChange = vi.fn();
      render(<Checkbox label="Accept terms" onChange={handleChange} />);
      const checkbox = screen.getByLabelText(/accept terms/i);
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalled();
    });

    it('toggles switch state with role switch', () => {
      render(<Switch label="Enable Notifications" />);
      const switchElement = screen.getByRole('switch', { name: /enable notifications/i });
      expect(switchElement).toBeInTheDocument();
    });
  });

  describe('RadioGroup', () => {
    it('handles radio selection within group', () => {
      const handleChange = vi.fn();
      render(
        <RadioGroup label="Plan" value="pro" onChange={handleChange}>
          <Radio value="free" label="Free Plan" />
          <Radio value="pro" label="Pro Plan" />
        </RadioGroup>
      );
      const proRadio = screen.getByLabelText(/pro plan/i) as HTMLInputElement;
      expect(proRadio.checked).toBe(true);
    });
  });
});
