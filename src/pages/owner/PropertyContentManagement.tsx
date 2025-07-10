/**
 * Property Content Management Page
 * Apple-Grade Owner Portal Page for Managing Property Content
 * 
 * Purpose: Main page for property content management in owner portal
 * Compliance: BE CONSCIOUS zero tolerance for any types
 * Architecture: Integrated with existing owner portal layout
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import OwnerLayout from '@/components/layout/OwnerLayout';
import PropertyContentManager from '@/components/owner/property-content/PropertyContentManager';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const PropertyContentManagement: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();

  if (!propertyId) {
    return (
      <OwnerLayout pageTitle="Property Content Management" showBackButton>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Property ID is required to manage content.
          </AlertDescription>
        </Alert>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout 
      pageTitle="Property Content Management" 
      showBackButton
      backUrl="/owner/properties"
    >
      <PropertyContentManager propertyId={propertyId} />
    </OwnerLayout>
  );
};

export default PropertyContentManagement;
