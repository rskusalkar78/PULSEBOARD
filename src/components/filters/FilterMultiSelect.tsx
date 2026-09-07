import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import type { FilterOption } from '@/types/filter';
import { Dropdown } from '@/components/ui/Overlay/Dropdown';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Form/Input';
import { Checkbox } from '@/components/ui/Form/Checkbox';
import { Avatar } from '@/components/ui/Display/Avatar';

export interface FilterMultiSelectProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  icon?: React.ReactNode;
  searchable?: boolean;
  className?: string;
}

export const FilterMultiSelect: React.FC<FilterMultiSelectProps> = ({
  label,
  options,
  selectedValues = [],
  onChange,
  icon,
  searchable = true,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const query = searchTerm.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(query))
    );
  }, [options, searchTerm]);

  const handleToggle = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((v) => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((opt) => opt.id));
    }
  };

  const activeCount = selectedValues.length;
  const buttonLabel =
    activeCount === 0
      ? label
      : activeCount === 1
        ? options.find((o) => o.id === selectedValues[0])?.label || `${label} (1)`
        : `${label} (${activeCount})`;

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className={className}
      trigger={
        <Button
          variant={activeCount > 0 ? 'primary' : 'outline'}
          size="sm"
          leftIcon={icon}
          rightIcon={<ChevronDown className="h-3.5 w-3.5" />}
          onClick={() => setIsOpen(!isOpen)}
          className="whitespace-nowrap"
        >
          {buttonLabel}
        </Button>
      }
    >
      <div className="w-64 p-3 space-y-2">
        {searchable && (
          <div className="relative">
            <Input
              type="text"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
              leftIcon={<Search className="h-3.5 w-3.5 text-slate-400" />}
              className="text-xs"
            />
          </div>
        )}

        <div className="flex items-center justify-between px-1 py-1 border-b border-slate-200 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium"
          >
            {selectedValues.length === options.length ? 'Deselect all' : 'Select all'}
          </button>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-rose-600 dark:text-rose-400 hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1">
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-500">No options found</div>
          ) : (
            filteredOptions.map((opt) => {
              const isChecked = selectedValues.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer text-xs select-none transition-colors ${
                    isChecked
                      ? 'bg-violet-50/70 text-violet-900 dark:bg-violet-950/40 dark:text-violet-200'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Checkbox checked={isChecked} onChange={() => handleToggle(opt.id)} size="sm" />
                  {opt.avatar && <Avatar src={opt.avatar} alt={opt.label} size="xs" />}
                  {opt.color && (
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: opt.color }}
                    />
                  )}
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <div className="flex-1 min-w-0 truncate">
                    <span className="font-medium">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {opt.sublabel}
                      </span>
                    )}
                  </div>
                  {isChecked && <Check className="h-3.5 w-3.5 text-violet-600 shrink-0" />}
                </label>
              );
            })
          )}
        </div>
      </div>
    </Dropdown>
  );
};
