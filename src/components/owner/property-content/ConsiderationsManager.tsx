/**
 * Considerations Manager
 * Apple-Grade Component for Managing Property "Things to Consider"
 * 
 * Purpose: Enable transparent communication of property limitations and challenges
 * Compliance: BE CONSCIOUS zero tolerance for any types
 * Architecture: Honest transparency system for better student experience
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  PropertyConsideration,
  PropertyConsiderationInput,
  PropertyConsiderationSchema,
  ConsiderationSeverityLevel
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  AlertTriangle, 
  Info, 
  AlertCircle,
  XCircle,
  Save,
  Trash2,
  Edit
} from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

interface ConsiderationsManagerProps {
  readonly propertyId: string;
  readonly currentConsiderations: ReadonlyArray<PropertyConsideration>;
  readonly onContentChange: () => void;
  readonly onSaveSuccess: () => void;
}

// ============================================================================
// CENTRALIZED CONFIGURATION IMPORTS
// ============================================================================

import { contentValidationEngine } from '@/config/centralized-content-validation.config';
import { uiConfigurationEngine } from '@/config/centralized-ui-configuration.config';

// ✅ CENTRALIZED VALIDATION RULES - Single source of truth
const considerationsValidationRules = contentValidationEngine.getConsiderationsRules();

// ✅ CENTRALIZED UI CONFIGURATION - Single source of truth
const considerationCategories = uiConfigurationEngine.getConsiderationCategories();

// ✅ CENTRALIZED UI CONFIGURATION - Single source of truth
const severityLevels = uiConfigurationEngine.getSeverityLevels();

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ConsiderationsManager: React.FC<ConsiderationsManagerProps> = ({
  propertyId,
  currentConsiderations,
  onContentChange,
  onSaveSuccess
}) => {
  // ============================================================================
  // HOOKS AND STATE
  // ============================================================================

  const { user } = useAuth();
  const { addConsideration } = useDynamicPropertyContent(propertyId, user?.id || null);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form setup
  const form = useForm<PropertyConsiderationInput>({
    resolver: zodResolver(PropertyConsiderationSchema),
    defaultValues: {
      categoryId: '',
      title: '',
      description: '',
      severityLevel: 'info',
      iconName: 'solar:info-circle-bold',
      affectsBooking: false,
      requiresAcknowledgment: false,
      displayOrder: 0
    }
  });

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleAddConsideration = async (data: PropertyConsiderationInput): Promise<void> => {
    if (!user?.id) {
      setSaveError('User authentication required');
      return;
    }

    if (currentConsiderations.length >= considerationsValidationRules.maxConsiderationsPerProperty) {
      setSaveError(`Maximum ${considerationsValidationRules.maxConsiderationsPerProperty} considerations allowed`);
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      enhancedLogger.info('Adding property consideration', { 
        propertyId, 
        userId: user.id,
        severityLevel: data.severityLevel
      });

      const result = await addConsideration(data);

      if (result.success) {
        enhancedLogger.info('Property consideration added successfully', { propertyId });
        form.reset();
        setIsAdding(false);
        onSaveSuccess();
        onContentChange();
      } else {
        setSaveError(result.error.message);
        enhancedLogger.error('Failed to add property consideration', { 
          propertyId, 
          error: result.error.message 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSaveError(errorMessage);
      enhancedLogger.error('Unexpected error adding property consideration', { 
        propertyId, 
        error: errorMessage 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelAdd = (): void => {
    form.reset();
    setIsAdding(false);
    setSaveError(null);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getSeverityConfig = (level: ConsiderationSeverityLevel) => {
    return SEVERITY_LEVELS.find(s => s.value === level) || SEVERITY_LEVELS[0];
  };

  const renderConsiderationCard = (consideration: PropertyConsideration): React.ReactNode => {
    const severityConfig = getSeverityConfig(consideration.severityLevel);
    const IconComponent = severityConfig.icon;

    return (
      <Card key={consideration.id} className="border-l-4" style={{
        borderLeftColor: severityConfig.color === 'blue' ? '#3b82f6' :
                        severityConfig.color === 'yellow' ? '#eab308' :
                        severityConfig.color === 'orange' ? '#f97316' : '#ef4444'
      }}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center space-x-2">
              <IconComponent className="h-4 w-4" />
              <span>{consideration.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {severityConfig.label}
              </Badge>
              {consideration.affectsBooking && (
                <Badge variant="destructive" className="text-xs">
                  Affects Booking
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-3">{consideration.description}</p>
          {consideration.requiresAcknowledgment && (
            <div className="flex items-center text-sm text-orange-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Requires student acknowledgment
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderAddForm = (): React.ReactNode => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add New Consideration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddConsideration)} className="space-y-4">
            {/* Category Selection */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONSIDERATION_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Limited hot water during peak hours"
                      {...field}
                      maxLength={considerationsValidationRules.title.maxLength}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief, clear title ({considerationsValidationRules.title.minLength}-{considerationsValidationRules.title.maxLength} characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed information about this consideration..."
                      className="min-h-[80px]"
                      {...field}
                      maxLength={considerationsValidationRules.description.maxLength}
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed explanation ({considerationsValidationRules.description.minLength}-{considerationsValidationRules.description.maxLength} characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Severity Level */}
            <FormField
              control={form.control}
              name="severityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SEVERITY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center space-x-2">
                            <level.icon className="h-4 w-4" />
                            <span>{level.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How serious is this consideration?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Options */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="affectsBooking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Affects booking availability
                      </FormLabel>
                      <FormDescription>
                        This consideration may prevent some students from booking
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requiresAcknowledgment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Requires student acknowledgment
                      </FormLabel>
                      <FormDescription>
                        Students must acknowledge this before booking
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancelAdd}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Consideration
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Things to Consider
          </h2>
          <p className="text-gray-600">
            Be transparent about property limitations to build trust with students
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline">
            {currentConsiderations.length}/{considerationsValidationRules.maxConsiderationsPerProperty}
          </Badge>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Consideration
            </Button>
          )}
        </div>
      </div>

      {saveError && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      {/* Add Form */}
      {isAdding && renderAddForm()}

      {/* Current Considerations */}
      {currentConsiderations.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Current Considerations</h3>
          {currentConsiderations.map(renderConsiderationCard)}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No considerations added yet
            </h3>
            <p className="text-gray-600 mb-4">
              Being transparent about property limitations builds trust with students
              and leads to better reviews and fewer complaints.
            </p>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Consideration
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsiderationsManager;
