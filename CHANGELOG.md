# Changelog

All notable changes to the **PulseBoard** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- CI/CD quality badges and test suite status indicators in documentation.
- Comprehensive GitHub Issue and Pull Request templates for open-source contributors.
- Direct repository screenshot gallery covering Dashboard, Analytics, Projects, Kanban, Storybook, and Docs.

---

## [0.1.0] - 2026-10-19

### Added

- **Core Architecture**:
  - React 19 application shell with Vite 6 build configuration.
  - TypeScript strict mode configuration and comprehensive path aliases (`@/*`).
  - Tailwind CSS v4 design token architecture with 150+ CSS variables.
- **Theme Engine**:
  - Light, Dark, and System theme synchronization.
  - Zero-flash theme initialization script and persistent user preference storage.
- **UI Component System**:
  - 26+ reusable, accessible (WCAG AA compliant) components across Buttons, Forms, Navigation, Display, Overlay, and Feedback.
  - Interactive Storybook 8 workbench with automated accessibility (`@storybook/addon-a11y`) checks.
- **Dashboard & Analytics**:
  - Executive KPI summary cards (Total Projects, Active Projects, Completed Tasks, Productivity Score).
  - Interactive Recharts visualization with multi-timeframe views (Week, Month, Quarter, Year).
  - Quick action shortcuts and real-time team member activity monitors.
- **Project & Task Management**:
  - Multi-project workspace with category, priority, and date range filtering.
  - Interactive Kanban board powered by `@hello-pangea/dnd` with columns for Backlog, Todo, In Progress, Review, and Done.
  - Dual list-view and board-view toggle with state preservation.
- **Authentication & Backend Integration**:
  - Supabase client integration with PKCE browser authentication flow.
  - Robust local mock fallback allowing full offline and local evaluation without external dependencies.
  - Row Level Security (RLS) migration policies for multi-tenant data isolation.
- **Quality Assurance & Testing**:
  - Vitest test harness for unit, hook, and service testing.
  - End-to-end user journey test suite using Playwright.
  - 10-stage GitHub Actions CI/CD automation workflow (`ci.yml`).
- **Security & Open Source Governance**:
  - Automated pre-commit hooks with Husky and lint-staged.
  - Contributor Covenant Code of Conduct and Open Source Contributing Guidelines.
  - Responsible Vulnerability Disclosure policy (`SECURITY.md`).

[Unreleased]: https://github.com/rskusalkar78/PULSEBOARD/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/rskusalkar78/PULSEBOARD/releases/tag/v0.1.0
