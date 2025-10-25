
import React, { useEffect, useMemo, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { SupabaseImageUpload } from './SupabaseImageUpload';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
    <div className="space-y-6">
      <Tabs defaultValue="cover" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cover">Cover Image</TabsTrigger>
          <TabsTrigger value="property">Property Images</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
        </TabsList>

        <TabsContent value="cover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <SupabaseImageUpload
                images={cover}
                maxImages={1}
                propertyId={propertyId}
                onImagesChange={(imgs) => {
                  const nextCover = imgs.slice(0, 1);
                  setCover(nextCover);
                  pushToForm(nextCover, propertyImages, environmentImages);
                }}
              />
              <p className="text-xs text-gray-500 mt-2">This image appears on the card thumbnail and listing cover.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="property" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
            </CardHeader>
            <CardContent>
              <SupabaseImageUpload
                images={propertyImages}
                propertyId={propertyId}
                maxImages={12}
                onImagesChange={(imgs) => {
                  setPropertyImages(imgs);
                  pushToForm(cover, imgs, environmentImages);
                }}
              />
              <p className="text-xs text-gray-500 mt-2">Show rooms, corridors, kitchens, washrooms, study areas, etc.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <SupabaseImageUpload
                images={environmentImages}
                propertyId={propertyId}
                maxImages={12}
                onImagesChange={(imgs) => {
                  setEnvironmentImages(imgs);
                  pushToForm(cover, propertyImages, imgs);
                }}
              />
              <p className="text-xs text-gray-500 mt-2">Show surroundings: neighborhood, campus proximity, landmarks.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
