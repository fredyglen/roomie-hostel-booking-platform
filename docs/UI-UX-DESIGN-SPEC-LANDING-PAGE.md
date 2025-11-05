# ROOMie Landing Page - UI/UX Design Specification
## Inspired by Bolt.eu and Modern Landing Page Best Practices

**Document Version:** 1.0  
**Date:** November 2, 2025  
**Target:** ROOMie Student Housing Platform  
**Brand Colors:** Primary #007BFF, Accent #00D9FF, Background #F2F2F7  
**Typography:** Work Sans Light (300) for body, Manrope Bold (700) for headings

---

## Executive Summary

This document provides a comprehensive redesign specification for the ROOMie landing page, transforming it from a basic, static layout into a modern, interactive, and highly engaging experience. The design draws inspiration from industry leaders like Bolt.eu while maintaining ROOMie's unique brand identity.

**Key Problems with Current Landing Page:**
- ❌ Static, lifeless design with no scroll animations
- ❌ Flat white background throughout (boring, unprofessional)
- ❌ Poor visual hierarchy and spacing
- ❌ No depth or layering (no shadows, gradients, or elevation)
- ❌ Weak typography contrast
- ❌ No interactive hover states or micro-animations
- ❌ Images lack treatment (no overlays, zoom effects, or parallax)
- ❌ Sections blend together with no clear separation
- ❌ Mobile-first but not optimized for desktop experience

---

## 1. LAYOUT & STRUCTURE

### 1.1 Hero Section (Full-Screen Impact)

**Desktop (≥1024px):**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                                    [Nav Links] [CTA] │ ← Transparent/Glass
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                                                               │
│         [Headline - 64px Bold]                                │
│         [Subheadline - 20px Light]                            │
│                                                               │
│         [Primary CTA] [Secondary CTA]                         │
│                                                               │
│                                                               │
│                                                               │
│                    [Background: Large Image with              │
│                     Gradient Overlay + Parallax Effect]       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
Height: 100vh (full viewport)
Padding: 120px horizontal, 80px vertical
```

**Mobile (≤768px):**
```
┌───────────────────────┐
│ [Logo]         [Menu] │
├───────────────────────┤
│                       │
│  [Headline - 36px]    │
│  [Subheadline - 16px] │
│                       │
│  [Primary CTA]        │
│  [Secondary CTA]      │
│                       │
│  [Background Image]   │
│                       │
└───────────────────────┘
Height: 90vh
Padding: 24px horizontal, 40px vertical
```

**Key Specifications:**
- **Background Image:** 
  - Desktop: 1920x1080px minimum
  - Mobile: 768x1024px minimum
  - Gradient overlay: `linear-gradient(135deg, rgba(0,123,255,0.85) 0%, rgba(0,217,255,0.65) 100%)`
  - Parallax scroll speed: 0.5x (image moves slower than content)
  
- **Typography:**
  - Headline: Manrope Bold, 64px/72px (desktop), 36px/44px (mobile)
  - Subheadline: Work Sans Light, 20px/32px (desktop), 16px/26px (mobile)
  - Letter spacing: -0.02em for headlines
  
- **CTAs:**
  - Primary: 56px height, 32px horizontal padding, #007BFF background
  - Secondary: 56px height, 32px horizontal padding, white background with #007BFF border
  - Border radius: 12px
  - Font: Manrope Semi-Bold, 16px
  - Hover: Scale 1.02, shadow elevation increase

### 1.2 Section Ordering & Spacing

**Recommended Flow:**
1. **Hero** (100vh) - Full-screen impact
2. **Trust Indicators** (auto height) - Logo carousel, stats
3. **Problem/Solution** (auto height) - Pain points → ROOMie solution
4. **Features Grid** (auto height) - 3-column on desktop, 1-column mobile
5. **How It Works** (auto height) - Step-by-step with illustrations
6. **Social Proof** (auto height) - Testimonials, reviews
7. **University Selector** (auto height) - Interactive search
8. **Pricing Transparency** (auto height) - Clear breakdown
9. **Final CTA** (60vh) - Strong conversion push
10. **Footer** (auto height) - Links, legal, social

**Vertical Spacing System:**
- Section padding: 120px top/bottom (desktop), 80px (mobile)
- Component gaps: 64px (desktop), 40px (mobile)
- Element gaps: 24px (desktop), 16px (mobile)

### 1.3 Grid System

**Desktop (≥1024px):**
- Max width: 1280px
- Columns: 12-column grid
- Gutter: 32px
- Margin: 80px (sides)

**Tablet (768px - 1023px):**
- Max width: 100%
- Columns: 8-column grid
- Gutter: 24px
- Margin: 40px (sides)

**Mobile (≤767px):**
- Max width: 100%
- Columns: 4-column grid
- Gutter: 16px
- Margin: 24px (sides)

---

## 2. INTERACTIVE ELEMENTS

### 2.1 Scroll-Triggered Animations

**Fade-In on Scroll:**
```javascript
// Trigger when element is 20% visible
{
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 }
}
```

**Slide-In from Left/Right:**
```javascript
// Alternate directions for visual interest
{
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  viewport: { once: true, amount: 0.3 }
}
```

**Stagger Children:**
```javascript
// For feature grids, card lists
{
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
}
```

**Scale on Scroll:**
```javascript
// For images, cards
{
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
}
```

### 2.2 Image Zoom Effects

**Hover Zoom (Cards):**
```css
.card-image {
  transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  transform-origin: center;
}

.card:hover .card-image {
  transform: scale(1.08);
}
```

**Parallax Zoom on Scroll:**
```javascript
// Image scales up as user scrolls down
const { scrollYProgress } = useScroll();
const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

<motion.img style={{ scale }} />
```

### 2.3 Hover States & Transitions

**Buttons:**
```css
.button-primary {
  background: #007BFF;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.button-primary:hover {
  background: #0056D6;
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.4);
  transform: translateY(-2px);
}

.button-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}
```

**Cards:**
```css
.feature-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}
```

**Links:**
```css
.nav-link {
  position: relative;
  color: #1C1C1E;
  transition: color 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #007BFF;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
```

### 2.4 Micro-Animations

**Icon Bounce on Hover:**
```javascript
<motion.div
  whileHover={{ y: -4 }}
  transition={{ type: "spring", stiffness: 400, damping: 10 }}
>
  <Icon />
</motion.div>
```

**Button Ripple Effect:**
```javascript
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.1 }}
>
  Click Me
</motion.button>
```

**Counter Animation:**
```javascript
// For stats (e.g., "10,000+ Students")
<motion.span
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 1 }}
>
  {useCountUp(0, 10000, 2000)} {/* from, to, duration */}
</motion.span>
```

### 2.5 Navigation Behavior

**Sticky Header with Scroll:**
```javascript
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Apply classes based on scroll state
className={`
  fixed top-0 w-full z-50 transition-all duration-300
  ${scrolled 
    ? 'bg-white/95 backdrop-blur-md shadow-md py-4' 
    : 'bg-transparent py-6'
  }
`}
```

**Mobile Menu Animation:**
```javascript
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: isOpen ? 0 : '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
  className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl"
>
  {/* Menu content */}
</motion.div>
```

---

## 3. VISUAL DESIGN

### 3.1 Typography Hierarchy

**Headings:**
```
H1 (Hero): Manrope Bold, 64px/72px, -0.02em, #1C1C1E
H2 (Section): Manrope Bold, 48px/56px, -0.01em, #1C1C1E
H3 (Subsection): Manrope Bold, 32px/40px, -0.01em, #1C1C1E
H4 (Card Title): Manrope Semi-Bold, 24px/32px, 0em, #1C1C1E
H5 (Small Title): Manrope Semi-Bold, 20px/28px, 0em, #3A3A3C
H6 (Label): Manrope Semi-Bold, 16px/24px, 0em, #3A3A3C
```

**Body Text:**
```
Large: Work Sans Light, 20px/32px, 0em, #3A3A3C
Regular: Work Sans Light, 16px/26px, 0em, #3A3A3C
Small: Work Sans Light, 14px/22px, 0em, #8E8E93
Caption: Work Sans Light, 12px/18px, 0em, #8E8E93
```

**Buttons & CTAs:**
```
Primary: Manrope Semi-Bold, 16px/24px, 0em, white
Secondary: Manrope Semi-Bold, 16px/24px, 0em, #007BFF
Tertiary: Manrope Medium, 14px/20px, 0em, #007BFF
```

### 3.2 Color Palette

**Primary Colors:**
```
Primary Blue: #007BFF
  - Hover: #0056D6
  - Active: #004BB5
  - Light: rgba(0, 123, 255, 0.1)
  - Lighter: rgba(0, 123, 255, 0.05)

Accent Cyan: #00D9FF
  - Hover: #00B8D9
  - Active: #0097B2
  - Light: rgba(0, 217, 255, 0.1)
```

**Neutral Colors:**
```
Dark: #1C1C1E (headings, primary text)
Gray Dark: #3A3A3C (body text)
Gray: #8E8E93 (secondary text)
Gray Light: #C7C7CC (borders, dividers)
Background: #F2F2F7 (page background)
Card: #FFFFFF (card backgrounds)
```

**Semantic Colors:**
```
Success: #00C853
Warning: #FF9500
Error: #FF3B30
Info: #007BFF
```

### 3.3 Image Treatment

**Aspect Ratios:**
```
Hero: 16:9 (desktop), 4:3 (mobile)
Feature Cards: 4:3
Testimonial Avatars: 1:1 (circular)
University Logos: 3:2 (contained)
Property Images: 16:9
```

**Overlays:**
```css
/* Dark gradient for text readability */
.hero-overlay {
  background: linear-gradient(
    135deg,
    rgba(0, 123, 255, 0.85) 0%,
    rgba(0, 217, 255, 0.65) 100%
  );
}

/* Subtle overlay for cards */
.card-overlay {
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
}
```

**Filters:**
```css
/* Slightly desaturated for consistency */
.image-filter {
  filter: saturate(0.9) brightness(1.05);
}

/* Hover effect */
.image-filter:hover {
  filter: saturate(1) brightness(1.1);
}
```

### 3.4 Spacing System

**Padding Scale:**
```
xs: 8px
sm: 16px
md: 24px
lg: 32px
xl: 48px
2xl: 64px
3xl: 80px
4xl: 120px
```

**Margin Scale:**
```
xs: 8px
sm: 16px
md: 24px
lg: 40px
xl: 64px
2xl: 96px
3xl: 128px
```

**Gap Scale:**
```
xs: 8px
sm: 12px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

### 3.5 Border Radius & Shadows

**Border Radius:**
```
sm: 8px (small elements, tags)
md: 12px (buttons, inputs)
lg: 16px (cards, containers)
xl: 24px (large sections)
2xl: 32px (hero sections)
full: 9999px (circular elements)
```

**Box Shadows:**
```css
/* Elevation levels */
.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.shadow-md {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.shadow-lg {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.shadow-xl {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

/* Colored shadows for CTAs */
.shadow-primary {
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.3);
}

.shadow-primary-hover {
  box-shadow: 0 12px 32px rgba(0, 123, 255, 0.4);
}
```

---

## 4. RESPONSIVE BEHAVIOR

### 4.1 Image Scaling & Cropping

**Hero Background:**
```css
/* Desktop: Full width, centered */
@media (min-width: 1024px) {
  .hero-bg {
    object-fit: cover;
    object-position: center;
    width: 100%;
    height: 100vh;
  }
}

/* Mobile: Crop to focus on subject */
@media (max-width: 767px) {
  .hero-bg {
    object-fit: cover;
    object-position: center 30%; /* Focus on upper portion */
    width: 100%;
    height: 90vh;
  }
}
```

**Card Images:**
```css
/* Maintain aspect ratio, crop excess */
.card-image {
  aspect-ratio: 4 / 3;
  object-fit: cover;
  object-position: center;
  width: 100%;
}
```

### 4.2 Text Size Adjustments

**Fluid Typography:**
```css
/* Scales smoothly between breakpoints */
h1 {
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.2;
}

h2 {
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1.25;
}

p {
  font-size: clamp(14px, 2vw, 16px);
  line-height: 1.6;
}
```

### 4.3 Component Reordering

**Desktop (3-column):**
```
┌─────────┬─────────┬─────────┐
│ Feature │ Feature │ Feature │
│    1    │    2    │    3    │
└─────────┴─────────┴─────────┘
```

**Tablet (2-column):**
```
┌─────────┬─────────┐
│ Feature │ Feature │
│    1    │    2    │
├─────────┴─────────┤
│     Feature 3     │
└───────────────────┘
```

**Mobile (1-column):**
```
┌───────────────────┐
│     Feature 1     │
├───────────────────┤
│     Feature 2     │
├───────────────────┤
│     Feature 3     │
└───────────────────┘
```

### 4.4 Touch vs Hover Interactions

**Desktop (Hover):**
- Hover states on all interactive elements
- Cursor changes (pointer, grab, etc.)
- Tooltips on hover
- Smooth transitions (0.3s)

**Mobile (Touch):**
- Active states on tap
- No hover effects (use :active instead)
- Larger touch targets (min 44x44px)
- Haptic feedback where supported
- Swipe gestures for carousels

---

## 5. TECHNICAL IMPLEMENTATION

### 5.1 CSS Techniques

**Transforms:**
```css
/* Hardware-accelerated animations */
.animated-element {
  transform: translateZ(0);
  will-change: transform;
}

/* Smooth scale */
.scale-hover:hover {
  transform: scale(1.05) translateZ(0);
}

/* 3D rotation */
.card-3d {
  transform-style: preserve-3d;
  perspective: 1000px;
}
```

**Transitions:**
```css
/* Smooth easing */
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* Staggered transitions */
.stagger-item:nth-child(1) { transition-delay: 0ms; }
.stagger-item:nth-child(2) { transition-delay: 100ms; }
.stagger-item:nth-child(3) { transition-delay: 200ms; }
```

**Animations:**
```css
/* Fade in from bottom */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Infinite pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

### 5.2 JavaScript Libraries

**Recommended Stack:**
```json
{
  "framer-motion": "^10.16.4",  // Scroll animations, gestures
  "react-intersection-observer": "^9.5.2",  // Viewport detection
  "react-countup": "^6.4.2",  // Number animations
  "swiper": "^11.0.5",  // Touch-enabled carousels
  "lottie-react": "^2.4.0"  // Animated illustrations
}
```

**Framer Motion Setup:**
```javascript
import { motion, useScroll, useTransform } from 'framer-motion';

// Scroll-triggered fade-in
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true, amount: 0.2 }}
>
  {content}
</motion.div>

// Parallax effect
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

<motion.div style={{ y }}>
  {content}
</motion.div>
```

### 5.3 Image Lazy Loading

**Native Lazy Loading:**
```jsx
<img
  src="image.jpg"
  alt="Description"
  loading="lazy"
  decoding="async"
/>
```

**Intersection Observer:**
```javascript
const [ref, inView] = useInView({
  triggerOnce: true,
  threshold: 0.1,
});

<div ref={ref}>
  {inView && <img src="image.jpg" alt="Description" />}
</div>
```

### 5.4 Performance Optimization

**Image Optimization:**
- Use WebP format with JPEG fallback
- Serve responsive images with `srcset`
- Compress images (80-85% quality)
- Use CDN for faster delivery

**Code Splitting:**
```javascript
// Lazy load heavy components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

**Reduce Layout Shift:**
```css
/* Reserve space for images */
.image-container {
  aspect-ratio: 16 / 9;
  background: #F2F2F7;
}
```

---

## 6. IMPLEMENTATION PRIORITY

### Phase 1: Foundation (Week 1)
1. ✅ Update color scheme (#007BFF, #00D9FF)
2. ✅ Apply typography system (Work Sans Light, Manrope Bold)
3. ✅ Implement spacing system
4. ✅ Add box shadows and border radius

### Phase 2: Interactivity (Week 2)
1. 🔄 Install Framer Motion
2. 🔄 Add scroll-triggered fade-ins
3. 🔄 Implement hover states
4. 🔄 Add micro-animations

### Phase 3: Visual Polish (Week 3)
1. ⏳ Redesign hero section with parallax
2. ⏳ Add image zoom effects
3. ⏳ Implement gradient overlays
4. ⏳ Create animated illustrations

### Phase 4: Optimization (Week 4)
1. ⏳ Optimize images (WebP, lazy loading)
2. ⏳ Code splitting
3. ⏳ Performance audit
4. ⏳ Cross-browser testing

---

## 7. NEXT STEPS

1. **Review this specification** with the team
2. **Create mockups** in Figma based on this spec
3. **Implement Phase 1** (foundation) first
4. **Test on real devices** (mobile, tablet, desktop)
5. **Iterate based on user feedback**

---

**Document End**

