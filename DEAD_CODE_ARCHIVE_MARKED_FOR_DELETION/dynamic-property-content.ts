/**
 * Dynamic Property Content Types
 * Apple-Grade TypeScript Interfaces for Owner-Managed Property Content
 * 
 * Purpose: Eliminate hardcoded values and enable dynamic property content
 * Compliance: BE CONSCIOUS zero tolerance for any types
 * Database: Corresponds to dynamic property content schema
 */

import { z } from 'zod';

// ============================================================================
// BRANDED TYPES FOR COMPILE-TIME SAFETY
// ============================================================================

export type PropertyContentId = string & { readonly __brand: 'PropertyContentId' };
export type AmenityId = string & { readonly __brand: 'AmenityId' };
export type HouseRuleId = string & { readonly __brand: 'HouseRuleId' };
export type ConsiderationId = string & { readonly __brand: 'ConsiderationId' };
export type PropertyMediaId = string & { readonly __brand: 'PropertyMediaId' };

// Helper functions for branded types
export const createPropertyContentId = (id: string): PropertyContentId => id as PropertyContentId;
export const createAmenityId = (id: string): AmenityId => id as AmenityId;
export const createHouseRuleId = (id: string): HouseRuleId => id as HouseRuleId;
export const createConsiderationId = (id: string): ConsiderationId => id as ConsiderationId;
export const createPropertyMediaId = (id: string): PropertyMediaId => id as PropertyMediaId;

// ============================================================================
// AMENITIES SYSTEM
// ============================================================================

export interface AmenityCategory {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly iconName: string;
  readonly displayOrder: number;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Amenity {
  readonly id: AmenityId;
  readonly name: string;
  readonly description?: string;
  readonly categoryId: string;
  readonly iconName: string;
  readonly isPremium: boolean;
  readonly isActive: boolean;
  readonly displayOrder: number;
  readonly requiresVerification: boolean;
  readonly affectsPricing: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PropertyAmenity {
  readonly id: string;
  readonly propertyId: string;
  readonly amenityId: AmenityId;
  readonly isAvailable: boolean;
  readonly customDescription?: string;
  readonly additionalCost: number;
  readonly isVerified: boolean;
  readonly verifiedAt?: string;
  readonly verifiedBy?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: string;
  readonly updatedBy: string;
  
  // Populated from joins
  readonly amenity?: Amenity;
}

// ============================================================================
// HOUSE RULES SYSTEM
// ============================================================================

export type RuleSeverityLevel = 'info' | 'warning' | 'strict' | 'critical';

export interface RuleCategory {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly iconName: string;
  readonly isMandatory: boolean;
  readonly displayOrder: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface HouseRule {
  readonly id: HouseRuleId;
  readonly title: string;
  readonly description: string;
  readonly categoryId: string;
  readonly iconName: string;
  readonly severityLevel: RuleSeverityLevel;
  readonly isCustomizable: boolean;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PropertyHouseRule {
  readonly id: string;
  readonly propertyId: string;
  readonly houseRuleId: HouseRuleId;
  readonly customDescription?: string;
  readonly isStrictlyEnforced: boolean;
  readonly penaltyDescription?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: string;
  readonly updatedBy: string;
  
  // Populated from joins
  readonly houseRule?: HouseRule;
}

// ============================================================================
// THINGS TO CONSIDER SYSTEM
// ============================================================================

export type ConsiderationSeverityLevel = 'info' | 'warning' | 'important' | 'critical';

export interface ConsiderationCategory {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly iconName: string;
  readonly severityLevel: ConsiderationSeverityLevel;
  readonly displayOrder: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PropertyConsideration {
  readonly id: ConsiderationId;
  readonly propertyId: string;
  readonly categoryId: string;
  readonly title: string;
  readonly description: string;
  readonly severityLevel: ConsiderationSeverityLevel;
  readonly iconName: string;
  readonly affectsBooking: boolean;
  readonly requiresAcknowledgment: boolean;
  readonly displayOrder: number;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: string;
  readonly updatedBy: string;
  
  // Populated from joins
  readonly category?: ConsiderationCategory;
}

// ============================================================================
// PROPERTY CONTENT SYSTEM
// ============================================================================

export type PropertyContentStatus = 'draft' | 'review' | 'published' | 'archived';

export interface NearbyLandmark {
  readonly name: string;
  readonly type: string;
  readonly distanceMeters: number;
  readonly description?: string;
}

export interface TransportationInfo {
  readonly publicTransport?: ReadonlyArray<string>;
  readonly walkingTimeMinutes?: number;
  readonly drivingTimeMinutes?: number;
  readonly parkingAvailable?: boolean;
  readonly accessibilityFeatures?: ReadonlyArray<string>;
}

export interface EmergencyContact {
  readonly name?: string;
  readonly phone?: string;
  readonly relationship?: string;
  readonly isAvailable24h?: boolean;
}

export interface PropertyContent {
  readonly id: PropertyContentId;
  readonly propertyId: string;
  
  // About Section
  readonly aboutTitle?: string;
  readonly aboutDescription: string;
  readonly aboutHighlights: ReadonlyArray<string>;
  
  // Location Details
  readonly locationDescription?: string;
  readonly nearbyLandmarks: ReadonlyArray<NearbyLandmark>;
  readonly transportationInfo: TransportationInfo;
  readonly distanceToCampusMeters?: number;
  
  // Contact Information (Paywall Protected)
  readonly contactVisibleAfterPayment: boolean;
  readonly emergencyContact: EmergencyContact;
  
  // Content Management
  readonly contentStatus: PropertyContentStatus;
  readonly lastReviewedAt?: string;
  readonly reviewedBy?: string;
  readonly version: number;
  
  // Audit Fields
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: string;
  readonly updatedBy: string;
}

// ============================================================================
// PROPERTY MEDIA SYSTEM
// ============================================================================

export type MediaType = 'image' | 'video' | 'virtual_tour' | 'document';
export type MediaPurpose = 'cover' | 'gallery' | 'room' | 'amenity' | 'exterior' | 'common_area';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface PropertyMedia {
  readonly id: PropertyMediaId;
  readonly propertyId: string;
  
  // File Information
  readonly fileName: string;
  readonly filePath: string;
  readonly fileSizeBytes: number;
  readonly mimeType: string;
  
  // Media Properties
  readonly mediaType: MediaType;
  readonly purpose: MediaPurpose;
  readonly title?: string;
  readonly description?: string;
  readonly altText?: string;
  readonly displayOrder: number;
  readonly isCover: boolean;
  
  // Processing
  readonly processingStatus: ProcessingStatus;
  readonly thumbnailPath?: string;
  readonly optimizedPath?: string;
  
  // Verification
  readonly isVerified: boolean;
  readonly moderationStatus: ModerationStatus;
  readonly moderationNotes?: string;
  readonly verifiedAt?: string;
  readonly verifiedBy?: string;
  
  // Audit Fields
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: string;
  readonly updatedBy: string;
}

// ============================================================================
// COMPLETE PROPERTY WITH DYNAMIC CONTENT
// ============================================================================

export interface PropertyWithDynamicContent {
  readonly propertyId: string;
  readonly content?: PropertyContent;
  readonly amenities: ReadonlyArray<PropertyAmenity>;
  readonly houseRules: ReadonlyArray<PropertyHouseRule>;
  readonly considerations: ReadonlyArray<PropertyConsideration>;
  readonly media: ReadonlyArray<PropertyMedia>;
  
  // Computed fields
  readonly hasVerifiedMedia: boolean;
  readonly totalConsiderations: number;
  readonly criticalConsiderations: number;
  readonly isContentComplete: boolean;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

// Property Content Validation
export const PropertyContentSchema = z.object({
  aboutTitle: z.string().min(5).max(100).optional(),
  aboutDescription: z.string().min(50).max(2000),
  aboutHighlights: z.array(z.string().min(1).max(100)).default([]),
  locationDescription: z.string().max(1000).optional(),
  nearbyLandmarks: z.array(z.object({
    name: z.string().min(1).max(100),
    type: z.string().min(1).max(50),
    distanceMeters: z.number().positive(),
    description: z.string().max(200).optional()
  })).default([]),
  transportationInfo: z.object({
    publicTransport: z.array(z.string()).optional(),
    walkingTimeMinutes: z.number().positive().optional(),
    drivingTimeMinutes: z.number().positive().optional(),
    parkingAvailable: z.boolean().optional(),
    accessibilityFeatures: z.array(z.string()).optional()
  }).default({}),
  distanceToCampusMeters: z.number().positive().optional(),
  contactVisibleAfterPayment: z.boolean().default(true),
  emergencyContact: z.object({
    name: z.string().max(100).optional(),
    phone: z.string().max(20).optional(),
    relationship: z.string().max(50).optional(),
    isAvailable24h: z.boolean().optional()
  }).default({})
});

// Property Consideration Validation
export const PropertyConsiderationSchema = z.object({
  categoryId: z.string().uuid(),
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(500),
  severityLevel: z.enum(['info', 'warning', 'important', 'critical']),
  iconName: z.string().min(2).max(50),
  affectsBooking: z.boolean().default(false),
  requiresAcknowledgment: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0)
});

// Property Media Validation
export const PropertyMediaSchema = z.object({
  fileName: z.string().min(1).max(255),
  mediaType: z.enum(['image', 'video', 'virtual_tour', 'document']),
  purpose: z.enum(['cover', 'gallery', 'room', 'amenity', 'exterior', 'common_area']),
  title: z.string().max(100).optional(),
  description: z.string().max(300).optional(),
  altText: z.string().max(200).optional(),
  displayOrder: z.number().int().min(0).default(0),
  isCover: z.boolean().default(false)
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type PropertyContentInput = z.infer<typeof PropertyContentSchema>;
export type PropertyConsiderationInput = z.infer<typeof PropertyConsiderationSchema>;
export type PropertyMediaInput = z.infer<typeof PropertyMediaSchema>;

// ============================================================================
// BUSINESS RULES AND CONSTANTS
// ============================================================================

export const PROPERTY_CONTENT_RULES = {
  MIN_ABOUT_DESCRIPTION_LENGTH: 50,
  MAX_ABOUT_DESCRIPTION_LENGTH: 2000,
  MAX_HIGHLIGHTS_COUNT: 10,
  MAX_NEARBY_LANDMARKS: 20,
  MAX_MEDIA_PER_PROPERTY: 25,
  MAX_CONSIDERATIONS_PER_PROPERTY: 15,
  MAX_AMENITIES_PER_PROPERTY: 30,
  MAX_HOUSE_RULES_PER_PROPERTY: 20
} as const;

export const MEDIA_CONSTRAINTS = {
  MAX_IMAGE_SIZE_MB: 5,
  MAX_VIDEO_SIZE_MB: 50,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'] as const,
  THUMBNAIL_SIZES: [150, 300, 600] as const
} as const;
