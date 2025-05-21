
import React from 'react';
import { ClipboardCheck } from 'lucide-react';

interface PropertyHouseRulesTabProps {
  houseRules: string[];
}

const PropertyHouseRulesTab: React.FC<PropertyHouseRulesTabProps> = ({ houseRules }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">House Rules</h3>
      <ul className="space-y-2">
        {houseRules && houseRules.length > 0 ? (
          houseRules.map((rule, index) => (
            <li key={index} className="flex items-start">
              <ClipboardCheck className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{rule}</span>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No specific house rules listed.</li>
        )}
      </ul>
    </div>
  );
};

export default PropertyHouseRulesTab;
