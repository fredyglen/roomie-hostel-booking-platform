/**
 * INTELLIGENT PROPERTY ROUTER
 * 
 * Asks business questions, automatically determines:
 * - Property type (Hostel/Homestel/Apartment)
 * - Structure complexity (Simple/Building/Compound)
 * - Agent vs Owner setup
 * - Documentation requirements
 * 
 * NO TECHNICAL JARGON. JUST BUSINESS QUESTIONS.
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Home, Users, FileText, CheckCircle2 } from 'lucide-react';

interface PropertyRouterResult {
  propertyType: 'hostel' | 'homestel' | 'apartment';
  structureType: 'simple' | 'building' | 'compound';
  userType: 'owner' | 'agent';
  requiresDocumentation: boolean;
  recommendedSetup: string;
}

interface IntelligentPropertyRouterProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: PropertyRouterResult) => void;
}

export const IntelligentPropertyRouter: React.FC<IntelligentPropertyRouterProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    userType: '',
    propertyCount: '',
    accommodationType: '',
    buildingType: '',
    roomCount: '',
    hasDocumentation: ''
  });

  // Handle auto-completion for non-agents at step 5
  React.useEffect(() => {
    if (step === 5 && answers.userType !== 'agent') {
      handleComplete();
    }
  }, [step, answers.userType]);

  // Step 1: Are you an owner or agent?
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Let's get started</h3>
        <p className="text-gray-600">First, tell us about yourself</p>
      </div>

      <RadioGroup
        value={answers.userType}
        onValueChange={(value) => setAnswers({ ...answers, userType: value })}
      >
        <Card className="cursor-pointer hover:border-blue-500 transition-all">
          <CardContent className="flex items-start space-x-4 p-6">
            <RadioGroupItem value="owner" id="owner" />
            <div className="flex-1">
              <Label htmlFor="owner" className="text-lg font-medium cursor-pointer">
                I own this property
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                You own one or a few properties and manage them yourself
              </p>
            </div>
            <Home className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-blue-500 transition-all">
          <CardContent className="flex items-start space-x-4 p-6">
            <RadioGroupItem value="agent" id="agent" />
            <div className="flex-1">
              <Label htmlFor="agent" className="text-lg font-medium cursor-pointer">
                I'm a property agent/manager
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                You manage multiple properties for different owners as a business
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
      </RadioGroup>

      <Button
        onClick={() => setStep(2)}
        disabled={!answers.userType}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );

  // Step 2: How many properties? (for agents)
  const renderStep2 = () => {
    if (answers.userType !== 'agent') {
      setStep(3);
      return null;
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">How many properties do you manage?</h3>
          <p className="text-gray-600">This helps us set up the right system for you</p>
        </div>

        <RadioGroup
          value={answers.propertyCount}
          onValueChange={(value) => setAnswers({ ...answers, propertyCount: value })}
        >
          <Card className="cursor-pointer hover:border-blue-500 transition-all">
            <CardContent className="flex items-start space-x-4 p-6">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single" className="text-lg font-medium cursor-pointer flex-1">
                Just this one property
              </Label>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-blue-500 transition-all">
            <CardContent className="flex items-start space-x-4 p-6">
              <RadioGroupItem value="multiple_separate" id="multiple_separate" />
              <div className="flex-1">
                <Label htmlFor="multiple_separate" className="text-lg font-medium cursor-pointer">
                  Multiple properties in different locations
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Each property is separate (different addresses)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-blue-500 transition-all">
            <CardContent className="flex items-start space-x-4 p-6">
              <RadioGroupItem value="compound" id="compound" />
              <div className="flex-1">
                <Label htmlFor="compound" className="text-lg font-medium cursor-pointer">
                  Multiple buildings in the same compound
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  All buildings share the same address/compound (e.g., Block A, Block B, Block C)
                </p>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
            Back
          </Button>
          <Button
            onClick={() => setStep(3)}
            disabled={!answers.propertyCount}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  };

  // Step 3: What type of accommodation?
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">What type of accommodation is this?</h3>
        <p className="text-gray-600">Choose the one that best describes your property</p>
      </div>

      <RadioGroup
        value={answers.accommodationType}
        onValueChange={(value) => setAnswers({ ...answers, accommodationType: value })}
      >
        <Card className="cursor-pointer hover:border-blue-500 transition-all">
          <CardContent className="flex items-start space-x-4 p-6">
            <RadioGroupItem value="hostel" id="hostel" />
            <div className="flex-1">
              <Label htmlFor="hostel" className="text-lg font-medium cursor-pointer">
                Student Hostel
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Traditional hostel with shared rooms (2-4 students per room), semester-based pricing
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-blue-500 transition-all">
          <CardContent className="flex items-start space-x-4 p-6">
            <RadioGroupItem value="homestel" id="homestel" />
            <div className="flex-1">
              <Label htmlFor="homestel" className="text-lg font-medium cursor-pointer">
                Homestel (Home-style)
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Home-like accommodation, mostly single rooms or 2-in-a-room, flexible rental periods
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-blue-500 transition-all">
          <CardContent className="flex items-start space-x-4 p-6">
            <RadioGroupItem value="apartment" id="apartment" />
            <div className="flex-1">
              <Label htmlFor="apartment" className="text-lg font-medium cursor-pointer">
                Apartment/Self-Contained Units
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Complete units with kitchen, bathroom (studio, 1-bed, 2-bed, etc.)
              </p>
            </div>
          </CardContent>
        </Card>
      </RadioGroup>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(answers.userType === 'agent' ? 2 : 1)} className="flex-1">
          Back
        </Button>
        <Button
          onClick={() => setStep(4)}
          disabled={!answers.accommodationType}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  // Step 4: Building structure
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Tell us about the building</h3>
        <p className="text-gray-600">This helps us track rooms and availability accurately</p>
      </div>

      <RadioGroup
        value={answers.buildingType}
        onValueChange={(value) => setAnswers({ ...answers, buildingType: value })}
      >
        <Card className="cursor-pointer hover:border-blue-500 transition-all">
          <CardContent className="flex items-start space-x-4 p-6">
            <RadioGroupItem value="simple" id="simple" />
            <div className="flex-1">
              <Label htmlFor="simple" className="text-lg font-medium cursor-pointer">
                Simple property (1-2 floors, few rooms)
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Small property, easy to manage without detailed floor plans
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-blue-500 transition-all">
          <CardContent className="flex items-start space-x-4 p-6">
            <RadioGroupItem value="multi_floor" id="multi_floor" />
            <div className="flex-1">
              <Label htmlFor="multi_floor" className="text-lg font-medium cursor-pointer">
                Multi-floor building (3+ floors, many rooms)
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Need to track which floor each room is on, room numbers, bed assignments
              </p>
            </div>
          </CardContent>
        </Card>
      </RadioGroup>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
          Back
        </Button>
        <Button
          onClick={() => setStep(5)}
          disabled={!answers.buildingType}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  // Step 5: Documentation (for agents)
  const renderStep5 = () => {
    if (answers.userType !== 'agent') {
      return null;
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Business Documentation</h3>
          <p className="text-gray-600">
            As an agent, proper documentation helps you access business services
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Why documentation matters:</p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                <li>Qualify for business loans and financing</li>
                <li>Build verified track record for partnerships</li>
                <li>Access premium agent features</li>
                <li>Provide guarantees to property owners</li>
              </ul>
            </div>
          </div>
        </div>

        <RadioGroup
          value={answers.hasDocumentation}
          onValueChange={(value) => setAnswers({ ...answers, hasDocumentation: value })}
        >
          <Card className="cursor-pointer hover:border-blue-500 transition-all">
            <CardContent className="flex items-start space-x-4 p-6">
              <RadioGroupItem value="yes" id="yes" />
              <div className="flex-1">
                <Label htmlFor="yes" className="text-lg font-medium cursor-pointer">
                  Yes, I have business documentation
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Business registration, tax ID, or other official documents
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-blue-500 transition-all">
            <CardContent className="flex items-start space-x-4 p-6">
              <RadioGroupItem value="no" id="no" />
              <div className="flex-1">
                <Label htmlFor="no" className="text-lg font-medium cursor-pointer">
                  No, but I want to build my business profile
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  We'll help you track your performance to qualify for services later
                </p>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(4)} className="flex-1">
            Back
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!answers.hasDocumentation}
            className="flex-1"
          >
            Complete Setup
          </Button>
        </div>
      </div>
    );
  };

  const handleComplete = () => {
    const result: PropertyRouterResult = {
      propertyType: answers.accommodationType as 'hostel' | 'homestel' | 'apartment',
      structureType: determineStructureType(),
      userType: answers.userType as 'owner' | 'agent',
      requiresDocumentation: answers.userType === 'agent' && answers.hasDocumentation === 'yes',
      recommendedSetup: generateRecommendation()
    };

    onComplete(result);
  };

  const determineStructureType = (): 'simple' | 'building' | 'compound' => {
    if (answers.propertyCount === 'compound') return 'compound';
    if (answers.buildingType === 'multi_floor') return 'building';
    return 'simple';
  };

  const generateRecommendation = (): string => {
    const { userType, accommodationType, buildingType, propertyCount } = answers;
    
    if (propertyCount === 'compound') {
      return 'Compound Management System - Track multiple buildings in one location with centralized management';
    }
    
    if (buildingType === 'multi_floor') {
      return 'Building Structure System - Track floors, rooms, and beds with detailed inventory management';
    }
    
    if (userType === 'agent' && propertyCount === 'multiple_separate') {
      return 'Multi-Property Dashboard - Manage all your properties from one central dashboard';
    }
    
    return 'Simple Property Setup - Quick and easy property listing';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Property Setup Wizard</DialogTitle>
          <div className="flex items-center justify-center space-x-2 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full transition-all ${
                  s <= step ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="mt-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

