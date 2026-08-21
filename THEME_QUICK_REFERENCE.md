# PulseBoard Theme System — Quick Reference

## Theme Usage

### Import and Use Theme Hook

```tsx
import { useTheme } from '@/context/ThemeContext';

function MyComponent() {
  const { mode, resolvedTheme, setMode, isDark } = useTheme();

  return (
    <div>
      <p>Current mode: {mode}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setMode('dark')}>Dark Mode</button>
      <button onClick={() => setMode('light')}>Light Mode</button>
      <button onClick={() => setMode('system')}>System Mode</button>
    </div>
  );
}
```

### Use Theme Toggle Component

```tsx
import { ThemeToggle } from '@/components/ui/Display/ThemeToggle';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeToggle size="md" />
    </header>
  );
}
```

## Design Tokens Reference

### Colors

#### Brand/Primary

```css
var(--pb-primary)           /* Main brand color */
var(--pb-primary-hover)     /* Hover state */
var(--pb-primary-active)    /* Active/pressed state */
var(--pb-primary-subtle)    /* Light background */
var(--pb-primary-muted)     /* Muted background */
var(--pb-primary-text)      /* Text on light backgrounds */
```

#### Status Colors

```css
/* Success */
var(--pb-success)
var(--pb-success-hover)
var(--pb-success-subtle)
var(--pb-success-muted)
var(--pb-success-text)

/* Warning */
var(--pb-warning)
var(--pb-warning-hover)
var(--pb-warning-subtle)
var(--pb-warning-muted)
var(--pb-warning-text)

/* Danger */
var(--pb-danger)
var(--pb-danger-hover)
var(--pb-danger-subtle)
var(--pb-danger-muted)
var(--pb-danger-text)

/* Info */
var(--pb-info)
var(--pb-info-hover)
var(--pb-info-subtle)
var(--pb-info-muted)
var(--pb-info-text)
```

#### Backgrounds

```css
var(--pb-bg-background)     /* Page background */
var(--pb-bg-surface)        /* Card/panel background */
var(--pb-bg-subtle)         /* Subtle gray background */
var(--pb-bg-muted)          /* Muted background */
var(--pb-bg-overlay)        /* Modal overlay */
```

#### Borders

```css
var(--pb-border)            /* Default border */
var(--pb-border-hover)      /* Hover state border */
var(--pb-border-focus)      /* Focus state border */
var(--pb-border-strong)     /* Emphasized border */
```

#### Text

```css
var(--pb-text-primary)      /* Primary text */
var(--pb-text-secondary)    /* Secondary text */
var(--pb-text-muted)        /* Muted/placeholder text */
var(--pb-text-disabled)     /* Disabled text */
var(--pb-text-on-primary)   /* Text on primary color */
var(--pb-text-on-surface)   /* Text on surface */
var(--pb-text-inverse)      /* Inverse text */
```

#### Focus Ring

```css
var(--pb-ring-color)        /* Focus ring color */
var(--pb-ring-offset)       /* Focus ring offset color */
```

### Typography

#### Font Families

```css
var(--pb-font-sans)         /* Inter, system-ui */
var(--pb-font-mono)         /* Monospace font */
```

#### Font Sizes

```css
var(--pb-text-xs)           /* 12px */
var(--pb-text-sm)           /* 14px */
var(--pb-text-base)         /* 16px (default) */
var(--pb-text-lg)           /* 18px */
var(--pb-text-xl)           /* 20px */
var(--pb-text-2xl)          /* 24px */
var(--pb-text-3xl)          /* 30px */
var(--pb-text-4xl)          /* 36px */
var(--pb-text-5xl)          /* 48px */
```

#### Line Heights

```css
var(--pb-leading-none)      /* 1 */
var(--pb-leading-tight)     /* 1.25 */
var(--pb-leading-snug)      /* 1.375 */
var(--pb-leading-normal)    /* 1.5 (default) */
var(--pb-leading-relaxed)   /* 1.625 */
var(--pb-leading-loose)     /* 2 */
```

#### Font Weights

```css
var(--pb-font-normal)       /* 400 */
var(--pb-font-medium)       /* 500 */
var(--pb-font-semibold)     /* 600 */
var(--pb-font-bold)         /* 700 */
var(--pb-font-extrabold)    /* 800 */
```

#### Letter Spacing

```css
var(--pb-tracking-tight)    /* -0.025em */
var(--pb-tracking-normal)   /* 0em */
var(--pb-tracking-wide)     /* 0.025em */
var(--pb-tracking-wider)    /* 0.05em */
var(--pb-tracking-widest)   /* 0.1em */
```

### Spacing

```css
var(--pb-space-px)          /* 1px */
var(--pb-space-0)           /* 0px */
var(--pb-space-0-5)         /* 2px */
var(--pb-space-1)           /* 4px */
var(--pb-space-1-5)         /* 6px */
var(--pb-space-2)           /* 8px */
var(--pb-space-2-5)         /* 10px */
var(--pb-space-3)           /* 12px */
var(--pb-space-3-5)         /* 14px */
var(--pb-space-4)           /* 16px */
var(--pb-space-5)           /* 20px */
var(--pb-space-6)           /* 24px */
var(--pb-space-7)           /* 28px */
var(--pb-space-8)           /* 32px */
var(--pb-space-10)          /* 40px */
var(--pb-space-12)          /* 48px */
var(--pb-space-16)          /* 64px */
var(--pb-space-20)          /* 80px */
var(--pb-space-24)          /* 96px */
```

### Border Radius

```css
var(--pb-radius-none)       /* 0px */
var(--pb-radius-xs)         /* 2px */
var(--pb-radius-sm)         /* 4px */
var(--pb-radius-md)         /* 6px */
var(--pb-radius-lg)         /* 8px */
var(--pb-radius-xl)         /* 12px */
var(--pb-radius-2xl)        /* 16px */
var(--pb-radius-3xl)        /* 24px */
var(--pb-radius-full)       /* 9999px (circle) */
```

### Shadows

```css
var(--pb-shadow-none)       /* No shadow */
var(--pb-shadow-xs)         /* Very subtle */
var(--pb-shadow-sm)         /* Small shadow */
var(--pb-shadow-md)         /* Medium shadow */
var(--pb-shadow-lg)         /* Large shadow */
var(--pb-shadow-xl)         /* Extra large shadow */
var(--pb-shadow-2xl)        /* Massive shadow */
var(--pb-shadow-inner)      /* Inset shadow */
var(--pb-shadow-glow)       /* Glow effect */
var(--pb-shadow-glow-sm)    /* Small glow effect */
```

### Motion

#### Durations

```css
var(--pb-duration-instant)  /* 0ms */
var(--pb-duration-fast)     /* 100ms */
var(--pb-duration-normal)   /* 200ms (default) */
var(--pb-duration-slow)     /* 300ms */
var(--pb-duration-slower)   /* 500ms */
var(--pb-duration-slowest)  /* 700ms */
```

#### Easing Functions

```css
var(--pb-ease-linear)       /* linear */
var(--pb-ease-in)           /* ease-in */
var(--pb-ease-out)          /* ease-out (default) */
var(--pb-ease-in-out)       /* ease-in-out */
var(--pb-ease-spring)       /* spring effect */
var(--pb-ease-bounce)       /* bounce effect */
```

#### Transition Shortcuts

```css
var(--pb-transition-colors)     /* Color transitions */
var(--pb-transition-transform)  /* Transform transitions */
var(--pb-transition-opacity)    /* Opacity transitions */
var(--pb-transition-shadow)     /* Shadow transitions */
var(--pb-transition-all)        /* All properties */
```

### Z-Index

```css
var(--pb-z-hide)            /* -1 */
var(--pb-z-base)            /* 0 */
var(--pb-z-raised)          /* 1 */
var(--pb-z-dropdown)        /* 1000 */
var(--pb-z-sticky)          /* 1100 */
var(--pb-z-fixed)           /* 1200 */
var(--pb-z-overlay)         /* 1300 */
var(--pb-z-modal)           /* 1400 */
var(--pb-z-drawer)          /* 1400 */
var(--pb-z-popover)         /* 1500 */
var(--pb-z-tooltip)         /* 1600 */
var(--pb-z-toast)           /* 1700 */
var(--pb-z-top)             /* 9999 */
```

## Common Patterns

### Card Component

```tsx
<div
  style={{
    backgroundColor: 'var(--pb-bg-surface)',
    border: '1px solid var(--pb-border)',
    borderRadius: 'var(--pb-radius-xl)',
    padding: 'var(--pb-space-6)',
    boxShadow: 'var(--pb-shadow-md)',
    transition: 'var(--pb-transition-shadow)',
  }}
>
  Content
</div>
```

### Button Component

```tsx
<button
  style={{
    backgroundColor: 'var(--pb-primary)',
    color: 'var(--pb-text-on-primary)',
    padding: 'var(--pb-space-3) var(--pb-space-6)',
    borderRadius: 'var(--pb-radius-lg)',
    fontSize: 'var(--pb-text-base)',
    fontWeight: 'var(--pb-font-medium)',
    transition: 'var(--pb-transition-colors)',
    boxShadow: 'var(--pb-shadow-sm)',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = 'var(--pb-primary-hover)';
  }}
>
  Click Me
</button>
```

### Input Component

```tsx
<input
  style={{
    backgroundColor: 'var(--pb-bg-surface)',
    color: 'var(--pb-text-primary)',
    border: '1px solid var(--pb-border)',
    borderRadius: 'var(--pb-radius-lg)',
    padding: 'var(--pb-space-3)',
    fontSize: 'var(--pb-text-base)',
    outline: 'none',
    transition: 'var(--pb-transition-colors)',
  }}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = 'var(--pb-border-focus)';
    e.currentTarget.style.boxShadow = `0 0 0 3px var(--pb-ring-color)`;
  }}
/>
```

### Status Badge

```tsx
<span
  style={{
    backgroundColor: 'var(--pb-success-subtle)',
    color: 'var(--pb-success-text)',
    padding: 'var(--pb-space-1) var(--pb-space-3)',
    borderRadius: 'var(--pb-radius-full)',
    fontSize: 'var(--pb-text-xs)',
    fontWeight: 'var(--pb-font-medium)',
  }}
>
  Active
</span>
```

### Modal Overlay

```tsx
<div
  style={{
    position: 'fixed',
    inset: 0,
    backgroundColor: 'var(--pb-bg-overlay)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 'var(--pb-z-modal)',
  }}
>
  <div
    style={{
      backgroundColor: 'var(--pb-bg-surface)',
      borderRadius: 'var(--pb-radius-2xl)',
      padding: 'var(--pb-space-8)',
      boxShadow: 'var(--pb-shadow-2xl)',
      maxWidth: '500px',
    }}
  >
    Modal Content
  </div>
</div>
```

## Testing URLs

- **Main App**: http://localhost:5173/
- **Design System**: http://localhost:5173/design-system
- **Theme Verification**: http://localhost:5173/theme-verification
- **Login**: http://localhost:5173/login
- **Dashboard**: http://localhost:5173/dashboard

## Tips

1. **Always use CSS variables**: Never hard-code colors
2. **Test both themes**: Check light and dark mode for every component
3. **Check contrast**: Use the verification page to test accessibility
4. **Use semantic tokens**: Prefer `--pb-text-primary` over `--pb-color-slate-900`
5. **Leverage transitions**: Use `--pb-transition-*` for smooth theme changes
6. **Follow spacing scale**: Use spacing tokens for consistent layouts
7. **Use TypeScript**: The `useTheme()` hook is fully typed

## Need Help?

- See full documentation: `THEME_SYSTEM.md`
- Check theme verification page: `/theme-verification`
- Review design system: `/design-system`
- Check token definitions: `src/styles/tokens.css`
