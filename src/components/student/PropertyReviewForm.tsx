/**
 * Property Review Form Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Allows students to submit detailed property reviews with
 * 5-star ratings across multiple categories after booking completion
 * 
 * Technical Implementation: Type-safe form handling, booking verification,
 * and zero tolerance for 'any' types
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader, Star, CheckCircle, AlertTriangle, Upload, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import PropertyReviewService from '@/services/reviewService';
import CrossPortalInvalidationService from '@/services/queryInvalidation';
import {
  PropertyReviewFormData,
  ReviewRating,
  RATING_CATEGORIES
} from '@/types/reviews';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5, 'Title must be at least 5 characters').max(255),
  review_text: z.string().min(10, 'Review must be at least 10 characters').max(1000),
  cleanliness_rating: z.number().min(1).max(5),
  location_rating: z.number().min(1).max(5),
  value_rating: z.number().min(1).max(5),
  communication_rating: z.number().min(1).max(5),
  amenities_rating: z.number().min(1).max(5),
  is_anonymous: z.boolean()
});

type FormData = z.infer<typeof reviewSchema>;

// ============================================================================
// STAR RATING COMPONENT
// ============================================================================

interface StarRatingProps {
  readonly rating: number;
  readonly onRatingChange: (rating: ReviewRating) => void;
  readonly label: string;
  readonly required?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  label, 
  required = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 hover:scale-110 transition-transform"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(star as ReviewRating)}
          >
            <Star
              className={`h-6 w-6 ${
                star <= (hoverRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating}/5` : 'Not rated'}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface PropertyReviewFormProps {
  readonly propertyId: string;
  readonly studentId: string;
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

// ============================================================================
// COMPONENT IMPLEMENTATION
// ============================================================================

const PropertyReviewForm: React.FC<PropertyReviewFormProps> = ({
  propertyId,
  studentId,
  onSuccess,
  onCancel
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      cleanliness_rating: 0,
      location_rating: 0,
      value_rating: 0,
      communication_rating: 0,
      amenities_rating: 0,
      is_anonymous: false
    }
  });

  const watchedRatings = watch();

  // --------------------------------------------------------------------------
  // CHECK ELIGIBILITY
  // --------------------------------------------------------------------------

  const { data: eligibility, isLoading: checkingEligibility } = useQuery({
    queryKey: ['review-eligibility', studentId, propertyId],
    queryFn: () => PropertyReviewService.checkBookingEligibility(studentId, propertyId),
  });

  // --------------------------------------------------------------------------
  // MUTATION
  // --------------------------------------------------------------------------

  const createReviewMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const reviewData = {
        student_id: studentId,
        property_id: propertyId,
        rating: data.rating as ReviewRating,
        title: data.title,
        review_text: data.review_text,
        cleanliness_rating: data.cleanliness_rating as ReviewRating,
        location_rating: data.location_rating as ReviewRating,
        value_rating: data.value_rating as ReviewRating,
        communication_rating: data.communication_rating as ReviewRating,
        amenities_rating: data.amenities_rating as ReviewRating,
        is_anonymous: data.is_anonymous,
        images: [] // TODO: Implement image upload
      };

      return await PropertyReviewService.createPropertyReview(reviewData);
    },
    onSuccess: async (result) => {
      if (result.success) {
        toast({
          title: "Review Submitted",
          description: "Your review has been submitted successfully.",
        });

        // ✅ BE CONSCIOUS: Cross-portal invalidation for real-time updates
        await CrossPortalInvalidationService.invalidatePropertyReviewCreated(queryClient, {
          event: 'property_review_created',
          studentId,
          propertyId,
          // TODO: Get ownerId from property data
        });

        reset();
        setSelectedImages([]);
        onSuccess?.();
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || "Failed to submit review",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      logger.error('Failed to create review', { error });
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  });

  // --------------------------------------------------------------------------
  // EVENT HANDLERS
  // --------------------------------------------------------------------------

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Some files were skipped. Only images under 5MB are allowed.",
        variant: "destructive",
      });
    }

    setSelectedImages(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    // Validate all ratings are provided
    if (data.rating === 0 || data.cleanliness_rating === 0 || data.location_rating === 0 || 
        data.value_rating === 0 || data.communication_rating === 0 || data.amenities_rating === 0) {
      toast({
        title: "Incomplete Ratings",
        description: "Please provide ratings for all categories.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createReviewMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------------------------------

  if (checkingEligibility) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p>Checking eligibility...</p>
        </CardContent>
      </Card>
    );
  }

  // --------------------------------------------------------------------------
  // ELIGIBILITY CHECK
  // --------------------------------------------------------------------------

  if (!eligibility?.canReview) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {eligibility?.reason || 'You are not eligible to review this property.'}
            </AlertDescription>
          </Alert>
          {onCancel && (
            <Button onClick={onCancel} className="mt-4">
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER FORM
  // --------------------------------------------------------------------------

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Write a Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Overall Rating */}
          <StarRating
            rating={watchedRatings.rating}
            onRatingChange={(rating) => setValue('rating', rating)}
            label="Overall Rating"
            required
          />

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Summarize your experience"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review_text">Your Review *</Label>
            <Textarea
              id="review_text"
              {...register('review_text')}
              placeholder="Share your detailed experience with this property..."
              rows={4}
              className={errors.review_text ? 'border-red-500' : ''}
            />
            {errors.review_text && (
              <p className="text-sm text-red-500">{errors.review_text.message}</p>
            )}
          </div>

          {/* Category Ratings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Rate by Category</h3>
            <div className="grid gap-4">
              <StarRating
                rating={watchedRatings.cleanliness_rating}
                onRatingChange={(rating) => setValue('cleanliness_rating', rating)}
                label={RATING_CATEGORIES.cleanliness}
                required
              />
              <StarRating
                rating={watchedRatings.location_rating}
                onRatingChange={(rating) => setValue('location_rating', rating)}
                label={RATING_CATEGORIES.location}
                required
              />
              <StarRating
                rating={watchedRatings.value_rating}
                onRatingChange={(rating) => setValue('value_rating', rating)}
                label={RATING_CATEGORIES.value}
                required
              />
              <StarRating
                rating={watchedRatings.communication_rating}
                onRatingChange={(rating) => setValue('communication_rating', rating)}
                label={RATING_CATEGORIES.communication}
                required
              />
              <StarRating
                rating={watchedRatings.amenities_rating}
                onRatingChange={(rating) => setValue('amenities_rating', rating)}
                label={RATING_CATEGORIES.amenities}
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photos (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="review-image-upload"
              />
              <label
                htmlFor="review-image-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload images</p>
                <p className="text-xs text-gray-500">Max 5 images, 5MB each</p>
              </label>
            </div>

            {/* Selected Images */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_anonymous"
              checked={watchedRatings.is_anonymous}
              onCheckedChange={(checked) => setValue('is_anonymous', !!checked)}
            />
            <Label htmlFor="is_anonymous" className="text-sm">
              Submit this review anonymously
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyReviewForm;
