import React, { useState, useCallback, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { Progress } from '@/components/ui/progress';
import { compressImageFile, formatBytes } from '@/utils/imageCompression';
import { logger } from '@/utils/enhanced-logger';

interface SupabaseImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  propertyId?: string;
  variant?: 'default' | 'htmlMock';
  uploadLabel?: string; // emphasized label (e.g., Click to upload)
  uploadHelp?: string;  // secondary help (e.g., or drag and drop)
  note?: string;        // small note (e.g., JPG, PNG, up to 5MB)
  inputId?: string;     // ensure unique input per instance
  hideDropArea?: boolean; // when true, render only the grid with an Add more tile
  allowedMimeTypes?: string[]; // e.g., ['image/jpeg','image/png','image/webp','video/mp4']
  maxFileSizeMB?: number; // per-file size limit in MB
}

export const SupabaseImageUpload: React.FC<SupabaseImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  propertyId,
  variant = 'default',
  uploadLabel = 'Click to upload',
  uploadHelp = 'or drag and drop',
  note,
  inputId,
  hideDropArea = false,
  allowedMimeTypes = ['image/jpeg','image/png','image/webp'],
  maxFileSizeMB = 5,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const reactId = useId();
  const resolvedInputId = inputId || `image-upload-${reactId}`;
  const acceptAttr = allowedMimeTypes.join(',');
  const isVideoUrl = (url: string) => /\.mp4($|\?)/i.test(url);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // 1. Validate the type of what the user actually picked
      if (!allowedMimeTypes.includes(file.type)) {
        ErrorHandler.handle('Invalid file type', file.type);
        return null;
      }

      // Covers compression as well as the network upload
      setUploading(true);

      // 2. Compress before anything leaves the browser. Supabase's on-the-fly
      //    image transformation is a paid add-on this project does not have, so
      //    the stored object has to already be serving-sized. Never throws --
      //    it returns the original file if compression is not possible.
      const { file: uploadFile, originalBytes, finalBytes, skipped, reason } =
        await compressImageFile(file);

      if (skipped) {
        logger.debug('Skipped image compression', { name: file.name, reason });
      } else {
        logger.info('Compressed image before upload', {
          name: file.name,
          from: formatBytes(originalBytes),
          to: formatBytes(finalBytes),
          saved: `${Math.round((1 - finalBytes / originalBytes) * 100)}%`,
        });
      }

      // 3. Enforce the size cap on what is actually being uploaded, so a large
      //    phone photo is shrunk rather than rejected outright.
      if (uploadFile.size > maxFileSizeMB * 1024 * 1024) {
        setUploading(false);
        ErrorHandler.handle('File too large', uploadFile.size.toString());
        return null;
      }

      // 4. Sanitize file name (extension comes from the compressed file, which
      //    may now be .webp even though the original was .jpg)
      const fileExt = uploadFile.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'bin';
      const fileName = `${propertyId || 'temp'}_${Date.now()}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(filePath, uploadFile, {
          cacheControl: '3600',
          upsert: false
        });
      setUploadProgress(100);
      setUploading(false);
      if (error) {
        ErrorHandler.handle('Upload error', error.message);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      setUploadProgress(0);
      return publicUrl;
    } catch (error) {
      setUploadProgress(0);
      setUploading(false);
      ErrorHandler.handle('Error uploading image', error);
      return null;
    }
  };

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxImages} file(s) allowed`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type against allowed list
        if (!allowedMimeTypes.includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: `Allowed types: ${allowedMimeTypes.join(', ')}`,
            variant: "destructive"
          });
          continue;
        }

        // Validate file size
        if (file.size > maxFileSizeMB * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `Please select files smaller than ${maxFileSizeMB}MB`,
            variant: "destructive"
          });
          continue;
        }

        const imageUrl = await uploadImage(file);
        if (imageUrl) {
          newImages.push(imageUrl);
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
        toast({
          title: "Success",
          description: `${newImages.length} file(s) uploaded successfully`
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload some files",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, onImagesChange, propertyId, toast, allowedMimeTypes, maxFileSizeMB]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Hidden input kept outside so we can trigger it from multiple UI spots */}
      <input
        type="file"
        multiple
        accept={acceptAttr}
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
        id={resolvedInputId}
        disabled={uploading}
      />

      {/* Upload Area (optional) */}
      {!hideDropArea && (
        <Card
          className={`border-2 border-dashed transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="p-6">
            <div className="text-center">
              {variant === 'default' ? (
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              ) : null}
              {variant === 'default' ? (
                <div className="mb-4">
                  <p className="text-lg font-medium">Upload Property Images</p>
                  <p className="text-sm text-gray-500">
                    Drag and drop images here, or click to select files
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum {maxImages} images, up to 5MB each
                  </p>
                </div>
              ) : null}

              {variant === 'default' ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById(resolvedInputId)?.click()}
                  disabled={uploading || images.length >= maxImages}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Select Images
                    </>
                  )}
                </Button>
              ) : (
                <div
                  className="flex flex-col items-center gap-2 cursor-pointer select-none"
                  onClick={() => document.getElementById(resolvedInputId)?.click()}
                >
                  <span className="material-symbols-outlined text-4xl text-gray-400">upload_file</span>
                  <p className="text-gray-600">
                    <span className="font-semibold text-primary">{uploadLabel}</span> {uploadHelp}
                  </p>
                  <p className="text-xs text-gray-500">{note || `JPG, PNG, up to 5MB, max ${maxImages} image${maxImages>1?'s':''}`}</p>
                </div>
              )}

              {uploading && (
                <div className="w-full mt-4">
                  <Progress value={uploadProgress} max={100} />
                  <div className="text-xs text-gray-500 mt-1">Uploading...</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              {isVideoUrl(image) ? (
                <video className="w-full h-full object-cover" src={image} controls muted />
              ) : (
                <img
                  src={image}
                  alt={`Property media ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              )}
            </div>

            {/* Primary Badge */}
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Primary
              </div>
            )}

            {/* Controls */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => removeImage(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Move buttons */}
            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              {index > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => moveImage(index, index - 1)}
                  className="h-6 w-6 p-0 text-xs"
                >
                  ←
                </Button>
              )}
              {index < images.length - 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => moveImage(index, index + 1)}
                  className="h-6 w-6 p-0 text-xs"
                >
                  →
                </Button>
              )}
            </div>
          </div>
        ))}
          {variant === 'htmlMock' && images.length < maxImages && (
            <div
              className="flex cursor-pointer aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white text-center hover:border-primary"
              onClick={() => document.getElementById(resolvedInputId)?.click()}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-3xl text-gray-400">add_photo_alternate</span>
                <p className="text-xs text-gray-500 px-2">Add more</p>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};
