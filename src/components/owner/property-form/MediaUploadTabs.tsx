import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { 
  Upload, 
  Image, 
  Video, 
  FileText, 
  Globe, 
  Star,
  X,
  Eye
} from 'lucide-react';

interface MediaUploadTabsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const MediaUploadTabs: React.FC<MediaUploadTabsProps> = ({ form }) => {
  const [coverImage, setCoverImage] = useState<string>('');
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [environmentMedia, setEnvironmentMedia] = useState<string[]>([]);

  const handleFileUpload = (files: FileList | null, type: 'cover' | 'property' | 'environment') => {
    if (!files) return;

    // Convert FileList to Array and create preview URLs
    const fileArray = Array.from(files);
    const urls = fileArray.map(file => URL.createObjectURL(file));

    switch (type) {
      case 'cover':
        if (urls.length > 0) {
          setCoverImage(urls[0]);
        }
        break;
      case 'property':
        setPropertyImages(prev => [...prev, ...urls]);
        break;
      case 'environment':
        setEnvironmentMedia(prev => [...prev, ...urls]);
        break;
    }

    // Update form with all images
    const allImages = [coverImage, ...propertyImages, ...environmentMedia, ...urls].filter(Boolean);
    form.setValue('images', allImages);
  };

  const removeMedia = (index: number, type: 'cover' | 'property' | 'environment') => {
    switch (type) {
      case 'cover':
        setCoverImage('');
        break;
      case 'property':
        setPropertyImages(prev => prev.filter((_, i) => i !== index));
        break;
      case 'environment':
        setEnvironmentMedia(prev => prev.filter((_, i) => i !== index));
        break;
    }
  };

  return (
    <Tabs defaultValue="cover" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="cover" className="flex items-center space-x-2">
          <Star className="w-4 h-4" />
          <span>Cover Image</span>
        </TabsTrigger>
        <TabsTrigger value="property" className="flex items-center space-x-2">
          <Image className="w-4 h-4" />
          <span>Property Media</span>
        </TabsTrigger>
        <TabsTrigger value="environment" className="flex items-center space-x-2">
          <Video className="w-4 h-4" />
          <span>Environment</span>
        </TabsTrigger>
        <TabsTrigger value="virtual" className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span>Virtual Tour</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cover" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Cover Image</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose the main image that will represent your property. This will be the first image students see.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {coverImage ? (
                <div className="relative">
                  <img 
                    src={coverImage} 
                    alt="Cover" 
                    className="max-w-full h-48 object-cover mx-auto rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeMedia(0, 'cover')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Upload Cover Image</p>
                  <p className="text-sm text-gray-600 mb-4">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, 'cover')}
                    className="max-w-xs mx-auto"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="property" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Image className="w-5 h-5" />
              <span>Property Images & Videos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload multiple images and videos showcasing different areas of your property (rooms, common areas, facilities).
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Upload Property Media</p>
              <p className="text-sm text-gray-600 mb-4">
                Images: PNG, JPG, GIF | Videos: MP4, MOV, AVI up to 50MB each
              </p>
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files, 'property')}
                className="max-w-xs mx-auto"
              />
            </div>

            {propertyImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {propertyImages.map((media, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={media} 
                      alt={`Property ${index + 1}`} 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => removeMedia(index, 'property')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="environment" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span>Environment Showcase</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload images and videos showing the surrounding environment, neighborhood, nearby facilities, and campus proximity.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Upload Environment Media</p>
              <p className="text-sm text-gray-600 mb-4">
                Show nearby amenities, campus distance, neighborhood safety
              </p>
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files, 'environment')}
                className="max-w-xs mx-auto"
              />
            </div>

            {environmentMedia.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {environmentMedia.map((media, index) => (
                  <div key={index} className="relative">
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      {media.includes('video') ? (
                        <Video className="w-8 h-8 text-gray-400" />
                      ) : (
                        <img 
                          src={media} 
                          alt={`Environment ${index + 1}`} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => removeMedia(index, 'environment')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="virtual" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Virtual Tour</span>
              <Badge variant="outline">Premium Feature</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Add a virtual tour link to give students an immersive 360° view of your property.
            </p>
            
            <FormField
              control={form.control}
              name="virtual_tour_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Virtual Tour URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/your-virtual-tour"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Virtual Tour Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use services like Matterport, Kuula, or Roundme</li>
                <li>• Ensure good lighting when capturing</li>
                <li>• Include common areas and sample rooms</li>
                <li>• Virtual tours increase booking rates by 40%</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default MediaUploadTabs;
