/**
 * Property Owner Tags Component
 * 
 * Displays ALL owner-provided information as beautiful tags.
 * Shows everything the owner configured - no hardcoded values.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wifi, 
  Users, 
  Shield, 
  Car, 
  Accessibility, 
  RefreshCw, 
  CreditCard, 
  MapPin, 
  GraduationCap,
  Dog,
  Zap,
  Info
} from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyOwnerTagsProps {
  readonly property: Property;
  readonly showTitle?: boolean;
  readonly compact?: boolean;
}

/**
 * ✅ PRODUCTION-GRADE: Property Owner Tags Component
 */
const PropertyOwnerTags: React.FC<PropertyOwnerTagsProps> = ({
  property,
  showTitle = true,
  compact = false
}) => {
  const tags: Array<{
    label: string;
    value: string | number | boolean;
    icon?: React.ReactNode;
    color?: string;
    type: 'info' | 'feature' | 'policy' | 'location';
  }> = [];


  // ✅ ACCESSIBILITY FEATURES
  if (property.has_accessibility_features) {
    tags.push({
      label: 'Accessible',
      value: 'Accessibility Features',
      icon: <Accessibility className="h-3 w-3" />,
      color: 'bg-green-100 text-green-800',
      type: 'feature'
    });
  }

  // ✅ ALLOWS REBOOKING
  if (property.allows_rebooking) {
    tags.push({
      label: 'Rebooking',
      value: 'Rebooking Allowed',
      icon: <RefreshCw className="h-3 w-3" />,
      color: 'bg-purple-100 text-purple-800',
      type: 'policy'
    });
  }

  // ✅ ALLOWS SHARED PAYMENT
  if (property.allows_shared_payment) {
    tags.push({
      label: 'Payment',
      value: 'Shared Payment Allowed',
      icon: <CreditCard className="h-3 w-3" />,
      color: 'bg-indigo-100 text-indigo-800',
      type: 'policy'
    });
  }

  // ✅ CAMPUS NAME
  if (property.campus_name) {
    tags.push({
      label: 'Campus',
      value: property.campus_name,
      icon: <GraduationCap className="h-3 w-3" />,
      color: 'bg-teal-100 text-teal-800',
      type: 'location'
    });
  }

  // ✅ NEAREST UNIVERSITY
  if (property.nearest_university) {
    tags.push({
      label: 'University',
      value: property.nearest_university,
      icon: <MapPin className="h-3 w-3" />,
      color: 'bg-cyan-100 text-cyan-800',
      type: 'location'
    });
  }

  // ✅ GENDER RESTRICTION
  if (property.gender_restriction && property.gender_restriction !== 'mixed') {
    tags.push({
      label: 'Gender',
      value: formatGenderRestriction(property.gender_restriction),
      icon: <Users className="h-3 w-3" />,
      color: 'bg-pink-100 text-pink-800',
      type: 'policy'
    });
  }

  // ✅ UTILITIES INCLUDED
  if (property.utilities_included) {
    tags.push({
      label: 'Utilities',
      value: 'Utilities Included',
      icon: <Zap className="h-3 w-3" />,
      color: 'bg-yellow-100 text-yellow-800',
      type: 'feature'
    });
  }

  // ✅ FURNISHING DETAILS (Individual components)
  const furnishingTags = getFurnishingTags(property);
  tags.push(...furnishingTags);

  // ✅ SECURITY FEATURES
  if (property.has_security) {
    tags.push({
      label: 'Security',
      value: 'Security Available',
      icon: <Shield className="h-3 w-3" />,
      color: 'bg-red-100 text-red-800',
      type: 'feature'
    });
  }

  // ✅ PARKING (if available but not showing cost)
  if (property.parking_available && !property.parking_cost) {
    tags.push({
      label: 'Parking',
      value: 'Parking Available',
      icon: <Car className="h-3 w-3" />,
      color: 'bg-gray-100 text-gray-800',
      type: 'feature'
    });
  }

  // Group tags by type for better organization
  const groupedTags = {
    location: tags.filter(tag => tag.type === 'location'),
    feature: tags.filter(tag => tag.type === 'feature'),
    policy: tags.filter(tag => tag.type === 'policy'),
    info: tags.filter(tag => tag.type === 'info')
  };

  if (tags.length === 0) {
    return null; // Don't render if no tags
  }

  const TagGroup: React.FC<{ title: string; tags: typeof tags; showGroupTitle?: boolean }> = ({ 
    title, 
    tags: groupTags, 
    showGroupTitle = !compact 
  }) => {
    if (groupTags.length === 0) return null;

    return (
      <div className={compact ? 'space-y-1' : 'space-y-2'}>
        {showGroupTitle && (
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </h4>
        )}
        <div className="flex flex-wrap gap-1.5">
          {groupTags.map((tag, index) => (
            <Badge
              key={`${tag.label}-${index}`}
              variant="secondary"
              className={`
                ${tag.color || 'bg-gray-100 text-gray-800'} 
                text-xs font-medium px-2 py-1 rounded-full
                flex items-center gap-1.5
                ${compact ? 'text-xs' : 'text-sm'}
              `}
            >
              {tag.icon}
              <span className="truncate max-w-[120px]">
                {typeof tag.value === 'boolean' ? tag.label : tag.value}
              </span>
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  if (compact) {
    // Compact view - all tags in one row
    return (
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, index) => (
          <Badge
            key={`${tag.label}-${index}`}
            variant="secondary"
            className={`
              ${tag.color || 'bg-gray-100 text-gray-800'} 
              text-xs font-medium px-2 py-1 rounded-full
              flex items-center gap-1
            `}
          >
            {tag.icon}
            <span className="truncate max-w-[100px]">
              {typeof tag.value === 'boolean' ? tag.label : tag.value}
            </span>
          </Badge>
        ))}
      </div>
    );
  }

  // Full view - organized by groups
  return (
    <Card>
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4" />
            Property Features
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <TagGroup title="Location" tags={groupedTags.location} />
        <TagGroup title="Features" tags={groupedTags.feature} />
        <TagGroup title="Policies" tags={groupedTags.policy} />
        <TagGroup title="Information" tags={groupedTags.info} />
      </CardContent>
    </Card>
  );
};

/**
 * ✅ HELPER: Format internet speed
 */
function formatInternetSpeed(speed: string): string {
  const speedMap: Record<string, string> = {
    'basic': 'Basic Internet',
    'fast': 'Fast Internet',
    'fiber': 'Fiber Internet',
    'unlimited': 'Unlimited Internet'
  };
  return speedMap[speed.toLowerCase()] || speed;
}

/**
 * ✅ HELPER: Format pet policy
 */
function formatPetPolicy(policy: string): string {
  const policyMap: Record<string, string> = {
    'allowed': 'Pets Allowed',
    'not_allowed': 'No Pets',
    'cats_only': 'Cats Only',
    'dogs_only': 'Dogs Only',
    'small_pets': 'Small Pets Only'
  };
  return policyMap[policy.toLowerCase()] || policy;
}

/**
 * ✅ HELPER: Format gender restriction
 */
function formatGenderRestriction(restriction: string): string {
  const restrictionMap: Record<string, string> = {
    'male_only': 'Male Only',
    'female_only': 'Female Only',
    'mixed': 'Mixed Gender'
  };
  return restrictionMap[restriction.toLowerCase()] || restriction;
}

/**
 * ✅ HELPER: Get furnishing tags
 */
function getFurnishingTags(property: Property): Array<{
  label: string;
  value: string;
  icon?: React.ReactNode;
  color: string;
  type: 'feature';
}> {
  const furnishingTags = [];

  if (property.has_bedframes) {
    furnishingTags.push({
      label: 'Bedframes',
      value: 'Bedframes',
      color: 'bg-amber-100 text-amber-800',
      type: 'feature' as const
    });
  }

  if (property.has_mattresses) {
    furnishingTags.push({
      label: 'Mattresses',
      value: 'Mattresses',
      color: 'bg-emerald-100 text-emerald-800',
      type: 'feature' as const
    });
  }

  if (property.has_wardrobes) {
    furnishingTags.push({
      label: 'Wardrobes',
      value: 'Wardrobes',
      color: 'bg-violet-100 text-violet-800',
      type: 'feature' as const
    });
  }

  if (property.has_fan) {
    furnishingTags.push({
      label: 'Fan',
      value: 'Fan',
      color: 'bg-sky-100 text-sky-800',
      type: 'feature' as const
    });
  }

  if (property.has_tiled_room) {
    furnishingTags.push({
      label: 'Tiled',
      value: 'Tiled Room',
      color: 'bg-slate-100 text-slate-800',
      type: 'feature' as const
    });
  }

  return furnishingTags;
}

export default PropertyOwnerTags;
