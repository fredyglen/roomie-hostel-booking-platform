/**
 * Property Content Manager
 * Apple-Grade Owner Portal Interface for Dynamic Property Content Management
 * 
 * Purpose: Replace hardcoded property data with owner-managed dynamic content
 * Compliance: BE CONSCIOUS zero tolerance for any types
 * Architecture: Comprehensive content management with real-time validation
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useDynamicPropertyContent } from '@/hooks/useDynamicPropertyContent';
import { enhancedLogger } from '@/utils/enhanced-logger';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  MapPin, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Save,
  Eye,
  ArrowLeft
} from 'lucide-react';

// Import content management components
import AboutSectionEditor from './AboutSectionEditor';
import LocationDetailsEditor from './LocationDetailsEditor';
import AmenitiesManager from './AmenitiesManager';
import HouseRulesManager from './HouseRulesManager';
import ConsiderationsManager from './ConsiderationsManager';
import MediaManager from './MediaManager';
import ContentPreview from './ContentPreview';
import ContentValidationPanel from './ContentValidationPanel';

// ============================================================================
// INTERFACES
// ============================================================================

interface PropertyContentManagerProps {
  readonly propertyId?: string;
}

interface ContentTab {
  readonly id: string;
  readonly label: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly description: string;
  readonly isRequired: boolean;
}

// ============================================================================
// CONTENT TABS CONFIGURATION
// ============================================================================

const CONTENT_TABS: ReadonlyArray<ContentTab> = [
  {
    id: 'about',
    label: 'About Property',
    icon: FileText,
    description: 'Property description, highlights, and key information',
    isRequired: true
  },
  {
    id: 'location',
    label: 'Location Details',
    icon: MapPin,
    description: 'Location information, landmarks, and transportation',
    isRequired: false
  },
  {
    id: 'amenities',
    label: 'Amenities',
    icon: Settings,
    description: 'Available amenities and facilities',
    isRequired: true
  },
  {
    id: 'rules',
    label: 'House Rules',
    icon: Settings,
    description: 'Property rules and regulations',
    isRequired: false
  },
  {
    id: 'considerations',
    label: 'Things to Consider',
    icon: AlertTriangle,
    description: 'Important considerations and limitations',
    isRequired: false
  },
  {
    id: 'media',
    label: 'Media',
    icon: Eye,
    description: 'Property photos and videos',
    isRequired: true
  }
] as const;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PropertyContentManager: React.FC<PropertyContentManagerProps> = ({ 
  propertyId: propPropertyId 
}) => {
  // ============================================================================
  // HOOKS AND STATE
  // ============================================================================

  const { propertyId: paramPropertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const propertyId = propPropertyId || paramPropertyId;
  
  const [activeTab, setActiveTab] = useState<string>('about');
  const [showPreview, setShowPreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Dynamic property content hook
  const {
    data: propertyContent,
    isLoading,
    error,
    isContentComplete,
    hasVerifiedMedia,
    totalConsiderations,
    criticalConsiderations,
    refetch,
    validateCompleteness
  } = useDynamicPropertyContent(propertyId || null, user?.id || null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (propertyId && user?.id) {
      enhancedLogger.info('Property Content Manager initialized', { 
        propertyId, 
        userId: user.id,
        isContentComplete,
        hasVerifiedMedia
      });
    }
  }, [propertyId, user?.id, isContentComplete, hasVerifiedMedia]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleTabChange = (tabId: string): void => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave this tab?'
      );
      if (!confirmLeave) return;
    }
    
    setActiveTab(tabId);
    setHasUnsavedChanges(false);
  };

  const handleContentChange = (): void => {
    setHasUnsavedChanges(true);
  };

  const handleSaveSuccess = (): void => {
    setHasUnsavedChanges(false);
    refetch();
  };

  const handlePreviewToggle = (): void => {
    setShowPreview(!showPreview);
  };

  const handleValidateContent = async (): Promise<void> => {
    if (!propertyId) return;
    
    try {
      const result = await validateCompleteness();
      if (result.success) {
        enhancedLogger.info('Content validation completed', { 
          propertyId, 
          isComplete: result.data.isComplete 
        });
      }
    } catch (error) {
      enhancedLogger.error('Content validation failed', { propertyId, error });
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderTabBadge = (tab: ContentTab): React.ReactNode => {
    if (!propertyContent) return null;

    switch (tab.id) {
      case 'about':
        return propertyContent.content ? (
          <Badge variant="default" className="ml-2">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        ) : (
          <Badge variant="destructive" className="ml-2">
            Required
          </Badge>
        );
      
      case 'amenities':
        return propertyContent.amenities.length > 0 ? (
          <Badge variant="default" className="ml-2">
            {propertyContent.amenities.length}
          </Badge>
        ) : (
          <Badge variant="destructive" className="ml-2">
            Required
          </Badge>
        );
      
      case 'considerations':
        return totalConsiderations > 0 ? (
          <Badge 
            variant={criticalConsiderations > 0 ? "destructive" : "secondary"} 
            className="ml-2"
          >
            {totalConsiderations}
          </Badge>
        ) : null;
      
      case 'media':
        return hasVerifiedMedia ? (
          <Badge variant="default" className="ml-2">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        ) : (
          <Badge variant="destructive" className="ml-2">
            Required
          </Badge>
        );
      
      default:
        return null;
    }
  };

  const renderContentStatus = (): React.ReactNode => {
    if (!propertyContent) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              {isContentComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              )}
              Content Status
            </span>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleValidateContent}
              >
                Validate
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreviewToggle}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {propertyContent.amenities.length}
              </p>
              <p className="text-sm text-gray-600">Amenities</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {propertyContent.houseRules.length}
              </p>
              <p className="text-sm text-gray-600">House Rules</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {totalConsiderations}
              </p>
              <p className="text-sm text-gray-600">Considerations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {propertyContent.media.length}
              </p>
              <p className="text-sm text-gray-600">Media Files</p>
            </div>
          </div>
          
          {!isContentComplete && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your property content is incomplete. Complete all required sections 
                to make your property visible to students.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============================================================================
  // LOADING AND ERROR STATES
  // ============================================================================

  if (!propertyId) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Property ID is required to manage content.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading property content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error loading property content: {error}
        </AlertDescription>
      </Alert>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (showPreview && propertyContent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviewToggle}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Edit
          </Button>
        </div>
        <ContentPreview propertyContent={propertyContent} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Property Content Management
          </h1>
          <p className="text-gray-600">
            Manage your property information that students will see
          </p>
        </div>
        
        {hasUnsavedChanges && (
          <Badge variant="destructive">
            <Save className="h-3 w-3 mr-1" />
            Unsaved Changes
          </Badge>
        )}
      </div>

      {/* Content Status */}
      {renderContentStatus()}

      {/* Content Management Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {CONTENT_TABS.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center"
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {renderTabBadge(tab)}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-6">
              <TabsContent value="about">
                <AboutSectionEditor
                  propertyId={propertyId}
                  initialContent={propertyContent?.content}
                  onContentChange={handleContentChange}
                  onSaveSuccess={handleSaveSuccess}
                />
              </TabsContent>

              <TabsContent value="location">
                <LocationDetailsEditor
                  propertyId={propertyId}
                  initialContent={propertyContent?.content}
                  onContentChange={handleContentChange}
                  onSaveSuccess={handleSaveSuccess}
                />
              </TabsContent>

              <TabsContent value="amenities">
                <AmenitiesManager
                  propertyId={propertyId}
                  currentAmenities={propertyContent?.amenities || []}
                  onContentChange={handleContentChange}
                  onSaveSuccess={handleSaveSuccess}
                />
              </TabsContent>

              <TabsContent value="rules">
                <HouseRulesManager
                  propertyId={propertyId}
                  currentRules={propertyContent?.houseRules || []}
                  onContentChange={handleContentChange}
                  onSaveSuccess={handleSaveSuccess}
                />
              </TabsContent>

              <TabsContent value="considerations">
                <ConsiderationsManager
                  propertyId={propertyId}
                  currentConsiderations={propertyContent?.considerations || []}
                  onContentChange={handleContentChange}
                  onSaveSuccess={handleSaveSuccess}
                />
              </TabsContent>

              <TabsContent value="media">
                <MediaManager
                  propertyId={propertyId}
                  currentMedia={propertyContent?.media || []}
                  onContentChange={handleContentChange}
                  onSaveSuccess={handleSaveSuccess}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Content Validation Panel */}
      <ContentValidationPanel 
        propertyContent={propertyContent}
        onValidate={handleValidateContent}
      />
    </div>
  );
};

export default PropertyContentManager;
