import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import type { DateRangeFilter, DateRangePreset } from '@/types/filter';
import { Dropdown } from '@/components/ui/Overlay/Dropdown';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Form/Input';

export interface FilterDateRangePickerProps {
  value?: DateRangeFilter;
  onChange: (val?: DateRangeFilter) => void;
  className?: string;
}

const PRESETS: { label: string; value: DateRangePreset }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Custom Range', value: 'custom' },
];

export const FilterDateRangePicker: React.FC<FilterDateRangePickerProps> = ({
  value,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFrom, setTempFrom] = useState(value?.from || '');
  const [tempTo, setTempTo] = useState(value?.to || '');

  const handleSelectPreset = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      onChange({ preset: 'custom', from: tempFrom || undefined, to: tempTo || undefined });
    } else {
      const fromDate = new Date();
      if (preset === '7d') {
        fromDate.setDate(fromDate.getDate() - 7);
      } else if (preset === '30d') {
        fromDate.setDate(fromDate.getDate() - 30);
      } else if (preset === '90d') {
        fromDate.setDate(fromDate.getDate() - 90);
      }
      const fromStr = fromDate.toISOString().split('T')[0];
      const toStr = new Date().toISOString().split('T')[0];
      onChange({ preset, from: fromStr, to: toStr });
    }
    setIsOpen(false);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({
      preset: 'custom',
      from: tempFrom || undefined,
      to: tempTo || undefined,
    });
    setIsOpen(false);
  };

  const getLabel = () => {
    if (!value || (!value.preset && !value.from && !value.to)) {
      return 'Date Range';
    }
    if (value.preset && value.preset !== 'custom') {
      const match = PRESETS.find((p) => p.value === value.preset);
      if (match) return match.label;
    }
    if (value.from && value.to) {
      return `${value.from} to ${value.to}`;
    }
    if (value.from) return `From ${value.from}`;
    if (value.to) return `Until ${value.to}`;
    return 'Custom Range';
  };

  const hasSelection = Boolean(value?.preset || value?.from || value?.to);

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className={className}
      trigger={
        <Button
          variant={hasSelection ? 'primary' : 'outline'}
          size="sm"
          leftIcon={<Calendar className="h-4 w-4" />}
          rightIcon={<ChevronDown className="h-3.5 w-3.5" />}
          onClick={() => setIsOpen(!isOpen)}
          className="whitespace-nowrap"
        >
          {getLabel()}
        </Button>
      }
    >
      <div className="w-64 p-3 space-y-3">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Presets
        </div>
        <div className="space-y-1">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => handleSelectPreset(p.value)}
              className={`w-full text-left px-2.5 py-1.5 text-sm rounded-md transition-colors ${
                value?.preset === p.value
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Custom Dates
          </div>
          <form onSubmit={handleApplyCustom} className="space-y-2">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Start Date
              </label>
              <Input
                type="date"
                size="sm"
                value={tempFrom}
                onChange={(e) => setTempFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                End Date
              </label>
              <Input
                type="date"
                size="sm"
                value={tempTo}
                onChange={(e) => setTempTo(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  onChange(undefined);
                  setIsOpen(false);
                }}
              >
                Reset
              </Button>
              <Button type="submit" variant="primary" size="sm" className="w-full text-xs">
                Apply
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dropdown>
  );
};
