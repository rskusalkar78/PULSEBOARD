import { useState, useEffect } from 'react';

export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
}

// Re-export theme hook for convenience — primary source is ThemeContext
export { useTheme, type ThemeMode, type ResolvedTheme } from '@/context/ThemeContext';
