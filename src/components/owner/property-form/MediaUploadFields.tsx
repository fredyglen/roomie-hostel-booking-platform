
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { SupabaseImageUpload } from './SupabaseImageUpload';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from '@/types/property';

interface MediaUploadFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyId?: string;
}

export const MediaUploadFields: React.FC<MediaUploadFieldsProps> = ({
  form,
  propertyId
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Property Images</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload high-quality images of your property. The first image will be used as the primary image.
        </p>
        
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <SupabaseImageUpload
                  images={field.value || []}
                  onImagesChange={field.onChange}
                  maxImages={10}
                  propertyId={propertyId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
