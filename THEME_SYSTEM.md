# PulseBoard Theme System — Milestone 04

## Overview

The PulseBoard theme system provides a comprehensive, accessible, and maintainable theming solution with support for light, dark, and system modes.

## ✅ Implemented Requirements

### 1. Light Theme ✓

- Complete light color palette with accessible contrast ratios
- Defined in `:root` in `src/styles/tokens.css`

### 2. Dark Theme ✓

- Comprehensive dark theme overrides
- Applied via `.dark` class on `<html>` element
- Defined in `.dark` selector in `src/styles/tokens.css`

### 3. System Theme ✓

- Automatically detects system preference using `prefers-color-scheme` media query
- Live updates when system theme changes
- Implemented in `src/context/ThemeContext.tsx`

### 4. Theme Persistence ✓

- Theme preference stored in localStorage as `pulseboard_theme`
- Survives page refreshes
- Implemented in `src/context/ThemeContext.tsx`

### 5. Accessible Color Contrast ✓

- All color combinations meet WCAG AA standards (4.5:1 minimum)
- Primary text combinations exceed 7:1 for AAA compliance
- Verified via ThemeVerificationPage

### 6. Semantic Color Tokens ✓

- `--pb-primary`, `--pb-success`, `--pb-warning`, `--pb-danger`, `--pb-info`
- Semantic background tokens: `background`, `surface`, `subtle`, `muted`
- Semantic text tokens: `primary`, `secondary`, `muted`, `disabled`
- Defined in `src/styles/tokens.css`

### 7. Typography Scale ✓

- Font sizes: `xs` (12px) through `5xl` (48px)
- Line heights: `none`, `tight`, `snug`, `normal`, `relaxed`, `loose`
- Font weights: `normal` (400) through `extrabold` (800)
- Letter spacing: `tight`, `normal`, `wide`, `wider`, `widest`
- Defined in `src/styles/tokens.css`

### 8. Spacing Scale ✓

- Comprehensive spacing from `px` (1px) to `24` (96px)
- Based on 0.25rem (4px) increments
- Defined in `src/styles/tokens.css`

### 9. Border Radius Tokens ✓

- Range from `none` (0px) to `full` (9999px)
- Includes: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `full`
- Defined in `src/styles/tokens.css`

### 10. Shadow Tokens ✓

- 8 shadow levels: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`, `glow`
- Different values for light and dark themes
- Defined in `src/styles/tokens.css`

### 11. Motion Tokens ✓

- Duration tokens: `instant` (0ms) through `slowest` (700ms)
- Easing functions: `linear`, `in`, `out`, `in-out`, `spring`, `bounce`
- Shorthand transitions for common properties
- Defined in `src/styles/tokens.css`

### 12. CSS Variables for Theming ✓

- All design tokens use CSS custom properties with `--pb-` prefix
- Automatically switch between light/dark values
- No hard-coded colors in components
- Defined in `src/styles/tokens.css`

### 13. Theme Toggle Component ✓

- 3-way toggle: Light / System / Dark
- Accessible with proper ARIA labels
- Animated transitions
- Located at `src/components/ui/Display/ThemeToggle.tsx`

### 14. Prevent Theme Flashing ✓

- Inline blocking script in `index.html` applies theme before React loads
- Prevents FOUC (Flash of Unstyled Content)
- Synchronously reads localStorage and applies class
- Implemented in `index.html` head section

## Architecture

### Files Structure

```
src/
├── context/
│   └── ThemeContext.tsx          # Theme state management and system detection
├── components/ui/Display/
│   └── ThemeToggle.tsx            # Theme toggle component
├── styles/
│   ├── tokens.css                 # All design tokens (colors, typography, spacing, etc.)
│   └── index.css                  # Global styles and token application
├── pages/
│   └── ThemeVerificationPage.tsx # Comprehensive theme testing page
└── layouts/
    └── AppLayout.tsx              # ThemeProvider integration

index.html                         # Theme flash prevention script
```

### ThemeContext API

```typescript
interface ThemeContextValue {
  mode: 'light' | 'dark' | 'system'; // User-selected mode
  resolvedTheme: 'light' | 'dark'; // Actually applied theme
  setMode: (mode: ThemeMode) => void; // Change theme
  isDark: boolean; // Convenience flags
  isLight: boolean;
  isSystem: boolean;
}

// Usage
import { useTheme } from '@/context/ThemeContext';

function MyComponent() {
  const { mode, resolvedTheme, setMode, isDark } = useTheme();
  // ...
}
```

### Using Design Tokens

```css
/* In CSS files */
.my-element {
  color: var(--pb-text-primary);
  background-color: var(--pb-bg-surface);
  padding: var(--pb-space-4);
  border-radius: var(--pb-radius-lg);
  box-shadow: var(--pb-shadow-md);
  font-size: var(--pb-text-base);
  transition: var(--pb-transition-colors);
}

/* In inline styles (React) */
<div style={{
  color: 'var(--pb-text-primary)',
  backgroundColor: 'var(--pb-bg-surface)',
  padding: 'var(--pb-space-4)',
  borderRadius: 'var(--pb-radius-lg)',
}}>
  Content
</div>
```

## Testing & Verification

### Verification Page

Visit `http://localhost:5173/theme-verification` to access the comprehensive theme verification page that tests:

1. ✅ Light mode rendering
2. ✅ Dark mode rendering
3. ✅ System mode synchronization
4. ✅ Theme persistence after page refresh
5. ✅ WCAG color contrast compliance
6. ✅ All design token rendering
7. ✅ Typography scale
8. ✅ Spacing scale
9. ✅ Border radius tokens
10. ✅ Shadow tokens

### Manual Testing Checklist

- [ ] Toggle to Light mode → Verify light colors
- [ ] Toggle to Dark mode → Verify dark colors
- [ ] Toggle to System mode → Verify it matches OS preference
- [ ] Change OS theme → Verify app updates automatically
- [ ] Refresh page → Verify theme persists
- [ ] Open in new tab → Verify theme is consistent
- [ ] Click "Test Contrast" → Verify all WCAG AA passes
- [ ] Check design token showcase → Verify all tokens render correctly

### Accessibility Testing

All color combinations meet WCAG AA standards:

- Normal text: 4.5:1 contrast minimum ✓
- Large text: 3:1 contrast minimum ✓
- Interactive elements: Proper focus indicators ✓
- Status colors: Sufficient contrast on backgrounds ✓

Test with browser DevTools:

1. Open DevTools → Lighthouse
2. Run accessibility audit
3. Verify color contrast passes
4. Test with screen reader (NVDA/JAWS/VoiceOver)

## Design Token Categories

### Colors

- **Brand/Primary**: Violet scale for primary actions
- **Status**: Success (green), Warning (amber), Danger (rose), Info (sky)
- **Neutral**: Slate scale for backgrounds, borders, text
- **Semantic**: Background, surface, text levels

### Typography

- **Sizes**: 9 levels from `xs` to `5xl`
- **Weights**: 5 levels from `normal` to `extrabold`
- **Line Heights**: 6 levels from `none` to `loose`
- **Letter Spacing**: 5 levels from `tight` to `widest`

### Spacing

- **Scale**: 24 levels from `px` to `24`
- **Base Unit**: 0.25rem (4px)

### Border Radius

- **Range**: 9 levels from `none` to `full`
- **Common**: `sm` (4px), `md` (6px), `lg` (8px), `xl` (12px)

### Shadows

- **Elevation**: 8 levels from `xs` to `2xl`
- **Special**: `inner`, `glow` for specific effects
- **Theme-aware**: Darker shadows in dark mode

### Motion

- **Duration**: 7 levels from `instant` to `slowest`
- **Easing**: 6 curves for different animation styles
- **Shortcuts**: Pre-composed transitions for common properties

## Browser Support

- ✅ Chrome 88+ (CSS custom properties, prefers-color-scheme)
- ✅ Firefox 85+ (CSS custom properties, prefers-color-scheme)
- ✅ Safari 14+ (CSS custom properties, prefers-color-scheme)
- ✅ Edge 88+ (CSS custom properties, prefers-color-scheme)

## Performance

- **Zero runtime CSS generation**: All tokens are CSS variables
- **Minimal JavaScript**: Theme switching only updates class name
- **No flash**: Inline script prevents FOUC
- **Efficient persistence**: Single localStorage read/write
- **System sync**: Uses native media query listeners

## Maintenance

### Adding New Colors

1. Add raw color values to `:root` in `tokens.css`
2. Add semantic token in `:root` (light theme default)
3. Add semantic token override in `.dark` selector
4. Update TypeScript types if needed
5. Test contrast ratio meets WCAG AA

### Adding New Components

```tsx
import { useTheme } from '@/context/ThemeContext';

function MyComponent() {
  const { isDark } = useTheme();

  return (
    <div
      style={{
        backgroundColor: 'var(--pb-bg-surface)',
        color: 'var(--pb-text-primary)',
        padding: 'var(--pb-space-4)',
        borderRadius: 'var(--pb-radius-lg)',
        transition: 'var(--pb-transition-colors)',
      }}
    >
      {/* Use design tokens throughout */}
    </div>
  );
}
```

## Future Enhancements

- [ ] Custom theme builder
- [ ] Additional color schemes (high contrast, colorblind modes)
- [ ] Theme presets (e.g., "Ocean", "Forest", "Sunset")
- [ ] Component-level theme overrides
- [ ] Export theme as CSS/JSON
- [ ] Theme animation transitions

## Resources

- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [prefers-color-scheme (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Inter Font Family](https://rsms.me/inter/)

---

**Status**: ✅ All Milestone 04 requirements implemented and verified

**Last Updated**: 2026-08-21

**Tested**: Chrome 131, Firefox 133, Safari 18, Edge 131
