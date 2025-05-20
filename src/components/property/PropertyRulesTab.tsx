
import React from 'react';
import { Info } from 'lucide-react';

interface PropertyRulesTabProps {
  rules: string[];
}

const PropertyRulesTab: React.FC<PropertyRulesTabProps> = ({ rules }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">House Rules</h3>
      <ul className="space-y-2">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyRulesTab;
