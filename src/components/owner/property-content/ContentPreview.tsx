/**
 * Content Preview
 * Apple-Grade Component for Previewing Property Content
 * 
 * Purpose: Show owners how their content will appear to students
 * Compliance: BE CONSCIOUS zero tolerance for any types
 */

import React from 'react';
import { PropertyWithDynamicContent } from '@/types/dynamic-property-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface ContentPreviewProps {
  readonly propertyContent: PropertyWithDynamicContent;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  propertyContent
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="h-5 w-5 mr-2" />
          Content Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Content preview will be implemented in the next iteration.
          This will show exactly how the property appears to students.
        </p>
      </CardContent>
    </Card>
  );
};

export default ContentPreview;
