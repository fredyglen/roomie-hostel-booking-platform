/**
 * Smart Property Description Component
 * 
 * PRODUCTION-GRADE description component with intelligent character limits.
 * Prevents owner text overload while maintaining readability.
 * Includes "Read more" expansion for longer descriptions.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SmartPropertyDescriptionProps {
  readonly description: string;
  readonly characterLimit?: number;
  readonly className?: string;
}

/**
 * ✅ PRODUCTION-GRADE: Smart Description with Character Limits
 */
const SmartPropertyDescription: React.FC<SmartPropertyDescriptionProps> = ({
  description,
  characterLimit = 400, // User requested 400 character limit
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Clean and validate description
  const cleanDescription = description?.trim() || '';
  
  if (!cleanDescription) {
    return (
      <div className={`text-gray-500 text-sm italic ${className}`}>
        No description available for this property.
      </div>
    );
  }

  // Check if truncation is needed
  const shouldTruncate = cleanDescription.length > characterLimit;
  
  // Get display text
  const displayText = shouldTruncate && !isExpanded 
    ? cleanDescription.slice(0, characterLimit).trim() + '...'
    : cleanDescription;

  // Toggle expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Description Text */}
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-0">
          {displayText}
        </p>
      </div>

      {/* Read More/Less Button */}
      {shouldTruncate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpansion}
          className="h-auto p-0 text-primary hover:text-primary/80 font-medium text-sm"
        >
          <span className="flex items-center gap-1">
            {isExpanded ? (
              <>
                Show less
                <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Read more
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </span>
        </Button>
      )}

      {/* Character count indicator (for debugging/admin) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400">
          {cleanDescription.length} characters
          {shouldTruncate && ` (showing ${isExpanded ? 'all' : characterLimit})`}
        </div>
      )}
    </div>
  );
};

export default SmartPropertyDescription;
