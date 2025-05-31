
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePropertyLoader } from '@/hooks/property/usePropertyLoader';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import EnhancedStoryView from '@/components/story/EnhancedStoryView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { logger } from '@/utils/logger';

const EnhancedStoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  logger.debug('EnhancedStoryPage rendered', { id, location });
  
  const { data: property, isLoading, error } = usePropertyLoader({
    propertyId: id || '',
    enabled: !!id,
    forOwner: false
  });

  const handleBackClick = () => {
    logger.debug('Back to property button clicked');
    navigate(`/student/property/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
        <StudentNavBar />
      </div>
    );
  }

  if (error || !property) {
    logger.error('Property not found or error loading property', { error, id });
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error?.message || 'Property not found. The property may have been removed or the URL is incorrect.'}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/student/properties')}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
          </div>
        </main>
        <Footer />
        <StudentNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="mb-4 px-4 pt-4">
          <Button 
            onClick={handleBackClick}
            variant="ghost"
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Property
          </Button>
        </div>
        <ErrorBoundary>
          <EnhancedStoryView property={property} />
        </ErrorBoundary>
      </main>
      <Footer />
      <StudentNavBar />
    </div>
  );
};

export default EnhancedStoryPage;
