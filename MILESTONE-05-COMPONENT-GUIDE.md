# Milestone 05 — Component Reference Guide

## Quick Component Reference

### DashboardLayout

**Location**: `src/components/layout/DashboardLayout.tsx`

**Purpose**: Main layout wrapper that provides the entire dashboard shell structure.

**Usage**:

```tsx
import { DashboardLayout } from '@/components/layout';

<DashboardLayout>{/* Your page content */}</DashboardLayout>;
```

**Features**:

- Automatic responsive behavior
- Manages sidebar state
- Includes TopNavigation, Sidebar, and MobileNav
- Handles viewport detection

**Props**: None (uses Outlet for nested routes)

---

### TopNavigation

**Location**: `src/components/layout/TopNavigation.tsx`

**Purpose**: Fixed header bar with primary navigation controls.

**Props**:

```typescript
interface TopNavigationProps {
  onToggleSidebar: () => void; // Callback to toggle sidebar
  isSidebarOpen: boolean; // Current sidebar state
  isMobile: boolean; // Is viewport mobile?
}
```

**Contains**:

- Hamburger menu button
- Logo (responsive)
- Search trigger button
- Notification button
- User menu

---

### Sidebar

**Location**: `src/components/layout/Sidebar.tsx`

**Purpose**: Desktop/tablet navigation sidebar.

**Props**:

```typescript
interface SidebarProps {
  isOpen: boolean; // Is sidebar visible?
  isCollapsible?: boolean; // Can it be collapsed? (tablet)
  onClose?: () => void; // Callback when closing
}
```

**Behavior**:

- **Desktop (≥1024px)**: Always visible, persistent
- **Tablet (768-1023px)**: Collapsible with backdrop
- **Mobile (<768px)**: Not rendered (uses MobileNav)

**Navigation Items**:

```typescript
const navigationItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Projects', icon: FolderKanban, href: '/projects', badge: '3' },
  { label: 'Team', icon: Users, href: '/team' },
  { label: 'Settings', icon: Settings, href: '/settings' },
  { label: 'Help', icon: HelpCircle, href: '/help' },
];
```

---

### MobileNav

**Location**: `src/components/layout/MobileNav.tsx`

**Purpose**: Mobile drawer navigation (< 768px).

**Props**:

```typescript
interface MobileNavProps {
  isOpen: boolean; // Is drawer visible?
  onClose: () => void; // Callback when closing
}
```

**Behavior**:

- Slides in from left
- Backdrop overlay
- Closes on navigation
- Escape key support
- Focus trap

---

### UserMenu

**Location**: `src/components/layout/UserMenu.tsx`

**Purpose**: User profile dropdown menu.

**Props**: None (uses AuthContext)

**Menu Items**:

1. **User Info Section**
   - Avatar (with initials fallback)
   - Name and email
   - Role badge

2. **Actions**
   - View Profile → `/profile`
   - Settings → `/settings`
   - Help & Support → `/help`
   - Log Out → Logout + redirect to `/login`

**Features**:

- Click outside to close
- Escape key to close
- Keyboard navigation
- Focus management

---

### NotificationButton

**Location**: `src/components/layout/NotificationButton.tsx`

**Purpose**: Notification center with badge count.

**Props**: None (manages own state)

**Features**:

- Unread count badge (1-9, 9+)
- Notification types: info, success, warning, error
- Mark as read (individual)
- Mark all as read
- Delete notification
- Timestamps
- Empty state

**Notification Interface**:

```typescript
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
```

---

### PageHeader

**Location**: `src/components/layout/PageHeader.tsx`

**Purpose**: Reusable page header with title, description, breadcrumbs, and actions.

**Props**:

```typescript
interface PageHeaderProps {
  title: string; // Page title
  description?: string; // Optional description
  breadcrumbs?: BreadcrumbItem[]; // Optional breadcrumb path
  actions?: React.ReactNode; // Optional action buttons
  className?: string; // Additional classes
}
```

**Usage**:

```tsx
<PageHeader
  title="Dashboard"
  description="Welcome back! Here's an overview."
  breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
  actions={<Button leftIcon={<Plus />}>New Project</Button>}
/>
```

---

### Breadcrumb

**Location**: `src/components/layout/Breadcrumb.tsx`

**Purpose**: Navigation breadcrumb trail.

**Props**:

```typescript
interface BreadcrumbProps {
  items: BreadcrumbItem[]; // Breadcrumb items
  showHomeIcon?: boolean; // Show home icon on first item?
  className?: string; // Additional classes
}

interface BreadcrumbItem {
  label: string; // Display text
  href?: string; // Link URL (last item usually has no href)
  icon?: ReactNode; // Optional icon
}
```

**Usage**:

```tsx
<Breadcrumb
  items={[
    { label: 'Home', href: '/dashboard' },
    { label: 'Projects', href: '/projects' },
    { label: 'Project Alpha' },
  ]}
/>
```

**Features**:

- Chevron separators
- Home icon on first item (optional)
- Last item not clickable
- Responsive truncation on mobile

---

### ContentContainer

**Location**: `src/components/layout/ContentContainer.tsx`

**Purpose**: Responsive content wrapper with max-width.

**Props**:

```typescript
interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  noPadding?: boolean; // Remove default padding?
}
```

**Usage**:

```tsx
<ContentContainer maxWidth="xl">
  <YourContent />
</ContentContainer>
```

**Max-Width Values**:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px
- `full`: No constraint

---

## Common Patterns

### Creating a New Page

```tsx
import React from 'react';
import { PageHeader, Card, Button } from '@/components';
import { Plus } from 'lucide-react';

export const MyPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="My Page"
        description="Page description here"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'My Page' }]}
        actions={<Button leftIcon={<Plus />}>New Item</Button>}
      />

      {/* Page content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">{/* Card content */}</Card>
      </div>
    </div>
  );
};

export default MyPage;
```

### Adding a New Navigation Item

**1. Update Sidebar** (`src/components/layout/Sidebar.tsx`):

```tsx
const navigationItems: NavItem[] = [
  // ... existing items
  {
    label: 'New Section',
    icon: Star,
    href: '/new-section',
    badge: '5', // optional
  },
];
```

**2. Update MobileNav** (`src/components/layout/MobileNav.tsx`):

```tsx
// Same array update
const navigationItems: NavItem[] = [
  // ... same items as Sidebar
];
```

**3. Add Route** (in `src/app/router.tsx`):

```tsx
{
  path: 'new-section',
  element: withSuspense(NewSectionPage),
}
```

**4. Create Page** (`src/pages/NewSectionPage.tsx`):

```tsx
export const NewSectionPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="New Section"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'New Section' }]}
      />
      {/* Content */}
    </div>
  );
};

export default NewSectionPage;
```

---

## Styling Guidelines

### Colors

**Primary**: Violet

- Light: `#8b5cf6`
- Default: `#7c3aed`
- Dark: `#6d28d9`

**Neutrals**: Slate

- Background: `bg-slate-50` / `dark:bg-slate-950`
- Surface: `bg-white` / `dark:bg-slate-900`
- Border: `border-slate-200` / `dark:border-slate-800`
- Text: `text-slate-900` / `dark:text-white`
- Muted: `text-slate-600` / `dark:text-slate-400`

### Spacing

**Consistent Units**:

- Padding: `p-4`, `px-6`, `py-3`
- Gaps: `gap-2`, `gap-3`, `gap-4`, `gap-6`
- Margins: `mb-4`, `mt-6`, `mx-auto`

### Border Radius

**Consistent Rounding**:

- Cards: `rounded-lg` (8px)
- Buttons: `rounded-md` (6px)
- Avatars: `rounded-full`
- Inputs: `rounded-lg`

### Transitions

**Standard Duration**: 300ms

```css
transition-all duration-300 ease-in-out
transition-colors duration-200
transition-transform duration-300
```

### Shadows

**Elevation**:

- Cards: `shadow-sm`
- Modals: `shadow-lg`
- Drawers: `shadow-2xl`

---

## Responsive Grid Patterns

### 1-2-3 Column Grid

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{/* Items */}</div>
```

### 1-2 Column Grid

```tsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">{/* Items */}</div>
```

### Flexible Columns

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Items */}
</div>
```

---

## Icon Usage

All icons from `lucide-react`:

```tsx
import { IconName } from 'lucide-react';

<IconName className="h-5 w-5" />;
```

**Common Sizes**:

- Small: `h-4 w-4`
- Medium: `h-5 w-5`
- Large: `h-6 w-6`

---

## Accessibility Checklist

When creating new components:

- [ ] Use semantic HTML (`<nav>`, `<main>`, `<button>`)
- [ ] Add ARIA labels to icon buttons
- [ ] Ensure keyboard navigation works
- [ ] Add visible focus indicators
- [ ] Support Escape key for closing overlays
- [ ] Manage focus properly (trap and return)
- [ ] Use proper heading hierarchy
- [ ] Provide alternative text for images
- [ ] Ensure sufficient color contrast
- [ ] Test with keyboard only
- [ ] Test with screen reader (optional but recommended)

---

## Common Issues & Solutions

### Issue: Component not importing

**Solution**: Check import path, ensure exported from index.ts

### Issue: Styles not applying

**Solution**: Check Tailwind class names, dark mode variants

### Issue: Dark mode not working

**Solution**: Ensure dark: prefix on classes, ThemeContext active

### Issue: Sidebar not responding to resize

**Solution**: Check window resize listener, state updates

### Issue: Focus not trapping in overlay

**Solution**: Ensure tabindex on container, keyboard event handlers

### Issue: Navigation not highlighting active route

**Solution**: Check NavLink usage, isActive callback

---

## Testing Tips

### Responsive Testing

```bash
# Start dev server
npm run dev

# Open DevTools (F12)
# Toggle device toolbar (Ctrl+Shift+M)
# Test each breakpoint: 320, 375, 768, 1024, 1440, 1920
```

### Keyboard Testing

1. Click in browser
2. Press Tab repeatedly
3. Verify all interactive elements reachable
4. Verify focus visible
5. Test Escape on overlays
6. Test Enter/Space on buttons

### Visual Testing

1. Toggle dark mode
2. Check animations are smooth
3. Verify no horizontal scroll
4. Check text readability
5. Verify icon clarity

---

## Performance Tips

### Lazy Loading

Always wrap page components in lazy():

```tsx
const MyPage = lazy(() => import('@/pages/MyPage'));
```

### Event Listener Cleanup

Always cleanup in useEffect:

```tsx
useEffect(() => {
  const handler = () => {
    /* ... */
  };
  window.addEventListener('event', handler);
  return () => window.removeEventListener('event', handler);
}, []);
```

### Avoid Unnecessary Re-renders

- Use useCallback for event handlers passed as props
- Use useMemo for expensive calculations
- Don't define functions inside render

---

## Quick Command Reference

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run format:check     # Check formatting

# Testing
npm run test             # Run tests (if configured)
```

---

## Support & Documentation

- **Main README**: `MILESTONE-05-README.md`
- **Testing Guide**: `MILESTONE-05-TESTING.md`
- **Summary**: `MILESTONE-05-SUMMARY.md`
- **Checklist**: `MILESTONE-05-CHECKLIST.md`
- **This Guide**: `MILESTONE-05-COMPONENT-GUIDE.md`

---

**Happy Coding! 🚀**
