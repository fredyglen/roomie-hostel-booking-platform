import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Slider } from '@/components/ui/slider';
import { usePropertyRoomTypes, getRoomTypeAvailabilityStatus, getAvailabilityStatusDisplay } from '@/hooks/usePropertyRoomTypes';

interface Preferences {
  studyHabits?: string;
  sleepSchedule?: string;
  cleanliness?: string;
  socialPreference?: string;
  hobbies?: string[];
  dietary?: string;
  smoking?: string;
  noiseSensitivity?: string;
}

interface RoomAndPreferencesStepProps {
  // Required selections
  selectedRoomType: string;
  onRoomTypeChange: (value: string) => void;
  onRoomTypeSelect?: (value: string, price: number) => void;
  // Optional
  extraRequests: string;
  onRequestsChange: (value: string) => void;
  // Preferences
  preferences: Preferences;
  onPreferenceChange: (field: keyof Preferences, value: string | string[]) => void;
  // Navigation
  onPrevious: () => void;
  onNext: () => void;
  // Dynamic property context
  propertyId: string;
  propertyCategory?: string;
}

const RoomAndPreferencesStep: React.FC<RoomAndPreferencesStepProps> = ({
  selectedRoomType,
  onRoomTypeChange,
  onRoomTypeSelect,
  extraRequests,
  onRequestsChange,
  preferences,
  onPreferenceChange,
  onPrevious,
  onNext,
  propertyId,
  propertyCategory,
}) => {
  const { roomTypes, isLoading, error } = usePropertyRoomTypes({ propertyId, propertyCategory, enableFallback: true });

  const isValid = Boolean(selectedRoomType);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Choose Your Room</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="h-16 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Choose Your Room</h2>
        <div className="text-red-600 p-4 border border-red-200 rounded-lg">
          <p>Unable to load room types: {error}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile sticky header */}
      <div className="md:hidden sticky top-0 z-10 w-full bg-white">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button type="button" onClick={onPrevious} aria-label="Back" className="flex size-12 shrink-0 items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Step 3/5: Choose Your Room</h2>
          <div className="size-12 shrink-0"></div>
        </div>
        <div className="w-full bg-gray-100 h-1">
          <div className="bg-primary h-1" style={{ width: '60%' }}></div>
        </div>
      </div>

      <div className="space-y-6 px-4 md:px-0 pb-24 md:pb-0">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">Choose Your Room</h2>
          <p className="text-gray-600 mt-1">Select your preferred room and optionally share your preferences.</p>
        </div>

        {/* Room type selection (Radio list) */}
        <div>
          <Label className="mb-2 block">Room Type</Label>
          <RadioGroup
            value={selectedRoomType}
            onValueChange={(value) => {
              onRoomTypeChange(value);
              const rt = roomTypes.find((r) => r.value === value);
              if (rt && onRoomTypeSelect) onRoomTypeSelect(value, rt.price);
            }}
            className="space-y-3"
          >
            {roomTypes.length > 0 ? (
              roomTypes.map((rt) => {
                const status = getRoomTypeAvailabilityStatus(rt);
                const statusDisplay = getAvailabilityStatusDisplay(status);
                const disabled = status === 'full';
                const isSelected = selectedRoomType === rt.value;

                return (
                  <label
                    key={rt.value}
                    className={`flex items-center justify-between w-full p-4 border rounded-lg transition-colors cursor-pointer ${
                      isSelected ? 'border-primary bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={rt.value} id={`rt-${rt.value}`} disabled={disabled} />
                      <div>
                        <div className="font-medium">{rt.label}</div>
                        <div className="text-sm text-gray-600">₵{rt.price.toLocaleString()}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`text-xs ${statusDisplay.color} ${statusDisplay.bgColor}`}>
                      {statusDisplay.text}
                    </Badge>
                  </label>
                );
              })
            ) : (
              <div className="text-sm text-gray-600">No room types available</div>
            )}
          </RadioGroup>
        </div>

        {/* Roommate Preferences - Drawer */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full">Set Roommate Preferences (Optional)</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Roommate Preferences</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-5">
              <div>
                <Label className="mb-2 block">Study habits</Label>
                <RadioGroup value={preferences.studyHabits || ''} onValueChange={(v) => onPreferenceChange('studyHabits', v)} className="grid grid-cols-3 gap-2">
                  {['Quiet', 'Flexible', 'No preference'].map((opt) => (
                    <label key={opt} className="flex items-center justify-center gap-2 p-2 border rounded-full cursor-pointer text-sm">
                      <RadioGroupItem value={opt} id={`study-${opt}`} />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label className="mb-2 block">Sleep schedule</Label>
                <RadioGroup value={preferences.sleepSchedule || ''} onValueChange={(v) => onPreferenceChange('sleepSchedule', v)} className="grid grid-cols-3 gap-2">
                  {['Early', 'Late', 'Flexible'].map((opt) => (
                    <label key={opt} className="flex items-center justify-center gap-2 p-2 border rounded-full cursor-pointer text-sm">
                      <RadioGroupItem value={opt} id={`sleep-${opt}`} />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label className="mb-2 block">Cleanliness</Label>
                <Slider defaultValue={[50]} step={25} onValueChange={(vals) => {
                  const v = vals[0];
                  const label = v <= 25 ? 'Relaxed' : v <= 50 ? 'Moderate' : 'Tidy';
                  onPreferenceChange('cleanliness', label);
                }} />
              </div>
              <div>
                <Label className="mb-2 block">Noise sensitivity</Label>
                <Slider defaultValue={[50]} step={25} onValueChange={(vals) => {
                  const v = vals[0];
                  const label = v <= 25 ? 'Low' : v <= 50 ? 'Medium' : 'High';
                  onPreferenceChange('noiseSensitivity', label);
                }} />
              </div>
              <div>
                <Label className="mb-2 block">Hobbies/interests</Label>
                <ToggleGroup type="multiple" value={preferences.hobbies || []} onValueChange={(vals) => onPreferenceChange('hobbies', vals)} className="flex flex-wrap gap-2 justify-start">
                  {['Reading', 'Sports', 'Music', 'Gaming', 'Cooking', 'Movies'].map((opt) => (
                    <ToggleGroupItem key={opt} value={opt} className="border rounded-full px-3 py-1 text-sm">
                      {opt}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              <div>
                <Label className="mb-2 block">Dietary</Label>
                <RadioGroup value={preferences.dietary || ''} onValueChange={(v) => onPreferenceChange('dietary', v)} className="grid grid-cols-3 gap-2">
                  {['None', 'Vegetarian', 'Halal', 'Other'].map((opt) => (
                    <label key={opt} className="flex items-center justify-center gap-2 p-2 border rounded-full cursor-pointer text-sm">
                      <RadioGroupItem value={opt} id={`diet-${opt}`} />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label className="mb-2 block">Smoking</Label>
                <RadioGroup value={preferences.smoking || ''} onValueChange={(v) => onPreferenceChange('smoking', v)} className="grid grid-cols-3 gap-2">
                  {['No', 'Occasionally', 'Yes'].map((opt) => (
                    <label key={opt} className="flex items-center justify-center gap-2 p-2 border rounded-full cursor-pointer text-sm">
                      <RadioGroupItem value={opt} id={`smoke-${opt}`} />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button className="w-full">Save Preferences</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <div>
          <Label htmlFor="extraRequests">Special Requests (Optional)</Label>
          <Textarea
            id="extraRequests"
            value={extraRequests}
            onChange={(e) => onRequestsChange(e.target.value)}
            placeholder="Any special requests or requirements..."
            rows={3}
          />
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button onClick={onNext} disabled={!isValid}>
            Next
          </Button>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-30 w-full bg-white p-4 border-t border-gray-200">
        <Button onClick={onNext} disabled={!isValid} className="w-full">
          Continue
        </Button>
      </footer>
    </div>
  );
};

export default RoomAndPreferencesStep;

