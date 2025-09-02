# 🎨 Property Card Overlay System

## Overview

The Property Card Overlay System is a **production-grade, mobile-first** solution for displaying real-time information on property card cover images. Designed with Apple-level polish and optimized for the Ghana hostel market.

## 🚀 Key Features

### ✅ Real-Time Information Display
- **Live bed availability** with color-coded status indicators
- **Occupancy rates** and urgency levels (filling up, full)
- **Real-time updates** via WebSocket subscriptions
- **Automatic refresh** every 30 seconds

### ✅ Mobile-First Design
- **Responsive overlays** that adapt to different screen sizes
- **Touch-optimized** interactions and button sizing
- **Performance optimized** for mobile devices
- **Accessibility compliant** with high contrast and readable text

### ✅ Multiple Variants
- **Default**: Full overlay with all information
- **Compact**: Mobile-optimized for small cards
- **Minimal**: Status indicator only

## 📱 Implementation

### Basic Usage

```tsx
import PropertyCardOverlay from '@/components/property/PropertyCardOverlay';

<div className="relative h-48">
  <img src={propertyImage} alt="Property" className="w-full h-full object-cover" />
  
  <PropertyCardOverlay
    propertyId="property-uuid"
    price={4890}
    priceUnit="semester"
    variant="default"
    isVerified={true}
    isPopular={false}
    showLiveIndicator={true}
    showPrice={true}
  />
</div>
```

### Variant Examples

#### Default Variant (Full Overlay)
```tsx
<PropertyCardOverlay
  propertyId={propertyId}
  price={4890}
  priceUnit="semester"
  variant="default"
  isVerified={true}
  isPopular={true}
  viewCount={127}
  showLiveIndicator={true}
  showPrice={true}
/>
```

**Features:**
- Verification badges (top-left)
- Live indicator (top-right)
- Real-time availability status (bottom-left)
- Price and urgency indicators (bottom-right)
- View count tracking
- Gradient overlay for text readability

#### Compact Variant (Mobile Optimized)
```tsx
<PropertyCardOverlay
  propertyId={propertyId}
  price={3200}
  priceUnit="semester"
  variant="compact"
  isVerified={true}
  showLiveIndicator={true}
  showPrice={true}
/>
```

**Features:**
- Availability status badge (top-left)
- Price display (top-right)
- Live indicator dot (bottom-right)
- Optimized for small screens

#### Minimal Variant (Status Only)
```tsx
<PropertyCardOverlay
  propertyId={propertyId}
  price={2800}
  priceUnit="semester"
  variant="minimal"
  showLiveIndicator={false}
  showPrice={false}
/>
```

**Features:**
- Color-coded status dot only
- Ultra-minimal design
- Perfect for grid layouts

## 🎯 Real-Time Data Integration

### Availability Status Colors
- 🟢 **Green**: Available (plenty of beds)
- 🟡 **Yellow**: Moderate (limited beds)
- 🟠 **Orange**: Filling Up (few beds remaining)
- 🔴 **Red**: Full (no beds available)

### Urgency Indicators
- **Critical**: Property is fully booked
- **High**: "Filling Fast" - less than 30% beds available
- **Medium**: "Limited" - less than 70% beds available
- **Low**: No urgency indicator shown

### Live Updates
The overlay automatically subscribes to real-time database changes:
- Room availability updates
- Booking status changes
- Occupancy rate calculations
- 30-second refresh intervals

## 📐 Design Specifications

### Positioning
- **Top-Left**: Verification badges, status indicators
- **Top-Right**: Live indicator, view count
- **Bottom-Left**: Detailed availability information
- **Bottom-Right**: Price, urgency indicators

### Typography
- **Primary Text**: 12px-14px, medium weight
- **Secondary Text**: 10px-12px, regular weight
- **Price Display**: 14px-16px, bold weight

### Colors
- **Background Overlays**: Black with 60-80% opacity
- **Backdrop Blur**: Applied for modern glass effect
- **Status Colors**: Semantic color system (green/yellow/orange/red)
- **Text**: White on dark backgrounds, dark on light backgrounds

### Spacing
- **Padding**: 8px-12px for badges and containers
- **Margins**: 8px-16px from edges
- **Gap**: 4px-8px between elements

## 🔧 Technical Implementation

### Component Architecture
```
PropertyCardOverlay/
├── PropertyCardOverlay.tsx     # Main overlay component
├── MobilePropertyCard.tsx      # Mobile-optimized card
└── PropertyCardOverlayDemo.tsx # Demo and testing
```

### Dependencies
- `@/hooks/useRealTimeBedAvailability` - Real-time data hook
- `@/services/realTimeBedAvailabilityService` - Data service
- `@/components/ui/badge` - Badge component
- `lucide-react` - Icon library

### Performance Optimizations
- **Lazy loading** for images
- **Memoized calculations** for status and colors
- **Efficient re-renders** with React.memo
- **Optimized subscriptions** with cleanup

## 🎨 Customization

### Theme Integration
The overlay system integrates with your design system:
- Uses semantic color tokens
- Respects dark/light mode preferences
- Follows accessibility guidelines

### Custom Variants
Create custom variants by extending the base component:

```tsx
// Custom variant for featured properties
if (variant === 'featured') {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Custom featured property overlay */}
    </div>
  );
}
```

## 📊 Analytics Integration

### Tracking Events
- Property card views
- Overlay interactions
- Real-time data updates
- Performance metrics

### Data Points
- View counts per property
- Interaction rates
- Load times
- Error rates

## 🧪 Testing

### Demo Component
Use `PropertyCardOverlayDemo` to test all variants:
```tsx
import PropertyCardOverlayDemo from '@/components/demo/PropertyCardOverlayDemo';

<PropertyCardOverlayDemo />
```

### Test Cases
- Different availability statuses
- Various price ranges
- Mobile responsiveness
- Real-time updates
- Error states

## 🚀 Future Enhancements

### Planned Features
- **Animation system** for status changes
- **Interactive elements** within overlays
- **A/B testing** for different layouts
- **Advanced analytics** integration
- **Personalization** based on user preferences

### Performance Improvements
- **Image optimization** with WebP format
- **Lazy loading** for off-screen cards
- **Virtual scrolling** for large lists
- **Service worker** caching

## 📱 Mobile Best Practices

### Touch Targets
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Clear visual feedback for interactions

### Performance
- Optimized for 3G networks
- Minimal JavaScript bundle size
- Efficient image loading
- Battery-conscious animations

### Accessibility
- High contrast ratios (4.5:1 minimum)
- Screen reader compatible
- Keyboard navigation support
- Reduced motion preferences

---

**Built with ❤️ for the ROOMIE platform**
