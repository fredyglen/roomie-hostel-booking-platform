import React from 'react';

interface PropertyDetailsTabProps {
  advancePaymentMonths?: number;
  washroomType?: string;
  hasIndividualMeters?: boolean;
  allowBillSharing?: boolean;
  meterType?: string;
  waterReliability?: string;
  waterReliabilityNotes?: string;
  parkingAvailable?: boolean;
  parkingCost?: number;
  internetSpeed?: string;
  securityFeatures?: string[];
  genderRestriction?: string;
  cancellationPolicy?: string;
  goodToKnow?: string;
}

const Row = ({ label, value }: { label: string; value?: string | number | boolean; }) => {
  if (value === undefined || value === '' || value === null) return null;
  return (
    <div className="flex items-start justify-between py-2 border-b last:border-b-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[65%]">
        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
      </span>
    </div>
  );
};

const PropertyDetailsTab: React.FC<PropertyDetailsTabProps> = (props) => {
  const utilities = props.hasIndividualMeters || props.allowBillSharing
    ? 'Utilities billed separately'
    : (props.hasIndividualMeters === false && props.allowBillSharing === false)
      ? 'Utilities included'
      : undefined;

  let washroom: string | undefined;
  const wt = (props.washroomType || '').toLowerCase();
  if (wt === 'private') washroom = 'Private washroom';
  else if (wt === 'shared') washroom = 'Shared washroom';
  else if (wt === 'outside' || wt === 'external') washroom = 'External washroom';

  return (
    <div className="space-y-6">
      {props.goodToKnow && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Must know information</h3>
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
            <p className="text-amber-900 text-sm leading-relaxed font-medium">{props.goodToKnow}</p>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment & policies</h3>
        <div className="divide-y rounded-lg border">
          <Row label="Advance payment" value={typeof props.advancePaymentMonths === 'number' ? `${props.advancePaymentMonths} month${props.advancePaymentMonths === 1 ? '' : 's'}` : undefined} />
          <Row label="Cancellation policy" value={props.cancellationPolicy} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Utilities & water</h3>
        <div className="divide-y rounded-lg border">
          <Row label="Washroom" value={washroom} />
          <Row label="Utilities" value={utilities} />
          <Row label="Meter type" value={props.meterType} />
          <Row label="Water reliability" value={props.waterReliability} />
          <Row label="Water notes" value={props.waterReliabilityNotes} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Parking & transport</h3>
        <div className="divide-y rounded-lg border">
          <Row label="Parking available" value={props.parkingAvailable} />
          <Row label="Parking cost" value={typeof props.parkingCost === 'number' ? `₵${props.parkingCost}` : undefined} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Internet & security</h3>
        <div className="divide-y rounded-lg border">
          <Row label="Internet speed" value={props.internetSpeed} />
          <Row label="Gender restriction" value={props.genderRestriction} />
          {Array.isArray(props.securityFeatures) && props.securityFeatures.length > 0 && (
            <Row label="Security features" value={props.securityFeatures.slice(0, 5).join(', ')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsTab;

