
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Upload, Image, Video, Camera, MapPin } from 'lucide-react';

interface MediaUploadTabsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const MediaUploadTabs: React.FC<MediaUploadTabsProps> = ({ form }) => {
  const [activeTab, setActiveTab] = useState<string>("cover");

  return (
    <div className="col-span-full">
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Media</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="cover" className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Cover Image
                    </TabsTrigger>
                    <TabsTrigger value="property" className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Property/Room Media
                    </TabsTrigger>
                    <TabsTrigger value="environment" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Environment Showcase
                    </TabsTrigger>
                    <TabsTrigger value="virtual" disabled className="flex items-center gap-2 opacity-50">
                      <Camera className="w-4 h-4" />
                      Virtual Tour
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="cover" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="cover-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Upload cover image
                            </span>
                            <span className="mt-1 block text-sm text-gray-500">
                              This will be the main image shown on property cards
                            </span>
                          </label>
                          <input
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                        <div className="mt-4">
                          <Input
                            placeholder="Or enter cover image URL"
                            {...field}
                          />
                        </div>
                      </div>
                    </div>
                    {field.value && (
                      <div className="aspect-video w-full rounded-lg overflow-hidden border">
                        <img
                          src={field.value}
                          alt="Cover"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/800x450?text=Cover+Image";
                          }}
                        />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="property" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Video className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload property and room media
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            Images and videos of rooms, bathrooms, kitchen, etc. (Max 50MB each)
                          </span>
                        </div>
                        <div className="mt-4">
                          <Input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="mb-2"
                          />
                          <Input
                            placeholder="Or enter media URLs (one per line)"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="environment" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Environment showcase
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            Photos of the compound, surroundings, nearby facilities
                          </span>
                        </div>
                        <div className="mt-4">
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            className="mb-2"
                          />
                          <Input
                            placeholder="Environment image URLs"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="virtual" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-300" />
                        <div className="mt-4">
                          <span className="mt-2 block text-sm font-medium text-gray-400">
                            Virtual Tour (Coming Soon)
                          </span>
                          <span className="mt-1 block text-sm text-gray-400">
                            360° tours and virtual walkthroughs will be available in a future update
                          </span>
                        </div>
                      </div>
                    </div>
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

export default MediaUploadTabs;
