import React, { useEffect, useMemo, useState } from 'react';
import type { PropertyCardProps as LegacyPropertyCardProps } from './PropertyCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import ViewingLimitOverlay from '@/components/properties/ViewingLimitOverlay';
import { usePropertyViewingTracker, ViewingRestriction } from '@/hooks/usePropertyViewingTracker';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Video, Wifi, Coffee, Tv, Dumbbell, Wind, Car, ChevronDown, Lock } from 'lucide-react';
import { getRealTimeBedAvailability, subscribeToRealTimeBedAvailability, type PropertyBedAvailability } from '@/services/realTimeBedAvailabilityService';
import { usePropertyRoomTypes } from '@/hooks/usePropertyRoomTypes';
import { getOptimizedPropertyImageUrl } from '@/utils/imageOptimization';

export type PropertyCardProps = LegacyPropertyCardProps;

const PremiumPropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  rent,
  location,
  bedrooms,
  bathrooms,
  maxOccupants,
  images,
  amenities,
  propertyType,
  genderRestriction,
  isAvailable,
  roomTypes,
  distanceToCampus,
  totalBedsAvailable = 0,
  totalBeds = 1,
  priceUnit = 'semester',
  onViewDetails,
  onViewStory
}) => {
  const propertyId = typeof id === 'string' ? id : String(id);
  const rentAmount = typeof rent === 'number' ? rent : Number(rent);
  const navigate = useNavigate();

  // Load owner-configured room types and pricing when not passed via props
  const { roomTypes: fetchedRoomTypes } = usePropertyRoomTypes({ propertyId, propertyCategory: propertyType });

  // Anonymous viewing limits and tracking
  const {
    trackImageView,
    trackStoryView,
    trackPropertyView,
    canViewImage,
    canViewStory,
    checkViewingRestriction,
    isAnonymous
  } = usePropertyViewingTracker();

  const [showViewingLimitOverlay, setShowViewingLimitOverlay] = useState(false);
  const [viewingRestriction, setViewingRestriction] = useState<ViewingRestriction | null>(null);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  useEffect(() => {
    if (isAnonymous && !hasTrackedView) {
      trackPropertyView();
      setHasTrackedView(true);
    }
  }, [isAnonymous, hasTrackedView, trackPropertyView]);

  const primaryImage = useMemo(() => {
    if (Array.isArray(images) && images.length > 0 && images[0]?.trim()) {
      const validImage = images.find((img) =>
        img && typeof img === 'string' && img.trim() && !img.includes('blob:') && !img.includes('localhost')
      );
      if (validImage) return validImage;
    }
    if (typeof images === 'string' && images.trim() && !images.includes('blob:') && !images.includes('localhost')) {
      return images;
    }
    return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800';
  }, [images]);

  const optimizedPrimaryImage = useMemo(
    () => getOptimizedPropertyImageUrl(primaryImage, { width: 1000, quality: 80, resize: 'cover' }),
    [primaryImage]
  );

  const handleImageView = () => {
    if (isAnonymous) {
      if (!canViewImage()) {
        const restriction = checkViewingRestriction('images');
        setViewingRestriction(restriction);
        setShowViewingLimitOverlay(true);
        return false;
      }
      trackImageView();
    }
    return true;
  };

  const handleStoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnonymous && !canViewStory()) {
      const restriction = checkViewingRestriction('stories');
      setViewingRestriction(restriction);
      setShowViewingLimitOverlay(true);
      return;
    }
    trackStoryView();
    onViewStory?.();
  };

  const handleRegisterFromOverlay = () => {
    setShowViewingLimitOverlay(false);
    navigate('/register');
  };
  const handleLoginFromOverlay = () => {
    setShowViewingLimitOverlay(false);
    navigate('/login');
  };

  const [selectedRoomType, setSelectedRoomType] = useState<string | undefined>(() => roomTypes?.[0]?.type);
  const [availability, setAvailability] = useState<PropertyBedAvailability | null>(null);
  const amenityItems = Array.isArray(amenities) ? amenities : [];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    (async () => {
      const initial = await getRealTimeBedAvailability(propertyId);
      setAvailability(initial);
      unsubscribe = subscribeToRealTimeBedAvailability(propertyId, setAvailability);
    })();
    return () => { unsubscribe(); };
  }, [propertyId]);

  const roomOptions = useMemo(() => {
    const normalize = (s: string) => String(s).toLowerCase().replace(/\s+/g, '_');

    // Prefer explicit prop-based room types when provided
    if (roomTypes && roomTypes.length > 0) {
      return roomTypes.map(rt => ({
        value: rt.type,
        label: rt.type?.toString().includes('room') ? rt.type : `${rt.type}`,
        price: rt.price,
        available: rt.bedsAvailable,
        total: rt.totalBeds
      }));
    }

    // Build a price map from owner-configured room types (service hook)
    const priceMap = new Map<string, number>();
    if (Array.isArray(fetchedRoomTypes) && fetchedRoomTypes.length > 0) {
      fetchedRoomTypes.forEach(rt => priceMap.set(normalize(rt.value), Number(rt.price) || 0));
    }

    if (availability?.byRoomType?.length) {
      return availability.byRoomType.map(rt => {
        const key = normalize(rt.roomType);
        const price = priceMap.has(key) ? (priceMap.get(key) as number) : rentAmount;
        return {
          value: rt.roomType,
          label: rt.roomType,
          price,
          available: rt.availableBeds,
          total: rt.totalBeds
        };
      });
    }
    return [] as Array<{ value: string; label: string; price: number; available: number; total: number }>;
  }, [roomTypes, availability, rentAmount, fetchedRoomTypes]);

  const currentRoom = useMemo(() => {
    if (!roomOptions.length) {
      return {
        value: 'overall',
        label: `${maxOccupants} in a room`,
        price: rentAmount,
        available: availability?.overall.availableBeds ?? totalBedsAvailable ?? 0,
        total: availability?.overall.totalBeds ?? totalBeds ?? 0
      };
    }
    const found = roomOptions.find(r => r.value === selectedRoomType) || roomOptions[0];
    return found;
  }, [roomOptions, selectedRoomType, availability, rentAmount, maxOccupants, totalBedsAvailable, totalBeds]);

  const occupancyPercent = useMemo(() => {
    const total = Number(currentRoom.total) || 0;
    const availableNow = Number(currentRoom.available) || 0;
    const occupied = Math.max(0, total - availableNow);
    return total > 0 ? (occupied / total) * 100 : 0;
  }, [currentRoom]);

  const getAvailabilityColor = () => {
    if (currentRoom.available === 0) return 'bg-red-500';
    if (occupancyPercent >= 70) return 'bg-red-500';
    if (occupancyPercent >= 40) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const displayedAmenities = useMemo(() => {
    const iconMap: Record<string, any> = {
      wifi: Wifi,
      'wi-fi': Wifi,
      internet: Wifi,
      ac: Wind,
      'air conditioning': Wind,
      tv: Tv,
      kitchen: Coffee,
      gym: Dumbbell,
      parking: Car
    };
    const order = ['wifi', 'ac', 'tv', 'kitchen', 'gym', 'parking'];
    const normalized = amenityItems.map(a => String(a).toLowerCase());
    const picked: Array<{icon: any; label: string}> = [];
    order.forEach(key => {
      const Icon = iconMap[key];
      // Use the canonical label for display (capitalize)
      const labelMap: Record<string, string> = { wifi: 'WiFi', ac: 'AC', tv: 'TV', kitchen: 'Kitchen', gym: 'Gym', parking: 'Parking' };
      // Include if present in amenities; if not present but we still need 6, we keep it as optional fallback only if none matched
      if (normalized.some(n => n.includes(key)) || picked.length < 6) {
        picked.push({ icon: Icon, label: labelMap[key] });
      }
    });
    return picked.slice(0, 6);
  }, [amenityItems]);

  const otherAmenityLabels = useMemo(() => {
    const base = amenityItems.filter(a => !displayedAmenities.some(d => d.label.toLowerCase() === String(a).toLowerCase()));
    return base;
  }, [amenityItems, displayedAmenities]);


  const extraChips = useMemo(() => {
    const lower = amenityItems.map(a => String(a).toLowerCase());
    const extras: string[] = [];
    if (lower.some(s => s.includes('clean'))) extras.push('Cleaning Service');
    if (lower.some(s => s.includes('cctv') || s.includes('security'))) extras.push('CCTV Security');
    const remaining = Math.max(0, amenityItems.length - displayedAmenities.length - extras.length);
    return { extras, remaining };
  }, [amenityItems, displayedAmenities]);

  const genderLabel = useMemo(() => {
    if (!genderRestriction) return undefined;
    if (genderRestriction === 'male') return 'BOYS';
    if (genderRestriction === 'female') return 'GIRLS';
    return 'MIXED';
  }, [genderRestriction]);

  const genderBadgeClass = useMemo(() => {
    if (!genderLabel) return 'bg-gray-600';
    if (genderLabel === 'BOYS') return 'bg-blue-600';
    if (genderLabel === 'GIRLS') return 'bg-pink-600';
    return 'bg-purple-600';
  }, [genderLabel]);

  return (
    <Card
      className="overflow-hidden card-premium animate-fade-in-up flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200 w-full"
      onClick={() => onViewDetails()}
    >
      <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600" />

      {/* Media */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={optimizedPrimaryImage}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
            isAnonymous && !canViewImage() ? 'blur-sm' : ''
          }`}
          width={400}
          height={70}
          loading="eager"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800';
          }}
          onLoad={() => {
            if (isAnonymous) handleImageView();
          }}
        />

        {/* Gender badge (top-left text) */}
        {genderLabel && (
          <div className={`absolute top-2 left-2 ${genderBadgeClass} text-white text-xs font-bold px-3 py-1 tracking-wider`}>
            {genderLabel}
          </div>
        )}

        {/* Video icon - bottom-left */}
        {onViewStory && (
          <button
            onClick={handleStoryClick}
            className="interactive-element absolute bottom-2 left-2 bg-white/95 p-2 shadow-lg"
            style={{ borderRadius: '50%', border: '2px dotted rgba(37,99,235,0.4)', borderTop: '2px solid rgb(37,99,235)', borderRight: '2px solid rgb(37,99,235)' }}
            aria-label="View story"
          >
            <Video className="w-4 h-4 text-blue-600" />
          </button>
        )}

        {/* Image viewing lock overlay */}
        {isAnonymous && !canViewImage() && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
            <div className="bg-white/90 rounded-lg p-1 flex items-center gap-1 text-xs">
              <Lock size={10} className="text-primary" />
              <span className="font-medium text-gray-800">Register for more</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 flex-1 flex flex-col justify-between min-h-0">
        {/* Title + Price */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-1">{title}</h3>
          </div>
          {/* Price Box */}
          <div className="bg-slate-50 px-3 py-2 ml-3 text-right">
            <div className="text-xl font-bold text-blue-600">¢{Number(currentRoom.price ?? rentAmount).toLocaleString()}</div>
            <span className="text-xs text-slate-600">/{priceUnit}</span>
          </div>
        </div>

        {/* Location + Distance */}
        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
          <div className="flex items-center flex-1 min-w-0">
            <MapPin className="w-3 h-3 text-blue-600" />
            <span className="ml-1 truncate">{location}</span>
          </div>
          {distanceToCampus && (
            <span className="text-blue-600 font-medium ml-1 flex-shrink-0 text-sm">{distanceToCampus}</span>
          )}
        </div>

        {/* Room Type Dropdown & Availability */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <button
              onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(v => !v); }}
              className="interactive-element w-full flex items-center justify-between text-xs bg-white border border-slate-300 px-2 py-1.5 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-slate-500" />
                <span className="font-semibold text-slate-700">{currentRoom.label}</span>
              </div>
              <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && roomOptions.length > 0 && (
              <div className="interactive-element absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 shadow-lg z-20">
                {roomOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={(e) => { e.stopPropagation(); setSelectedRoomType(option.value); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-2 py-2 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-0 ${selectedRoomType === option.value ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span className="text-xs font-semibold text-slate-700">{option.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600">¢{Number(option.price || rentAmount).toLocaleString()}</span>
                        <span className="text-xs text-slate-500">{option.available}/{option.total}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Availability Badge */}
          <div className={`${getAvailabilityColor()} text-white px-3 py-1.5 flex items-center justify-center min-w-[60px]`}>
            <span className="text-xs font-bold">{Number(currentRoom.available) || 0}/{Number(currentRoom.total) || 0}</span>
          </div>
        </div>

        {/* Amenities grid (icons + names) */}
        {displayedAmenities.length > 0 && (
          <div className="mb-3">
            <div className="grid grid-cols-6 gap-2">
              {displayedAmenities.map((amenity, index) => (
                <div key={index} className="flex flex-col items-center gap-0.5 p-1.5 bg-slate-50 hover:bg-blue-50 transition-colors">
                  <amenity.icon className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs text-slate-700 font-medium">{amenity.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional services (scrollable chips with subtle fade) */}
        {(extraChips.extras.length > 0 || extraChips.remaining > 0) && (
          <div className="relative">
            <div className="flex gap-1.5 overflow-x-auto pr-6 no-scrollbar">
              {extraChips.extras.map((label) => (
                <span key={label} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-200">
                  {label}
                </span>
              ))}
              {extraChips.remaining > 0 && (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5">
                  +{extraChips.remaining}
                </span>
              )}
            </div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent" />
          </div>
        )}


      </div>

      {/* Viewing Limit Overlay */}
      {viewingRestriction && (
        <ViewingLimitOverlay
          isVisible={showViewingLimitOverlay}
          restrictionType={viewingRestriction.restrictionType}
          remainingViews={viewingRestriction.remainingViews}
          totalLimit={viewingRestriction.totalLimit}
          message={viewingRestriction.message}
          onRegisterClick={handleRegisterFromOverlay}
          onLoginClick={handleLoginFromOverlay}
        />
      )}
    </Card>
  );
};

export default PremiumPropertyCard;

