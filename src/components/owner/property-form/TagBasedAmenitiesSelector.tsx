import React, { useState } from 'react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface TagBasedAmenitiesSelectorProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
}

/**
 * BE CONSCIOUS: Tag-Based Amenities System
 * 
 * Ghana-specific amenities organized by categories
 * Following centralized configuration standards
 */
const TagBasedAmenitiesSelector: React.FC<TagBasedAmenitiesSelectorProps> = ({ 
  form, 
  propertyCategory 
}) => {
  const [customAmenityOpen, setCustomAmenityOpen] = useState(false);
  const [newAmenityName, setNewAmenityName] = useState('');
  const selectedAmenities = Array.isArray(form.watch('amenities')) ? form.watch('amenities') : [];

  // Categories exactly as per the HTML mock
  const categories = [
    { key: 'basic', title: 'Basic Utilities', icon: 'power', items: [
      'Water Supply','Electricity','WiFi Internet','Generator Backup','Waste Management','Cleaning Service','Maintenance Service'
    ]},
    { key: 'security', title: 'Security & Safety', icon: 'security', items: [
      'Security Guard','CCTV Security','Walled Compound','Gate Security','Fire Safety','Emergency Exits','First Aid Kit'
    ]},
    { key: 'room', title: 'Room Features', icon: 'bed', items: [
      'Bed Frame','Mattress','Wardrobe','Study Desk','Chair','Fan','Reading Light'
    ]},
    { key: 'washroom', title: 'Washroom Facilities', icon: 'shower', items: [
      'Private Bathroom','Shared Bathroom','Hot Water','Shower','Mirror','Towel Rack'
    ]},
    { key: 'kitchen', title: 'Kitchen & Dining', icon: 'kitchen', items: [
      'Shared Kitchen','Cooking Gas','Refrigerator','Microwave','Dining Area','Water Dispenser'
    ]},
    { key: 'recreation', title: 'Recreation & Study', icon: 'deck', items: [
      'Study Area','Common Room','TV Room','Outdoor Space','Gym'
    ]}
  ] as const;

  // BE CONSCIOUS: Toggle amenity selection
  const toggleAmenity = (amenityName: string) => {
    const currentAmenities = Array.isArray(selectedAmenities) ? selectedAmenities : [];
    const isSelected = currentAmenities.includes(amenityName);

    if (isSelected) {
      form.setValue('amenities', currentAmenities.filter(a => a !== amenityName));
    } else {
      // BE CONSCIOUS: Respect max amenities limit from business rules
      if (currentAmenities.length < 20) { // From centralized business rules
        form.setValue('amenities', [...currentAmenities, amenityName]);
      }
    }
  };

  // BE CONSCIOUS: Add custom amenity
  const addCustomAmenity = (customAmenity: string) => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      if (selectedAmenities.length < 20) {
        form.setValue('amenities', [...selectedAmenities, customAmenity.trim()]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-neutral-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Select all available amenities</h2>
        <button
          type="button"
          onClick={() => setCustomAmenityOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold border-2 border-neutral-400 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Add Custom Amenity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.key} className="bg-white dark:bg-neutral-800/50 border border-neutral-400/50 dark:border-neutral-600/50 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
              <h3 className="text-lg font-bold">{cat.title}</h3>
            </div>
            <div className="space-y-3">
              {cat.items.map((label) => {
                const checked = selectedAmenities.includes(label);
                return (
                  <label key={label} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-neutral-400 text-primary focus:ring-primary/50"
                      checked={checked}
                      onChange={() => {
                        const isSelected = selectedAmenities.includes(label);
                        const next = isSelected ? selectedAmenities.filter(a => a !== label) : Array.from(new Set([...(selectedAmenities || []), label]));
                        form.setValue('amenities', next, { shouldDirty: true, shouldValidate: true });
                      }}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Hidden form field for validation */}
      <FormField
        control={form.control}
        name="amenities"
        render={() => (
          <FormItem className="hidden">
            <FormControl>
              <input type="hidden" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Dialog open={customAmenityOpen} onOpenChange={setCustomAmenityOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Amenity</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Amenity name (e.g. 24/7 Concierge)"
              value={newAmenityName}
              onChange={(e) => setNewAmenityName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomAmenityOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                const name = newAmenityName.trim();
                if (name) {
                  const next = Array.from(new Set([...(selectedAmenities || []), name]));
                  form.setValue('amenities', next, { shouldDirty: true, shouldValidate: true });
                }
                setNewAmenityName('');
                setCustomAmenityOpen(false);
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagBasedAmenitiesSelector;
