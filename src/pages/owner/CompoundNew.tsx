/**
 * ✅ COMPOUND CREATION PAGE
 * 
 * Dedicated page for creating multi-property compounds with step-by-step walkthrough.
 * This is a complete engine separate from regular property creation.
 * 
 * Features:
 * - Notification-style introduction walkthrough
 * - Step-by-step compound setup
 * - Visual progress tracking
 * - Compound-specific form fields
 * 
 * Future: Will be visually enhanced like the Intelligent Building Creator
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Home, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Info,
  Sparkles
} from 'lucide-react';

interface CompoundCreationStep {
  id: number;
  title: string;
  description: string;
  icon: typeof Building2;
  completed: boolean;
}

const CompoundNew: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get router result from navigation state
  const routerResult = location.state?.routerResult;
  
  // Walkthrough state
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  
  // Creation steps
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<CompoundCreationStep[]>([
    {
      id: 1,
      title: 'Compound Information',
      description: 'Basic details about your compound',
      icon: Building2,
      completed: false
    },
    {
      id: 2,
      title: 'Location & Address',
      description: 'Where is your compound located?',
      icon: MapPin,
      completed: false
    },
    {
      id: 3,
      title: 'Shared Amenities',
      description: 'Facilities available to all properties',
      icon: Home,
      completed: false
    },
    {
      id: 4,
      title: 'Documentation',
      description: 'Business registration and documents',
      icon: FileText,
      completed: false
    }
  ]);
  
  // Walkthrough messages
  const walkthroughMessages = [
    {
      title: "Welcome to Compound Management! 🎉",
      description: "You're about to create a compound - a powerful way to manage multiple properties in one location.",
      icon: Sparkles
    },
    {
      title: "What is a Compound?",
      description: "A compound lets you manage multiple buildings (Block A, Block B, etc.) that share the same address and amenities.",
      icon: Building2
    },
    {
      title: "Centralized Management",
      description: "Track occupancy, revenue, and bookings across all your buildings from one dashboard.",
      icon: CheckCircle2
    },
    {
      title: "Let's Get Started!",
      description: "We'll guide you through 4 simple steps to set up your compound. This should take about 10 minutes.",
      icon: Info
    }
  ];
  
  useEffect(() => {
    // Verify user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a compound.",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [user, navigate, toast]);
  
  const handleWalkthroughNext = () => {
    if (walkthroughStep < walkthroughMessages.length - 1) {
      setWalkthroughStep(walkthroughStep + 1);
    } else {
      setShowWalkthrough(false);
    }
  };
  
  const handleWalkthroughSkip = () => {
    setShowWalkthrough(false);
  };
  
  const handleStepComplete = (stepId: number) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
    
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/owner/properties/new');
    }
  };
  
  const calculateProgress = () => {
    const completedSteps = steps.filter(step => step.completed).length;
    return (completedSteps / steps.length) * 100;
  };
  
  // Walkthrough UI
  if (showWalkthrough) {
    const currentMessage = walkthroughMessages[walkthroughStep];
    const Icon = currentMessage.icon;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl border-2">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Icon className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold mb-2">
              {currentMessage.title}
            </CardTitle>
            <CardDescription className="text-lg">
              {currentMessage.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Progress dots */}
            <div className="flex justify-center gap-2">
              {walkthroughMessages.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === walkthroughStep 
                      ? 'bg-blue-600 w-8' 
                      : index < walkthroughStep 
                        ? 'bg-blue-400' 
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            {/* Router result info */}
            {routerResult && walkthroughStep === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Detected Setup:</strong> {routerResult.recommendedSetup}
                </p>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleWalkthroughSkip}
                className="flex-1"
              >
                Skip Introduction
              </Button>
              <Button
                onClick={handleWalkthroughNext}
                className="flex-1"
              >
                {walkthroughStep < walkthroughMessages.length - 1 ? (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Start Setup <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Main compound creation UI
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Compound</h1>
              <p className="text-gray-600 mt-1">
                Set up your multi-property compound in 4 simple steps
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
          
          {/* Progress bar */}
          <Progress value={calculateProgress()} className="h-2" />
        </div>
        
        {/* Steps overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.completed;
            
            return (
              <Card 
                key={step.id}
                className={`cursor-pointer transition-all ${
                  isActive 
                    ? 'border-blue-500 shadow-lg' 
                    : isCompleted 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200'
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isCompleted 
                        ? 'bg-green-100' 
                        : isActive 
                          ? 'bg-blue-100' 
                          : 'bg-gray-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <StepIcon className={`h-5 w-5 ${
                          isActive ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{step.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Step content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          
          <CardContent className="min-h-[400px]">
            {/* TODO: Add step-specific forms here */}
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Step {currentStep} form will be implemented here
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This is a placeholder for the compound creation form
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button
            onClick={() => handleStepComplete(currentStep)}
            disabled={currentStep === steps.length && !steps[currentStep - 1].completed}
          >
            {currentStep === steps.length ? 'Create Compound' : 'Continue'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompoundNew;

