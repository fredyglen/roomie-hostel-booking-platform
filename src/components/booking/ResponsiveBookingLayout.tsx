import React, { type ReactNode } from 'react';
import type { Property } from '@/types/property';
import { useMobile } from '@/hooks/use-mobile';

interface ResponsiveBookingLayoutProps {
  property: Property;
  /** Main booking content (steps, forms, etc.) */
  children: ReactNode;
  /** Optional right-hand sidebar content (e.g., booking summary) */
  sidebar?: ReactNode;
}

/**
 * Shared responsive shell for the enhanced booking flow.
 *
 * - Mobile: single-column layout, main content only (no sidebar)
 * - Tablet/Desktop: two-column grid with sticky sidebar on the right
 */
const ResponsiveBookingLayout: React.FC<ResponsiveBookingLayoutProps> = ({
  property,
  children,
  sidebar,
}) => {
  const isMobile = useMobile();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8">
        {/* Main booking content */}
        <section
          aria-label={`Booking steps for ${property.title || property.name}`}
          className="min-w-0"
        >
          {children}
        </section>

        {/* Sticky summary sidebar (desktop / tablet only) */}
        {!isMobile && sidebar && (
          <aside className="hidden md:block">
            <div className="md:sticky md:top-6">
              {sidebar}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ResponsiveBookingLayout;

