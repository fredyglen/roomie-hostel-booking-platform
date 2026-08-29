import React, { useEffect, useMemo, useState } from 'react';

/**
 * Background slideshow for the sign-in / sign-up split panel.
 *
 * Motion is deliberately slow and quiet: a long hold on each frame, a soft
 * cross-fade, and a gentle scale-DOWN while a frame is showing. The images are
 * behind a form, so anything faster reads as distracting rather than alive.
 *
 * Assets are pre-compressed WebP written by scripts/compress-brand-images.mjs
 * (9.8 MB of source PNG -> 648 KB). Supabase image transformation is a paid
 * add-on this project does not have, so static art is optimised at build time.
 *
 * Honours prefers-reduced-motion: the slideshow holds on the first frame with
 * no movement at all.
 */

const SLIDES = [
  { src: '/brand/auth/sign-in-up-page.webp', alt: 'A student reading by a sunlit library window' },
  { src: '/brand/auth/sign-in-up-page-2.webp', alt: 'A student working on a laptop in a campus lounge' },
  { src: '/brand/auth/sign-in-up-page-3.webp', alt: 'A student reading on a curved blue campus bench' },
  { src: '/brand/auth/sign-in-up-page-4.webp', alt: 'A student studying outdoors beside a planter' },
];

/** How long each frame holds, and how long the cross-fade takes. */
const HOLD_MS = 7000;
const FADE_MS = 1600;

interface AuthImageSlideshowProps {
  /** Optional overlay content, e.g. logo and tagline. */
  children?: React.ReactNode;
  className?: string;
}

const AuthImageSlideshow: React.FC<AuthImageSlideshowProps> = ({ children, className = '' }) => {
  const [index, setIndex] = useState(0);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    if (reducedMotion || SLIDES.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className={`relative overflow-hidden bg-primary ${className}`}>
      {SLIDES.map((slide, i) => {
        const active = i === index;
        return (
          <img
            key={slide.src}
            src={slide.src}
            alt={active ? slide.alt : ''}
            aria-hidden={!active}
            // The first frame is above the fold on every auth visit; the rest
            // can wait until the browser is idle.
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={i === 0 ? 'high' : 'low'}
            className="absolute inset-0 h-full w-full object-cover will-change-[opacity,transform]"
            style={{
              opacity: active ? 1 : 0,
              // Inactive frames sit slightly enlarged; becoming active eases
              // them back to 1, so the visible motion is always a scale-down.
              transform: reducedMotion ? 'none' : `scale(${active ? 1 : 1.06})`,
              transition: reducedMotion
                ? 'none'
                : `opacity ${FADE_MS}ms ease-in-out, transform ${HOLD_MS + FADE_MS}ms ease-out`,
            }}
          />
        );
      })}

      {/* Only applied when something is overlaid; bare photos show unfiltered. */}
      {children && (
        <>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="relative z-10 flex h-full w-full items-center justify-center">{children}</div>
        </>
      )}
    </div>
  );
};

export default AuthImageSlideshow;
