/**
 * Amenities Manager
 * Apple-Grade Component for Managing Property Amenities
 * 
 * Purpose: Replace hardcoded amenities with owner-selected dynamic amenities
 * Compliance: BE CONSCIOUS zero tolerance for any types
 * Architecture: Real-time amenities selection with validation
 */

import React, { useState, useEffect } from 'react';
import { PropertyAmenity } from '@/types/dynamic-property-content';
import { useDynamicPropertyContent, useAvailableAmenities } from '@/hooks/useDynamicPropertyContent';
import { useAuth } from '@/context/EnhancedAuthContext';
import { enhancedLogger } from '@/utils/enhanced-logger';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Save, 
  AlertTriangle, 
  CheckCircle,
  Search,
  Filter,
  Star
} from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

interface AmenitiesManagerProps {
  readonly propertyId: string;
  readonly currentAmenities: ReadonlyArray<PropertyAmenity>;
  readonly onContentChange: () => void;
  readonly onSaveSuccess: () => void;
}

interface AmenitySelection {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly iconName: string;
  readonly isPremium: boolean;
  readonly isSelected: boolean;
}

// ============================================================================
// CENTRALIZED CONFIGURATION IMPORTS
// ============================================================================

import { contentValidationEngine } from '@/config/centralized-content-validation.config';
import { uiConfigurationEngine } from '@/config/centralized-ui-configuration.config';

// ✅ CENTRALIZED VALIDATION RULES - Single source of truth
const amenitiesValidationRules = contentValidationEngine.getAmenitiesRules();

// ✅ CENTRALIZED UI CONFIGURATION - Single source of truth
const categoryDisplayOrder = uiConfigurationEngine.getAmenityCategoryDisplayOrder();

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AmenitiesManager: React.FC<AmenitiesManagerProps> = ({
  propertyId,
  currentAmenities,
  onContentChange,
  onSaveSuccess
}) => {
  // ============================================================================
  // HOOKS AND STATE
  // ============================================================================

  const { user } = useAuth();
  const { updateAmenities } = useDynamicPropertyContent(propertyId, user?.id || null);
  const { amenities: availableAmenities, isLoading, error } = useAvailableAmenities();

  const [selectedAmenityIds, setSelectedAmenityIds] = useState<ReadonlyArray<string>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    const currentIds = currentAmenities.map(amenity => amenity.amenityId);
    setSelectedAmenityIds(currentIds);
  }, [currentAmenities]);

  useEffect(() => {
    onContentChange();
  }, [selectedAmenityIds, onContentChange]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const amenitySelections: ReadonlyArray<AmenitySelection> = React.useMemo(() => {
    if (!availableAmenities) return [];

    return availableAmenities.map(amenity => ({
      id: amenity.id,
      name: amenity.name,
      category: amenity.category,
      iconName: amenity.iconName,
      isPremium: amenity.isPremium,
      isSelected: selectedAmenityIds.includes(amenity.id)
    }));
  }, [availableAmenities, selectedAmenityIds]);

  const filteredAmenities = React.useMemo(() => {
    let filtered = amenitySelections;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(amenity =>
        amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        amenity.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(amenity => amenity.category === selectedCategory);
    }

    return filtered;
  }, [amenitySelections, searchTerm, selectedCategory]);

  const categorizedAmenities = React.useMemo(() => {
    const categories = new Map<string, ReadonlyArray<AmenitySelection>>();
    
    categoryDisplayOrder.forEach(category => {
      const categoryAmenities = filteredAmenities.filter(
        amenity => amenity.category === category
      );
      if (categoryAmenities.length > 0) {
        categories.set(category, categoryAmenities);
      }
    });

    return categories;
  }, [filteredAmenities]);

  const selectedCount = selectedAmenityIds.length;
  const premiumCount = amenitySelections.filter(
    amenity => amenity.isSelected && amenity.isPremium
  ).length;

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleAmenityToggle = (amenityId: string): void => {
    const isCurrentlySelected = selectedAmenityIds.includes(amenityId);
    
    if (isCurrentlySelected) {
      // Remove amenity
      setSelectedAmenityIds(prev => prev.filter(id => id !== amenityId));
    } else {
      // Add amenity (check limits)
      if (selectedCount >= amenitiesValidationRules.maxAmenitiesPerProperty) {
        setSaveError(`Maximum ${amenitiesValidationRules.maxAmenitiesPerProperty} amenities allowed`);
        return;
      }

      const amenity = amenitySelections.find(a => a.id === amenityId);
      if (amenity?.isPremium && premiumCount >= amenitiesValidationRules.premiumAmenitiesLimit) {
        setSaveError(`Maximum ${amenitiesValidationRules.premiumAmenitiesLimit} premium amenities allowed`);
        return;
      }

      setSelectedAmenityIds(prev => [...prev, amenityId]);
      setSaveError(null);
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!user?.id) {
      setSaveError('User authentication required');
      return;
    }

    if (selectedCount < amenitiesValidationRules.minAmenitiesRequired) {
      setSaveError(`Minimum ${amenitiesValidationRules.minAmenitiesRequired} amenities required`);
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      enhancedLogger.info('Saving property amenities', { 
        propertyId, 
        userId: user.id, 
        amenityCount: selectedCount 
      });

      const result = await updateAmenities(selectedAmenityIds);

      if (result.success) {
        enhancedLogger.info('Property amenities saved successfully', { 
          propertyId, 
          amenityCount: selectedCount 
        });
        onSaveSuccess();
      } else {
        setSaveError(result.error.message);
        enhancedLogger.error('Failed to save property amenities', { 
          propertyId, 
          error: result.error.message 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSaveError(errorMessage);
      enhancedLogger.error('Unexpected error saving property amenities', { 
        propertyId, 
        error: errorMessage 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderAmenityCard = (amenity: AmenitySelection): React.ReactNode => (
    <Card 
      key={amenity.id}
      className={`cursor-pointer transition-all ${
        amenity.isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50' 
          : 'hover:shadow-md'
      }`}
      onClick={() => handleAmenityToggle(amenity.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Checkbox 
            checked={amenity.isSelected}
            onChange={() => {}} // Handled by card click
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{amenity.name}</span>
              {amenity.isPremium && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{amenity.category}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCategorySection = (
    category: string, 
    amenities: ReadonlyArray<AmenitySelection>
  ): React.ReactNode => (
    <div key={category} className="space-y-3">
      <h3 className="font-semibold text-lg text-gray-900">{category}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {amenities.map(renderAmenityCard)}
      </div>
    </div>
  );

  // ============================================================================
  // LOADING AND ERROR STATES
  // ============================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>Loading available amenities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error loading amenities: {error}
        </AlertDescription>
      </Alert>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Property Amenities
          </h2>
          <p className="text-gray-600">
            Select amenities available at your property
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline">
            {selectedCount}/{amenitiesValidationRules.maxAmenitiesPerProperty} Selected
          </Badge>
          {premiumCount > 0 && (
            <Badge variant="secondary">
              <Star className="h-3 w-3 mr-1" />
              {premiumCount} Premium
            </Badge>
          )}
        </div>
      </div>

      {/* Validation Alert */}
      {selectedCount < amenitiesValidationRules.minAmenitiesRequired && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please select at least {amenitiesValidationRules.minAmenitiesRequired} amenities to make your property visible to students.
          </AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search amenities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categoryDisplayOrder.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities Selection */}
      <div className="space-y-6">
        {Array.from(categorizedAmenities.entries()).map(([category, amenities]) =>
          renderCategorySection(category, amenities)
        )}
      </div>

      {filteredAmenities.length === 0 && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No amenities found matching your search.</p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button 
          onClick={handleSave}
          disabled={isSaving || selectedCount < amenitiesValidationRules.minAmenitiesRequired}
          className="flex items-center"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Amenities ({selectedCount})
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AmenitiesManager;
