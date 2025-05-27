
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Upload, Image, Video, Camera, FileText } from 'lucide-react';

interface MediaUploadTabsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const MediaUploadTabs: React.FC<MediaUploadTabsProps> = ({ form }) => {
  const [activeTab, setActiveTab] = useState<string>("photos");

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
                    <TabsTrigger value="photos" className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Photos
                    </TabsTrigger>
                    <TabsTrigger value="videos" className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Videos
                    </TabsTrigger>
                    <TabsTrigger value="virtual" className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Virtual Tour
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Documents
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="photos" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="photo-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Upload property photos
                            </span>
                            <span className="mt-1 block text-sm text-gray-500">
                              PNG, JPG, GIF up to 10MB each
                            </span>
                          </label>
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                          />
                        </div>
                        <div className="mt-4">
                          <Input
                            placeholder="Or enter image URL"
                            {...field}
                          />
                        </div>
                      </div>
                    </div>
                    {field.value && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="relative">
                          <img
                            src={field.value}
                            alt="Property"
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="videos" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Video className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload property videos
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            MP4, MOV up to 50MB each
                          </span>
                        </div>
                        <div className="mt-4">
                          <Input
                            placeholder="Enter YouTube or Vimeo URL"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="virtual" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Virtual Tour Link
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            Link to 360° tour or virtual walkthrough
                          </span>
                        </div>
                        <div className="mt-4">
                          <Input
                            placeholder="Enter virtual tour URL (Matterport, etc.)"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documents" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Property Documents
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            Floor plans, agreements, certificates (PDF only)
                          </span>
                        </div>
                        <div className="mt-4">
                          <Input
                            type="file"
                            accept=".pdf"
                            multiple
                          />
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
