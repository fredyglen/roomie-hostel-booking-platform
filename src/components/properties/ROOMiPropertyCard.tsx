import React from 'react';
import {
  Heart, Video, MapPin, User, ChevronDown, Users,
  Wifi, Wind, Tv, CookingPot, Dumbbell, Car,
} from 'lucide-react';

/**
 * The ROOMi property card.
 *
 * Ported from the reference markup in single-card-listing.html, keeping its
 * measurements exactly: 1.72:1 image, 10px radius, 14px content padding, the
 * 1fr/64px room+availability row, and the six-column amenity strip.
 *
 * Two details from the reference worth preserving:
 *
 *  - The availability chip is a STATUS INDICATOR, not a button. It is never
 *    clickable and never focusable; colour alone carries urgency, so the
 *    "taken/total" figure is always spelled out for screen readers.
 *  - The cover image is shown unobstructed. Registration is triggered when a
 *    student opens a property, not by hiding what a listing looks like.
 */

export type GenderPolicy = 'mixed' | 'girls' | 'boys';

export interface RoomiAmenity {
  key: string;
  label: string;
}

export interface ROOMiPropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number | null;
  /** Shown under the price, e.g. "/semester". */
  period?: string;
  currency?: string;
  coverImage?: string;
  gender?: GenderPolicy;
  /** Occupancy label, e.g. "1 in a room". */
  roomLabel?: string;
  /** Beds taken and total, for the availability chip. */
  taken?: number;
  total?: number;
  amenities?: RoomiAmenity[];
  isFavorite?: boolean;
  hasVideo?: boolean;
  onOpen?: () => void;
  onFavorite?: () => void;
  onVideo?: () => void;
  onRoomChange?: () => void;
  className?: string;
}

/** Gender policy drives the badge colour, matching the listing screens. */
const GENDER_STYLES: Record<GenderPolicy, { label: string; className: string }> = {
  mixed: { label: 'MIXED', className: 'bg-[#7c3aed]' },
  girls: { label: 'GIRLS', className: 'bg-[#db2777]' },
  boys: { label: 'BOYS', className: 'bg-[#0a5cff]' },
};

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  ac: Wind,
  tv: Tv,
  kitchen: CookingPot,
  gym: Dumbbell,
  parking: Car,
};

const DEFAULT_AMENITIES: RoomiAmenity[] = [
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'ac', label: 'AC' },
  { key: 'tv', label: 'TV' },
  { key: 'kitchen', label: 'Kitchen' },
  { key: 'gym', label: 'Gym' },
  { key: 'parking', label: 'Parking' },
];

/** green = space left, orange = filling up, red = full. */
function availabilityTone(taken: number, total: number) {
  if (total <= 0 || taken >= total) return 'text-[#e52b3a] bg-[#fff0f0]';
  if (taken / total >= 0.7) return 'text-[#eaa600] bg-[#fff3d6]';
  return 'text-[#16b95a] bg-[#dcf7e7]';
}

const ROOMiPropertyCard: React.FC<ROOMiPropertyCardProps> = ({
  title,
  location,
  price,
  period = '/semester',
  currency = '₵',
  coverImage,
  gender = 'mixed',
  roomLabel = '1 in a room',
  taken = 0,
  total = 0,
  amenities = DEFAULT_AMENITIES,
  isFavorite = false,
  hasVideo = true,
  onOpen,
  onFavorite,
  onVideo,
  onRoomChange,
  className = '',
}) => {
  const badge = GENDER_STYLES[gender] ?? GENDER_STYLES.mixed;
  const tone = availabilityTone(taken, total);

  /** Child controls must not open the property. */
  const stop = (fn?: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn?.();
  };

  return (
    <article
      onClick={onOpen}
      className={
        'w-full max-w-[390px] overflow-hidden rounded-[10px] border border-[#e8ecf2] bg-white ' +
        'shadow-[0_2px_8px_rgba(11,31,58,0.04),0_8px_24px_rgba(11,31,58,0.035)] ' +
        'transition-shadow hover:shadow-[0_4px_14px_rgba(11,31,58,0.08),0_12px_32px_rgba(11,31,58,0.06)] ' +
        (onOpen ? 'cursor-pointer ' : '') +
        className
      }
    >
      {/* ------------------------------------------------------------ image */}
      <div className="relative aspect-[1.72/1] w-full overflow-hidden bg-[#eef2f7]">
        {coverImage ? (
          <img src={coverImage} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-center" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#eef2f7] to-[#dde4ee]" />
        )}

        <div
          className={`absolute left-[10px] top-[10px] flex h-[27px] items-center justify-center rounded-[3px] px-[11px] text-[11px] font-bold tracking-[0.01em] text-white ${badge.className}`}
        >
          {badge.label}
        </div>

        <button
          type="button"
          onClick={stop(onFavorite)}
          aria-label={isFavorite ? `Remove ${title} from saved` : `Save ${title}`}
          aria-pressed={isFavorite}
          className="absolute right-[10px] top-[10px] flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.98] text-[#0a5cff] shadow-[0_2px_7px_rgba(11,31,58,0.12)] transition-transform hover:scale-105"
        >
          <Heart className={`h-[18px] w-[18px] ${isFavorite ? 'fill-current' : ''}`} strokeWidth={1.8} />
        </button>

        {hasVideo && (
          <button
            type="button"
            onClick={stop(onVideo)}
            aria-label={`Watch a video tour of ${title}`}
            className="absolute bottom-[10px] left-[10px] flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.98] text-[#0a5cff] shadow-[0_2px_7px_rgba(11,31,58,0.12)] transition-transform hover:scale-105"
          >
            <Video className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
        )}
      </div>

      {/* ---------------------------------------------------------- content */}
      <div className="px-[14px] pb-3 pt-[14px]">
        <div className="flex items-start justify-between gap-3">
          <h3 className="m-0 min-w-0 text-[18px] font-bold leading-[22px] tracking-[-0.02em] text-[#0b1f3a]">
            {title}
          </h3>
          <div className="flex-none text-right text-[#0a5cff]">
            <span className="block text-[18px] font-bold leading-[21px] tracking-[-0.02em]">
              {price != null ? `${currency}${Number(price).toLocaleString()}` : 'Ask'}
            </span>
            <span className="mt-0.5 block text-[10px] leading-[13px] text-[#6f7f98]">{period}</span>
          </div>
        </div>

        <div className="mt-[11px] flex min-w-0 items-center gap-1.5 text-[11px] leading-4 text-[#6f7f98]">
          <MapPin className="h-3.5 w-3.5 flex-none text-[#0a5cff]" strokeWidth={1.8} />
          <span className="truncate">{location}</span>
        </div>

        {/* room selector + availability status */}
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_64px] gap-2">
          <button
            type="button"
            onClick={stop(onRoomChange)}
            className="flex h-[34px] min-w-0 items-center rounded-[5px] border border-[#e8ecf2] bg-white px-[9px] text-[#0b1f3a] transition-colors hover:border-[#0a5cff]/40"
          >
            <User className="mr-[7px] h-[15px] w-[15px] flex-none text-[#0a5cff]" strokeWidth={1.8} />
            <span className="min-w-0 truncate text-[11px] font-semibold">{roomLabel}</span>
            <ChevronDown className="ml-auto h-[13px] w-[13px] flex-none text-[#0a5cff]" strokeWidth={1.8} />
          </button>

          {/* Status indicator, deliberately not a button. */}
          <div
            role="status"
            aria-label={`Availability: ${taken} of ${total} beds taken`}
            className={`flex h-[34px] select-none items-center justify-center gap-1 rounded-[5px] text-[11px] font-bold ${tone}`}
          >
            <Users className="h-[13px] w-[13px]" strokeWidth={1.8} aria-hidden />
            {taken}/{total}
          </div>
        </div>

        {/* amenities */}
        <div className="mt-3 grid grid-cols-6 border-t border-[#e8ecf2] pt-2.5">
          {amenities.slice(0, 6).map((a, i, arr) => {
            const Icon = AMENITY_ICONS[a.key] ?? Wifi;
            return (
              <div
                key={a.key}
                className={
                  'relative flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 py-px ' +
                  (i < arr.length - 1
                    ? "after:absolute after:right-0 after:top-0.5 after:h-[27px] after:w-px after:bg-[#edf0f4] after:content-['']"
                    : '')
                }
              >
                <Icon className="h-[17px] w-[17px] text-[#0a5cff]" />
                <span className="max-w-full truncate text-center text-[9.5px] leading-3 text-[#6f7f98]">
                  {a.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
};

export default ROOMiPropertyCard;
