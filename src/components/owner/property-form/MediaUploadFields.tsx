
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { SupabaseImageUpload } from './SupabaseImageUpload';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from '@/components/owner/PropertyForm';

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
          render={({ field }) => {
            // Get current images from both fields
            const currentImages = field.value || [];
            const imageUrl = form.watch('image_url');

            // Combine images from both sources
            const allImages = Array.isArray(currentImages) ? currentImages :
                             currentImages ? [currentImages] :
                             imageUrl ? [imageUrl] : [];

            console.log('🚀 CURRENT IMAGES STATE', { field: field.value, imageUrl, allImages });

            return (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <SupabaseImageUpload
                    images={allImages}
                    onImagesChange={(images) => {
                      console.log('🚀 IMAGES CHANGED', images);
                      // Update both fields to ensure persistence
                      field.onChange(images);
                      form.setValue('image_url', images[0] || '', { shouldDirty: true });

                      // Force form to recognize changes
                      form.trigger(['images', 'image_url']);
                    }}
                    maxImages={10}
                    propertyId={propertyId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
};
