# Contributing to PulseBoard

First off, thank you for considering contributing to PulseBoard! 🎉

PulseBoard is an open-source, production-grade real-time dashboard and project management platform built with React 19, TypeScript, Tailwind CSS, and Supabase. We welcome contributions of all kinds: bug reports, feature suggestions, documentation improvements, test cases, and code contributions.

Please take a moment to review this document in order to make the contribution process smooth and effective for everyone.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the project maintainers.

---

## How Can I Contribute?

### 1. Reporting Bugs

Before submitting a bug report:

- Check existing [GitHub Issues](https://github.com/rskusalkar78/PULSEBOARD/issues) to avoid duplicates.
- Ensure the issue is reproducible with the latest `main` branch.

When filing a bug, please use our **[Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)** and include:

- A clear, descriptive title.
- Step-by-step reproduction instructions.
- Expected behavior vs. actual behavior.
- Browser name and version, OS, and Node version.
- Screenshots or console log errors if applicable.

### 2. Suggesting Enhancements

Feature requests and architectural proposals are very welcome! Please submit an issue using our **[Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)** explaining:

- The problem or use-case you are trying to solve.
- Your proposed solution or user experience flow.
- Any alternative solutions or workarounds considered.

### 3. Improving Documentation

Documentation improvements are always appreciated. Whether fixing typos, clarifying setup instructions, adding code examples, or documenting component props in Storybook:

- Edit the corresponding Markdown file or component stories.
- Submit a Pull Request following our PR guidelines.

---

## Development Setup

### Prerequisites

- **Node.js**: `>= 20.0.0` (Recommended: Node 22 LTS)
- **npm**: `>= 10.0.0`
- **Git**

### Step-by-Step Local Setup

1. **Fork the repository** on GitHub:
   Visit [https://github.com/rskusalkar78/PULSEBOARD](https://github.com/rskusalkar78/PULSEBOARD) and click **Fork**.

2. **Clone your fork locally**:

   ```bash
   git clone https://github.com/<your-username>/PULSEBOARD.git
   cd PULSEBOARD
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

   _(PulseBoard will function with built-in mock services if Supabase credentials are left as placeholders)._

5. **Start the local development server**:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

6. **Start Storybook (Component Explorer)**:
   ```bash
   npm run storybook
   ```
   Storybook will launch on `http://localhost:6006`.

---

## Scripts & Development Workflow

| Command                   | Purpose                                                               |
| :------------------------ | :-------------------------------------------------------------------- |
| `npm run dev`             | Starts the Vite development server with Hot Module Replacement (HMR)  |
| `npm run typecheck`       | Validates TypeScript types across the entire project (`tsc --noEmit`) |
| `npm run lint`            | Runs ESLint flat configuration checks across all files                |
| `npm run format`          | Automatically formats files using Prettier                            |
| `npm run format:check`    | Verifies code formatting conforms to Prettier rules                   |
| `npm run test`            | Executes the Vitest unit and integration test suite                   |
| `npm run test:coverage`   | Generates detailed code coverage reports via `@vitest/coverage-v8`    |
| `npm run test:e2e`        | Runs end-to-end user journey tests with Playwright                    |
| `npm run storybook`       | Starts the Storybook UI component workbench                           |
| `npm run build`           | Builds the optimized production web bundle in `dist/`                 |
| `npm run build-storybook` | Compiles static Storybook documentation into `storybook-static/`      |

---

## Git Workflow & Branching Strategy

We follow a feature-branch workflow:

1. **Create a topic branch from `main`**:

   ```bash
   git checkout -b feature/kanban-keyboard-navigation
   # or
   git checkout -b fix/auth-token-refresh
   ```

   **Branch naming conventions**:
   - `feature/<description>` — New user-facing features or components
   - `fix/<description>` — Bug fixes
   - `docs/<description>` — Documentation improvements
   - `refactor/<description>` — Code refactoring without behavior change
   - `test/<description>` — Adding or updating test suites
   - `chore/<description>` — Tooling, dependency updates, configuration

2. **Make your changes**:
   - Follow the established design system tokens and styling patterns.
   - Keep components modular, accessible (WCAG AA compliant), and typed.
   - Add unit tests for new utility functions, hooks, or service methods.
   - Add Storybook stories for new UI components.

3. **Commit your changes**:
   We recommend following the [Conventional Commits](https://www.conventionalcommits.org/) specification:

   ```bash
   git commit -m "feat(kanban): add drag-and-drop keyboard reordering"
   git commit -m "fix(auth): prevent race condition during session refresh"
   git commit -m "docs(readme): add architecture diagram and badges"
   ```

4. **Verify Quality Before Pushing**:
   Ensure all checks pass locally:
   ```bash
   npm run typecheck
   npm run lint
   npm run format:check
   npm run test
   ```

---

## Pull Request Guidelines

When you're ready to submit your code:

1. **Push your branch to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
2. **Open a Pull Request**:
   Go to the PulseBoard repository on GitHub and click **Compare & pull request**.
3. **Fill out the Pull Request Template**:
   - Clearly describe what changes were made and why.
   - Link related issue(s) using GitHub keywords (e.g., `Closes #42`).
   - Include screenshots or screen recordings for UI changes.
   - Confirm that all pre-flight checks (linting, tests, types) pass.
4. **Code Review**:
   - Maintainers will review your PR, suggest adjustments, or ask questions.
   - Once approved and CI pipeline passes, your branch will be merged into `main`.

Thank you for helping make PulseBoard better for everyone!
