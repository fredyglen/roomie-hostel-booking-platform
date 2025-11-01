import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { PropertyPreview } from '@/utils/propertyPreviewCache';

interface BookingFormSkeletonProps {
  preview?: PropertyPreview | null;
}

const BookingFormSkeleton: React.FC<BookingFormSkeletonProps> = ({ preview }) => {
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="mx-auto md:px-4 md:py-4 md:max-w-xl">
        {/* Desktop header skeleton */}
        <div className="hidden md:block mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-9 w-24 rounded-md bg-gray-200" />
            <div>
              <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-64 bg-gray-100 rounded" />
            </div>
          </div>
        </div>

        {/* Optional single cover image (never a gallery) */}
        {preview?.coverImage && (
          <div className="md:hidden mb-3">
            <img
              src={preview.coverImage}
              alt={preview.title}
              className="w-full h-40 object-cover"
            />
          </div>
        )}

        {/* Form card skeleton */}
        <Card>
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-100 rounded" />
              <div className="h-10 w-full bg-gray-100 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-10 w-full bg-gray-100 rounded" />
            </div>
            <div className="flex justify-end">
              <div className="h-10 w-28 bg-gray-200 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingFormSkeleton;

