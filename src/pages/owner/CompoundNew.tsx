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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

interface CompoundFormData {
  name: string;
  description: string;
  business_registration_number: string;
  address: string;
  city: string;
  state: string;
  country: string;
  shared_amenities: string[];
  house_rules: string[];
  cover_image_url: string;
  images: string[];
}

const CompoundNew: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get router result from navigation state
  const routerResult = location.state?.routerResult;

  // Walkthrough state
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [walkthroughStep, setWalkthroughStep] = useState(0);

  // Form data state
  const [formData, setFormData] = useState<CompoundFormData>({
    name: '',
    description: '',
    business_registration_number: '',
    address: '',
    city: 'Accra',
    state: 'Greater Accra',
    country: 'Ghana',
    shared_amenities: [],
    house_rules: [],
    cover_image_url: '',
    images: []
  });
  
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
  
  // ✅ DATABASE MUTATION: Create compound
  const createCompoundMutation = useMutation({
    mutationFn: async (data: CompoundFormData) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data: compound, error } = await supabase
        .from('compounds')
        .insert({
          owner_id: user.id,
          name: data.name,
          description: data.description,
          business_registration_number: data.business_registration_number || null,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          shared_amenities: data.shared_amenities,
          house_rules: data.house_rules,
          cover_image_url: data.cover_image_url || null,
          images: data.images,
          total_properties: 0,
          total_rooms: 0,
          total_beds: 0,
          occupancy_rate: 0
        })
        .select()
        .single();

      if (error) throw error;
      return compound;
    },
    onSuccess: (compound) => {
      toast({
        title: "Compound Created!",
        description: `${compound.name} has been created successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['compounds'] });
      navigate('/owner/properties');
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : 'Failed to create compound',
        variant: "destructive"
      });
    }
  });

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
    // Validate current step before proceeding
    if (stepId === 1) {
      if (!formData.name || !formData.description) {
        toast({
          title: "Incomplete Information",
          description: "Please fill in compound name and description.",
          variant: "destructive"
        });
        return;
      }
    } else if (stepId === 2) {
      if (!formData.address || !formData.city) {
        toast({
          title: "Incomplete Location",
          description: "Please fill in address and city.",
          variant: "destructive"
        });
        return;
      }
    }

    setSteps(steps.map(step =>
      step.id === stepId ? { ...step, completed: true } : step
    ));

    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
    } else {
      // Final step - create compound
      handleCreateCompound();
    }
  };

  const handleCreateCompound = () => {
    // Validate all required fields
    if (!formData.name || !formData.description || !formData.address || !formData.city) {
      toast({
        title: "Incomplete Form",
        description: "Please complete all required fields.",
        variant: "destructive"
      });
      return;
    }

    createCompoundMutation.mutate(formData);
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
            {/* ✅ STEP 1: Compound Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Compound Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Legon Hills Compound"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your compound and its features..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_registration">Business Registration Number (Optional)</Label>
                  <Input
                    id="business_registration"
                    placeholder="e.g., BN12345678"
                    value={formData.business_registration_number}
                    onChange={(e) => setFormData({ ...formData, business_registration_number: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">
                    Required for commercial property management
                  </p>
                </div>
              </div>
            )}

            {/* ✅ STEP 2: Location & Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    placeholder="e.g., Plot 123, University Road"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Accra"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Region *</Label>
                    <Input
                      id="state"
                      placeholder="e.g., Greater Accra"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    disabled
                  />
                  <p className="text-sm text-gray-500">
                    Currently only available in Ghana
                  </p>
                </div>
              </div>
            )}

            {/* ✅ STEP 3: Shared Amenities */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Shared Amenities</Label>
                  <p className="text-sm text-gray-500 mb-4">
                    Select amenities available to all properties in this compound
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {['WiFi', 'Security', 'Parking', 'Generator', 'Water Supply', 'Gym', 'Laundry', 'Common Area'].map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.shared_amenities.includes(amenity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                shared_amenities: [...formData.shared_amenities, amenity]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                shared_amenities: formData.shared_amenities.filter(a => a !== amenity)
                              });
                            }
                          }}
                          className="rounded"
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ✅ STEP 4: Documentation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Review Your Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Address:</strong> {formData.address}, {formData.city}</p>
                    <p><strong>Amenities:</strong> {formData.shared_amenities.length} selected</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Next Steps</h4>
                  <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                    <li>Your compound will be created</li>
                    <li>You can add properties to this compound</li>
                    <li>Track occupancy across all buildings</li>
                    <li>Manage bookings from one dashboard</li>
                  </ul>
                </div>
              </div>
            )}
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
            disabled={createCompoundMutation.isPending}
          >
            {createCompoundMutation.isPending ? (
              <>Creating...</>
            ) : currentStep === steps.length ? (
              <>Create Compound <CheckCircle2 className="ml-2 h-4 w-4" /></>
            ) : (
              <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompoundNew;

