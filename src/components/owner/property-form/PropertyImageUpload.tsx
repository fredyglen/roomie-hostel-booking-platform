
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface PropertyImageUploadProps {
  form: UseFormReturn<PropertyFormValues>;
  mediaTab: string;
  setMediaTab: (value: string) => void;
}

const PropertyImageUpload: React.FC<PropertyImageUploadProps> = ({ form, mediaTab, setMediaTab }) => {
  return (
    <div className="md:col-span-2">
      <Tabs defaultValue={mediaTab} onValueChange={setMediaTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
          <TabsTrigger value="cover">Cover Photo</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="pt-4">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Images</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                        {field.value && (
                          <p className="mt-2 text-xs text-green-600">
                            Image URL: {field.value}
                          </p>
                        )}
                      </div>
                      <Input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                      />
                    </label>
                  </div>
                  <Input 
                    type="text" 
                    placeholder="Or enter image URL directly: https://example.com/image.jpg"
                    {...field}
                    className="mt-2"
                  />
                </FormControl>
                <FormDescription>
                  Upload property images or provide image URLs
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
        <TabsContent value="cover" className="pt-4">
          <FormItem>
            <FormLabel>Cover Photo</FormLabel>
            <FormDescription>
              Select a landscape orientation photo to use as the main image for this property
            </FormDescription>
            {form.getValues("image_url") ? (
              <div className="aspect-video w-full rounded-md border overflow-hidden">
                <img 
                  src={form.getValues("image_url")} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/800x450?text=No+Image+Available";
                  }}
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-md border bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">No cover image selected</p>
              </div>
            )}
          </FormItem>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyImageUpload;
