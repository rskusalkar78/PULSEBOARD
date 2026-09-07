/**
 * Utility functions for chart data formatting and calculations
 */

/**
 * Format large numbers with K, M, B suffixes
 */
export const formatChartValue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

/**
 * Format time in hours or minutes
 */
export const formatTime = (minutes: number): string => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${minutes}m`;
};

/**
 * Format date for chart labels
 */
export const formatChartDate = (
  date: Date | string,
  format: 'short' | 'long' = 'short'
): string => {
  const d = new Date(date);

  if (format === 'short') {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Get contrasting colors for chart series
 */
export const chartColors = {
  primary: '#7c3aed', // violet-600
  secondary: '#06b6d4', // cyan-500
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
  info: '#3b82f6', // blue-500
  neutral: '#64748b', // slate-500
  dark: {
    primary: '#a78bfa', // violet-400
    secondary: '#22d3ee', // cyan-400
    success: '#34d399', // emerald-400
    warning: '#fbbf24', // amber-400
    danger: '#f87171', // red-400
    info: '#60a5fa', // blue-400
    neutral: '#94a3b8', // slate-400
  },
};

/**
 * Get color array for multi-series charts
 */
export const getChartColorPalette = (isDark: boolean = false) => {
  const colors = isDark ? chartColors.dark : chartColors;
  return [colors.primary, colors.secondary, colors.success, colors.warning, colors.danger];
};

/**
 * Calculate trend percentage change
 */
export const calculateTrendPercentage = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Generate mock analytics data for development/testing
 */
export const generateMockAnalyticsData = () => {
  const today = new Date();
  const days = 30;
  const data = [];

  for (let i = days; i > 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date,
      period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tasksCompleted: Math.floor(Math.random() * 20) + 5,
      tasksCreated: Math.floor(Math.random() * 25) + 10,
      productivityScore: Math.floor(Math.random() * 40) + 60,
      efficiency: Math.floor(Math.random() * 30) + 70,
      projectsCompleted: Math.floor(Math.random() * 5),
      projectsStarted: Math.floor(Math.random() * 4) + 1,
      completionRate: Math.floor(Math.random() * 30) + 60,
      averageCompletionTime: Math.floor(Math.random() * 20) + 10,
      tasksPending: Math.floor(Math.random() * 15) + 5,
      tasksOverdue: Math.floor(Math.random() * 5),
      activeUsers: Math.floor(Math.random() * 10) + 5,
      newProjects: Math.floor(Math.random() * 3),
      averageTaskTime: Math.floor(Math.random() * 120) + 30,
      completedTasks: Math.floor(Math.random() * 20) + 5, // Add completedTasks for TeamActivity
    });
  }

  return data;
};

/**
 * Group data by time period
 */
type ChartDataItem = {
  date: string;
  [key: string]: unknown;
};

export const groupDataByPeriod = (
  data: ChartDataItem[],
  period: 'day' | 'week' | 'month'
): Record<string, ChartDataItem[]> => {
  const grouped: Record<string, ChartDataItem[]> = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    let key: string;

    switch (period) {
      case 'week': {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        key = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        break;
      }

      case 'month':
        key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        break;

      case 'day':
      default:
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    const groupedArray = grouped[key];
    if (groupedArray) {
      groupedArray.push(item);
    }
  });

  return grouped;
};

/**
 * Calculate statistics from data array
 */
export const calculateStats = (values: number[]) => {
  if (values.length === 0) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      sum: 0,
      median: 0,
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  let median = 0;

  if (values.length % 2 === 0) {
    const mid1 = sorted[values.length / 2 - 1] ?? 0;
    const mid2 = sorted[values.length / 2] ?? 0;
    median = (mid1 + mid2) / 2;
  } else {
    median = sorted[Math.floor(values.length / 2)] ?? 0;
  }

  return {
    min: sorted[0] ?? 0,
    max: sorted[sorted.length - 1] ?? 0,
    avg: Math.round(avg),
    sum,
    median: Math.round(median),
  };
};
