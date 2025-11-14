import React from 'react';
import { Property } from '@/types/property';

interface StorySummaryCardProps {
  property: Property;
}

const StorySummaryCard: React.FC<StorySummaryCardProps> = ({ property }) => {
  const title = property.title || (property as any).name || '';
  const price = (property as any).price || (property as any).rent || (property as any).base_price_per_semester || 0;
  const priceUnit = (property as any).priceUnit || 'semester';
  const amenities: string[] = Array.isArray((property as any).amenities) ? (property as any).amenities : [];
  const goodToKnow = (property as any).good_to_know as string | undefined;

  const advance = (property as any).advance_payment_months as number | undefined;
  const parkingAvailable = (property as any).parking_available as boolean | undefined;
  const parkingCost = (property as any).parking_cost as number | undefined;
  const internetSpeed = (property as any).internet_speed as string | undefined;
  const genderRestriction = (property as any).gender_restriction || (property as any).gender_type as string | undefined;
  const securityFeatures: string[] | undefined = Array.isArray((property as any).security_features) ? (property as any).security_features : undefined;

  const chips: string[] = [];
  if (typeof advance === 'number') chips.push(`${advance} month${advance === 1 ? '' : 's'} advance`);
  if (parkingAvailable) chips.push(`Parking${parkingCost ? ` (₵${parkingCost})` : ''}`);
  if (internetSpeed) chips.push(`Internet: ${internetSpeed}`);
  if (genderRestriction) chips.push(`Gender: ${genderRestriction}`);
  if (Array.isArray(securityFeatures)) chips.push(...securityFeatures.slice(0, 3));

  return (
    <div className="max-w-md w-full bg-white/95 rounded-xl shadow-lg p-4 mx-auto">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-700">
          <span className="font-semibold">₵{Number(price || 0).toLocaleString()}</span>
          <span className="text-gray-500"> / {priceUnit}</span>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {chips.map((c, idx) => (
            <span key={idx} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{c}</span>
          ))}
        </div>
      )}

      {amenities.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Top amenities</h4>
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 5).map((a, idx) => (
              <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{a}</span>
            ))}
          </div>
        </div>
      )}

      {goodToKnow && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-3">
          <p className="text-amber-900 text-xs leading-relaxed font-medium">{goodToKnow}</p>
        </div>
      )}

      <button
        onClick={() => {
          const id = (property as any).id;
          if (id) window.location.href = `/student/book/${id}`;
        }}
        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow"
      >
        Book Now
      </button>
    </div>
  );
};

export default StorySummaryCard;

