# Design System & UI Specifications

## Brand Identity

**Name:** SkillSwap
**Tagline:** "Teach what you know. Learn what you need."
**Personality:** Trustworthy, energetic, collaborative, youthful but professional
**Audience:** University students, self-learners, bootcamp graduates (18–28)

---

## Color Palette

```
Background:   #0D0D0D (near-black)
Surface:      #141414 (card bg), #1C1C1C (elevated)
Border:       #2A2A2A (default), #3A3A3A (hover)
Accent:       #F59E0B (amber-500) — primary CTA, highlights, tokens
Accent 2:     #10B981 (emerald-500) — success, online status, match score
Text Primary: #F5F5F5
Text Muted:   #737373
Danger:       #EF4444
```

### Usage

- **Amber (#F59E0B)** — Buttons, teaching skills, tokens, primary actions
- **Emerald (#10B981)** — Learning skills, success states, online indicators
- **Red (#EF4444)** — Danger states, cancellations, errors

---

## Typography

```
Display/Headings: "Cabinet Grotesk" or "Syne"
  — Bold, geometric, expressive
  — Font weights: 700 (bold), 800 (extra-bold)
  
Body: "DM Sans" or "Geist"
  — Clean, readable, neutral
  — Font weights: 400 (regular), 500 (medium), 600 (semibold)

Mono (tokens/code): "JetBrains Mono"
  — For token balances, IDs, code blocks
  — Font weight: 500 (medium)
```

### Text Sizes

- **H1 (Display)** — 2.5rem (40px), line-height: 1.2
- **H2 (Page Title)** — 2rem (32px), line-height: 1.25
- **H3 (Section)** — 1.5rem (24px), line-height: 1.33
- **Body (Primary)** — 1rem (16px), line-height: 1.5
- **Body (Small)** — 0.875rem (14px), line-height: 1.43
- **Caption** — 0.75rem (12px), line-height: 1.33

---

## Component System

### Buttons

```tsx
// Primary Button
<button className="px-6 py-3 bg-[#F59E0B] text-black rounded-lg font-semibold hover:brightness-110">
  Get Started
</button>

// Secondary Button
<button className="px-6 py-3 border border-[#F59E0B] text-[#F59E0B] rounded-lg font-semibold hover:bg-[#F59E0B] hover:text-black">
  Learn More
</button>

// Ghost Button
<button className="px-6 py-3 text-[#737373] rounded-lg hover:bg-[#141414]">
  Cancel
</button>

// Danger Button
<button className="px-6 py-3 bg-[#EF4444] text-white rounded-lg hover:brightness-90">
  Delete
</button>
```

**States:**
- **Default:** Full color
- **Hover:** Brightness +10%
- **Active:** Brightness -5%
- **Disabled:** Opacity 50%
- **Focus:** Amber ring (2px) + offset (2px)

---

### Cards

```tsx
// Base Card
<div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
  Content
</div>

// Elevated Card (with hover effect)
<div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-6 hover:shadow-lg hover:shadow-[#F59E0B]/20">
  Content
</div>

// Glass Card (subtle glassmorphism)
<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
  Content
</div>
```

---

### Badges & Pills

```tsx
// Teaching Skill Tag
<span className="inline-block px-3 py-1 bg-[#F59E0B]/15 text-[#F59E0B] rounded-full text-xs font-medium">
  React
</span>

// Learning Skill Tag
<span className="inline-block px-3 py-1 bg-[#10B981]/15 text-[#10B981] rounded-full text-xs font-medium">
  Python
</span>

// Token Badge
<span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F59E0B]/15 text-[#F59E0B] rounded-full text-sm font-mono">
  ◈ 48
</span>
```

---

### Form Inputs

```tsx
<input
  type="text"
  placeholder="Search skills..."
  className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg px-4 py-2 text-[#F5F5F5] placeholder-[#737373] focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
/>
```

**States:**
- **Default:** Border #2A2A2A
- **Focus:** Ring #F59E0B, border transparent
- **Error:** Border #EF4444, error text red
- **Disabled:** Opacity 50%, cursor not-allowed

---

## Spacing System

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

---

## Border Radius

```
sm:  0.375rem (6px)   — small icons, badges
md:  0.5rem (8px)     — form inputs, small cards
lg:  0.75rem (12px)   — standard buttons
xl:  1rem (16px)      — cards
2xl: 1.5rem (24px)    — large modals
full: 9999px          — circular (avatars)
```

---

## Motion & Animations

### Transitions
```css
/* Standard transition */
transition: all 200ms ease-out;

/* Quick interaction */
transition: opacity 150ms ease-in;

/* Smooth state change */
transition: transform 240ms ease;
```

### Keyframe Animations
```css
/* Fade + slide in */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Token count animation */
@keyframes counterUp {
  from { content-visibility: auto; }
  to { content-visibility: visible; }
}

/* Pulse (live indicator) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Common Animations
- **Page transitions:** Fade + 2px upward slide (200ms)
- **Hover lift:** `transform: translateY(-4px)` (200ms)
- **Button press:** `scale(0.95)` (100ms)
- **Modal appear:** `scale(0.95)` → `scale(1)` + fade (150ms)
- **Notification slide:** Slide from top-right, auto-dismiss 4s

---

## Responsive Breakpoints

```
Mobile:   < 768px    (single column, bottom nav)
Tablet:   768–1279px (collapsed sidebar, 2-col grid)
Desktop:  1280px+    (full sidebar, multi-column)
```

### Mobile-first Layout
- **Hero:** Full viewport, centered text
- **Cards:** Stack vertically, full width
- **Grid:** 1 column on mobile, 2+ on tablet/desktop
- **Sidebar:** Slide-out drawer on mobile

---

## Accessibility (WCAG 2.1 AA)

✅ **Contrast Ratios**
- Text on bg: 7:1+ (AAA)
- UI components: 4.5:1+ (AA)

✅ **Focus States**
- All interactive elements: 2px amber ring
- Keyboard navigable (Tab/Shift+Tab)
- Skip links on pages

✅ **Semantic HTML**
```html
<nav>Navigation</nav>
<main>Main content</main>
<section>Section</section>
<article>Article</article>
```

✅ **ARIA Labels**
```html
<button aria-label="Close dialog">×</button>
<span role="status" aria-live="polite">3 new matches</span>
```

✅ **Reduced Motion**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Icon System

Use **Heroicons** or **Radix Icons** (consistent, accessible):

```tsx
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

<MagnifyingGlassIcon className="w-5 h-5 text-[#737373]" />
```

**Icon sizes:**
- xs: 16px (w-4 h-4)
- sm: 20px (w-5 h-5)
- md: 24px (w-6 h-6)
- lg: 32px (w-8 h-8)

---

## Dark Mode (Default)

SkillSwap ships **dark-first**. Light mode is optional (Phase 2).

```tsx
// Tailwind config
darkMode: 'class'

// HTML root
<html className="dark">
```

---

## Component Library

All components live in `apps/web/components/ui/`:

- `Button.tsx` — All button variants
- `Card.tsx` — Card variants (base, elevated, glass)
- `Badge.tsx` — Skill tags, token badges
- `Input.tsx` — Form input with validation
- `Select.tsx` — Dropdown menu
- `Modal.tsx` — Dialog box with animation
- `Tooltip.tsx` — Hover tooltips
- `Toast.tsx` — Notifications
- `Avatar.tsx` — User avatars with status dot

---

For implementation details, see component stubs in `apps/web/components/`.
