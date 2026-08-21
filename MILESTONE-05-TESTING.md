# Milestone 05 — Responsive Dashboard Shell Testing Guide

## Overview

This document provides comprehensive testing instructions for the PulseBoard responsive dashboard shell.

## Components Created

### Layout Components

1. **DashboardLayout** - Main layout wrapper with responsive behavior
2. **TopNavigation** - Fixed header with branding, search, notifications, and user menu
3. **Sidebar** - Desktop/tablet persistent navigation sidebar
4. **MobileNav** - Mobile drawer navigation
5. **UserMenu** - Dropdown menu with user profile and actions
6. **NotificationButton** - Notification center with badge
7. **PageHeader** - Reusable page header with breadcrumbs
8. **Breadcrumb** - Navigation breadcrumb component
9. **ContentContainer** - Responsive content wrapper

### Demo Pages

- **DashboardPage** - Sample dashboard with cards and stats
- **AnalyticsPage** - Sample analytics page
- **ProjectsPage** - Sample projects listing

## Responsive Breakpoints Testing

### 1. Mobile - 320px (iPhone SE)

**Expected Behavior:**

- ✓ Sidebar hidden, accessible via hamburger menu
- ✓ Mobile drawer navigation opens from left
- ✓ Compact header with menu button and logo
- ✓ Search icon visible, text input hidden
- ✓ Notification bell and user avatar visible
- ✓ User name hidden on small screens
- ✓ Single column layout for content
- ✓ No horizontal scrolling
- ✓ Touch-friendly tap targets (min 44px)

**Test Steps:**

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone SE" or set to 320px width
4. Click hamburger menu - drawer should slide in from left
5. Click backdrop - drawer should close
6. Press Escape - drawer should close
7. Navigate between pages - drawer should close on selection
8. Verify all content is readable without zooming
9. Check no horizontal overflow occurs

### 2. Mobile - 375px (iPhone 12/13/14)

**Expected Behavior:**

- ✓ Same as 320px with slightly more comfortable spacing
- ✓ User name still hidden
- ✓ All interactive elements easily tappable

**Test Steps:**

1. Set viewport to 375px width
2. Repeat 320px tests
3. Verify improved spacing and readability

### 3. Tablet - 768px (iPad)

**Expected Behavior:**

- ✓ Sidebar becomes collapsible with backdrop
- ✓ Sidebar can toggle open/closed
- ✓ User name visible in header user menu
- ✓ Two-column grid layouts start appearing
- ✓ Search input visible in header
- ✓ More comfortable spacing throughout

**Test Steps:**

1. Set viewport to 768px width
2. Toggle sidebar - should overlay with backdrop
3. Click backdrop - sidebar should close
4. Verify sidebar opens with animation
5. Test navigation - sidebar should close on page change
6. Verify search input is functional
7. Check content grid displays 2 columns

### 4. Desktop - 1024px (Laptop)

**Expected Behavior:**

- ✓ Persistent sidebar always visible
- ✓ No mobile drawer behavior
- ✓ Sidebar toggle changes content area width
- ✓ Full desktop navigation experience
- ✓ Three-column grid layouts
- ✓ All header elements visible

**Test Steps:**

1. Set viewport to 1024px width
2. Verify sidebar is always visible
3. Toggle sidebar - content should reflow smoothly
4. No backdrop should appear
5. Verify 3-column grid layouts
6. Test all navigation links
7. Verify smooth transitions

### 5. Desktop - 1440px (Standard Monitor)

**Expected Behavior:**

- ✓ Optimal viewing experience
- ✓ Full sidebar with descriptions
- ✓ Maximum content width applied
- ✓ Comfortable whitespace
- ✓ All features fully accessible

**Test Steps:**

1. Set viewport to 1440px width
2. Verify optimal layout spacing
3. Content should be centered with max-width
4. All elements properly sized
5. Typography comfortable to read

### 6. Desktop - 1920px (Large Monitor)

**Expected Behavior:**

- ✓ Content constrained to max-width
- ✓ No excessive stretching
- ✓ Centered layout with balanced margins
- ✓ Same as 1440px but with more margin space

**Test Steps:**

1. Set viewport to 1920px width
2. Verify content doesn't stretch too wide
3. Margins balanced on both sides
4. All components maintain readability

## Keyboard Accessibility Testing

### General Keyboard Navigation

**Test Steps:**

1. Press `Tab` to navigate through interactive elements
2. Verify focus ring is visible on all focusable elements
3. Press `Shift+Tab` to navigate backwards
4. Verify logical tab order (left to right, top to bottom)

### Sidebar Navigation

**Test Steps:**

1. Tab to hamburger menu button
2. Press `Enter` or `Space` to open sidebar
3. Tab through navigation links
4. Press `Enter` to activate a link
5. Press `Escape` to close sidebar (mobile/tablet)
6. Focus should return to menu button

### User Menu

**Test Steps:**

1. Tab to user menu button
2. Press `Enter` or `Space` to open menu
3. Use `Arrow Down/Up` to navigate menu items
4. Press `Enter` to select an item
5. Press `Escape` to close menu
6. Focus should return to user menu button

### Notification Menu

**Test Steps:**

1. Tab to notification bell
2. Press `Enter` to open notifications
3. Tab through notification actions
4. Press `Enter` to mark as read or delete
5. Press `Escape` to close
6. Focus returns to notification bell

### Search Trigger

**Test Steps:**

1. Tab to search button
2. Press `Enter` to activate search
3. Verify search functionality (placeholder in current implementation)

## Focus Management Testing

### Modal/Overlay Focus Trap

**Test Steps:**

1. Open mobile navigation drawer
2. Tab through - focus should stay within drawer
3. Cannot tab to elements behind drawer
4. Close drawer - focus returns to trigger

### Menu Focus Management

**Test Steps:**

1. Open user menu
2. Focus should move to first menu item
3. Tab cycles through menu items only
4. Escape closes and returns focus
5. Clicking outside closes menu

## Screen Reader Testing (Optional)

### Landmarks

**Verify:**

- ✓ Main navigation marked as `<nav>`
- ✓ Main content marked as `<main>`
- ✓ Header marked as `<header>`
- ✓ Appropriate ARIA labels on buttons

### Interactive Elements

**Verify:**

- ✓ Hamburger menu has descriptive label
- ✓ User menu has aria-expanded state
- ✓ Notification count announced
- ✓ Breadcrumb navigation announced

## Visual Testing

### Transitions & Animations

**Test:**

- ✓ Sidebar slide-in/out is smooth (300ms)
- ✓ Mobile drawer animates from left
- ✓ Dropdown menus fade in
- ✓ No janky or choppy animations
- ✓ Reduced motion respected (if enabled in OS)

### Dark Mode

**Test Steps:**

1. Click theme toggle in top navigation
2. Verify all components switch themes
3. Check contrast ratios are sufficient
4. Verify icons and text are readable
5. No bright flashes during transition

### No Horizontal Overflow

**Test at each breakpoint:**

1. Open DevTools
2. Check for horizontal scrollbar
3. Inspect elements extending beyond viewport
4. Verify `overflow-x: hidden` where needed

## Functional Testing

### Navigation Flow

**Test Steps:**

1. Click each sidebar link
2. Verify correct page loads
3. Check breadcrumb updates
4. Verify active state highlights correct link
5. Browser back button works correctly

### User Menu Actions

**Test:**

1. View Profile - navigates to /profile
2. Settings - navigates to /settings
3. Help & Support - navigates to /help
4. Log Out - calls logout and redirects to /login

### Notifications

**Test:**

1. Click notification bell
2. Verify unread count badge
3. Click "Mark as read" - removes indicator
4. Click "Mark all as read" - clears all badges
5. Delete notification - removes from list
6. "View all" - navigates to notifications page

### Search (Placeholder)

**Test:**

1. Click search icon
2. Verify console log (placeholder functionality)
3. In future: should open command palette/search modal

## Edge Cases & Error Handling

### Long Content

**Test:**

1. User with very long name - should truncate with ellipsis
2. Many notifications - should scroll within panel
3. Long breadcrumb - should truncate on mobile

### Empty States

**Test:**

1. No notifications - verify empty state message
2. Shows friendly icon and text

### Network Conditions

**Test:**

1. Slow connection - verify loading states
2. Offline - verify cached shell still renders

## Browser Testing

**Test in:**

- ✓ Chrome/Edge (Chromium)
- ✓ Firefox
- ✓ Safari (if available)
- ✓ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Testing

### Metrics to Check

- ✓ First paint < 1s
- ✓ Interactive < 2s
- ✓ No layout shift (CLS)
- ✓ Smooth 60fps animations

### Bundle Size

- Check dist/ files after build
- Main bundle should be reasonable (<350KB as per build output)

## Known Limitations

1. **Search** - Currently placeholder, logs to console
2. **Notifications** - Mock data, not connected to backend
3. **Theme** - Uses existing ThemeToggle, should persist
4. **Routing** - Some routes may show placeholder pages

## Success Criteria Summary

- ✅ Responsive from 320px to 1920px
- ✅ No horizontal overflow at any breakpoint
- ✅ Keyboard accessible
- ✅ Focus management works correctly
- ✅ Smooth transitions and animations
- ✅ Mobile drawer navigation
- ✅ Collapsible sidebar on tablet
- ✅ Persistent sidebar on desktop
- ✅ All interactive elements functional
- ✅ ARIA labels and semantic HTML
- ✅ Dark mode support
- ✅ Build completes without errors
- ✅ TypeScript strict mode passes

## Running the Tests

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Responsive Testing

1. Open http://localhost:5173 (or preview URL)
2. Use DevTools Responsive Design Mode
3. Test each breakpoint systematically
4. Use physical devices if available

## Issues Found During Testing

_Document any issues discovered here during manual testing_

---

## Test Checklist

### 320px Mobile

- [ ] Sidebar hidden by default
- [ ] Mobile drawer opens/closes correctly
- [ ] No horizontal scroll
- [ ] All tap targets ≥ 44px
- [ ] Content readable without zoom

### 375px Mobile

- [ ] Same as 320px tests pass
- [ ] Improved spacing

### 768px Tablet

- [ ] Collapsible sidebar with backdrop
- [ ] Search input visible
- [ ] 2-column grids
- [ ] Sidebar animations smooth

### 1024px Desktop

- [ ] Persistent sidebar
- [ ] No backdrop on toggle
- [ ] 3-column grids
- [ ] Content reflows on sidebar toggle

### 1440px Desktop

- [ ] Optimal layout
- [ ] Max-width applied
- [ ] Comfortable spacing

### 1920px Wide Desktop

- [ ] Content constrained
- [ ] Centered with margins
- [ ] No excessive stretching

### Keyboard Accessibility

- [ ] All elements reachable via Tab
- [ ] Focus rings visible
- [ ] Escape closes overlays
- [ ] Focus returns after closing
- [ ] Logical tab order

### Focus Management

- [ ] Mobile drawer traps focus
- [ ] Menus trap focus
- [ ] Focus returns on close

### Functionality

- [ ] Navigation works
- [ ] User menu actions work
- [ ] Notifications interact correctly
- [ ] Theme toggle works
- [ ] Breadcrumbs update
- [ ] Active states highlight

### Visual

- [ ] Smooth animations
- [ ] Dark mode works
- [ ] No horizontal overflow
- [ ] No layout shifts
- [ ] Proper contrast ratios

---

**Testing Date:** _____________________
**Tester:** _____________________
**Build Version:** _____________________
**Notes:** _____________________
