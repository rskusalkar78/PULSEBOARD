import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/styles/index.css';
import { ThemeProvider } from '../src/context/ThemeContext';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      element: '#storybook-root',
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile (375px)',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop (1280px)',
          styles: { width: '1280px', height: '800px' },
        },
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light Mode' },
          { value: 'dark', icon: 'circle', title: 'Dark Mode' },
        ],
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';

      React.useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        } else {
          root.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
        }
      }, [theme]);

      return (
        <ThemeProvider>
          <div
            className={
              theme === 'dark'
                ? 'dark bg-slate-900 text-slate-100 p-4 rounded-lg min-h-[100px]'
                : 'bg-white text-slate-900 p-4 rounded-lg min-h-[100px]'
            }
          >
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
