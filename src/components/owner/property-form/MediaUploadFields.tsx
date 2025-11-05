
import React, { useEffect, useMemo, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { SupabaseImageUpload } from './SupabaseImageUpload';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';


interface MediaUploadFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyId?: string;
}

export const MediaUploadFields: React.FC<MediaUploadFieldsProps> = ({
  form,
  propertyId
}) => {
  // Local UI state for three media buckets
  const [cover, setCover] = useState<string[]>([]);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [environmentImages, setEnvironmentImages] = useState<string[]>([]);

  // Initialize from form values (runs once)
  useEffect(() => {
    const imageUrl = form.getValues('image_url');
    const images = form.getValues('images') || [];
    const initialCover = imageUrl ? [imageUrl] : [];
    // We can't distinguish property vs environment historically, so treat all as property by default
    const rest = images.filter((u) => u && u !== imageUrl);
    setCover(initialCover);
    setPropertyImages(rest);
    setEnvironmentImages([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to compute and push combined images to form
  const pushToForm = (nextCover: string[] = cover, nextProperty: string[] = propertyImages, nextEnv: string[] = environmentImages) => {
    const dedupe = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));
    const combined = dedupe([...(nextCover[0] ? [nextCover[0]] : []), ...nextProperty, ...nextEnv]);
    form.setValue('images', combined, { shouldDirty: true, shouldValidate: false });
    form.setValue('image_url', nextCover[0] || '', { shouldDirty: true, shouldValidate: false });
    form.trigger(['images', 'image_url']);
  };

  return (
    <div className="space-y-10">
      {/* Cover Image Section */}
      <section className="space-y-3">
        <header>
          <h2 className="text-neutral-900 dark:text-white text-lg font-bold tracking-[-0.01em]">Cover Image</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">This is the main image for your listing card. It's the first thing students will see.</p>
        </header>
        <SupabaseImageUpload
          images={cover}
          maxImages={1}
          propertyId={propertyId}
          variant="htmlMock"
          inputId="cover-upload"
          uploadLabel="Click to upload"
          uploadHelp="or drag and drop"
          note="JPG, PNG, up to 5MB, max 1 image"
          onImagesChange={(imgs) => {
            const nextCover = imgs.slice(0, 1);
            setCover(nextCover);
            pushToForm(nextCover, propertyImages, environmentImages);
          }}
        />
      </section>

      {/* Property Images & Videos Section */}
      <section className="space-y-3">
        <header>
          <h2 className="text-neutral-900 dark:text-white text-lg font-bold tracking-[-0.01em]">Property Images & Videos</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Showcase the property's interior, rooms, and key features. Videos are highly encouraged.</p>
        </header>
        <SupabaseImageUpload
          images={propertyImages}
          propertyId={propertyId}
          maxImages={20}
          variant="htmlMock"
          hideDropArea
          inputId="property-upload"
          allowedMimeTypes={['image/jpeg','image/png','image/webp','video/mp4']}
          maxFileSizeMB={10}
          uploadLabel="Add files"
          uploadHelp="or drag and drop"
          note="Upload up to 20 images/videos (JPG, PNG, MP4, up to 10MB each)."
          onImagesChange={(imgs) => {
            setPropertyImages(imgs);
            pushToForm(cover, imgs, environmentImages);
          }}
        />
      </section>

      {/* Environment & Surroundings Section */}
      <section className="space-y-3">
        <header>
          <h2 className="text-neutral-900 dark:text-white text-lg font-bold tracking-[-0.01em]">Environment & Surroundings</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Upload photos of the neighborhood, building exterior, or nearby landmarks.</p>
        </header>
        <SupabaseImageUpload
          images={environmentImages}
          propertyId={propertyId}
          maxImages={5}
          variant="htmlMock"
          hideDropArea
          inputId="environment-upload"
          uploadLabel="Add files"
          uploadHelp="or drag and drop"
          note="Upload up to 5 images (JPG, PNG, up to 5MB each)."
          onImagesChange={(imgs) => {
            setEnvironmentImages(imgs);
            pushToForm(cover, propertyImages, imgs);
          }}
        />
      </section>

      {/* Keep a hidden field binding so RHF tracks validation messages if any */}
      <FormField
        control={form.control}
        name="images"
        render={() => (
          <FormItem className="hidden">
            <FormLabel>Images</FormLabel>
            <FormControl>
              <div />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
