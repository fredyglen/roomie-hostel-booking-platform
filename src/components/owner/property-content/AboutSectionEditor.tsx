/**
 * About Section Editor
 * Apple-Grade Component for Managing Property About Content
 * 
 * Purpose: Replace hardcoded property descriptions with owner-managed content
 * Compliance: BE CONSCIOUS zero tolerance for any types
 * Architecture: Real-time validation with comprehensive error handling
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  PropertyContent, 
  PropertyContentInput,
  PropertyContentSchema 
} from '@/types/dynamic-property-content';
import { useDynamicPropertyContent } from '@/hooks/useDynamicPropertyContent';
import { useAuth } from '@/context/EnhancedAuthContext';
import { enhancedLogger } from '@/utils/enhanced-logger';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Plus, 
  X, 
  Save, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Lightbulb
} from 'lucide-react';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const AboutSectionSchema = z.object({
  aboutTitle: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters')
    .optional(),
  aboutDescription: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  aboutHighlights: z.array(z.string().min(1).max(100))
    .max(10, 'Maximum 10 highlights allowed')
    .default([])
});

type AboutSectionFormData = z.infer<typeof AboutSectionSchema>;

// ============================================================================
// INTERFACES
// ============================================================================

interface AboutSectionEditorProps {
  readonly propertyId: string;
  readonly initialContent?: PropertyContent;
  readonly onContentChange: () => void;
  readonly onSaveSuccess: () => void;
}

// ============================================================================
// CENTRALIZED CONFIGURATION IMPORTS
// ============================================================================

import { contentValidationEngine } from '@/config/centralized-content-validation.config';
import { contentSuggestionsEngine } from '@/config/centralized-content-suggestions.config';

// ✅ CENTRALIZED VALIDATION RULES - Single source of truth
const aboutValidationRules = contentValidationEngine.getAboutSectionRules();

// ✅ CENTRALIZED CONTENT SUGGESTIONS - Single source of truth
const sampleHighlights = contentSuggestionsEngine.getAboutHighlightSuggestions(true, true);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AboutSectionEditor: React.FC<AboutSectionEditorProps> = ({
  propertyId,
  initialContent,
  onContentChange,
  onSaveSuccess
}) => {
  // ============================================================================
  // HOOKS AND STATE
  // ============================================================================

  const { user } = useAuth();
  const { updateContent } = useDynamicPropertyContent(propertyId, user?.id || null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [newHighlight, setNewHighlight] = useState('');

  // Form setup
  const form = useForm<AboutSectionFormData>({
    resolver: zodResolver(AboutSectionSchema),
    defaultValues: {
      aboutTitle: initialContent?.aboutTitle || '',
      aboutDescription: initialContent?.aboutDescription || '',
      aboutHighlights: initialContent?.aboutHighlights || []
    }
  });

  const { watch, setValue, getValues } = form;
  const watchedValues = watch();

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (initialContent) {
      form.reset({
        aboutTitle: initialContent.aboutTitle || '',
        aboutDescription: initialContent.aboutDescription || '',
        aboutHighlights: initialContent.aboutHighlights || []
      });
    }
  }, [initialContent, form]);

  useEffect(() => {
    onContentChange();
  }, [watchedValues, onContentChange]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSave = async (data: AboutSectionFormData): Promise<void> => {
    if (!user?.id) {
      setSaveError('User authentication required');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      enhancedLogger.info('Saving about section content', { propertyId, userId: user.id });

      const contentInput: PropertyContentInput = {
        aboutTitle: data.aboutTitle,
        aboutDescription: data.aboutDescription,
        aboutHighlights: data.aboutHighlights,
        // Preserve existing location data
        locationDescription: initialContent?.locationDescription,
        nearbyLandmarks: initialContent?.nearbyLandmarks || [],
        transportationInfo: initialContent?.transportationInfo || {},
        distanceToCampusMeters: initialContent?.distanceToCampusMeters,
        contactVisibleAfterPayment: initialContent?.contactVisibleAfterPayment ?? true,
        emergencyContact: initialContent?.emergencyContact || {}
      };

      const result = await updateContent(contentInput);

      if (result.success) {
        enhancedLogger.info('About section content saved successfully', { propertyId });
        onSaveSuccess();
      } else {
        setSaveError(result.error.message);
        enhancedLogger.error('Failed to save about section content', { 
          propertyId, 
          error: result.error.message 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSaveError(errorMessage);
      enhancedLogger.error('Unexpected error saving about section content', { 
        propertyId, 
        error: errorMessage 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddHighlight = (): void => {
    if (!newHighlight.trim()) return;
    
    const currentHighlights = getValues('aboutHighlights');
    if (currentHighlights.length >= aboutValidationRules.highlights.maxCount) {
      return;
    }

    const updatedHighlights = [...currentHighlights, newHighlight.trim()];
    setValue('aboutHighlights', updatedHighlights);
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index: number): void => {
    const currentHighlights = getValues('aboutHighlights');
    const updatedHighlights = currentHighlights.filter((_, i) => i !== index);
    setValue('aboutHighlights', updatedHighlights);
  };

  const handleAddSampleHighlight = (highlight: string): void => {
    const currentHighlights = getValues('aboutHighlights');
    if (currentHighlights.includes(highlight)) return;
    if (currentHighlights.length >= aboutValidationRules.highlights.maxCount) return;

    const updatedHighlights = [...currentHighlights, highlight];
    setValue('aboutHighlights', updatedHighlights);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderCharacterCount = (current: number, max: number): React.ReactNode => {
    const percentage = (current / max) * 100;
    const variant = percentage > 90 ? 'destructive' : percentage > 75 ? 'secondary' : 'outline';
    
    return (
      <Badge variant={variant} className="text-xs">
        {current}/{max}
      </Badge>
    );
  };

  const renderSampleHighlights = (): React.ReactNode => {
    const currentHighlights = getValues('aboutHighlights');
    const availableHighlights = sampleHighlights.filter(
      highlight => !currentHighlights.includes(highlight)
    );

    if (availableHighlights.length === 0) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            Suggested Highlights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableHighlights.slice(0, 6).map((highlight) => (
              <Button
                key={highlight}
                variant="outline"
                size="sm"
                onClick={() => handleAddSampleHighlight(highlight)}
                disabled={currentHighlights.length >= aboutValidationRules.highlights.maxCount}
              >
                <Plus className="h-3 w-3 mr-1" />
                {highlight}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            About Your Property
          </h2>
          <p className="text-gray-600">
            Provide compelling information about your property that students will see
          </p>
        </div>
      </div>

      {saveError && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          {/* Property Title */}
          <FormField
            control={form.control}
            name="aboutTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  Property Title (Optional)
                  {renderCharacterCount(
                    field.value?.length || 0,
                    aboutValidationRules.title.maxLength
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Modern Student Accommodation Near Campus"
                    {...field}
                    maxLength={aboutValidationRules.title.maxLength}
                  />
                </FormControl>
                <FormDescription>
                  A catchy title that summarizes your property (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Property Description */}
          <FormField
            control={form.control}
            name="aboutDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  Property Description *
                  {renderCharacterCount(
                    field.value?.length || 0,
                    aboutValidationRules.description.maxLength
                  )}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your property in detail. Include what makes it special, the atmosphere, nearby facilities, and why students would love to live here..."
                    className="min-h-[120px]"
                    {...field}
                    maxLength={aboutValidationRules.description.maxLength}
                  />
                </FormControl>
                <FormDescription>
                  Detailed description of your property (minimum {aboutValidationRules.description.minLength} characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Property Highlights */}
          <FormField
            control={form.control}
            name="aboutHighlights"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  Property Highlights
                  <Badge variant="outline">
                    {field.value.length}/{aboutValidationRules.highlights.maxCount}
                  </Badge>
                </FormLabel>
                <FormDescription>
                  Key features and benefits that make your property stand out
                </FormDescription>
                
                {/* Current Highlights */}
                {field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {field.value.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center">
                        {highlight}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-2"
                          onClick={() => handleRemoveHighlight(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add New Highlight */}
                {field.value.length < aboutValidationRules.highlights.maxCount && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a highlight..."
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddHighlight();
                        }
                      }}
                      maxLength={aboutValidationRules.highlights.maxLength}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddHighlight}
                      disabled={!newHighlight.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sample Highlights */}
          {renderSampleHighlights()}

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button 
              type="submit" 
              disabled={isSaving}
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
                  Save About Section
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AboutSectionEditor;
