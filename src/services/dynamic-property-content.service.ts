/**
 * Dynamic Property Content Service
 * Apple-Grade Service Layer for Owner-Managed Property Content
 * 
 * Purpose: Replace hardcoded values with database-driven dynamic content
 * Compliance: BE CONSCIOUS zero tolerance for any types
 * Architecture: Clean separation of concerns with proper error handling
 */

import { supabase } from '@/lib/supabase';
import { 
  PropertyContent,
  PropertyAmenity,
  PropertyHouseRule,
  PropertyConsideration,
  PropertyMedia,
  PropertyWithDynamicContent,
  PropertyContentInput,
  PropertyConsiderationInput,
  PropertyMediaInput,
  createPropertyContentId,
  createAmenityId,
  createHouseRuleId,
  createConsiderationId,
  createPropertyMediaId
} from '@/types/dynamic-property-content';
import { enhancedLogger } from '@/utils/enhanced-logger';
import { Result, createSuccess, createError } from '@/types/result';

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class DynamicPropertyContentService {
  private static instance: DynamicPropertyContentService;
  
  public static getInstance(): DynamicPropertyContentService {
    if (!DynamicPropertyContentService.instance) {
      DynamicPropertyContentService.instance = new DynamicPropertyContentService();
    }
    return DynamicPropertyContentService.instance;
  }

  // ============================================================================
  // PROPERTY CONTENT OPERATIONS
  // ============================================================================

  /**
   * Get complete property content with all related data
   */
  async getPropertyDynamicContent(propertyId: string): Promise<Result<PropertyWithDynamicContent, Error>> {
    try {
      enhancedLogger.info('Fetching dynamic property content', { propertyId });

      // Use the database function for optimized query
      const { data, error } = await supabase
        .rpc('get_property_dynamic_content', { p_property_id: propertyId });

      if (error) {
        enhancedLogger.error('Failed to fetch property dynamic content', { error, propertyId });
        return createError(new Error(`Failed to fetch property content: ${error.message}`));
      }

      if (!data) {
        enhancedLogger.warn('No dynamic content found for property', { propertyId });
        return createSuccess(this.createEmptyPropertyContent(propertyId));
      }

      const transformedContent = this.transformDatabaseContent(data, propertyId);
      
      enhancedLogger.info('Successfully fetched property dynamic content', { 
        propertyId,
        hasContent: !!transformedContent.content,
        amenitiesCount: transformedContent.amenities.length,
        rulesCount: transformedContent.houseRules.length,
        considerationsCount: transformedContent.considerations.length,
        mediaCount: transformedContent.media.length
      });

      return createSuccess(transformedContent);
    } catch (error) {
      enhancedLogger.error('Unexpected error fetching property dynamic content', { error, propertyId });
      return createError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * Create or update property content
   */
  async upsertPropertyContent(
    propertyId: string, 
    contentInput: PropertyContentInput,
    userId: string
  ): Promise<Result<PropertyContent, Error>> {
    try {
      enhancedLogger.info('Upserting property content', { propertyId, userId });

      const { data, error } = await supabase
        .from('property_content')
        .upsert({
          property_id: propertyId,
          about_title: contentInput.aboutTitle,
          about_description: contentInput.aboutDescription,
          about_highlights: contentInput.aboutHighlights,
          location_description: contentInput.locationDescription,
          nearby_landmarks: contentInput.nearbyLandmarks,
          transportation_info: contentInput.transportationInfo,
          distance_to_campus_meters: contentInput.distanceToCampusMeters,
          contact_visible_after_payment: contentInput.contactVisibleAfterPayment,
          emergency_contact: contentInput.emergencyContact,
          content_status: 'published',
          created_by: userId,
          updated_by: userId
        }, {
          onConflict: 'property_id'
        })
        .select()
        .single();

      if (error) {
        enhancedLogger.error('Failed to upsert property content', { error, propertyId, userId });
        return createError(new Error(`Failed to save property content: ${error.message}`));
      }

      const transformedContent = this.transformPropertyContent(data);
      
      enhancedLogger.info('Successfully upserted property content', { propertyId, userId });
      return createSuccess(transformedContent);
    } catch (error) {
      enhancedLogger.error('Unexpected error upserting property content', { error, propertyId, userId });
      return createError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  // ============================================================================
  // AMENITIES OPERATIONS
  // ============================================================================

  /**
   * Get all available amenities for property selection
   */
  async getAvailableAmenities(): Promise<Result<ReadonlyArray<{ id: string; name: string; category: string; iconName: string; isPremium: boolean }>, Error>> {
    try {
      enhancedLogger.info('Fetching available amenities');

      const { data, error } = await supabase
        .from('amenities')
        .select(`
          id,
          name,
          icon_name,
          is_premium,
          category:amenity_categories(name)
        `)
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        enhancedLogger.error('Failed to fetch available amenities', { error });
        return createError(new Error(`Failed to fetch amenities: ${error.message}`));
      }

      const transformedAmenities = data.map(amenity => ({
        id: amenity.id,
        name: amenity.name,
        category: amenity.category?.name || 'Other',
        iconName: amenity.icon_name,
        isPremium: amenity.is_premium
      }));

      enhancedLogger.info('Successfully fetched available amenities', { count: transformedAmenities.length });
      return createSuccess(transformedAmenities);
    } catch (error) {
      enhancedLogger.error('Unexpected error fetching available amenities', { error });
      return createError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * Update property amenities
   */
  async updatePropertyAmenities(
    propertyId: string,
    amenityIds: ReadonlyArray<string>,
    userId: string
  ): Promise<Result<ReadonlyArray<PropertyAmenity>, Error>> {
    try {
      enhancedLogger.info('Updating property amenities', { propertyId, amenityCount: amenityIds.length, userId });

      // First, remove existing amenities
      await supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', propertyId);

      // Then, add new amenities
      if (amenityIds.length > 0) {
        const amenitiesData = amenityIds.map(amenityId => ({
          property_id: propertyId,
          amenity_id: amenityId,
          is_available: true,
          created_by: userId,
          updated_by: userId
        }));

        const { error } = await supabase
          .from('property_amenities')
          .insert(amenitiesData);

        if (error) {
          enhancedLogger.error('Failed to insert property amenities', { error, propertyId, userId });
          return createError(new Error(`Failed to update amenities: ${error.message}`));
        }
      }

      // Fetch updated amenities with details
      const { data, error: fetchError } = await supabase
        .from('property_amenities')
        .select(`
          *,
          amenity:amenities(*)
        `)
        .eq('property_id', propertyId)
        .eq('is_available', true);

      if (fetchError) {
        enhancedLogger.error('Failed to fetch updated property amenities', { error: fetchError, propertyId });
        return createError(new Error(`Failed to fetch updated amenities: ${fetchError.message}`));
      }

      const transformedAmenities = data.map(this.transformPropertyAmenity);
      
      enhancedLogger.info('Successfully updated property amenities', { propertyId, count: transformedAmenities.length, userId });
      return createSuccess(transformedAmenities);
    } catch (error) {
      enhancedLogger.error('Unexpected error updating property amenities', { error, propertyId, userId });
      return createError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  // ============================================================================
  // CONSIDERATIONS OPERATIONS
  // ============================================================================

  /**
   * Add property consideration
   */
  async addPropertyConsideration(
    propertyId: string,
    considerationInput: PropertyConsiderationInput,
    userId: string
  ): Promise<Result<PropertyConsideration, Error>> {
    try {
      enhancedLogger.info('Adding property consideration', { propertyId, userId });

      const { data, error } = await supabase
        .from('property_considerations')
        .insert({
          property_id: propertyId,
          category_id: considerationInput.categoryId,
          title: considerationInput.title,
          description: considerationInput.description,
          severity_level: considerationInput.severityLevel,
          icon_name: considerationInput.iconName,
          affects_booking: considerationInput.affectsBooking,
          requires_acknowledgment: considerationInput.requiresAcknowledgment,
          display_order: considerationInput.displayOrder,
          created_by: userId,
          updated_by: userId
        })
        .select()
        .single();

      if (error) {
        enhancedLogger.error('Failed to add property consideration', { error, propertyId, userId });
        return createError(new Error(`Failed to add consideration: ${error.message}`));
      }

      const transformedConsideration = this.transformPropertyConsideration(data);
      
      enhancedLogger.info('Successfully added property consideration', { propertyId, considerationId: transformedConsideration.id, userId });
      return createSuccess(transformedConsideration);
    } catch (error) {
      enhancedLogger.error('Unexpected error adding property consideration', { error, propertyId, userId });
      return createError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  // ============================================================================
  // VALIDATION OPERATIONS
  // ============================================================================

  /**
   * Validate property content completeness
   */
  async validatePropertyContentCompleteness(propertyId: string): Promise<Result<{
    isComplete: boolean;
    contentExists: boolean;
    amenitiesCount: number;
    mediaCount: number;
    coverImageExists: boolean;
    requirements: {
      minAmenities: number;
      minMedia: number;
      requiresCoverImage: boolean;
      requiresPublishedContent: boolean;
    };
  }, Error>> {
    try {
      enhancedLogger.info('Validating property content completeness', { propertyId });

      const { data, error } = await supabase
        .rpc('validate_property_content_completeness', { p_property_id: propertyId });

      if (error) {
        enhancedLogger.error('Failed to validate property content completeness', { error, propertyId });
        return createError(new Error(`Failed to validate content: ${error.message}`));
      }

      enhancedLogger.info('Successfully validated property content completeness', { 
        propertyId, 
        isComplete: data.isComplete 
      });

      return createSuccess(data);
    } catch (error) {
      enhancedLogger.error('Unexpected error validating property content completeness', { error, propertyId });
      return createError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  // ============================================================================
  // PRIVATE TRANSFORMATION METHODS
  // ============================================================================

  private transformDatabaseContent(data: any, propertyId: string): PropertyWithDynamicContent {
    return {
      propertyId,
      content: data.content ? this.transformPropertyContent(data.content) : undefined,
      amenities: (data.amenities || []).map(this.transformPropertyAmenity),
      houseRules: (data.houseRules || []).map(this.transformPropertyHouseRule),
      considerations: (data.considerations || []).map(this.transformPropertyConsideration),
      media: (data.media || []).map(this.transformPropertyMedia),
      hasVerifiedMedia: (data.media || []).some((m: unknown) =>
        m && typeof m === 'object' && 'isVerified' in m && (m as { isVerified: boolean }).isVerified
      ),
      totalConsiderations: (data.considerations || []).length,
      criticalConsiderations: (data.considerations || []).filter((c: unknown) =>
        c && typeof c === 'object' && 'severityLevel' in c &&
        (c as { severityLevel: string }).severityLevel === 'critical'
      ).length,
      isContentComplete: !!(data.content && data.amenities?.length >= 3 && data.media?.length >= 1)
    };
  }

  private transformPropertyContent(data: unknown): PropertyContent {
    return {
      id: createPropertyContentId(data.id),
      propertyId: data.property_id,
      aboutTitle: data.about_title,
      aboutDescription: data.about_description,
      aboutHighlights: data.about_highlights || [],
      locationDescription: data.location_description,
      nearbyLandmarks: data.nearby_landmarks || [],
      transportationInfo: data.transportation_info || {},
      distanceToCampusMeters: data.distance_to_campus_meters,
      contactVisibleAfterPayment: data.contact_visible_after_payment,
      emergencyContact: data.emergency_contact || {},
      contentStatus: data.content_status,
      lastReviewedAt: data.last_reviewed_at,
      reviewedBy: data.reviewed_by,
      version: data.version,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by,
      updatedBy: data.updated_by
    };
  }

  private transformPropertyAmenity = (data: unknown): PropertyAmenity => {
    // Type guard for property amenity data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid property amenity data');
    }

    const amenityData = data as Record<string, unknown>;

    return {
    id: amenityData.id as string,
    propertyId: amenityData.property_id as string,
    amenityId: createAmenityId(amenityData.amenity_id as string),
    isAvailable: amenityData.is_available as boolean,
    customDescription: amenityData.custom_description as string,
    additionalCost: data.additional_cost,
    isVerified: data.is_verified,
    verifiedAt: data.verified_at,
    verifiedBy: data.verified_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: data.created_by,
    updatedBy: data.updated_by,
    amenity: data.amenity ? {
      id: createAmenityId(data.amenity.id),
      name: data.amenity.name,
      description: data.amenity.description,
      categoryId: data.amenity.category_id,
      iconName: data.amenity.icon_name,
      isPremium: data.amenity.is_premium,
      isActive: data.amenity.is_active,
      displayOrder: data.amenity.display_order,
      requiresVerification: data.amenity.requires_verification,
      affectsPricing: data.amenity.affects_pricing,
      createdAt: data.amenity.created_at,
      updatedAt: data.amenity.updated_at
    } : undefined
    };
  };

  private transformPropertyHouseRule = (data: unknown): PropertyHouseRule => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid house rule data');
    }

    const ruleData = data as Record<string, unknown>;

    return {
    id: data.id,
    propertyId: data.property_id,
    houseRuleId: createHouseRuleId(data.house_rule_id),
    customDescription: data.custom_description,
    isStrictlyEnforced: data.is_strictly_enforced,
    penaltyDescription: data.penalty_description,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: data.created_by,
    updatedBy: data.updated_by,
    houseRule: data.houseRule ? {
      id: createHouseRuleId(data.houseRule.id),
      title: data.houseRule.title,
      description: data.houseRule.description,
      categoryId: data.houseRule.category_id,
      iconName: data.houseRule.icon_name,
      severityLevel: data.houseRule.severity_level,
      isCustomizable: data.houseRule.is_customizable,
      isActive: data.houseRule.is_active,
      createdAt: data.houseRule.created_at,
      updatedAt: data.houseRule.updated_at
    } : undefined
  });

  private transformPropertyConsideration = (data: any): PropertyConsideration => ({
    id: createConsiderationId(data.id),
    propertyId: data.property_id,
    categoryId: data.category_id,
    title: data.title,
    description: data.description,
    severityLevel: data.severity_level,
    iconName: data.icon_name,
    affectsBooking: data.affects_booking,
    requiresAcknowledgment: data.requires_acknowledgment,
    displayOrder: data.display_order,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: data.created_by,
    updatedBy: data.updated_by
  });

  private transformPropertyMedia = (data: any): PropertyMedia => ({
    id: createPropertyMediaId(data.id),
    propertyId: data.property_id,
    fileName: data.file_name,
    filePath: data.file_path,
    fileSizeBytes: data.file_size_bytes,
    mimeType: data.mime_type,
    mediaType: data.media_type,
    purpose: data.purpose,
    title: data.title,
    description: data.description,
    altText: data.alt_text,
    displayOrder: data.display_order,
    isCover: data.is_cover,
    processingStatus: data.processing_status,
    thumbnailPath: data.thumbnail_path,
    optimizedPath: data.optimized_path,
    isVerified: data.is_verified,
    moderationStatus: data.moderation_status,
    moderationNotes: data.moderation_notes,
    verifiedAt: data.verified_at,
    verifiedBy: data.verified_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: data.created_by,
    updatedBy: data.updated_by
  });

  private createEmptyPropertyContent(propertyId: string): PropertyWithDynamicContent {
    return {
      propertyId,
      content: undefined,
      amenities: [],
      houseRules: [],
      considerations: [],
      media: [],
      hasVerifiedMedia: false,
      totalConsiderations: 0,
      criticalConsiderations: 0,
      isContentComplete: false
    };
  }
}

// Export singleton instance
export const dynamicPropertyContentService = DynamicPropertyContentService.getInstance();
