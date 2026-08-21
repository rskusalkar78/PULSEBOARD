# PULSEBOARD

A modern, production-grade real-time dashboard and analytics platform built with React 19, TypeScript, Vite, and Tailwind CSS.

## ✨ Features

- 🎨 **Complete Theme System** — Light, Dark, and System modes with zero-flash switching
- 🎯 **Design Tokens** — 150+ CSS variables for consistent styling
- ♿ **WCAG AA Compliant** — Accessible color contrast ratios
- 🔄 **Theme Persistence** — Remembers your preference across sessions
- 🚀 **26+ UI Components** — Professional, accessible, and fully typed
- 📱 **Responsive Design** — Mobile-first approach

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Linting & Formatting**: [ESLint](https://eslint.org/) (Flat Config) + [Prettier](https://prettier.io/)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 📁 Project Architecture

```
src/
├── app/          # Core application setup (App shell, providers)
├── components/   # Reusable UI components (buttons, cards, inputs)
├── features/     # Feature-based domain modules
├── layouts/      # Page layout templates (Header, Sidebar, Shell)
├── pages/        # Route pages
├── hooks/        # Custom React hooks
├── lib/          # Third-party library initializations & configurations
├── services/     # API services and data fetching clients
├── stores/       # Application state management stores
├── types/        # TypeScript type definitions and interfaces
├── utils/        # Helper utility functions
├── constants/    # Global constants and config objects
├── assets/       # Static media files (images, icons, fonts)
└── styles/       # Global CSS stylesheets and Tailwind config
```

---

## 🛠️ Path Aliases

Use the `@/*` alias to import modules relative to the `src/` directory:

```typescript
import { Button } from '@/components';
import { useAuth } from '@/hooks';
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` to configure your environment variables:

```bash
cp .env.example .env
```

Available variables:

| Variable            | Description                               | Default                     |
| ------------------- | ----------------------------------------- | --------------------------- |
| `VITE_APP_TITLE`    | Application Title                         | `PulseBoard`                |
| `VITE_APP_ENV`      | Environment (`development`, `production`) | `development`               |
| `VITE_API_BASE_URL` | Base API Endpoint URL                     | `http://localhost:3000/api` |

---

## 🚦 Getting Started

### Prerequisites

- **Node.js**: `>= 20.0.0`
- **npm**: `>= 10.0.0`

### Installation

```bash
npm install
```

### Development Server

Start the local Vite development server:

```bash
npm run dev
```

### Production Build

Typecheck and build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🎨 Theme System

PulseBoard includes a comprehensive theme system with:

- **Light Theme** — Clean, bright interface for daytime use
- **Dark Theme** — Eye-friendly dark mode for low-light environments
- **System Theme** — Automatically follows your OS preference
- **Zero Flash** — No white flash on page load
- **150+ Design Tokens** — Colors, typography, spacing, shadows, and more
- **WCAG AA Compliant** — All color combinations meet accessibility standards

### Quick Start

```tsx
import { useTheme } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/ui/Display/ThemeToggle';

function MyComponent() {
  const { mode, resolvedTheme, isDark } = useTheme();

  return (
    <div>
      <ThemeToggle size="md" />
      <p>Current theme: {resolvedTheme}</p>
    </div>
  );
}
```

### Documentation

- 📖 [Complete Theme Documentation](./THEME_SYSTEM.md)
- 🔖 [Quick Reference Guide](./THEME_QUICK_REFERENCE.md)
- ✅ [Milestone 04 Verification](./MILESTONE_04_VERIFICATION.md)

### Testing

Visit these pages to test the theme system:

- **Theme Verification**: http://localhost:5173/theme-verification
- **Design System**: http://localhost:5173/design-system

---

## 🧪 Testing & Code Quality

| Script                 | Action                               |
| ---------------------- | ------------------------------------ |
| `npm run lint`         | Run ESLint across all codebase files |
| `npm run format`       | Auto-format files using Prettier     |
| `npm run format:check` | Check code formatting compliance     |
| `npm run test`         | Run Vitest unit tests                |
| `npm run test:watch`   | Run Vitest in watch mode             |
