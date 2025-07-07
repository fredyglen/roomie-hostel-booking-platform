# 🎨 ROOMi Design System

**Welcome to the ROOMi Design System!** This is your complete guide to ROOMi's visual identity, brand guidelines, and design standards.

---

## 🎯 **DESIGN SYSTEM OVERVIEW**

The ROOMi Design System ensures consistent, professional, and accessible design across all platform touchpoints - from web app to marketing materials.

### **Design Principles**
1. **🏠 Student-Centric**: Designed for Ghana university students
2. **📱 Mobile-First**: Optimized for mobile devices
3. **🌍 Culturally Relevant**: Reflects Ghanaian culture and preferences
4. **♿ Accessible**: WCAG 2.1 AA compliant
5. **⚡ Performance**: Fast loading and efficient

---

## 🎨 **BRAND COLORS**

### **Primary Colors**
```css
/* ROOMi Brand Blue */
--roomi-primary: #2563eb;        /* Main brand color */
--roomi-primary-dark: #1d4ed8;   /* Hover states */
--roomi-primary-light: #3b82f6;  /* Light accents */

/* ROOMi Gold (Ghana Heritage) */
--roomi-gold: #f59e0b;           /* Accent color */
--roomi-gold-dark: #d97706;      /* Hover states */
--roomi-gold-light: #fbbf24;     /* Light accents */
```

### **Neutral Colors**
```css
/* Grays */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### **Semantic Colors**
```css
/* Success (Booking Confirmed) */
--success: #10b981;
--success-light: #34d399;
--success-dark: #059669;

/* Warning (Payment Pending) */
--warning: #f59e0b;
--warning-light: #fbbf24;
--warning-dark: #d97706;

/* Error (Booking Failed) */
--error: #ef4444;
--error-light: #f87171;
--error-dark: #dc2626;

/* Info (General Information) */
--info: #3b82f6;
--info-light: #60a5fa;
--info-dark: #2563eb;
```

---

## 📝 **TYPOGRAPHY**

### **Font Family**
```css
/* Primary Font - Inter (Clean, Modern) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Fallback for Local Systems */
font-family: system-ui, -apple-system, sans-serif;
```

### **Font Sizes & Hierarchy**
```css
/* Headings */
--text-xs: 0.75rem;     /* 12px - Small labels */
--text-sm: 0.875rem;    /* 14px - Body text */
--text-base: 1rem;      /* 16px - Default */
--text-lg: 1.125rem;    /* 18px - Large body */
--text-xl: 1.25rem;     /* 20px - H4 */
--text-2xl: 1.5rem;     /* 24px - H3 */
--text-3xl: 1.875rem;   /* 30px - H2 */
--text-4xl: 2.25rem;    /* 36px - H1 */
--text-5xl: 3rem;       /* 48px - Hero titles */
```

### **Font Weights**
```css
--font-light: 300;      /* Light text */
--font-normal: 400;     /* Body text */
--font-medium: 500;     /* Emphasis */
--font-semibold: 600;   /* Headings */
--font-bold: 700;       /* Strong emphasis */
```

---

## 📐 **SPACING & LAYOUT**

### **Spacing Scale**
```css
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
```

### **Border Radius**
```css
--radius-sm: 0.125rem;  /* 2px - Small elements */
--radius: 0.25rem;      /* 4px - Default */
--radius-md: 0.375rem;  /* 6px - Cards */
--radius-lg: 0.5rem;    /* 8px - Large cards */
--radius-xl: 0.75rem;   /* 12px - Modals */
--radius-full: 9999px;  /* Full circle */
```

### **Shadows**
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

---

## 🧩 **COMPONENT GUIDELINES**

### **Buttons**
```css
/* Primary Button */
.btn-primary {
  background: var(--roomi-primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius);
  font-weight: var(--font-medium);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--roomi-primary);
  border: 1px solid var(--roomi-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius);
}
```

### **Cards**
```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: var(--space-6);
  border: 1px solid var(--gray-200);
}
```

### **Forms**
```css
.input {
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  padding: var(--space-3);
  font-size: var(--text-base);
  transition: border-color 0.2s;
}

.input:focus {
  border-color: var(--roomi-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
}
```

---

## 📱 **RESPONSIVE BREAKPOINTS**

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### **Usage Example**
```css
/* Mobile first (default) */
.container {
  padding: var(--space-4);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--space-8);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: var(--space-12);
  }
}
```

---

## 🎯 **ACCESSIBILITY GUIDELINES**

### **Color Contrast**
- **Text on Background**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio
- **Interactive Elements**: Minimum 3:1 ratio

### **Focus States**
```css
.focusable:focus {
  outline: 2px solid var(--roomi-primary);
  outline-offset: 2px;
}
```

### **Screen Reader Support**
- Use semantic HTML elements
- Provide alt text for images
- Include ARIA labels for complex interactions

---

## 🖼️ **IMAGE GUIDELINES**

### **Property Photos**
- **Aspect Ratio**: 16:9 for hero images, 4:3 for thumbnails
- **Resolution**: Minimum 1200x675px for hero images
- **Format**: WebP preferred, JPEG fallback
- **Compression**: Optimize for web (< 200KB per image)

### **Profile Photos**
- **Aspect Ratio**: 1:1 (square)
- **Resolution**: 400x400px minimum
- **Format**: WebP preferred, JPEG fallback

### **Icons**
- **Format**: SVG preferred for scalability
- **Size**: 24x24px default, 16x16px small, 32x32px large
- **Style**: Outline style, 2px stroke width

---

## 📋 **BRAND VOICE & TONE**

### **Voice Characteristics**
- **Friendly**: Approachable and welcoming
- **Professional**: Trustworthy and reliable
- **Helpful**: Solution-oriented and supportive
- **Local**: Understanding of Ghanaian culture

### **Tone Guidelines**
- **For Students**: Casual, encouraging, empathetic
- **For Property Owners**: Professional, respectful, business-focused
- **For Agents**: Collaborative, opportunity-focused
- **Error Messages**: Helpful, not blaming, solution-oriented

---

## 🔧 **IMPLEMENTATION**

### **CSS Custom Properties**
All design tokens are available as CSS custom properties. Import the design system:

```css
@import './design-system/tokens.css';
```

### **Tailwind Configuration**
Design tokens are integrated into Tailwind CSS configuration:

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        'roomi-primary': 'var(--roomi-primary)',
        'roomi-gold': 'var(--roomi-gold)',
        // ... other tokens
      }
    }
  }
}
```

---

## 📞 **DESIGN SUPPORT**

- **Design Questions**: Contact design team
- **Implementation Help**: Check component documentation
- **Brand Guidelines**: Review this design system
- **Asset Requests**: Submit through project management

---

**Last Updated**: 2025-01-06  
**Design System Version**: 1.0  
**Maintained By**: ROOMi Design Team
