import React, { useState, useId } from 'react';
import { cn } from '@/utils/styles';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  children: React.ReactElement;
  className?: string;
  delayMs?: number;
}

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2 animate-in fade-in-0 zoom-in-95',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2 animate-in fade-in-0 zoom-in-95',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2 animate-in fade-in-0 zoom-in-95',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2 animate-in fade-in-0 zoom-in-95',
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  className,
  delayMs = 150,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const tooltipId = useId();

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delayMs);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {React.cloneElement(
        children,
        isVisible ? ({ 'aria-describedby': tooltipId } as React.Attributes) : undefined
      )}
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-[1600] whitespace-nowrap rounded-md bg-slate-900 dark:bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-100 dark:text-slate-900 shadow-md pointer-events-none',
            positionClasses[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
