# Phase 5 Schema Verification - Property Reviews Table

**Date:** 2025-11-05  
**Purpose:** Verify exact schema of `property_reviews` table before implementing Phase 5

---

## ✅ Schema Verification Results

**Query executed:** 2025-11-05  
**Table:** `property_reviews`

| column_name          | data_type                | is_nullable | column_default                 |
| -------------------- | ------------------------ | ----------- | ------------------------------ |
| id                   | uuid                     | NO          | gen_random_uuid()              |
| student_id           | uuid                     | NO          | null                           |
| property_id          | uuid                     | NO          | null                           |
| booking_id           | uuid                     | YES         | null                           |
| rating               | integer                  | NO          | null                           |
| title                | character varying        | YES         | null                           |
| review_text          | text                     | YES         | null                           |
| cleanliness_rating   | integer                  | YES         | null                           |
| location_rating      | integer                  | YES         | null                           |
| value_rating         | integer                  | YES         | null                           |
| communication_rating | integer                  | YES         | null                           |
| amenities_rating     | integer                  | YES         | null                           |
| images               | ARRAY                    | YES         | null                           |
| is_verified          | boolean                  | YES         | false                          |
| is_anonymous         | boolean                  | YES         | false                          |
| helpful_count        | integer                  | YES         | 0                              |
| reported_count       | integer                  | YES         | 0                              |
| status               | character varying        | YES         | 'published'::character varying |
| created_at           | timestamp with time zone | YES         | now()                          |
| updated_at           | timestamp with time zone | YES         | now()                          |

---

## 🔍 Schema Analysis

### Core Fields:
- ✅ **Primary Key:** `id` (uuid, auto-generated)
- ✅ **Student Reference:** `student_id` (uuid, NOT NULL) - who wrote the review
- ✅ **Property Reference:** `property_id` (uuid, NOT NULL) - which property
- ✅ **Booking Reference:** `booking_id` (uuid, NULLABLE) - optional link to booking
- ✅ **Overall Rating:** `rating` (integer, NOT NULL) - main rating (likely 1-5)

### Review Content:
- ✅ **Title:** `title` (varchar, nullable) - review headline
- ✅ **Review Text:** `review_text` (text, nullable) - detailed review
- ✅ **Images:** `images` (array, nullable) - review photos

### Detailed Ratings (All nullable integers):
- ✅ `cleanliness_rating` - How clean is the property
- ✅ `location_rating` - Location convenience
- ✅ `value_rating` - Value for money
- ✅ `communication_rating` - Owner/agent communication
- ✅ `amenities_rating` - Quality of amenities

### Moderation & Social:
- ✅ `is_verified` (boolean, default false) - Admin verified review
- ✅ `is_anonymous` (boolean, default false) - Hide student name
- ✅ `helpful_count` (integer, default 0) - Upvotes/helpful clicks
- ✅ `reported_count` (integer, default 0) - Abuse reports
- ✅ `status` (varchar, default 'published') - published/pending/rejected

### Timestamps:
- ✅ `created_at` (timestamp, default now())
- ✅ `updated_at` (timestamp, default now())

---

## 🎯 Implementation Plan

### TypeScript Type:
```typescript
interface PropertyReview {
  id: string;
  student_id: string;
  property_id: string;
  booking_id: string | null;
  rating: number; // 1-5
  title: string | null;
  review_text: string | null;
  cleanliness_rating: number | null;
  location_rating: number | null;
  value_rating: number | null;
  communication_rating: number | null;
  amenities_rating: number | null;
  images: string[] | null;
  is_verified: boolean;
  is_anonymous: boolean;
  helpful_count: number;
  reported_count: number;
  status: 'published' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
  // Joined data
  student?: {
    full_name: string;
    avatar_url: string | null;
  };
}
```

### Hook Functions:
1. `usePropertyReviews(propertyId)` - Get all reviews for a property
2. `useSubmitReview()` - Submit new review with rating
3. `useUpdatePropertyRating()` - Recalculate property's aggregated rating
4. `useMarkReviewHelpful()` - Increment helpful_count
5. `useReportReview()` - Increment reported_count

### Components to Create:
1. `ReviewsList.tsx` - Display all reviews for a property
2. `ReviewCard.tsx` - Individual review display
3. `ReviewForm.tsx` - Submit new review
4. `RatingDisplay.tsx` - Show star ratings
5. `DetailedRatings.tsx` - Show breakdown of cleanliness/location/etc

### Rating Aggregation Logic:
When a review is submitted:
1. Calculate average rating from all property reviews
2. Update `properties.rating` column (added in Phase 1)
3. Update `properties.review_count` column (added in Phase 1)

---

## 🚀 Proceeding to Implementation

**Status:** Schema verified, ready to implement Phase 5!

**Key Findings:**
- ✅ Comprehensive review system with 5 detailed rating categories
- ✅ Support for review images
- ✅ Moderation workflow (status field)
- ✅ Social features (helpful_count, is_anonymous)
- ✅ Optional booking link for verified stays
- ✅ Uses `student_id` (not `user_id`) - must match this exactly

