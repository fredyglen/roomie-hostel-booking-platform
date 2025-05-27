
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface PropertyImageUploadProps {
  form: UseFormReturn<PropertyFormValues>;
  mediaTab: string;
  setMediaTab: (tab: string) => void;
}

const PropertyImageUpload: React.FC<PropertyImageUploadProps> = ({ form, mediaTab, setMediaTab }) => {
  return (
    <div className="col-span-full">
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Images</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Tabs value={mediaTab} onValueChange={setMediaTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Images</TabsTrigger>
                    <TabsTrigger value="url">Image URL</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        id="image-upload"
                      />
                      <label 
                        htmlFor="image-upload" 
                        className="cursor-pointer block"
                      >
                        <div className="space-y-2">
                          <div className="text-gray-500">
                            Click to upload property images
                          </div>
                          <div className="text-sm text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </div>
                        </div>
                      </label>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="url">
                    <Input
                      placeholder="Enter image URL"
                      {...field}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PropertyImageUpload;
