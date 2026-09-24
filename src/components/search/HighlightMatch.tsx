import React from 'react';
import { getHighlightSegments } from '@/utils/fuzzySearch';
import { cn } from '@/utils/styles';

export interface HighlightMatchProps {
  text: string;
  query: string;
  className?: string;
  matchClassName?: string;
}

export const HighlightMatch: React.FC<HighlightMatchProps> = ({
  text,
  query,
  className,
  matchClassName,
}) => {
  if (!text) return null;
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const segments = getHighlightSegments(text, query);

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.isMatch ? (
          <mark
            key={index}
            className={cn(
              'bg-violet-500/20 text-violet-700 dark:text-violet-300 font-semibold px-0.5 py-0.2 rounded transition-colors',
              matchClassName
            )}
          >
            {segment.text}
          </mark>
        ) : (
          <React.Fragment key={index}>{segment.text}</React.Fragment>
        )
      )}
    </span>
  );
};
