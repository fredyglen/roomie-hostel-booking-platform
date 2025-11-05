
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function AmenitiesFields({ form }: { form: UseFormReturn<PropertyFormValues> }) {
  const [customAmenityOpen, setCustomAmenityOpen] = useState(false);
  const [newAmenityName, setNewAmenityName] = useState("");

  // Amenity categories and items (labels exactly as in the mock)
  const categories: { key: string; title: string; icon: string; items: string[] }[] = [
    { key: 'basic', title: 'Basic Utilities', icon: 'power', items: [
      'Water Supply','Electricity','WiFi Internet','Generator Backup','Waste Management','Cleaning Service','Maintenance Service'
    ]},
    { key: 'security', title: 'Security & Safety', icon: 'shield_person', items: [
      'Security Guard','CCTV Security','Walled Compound','Gate Security','Fire Safety','Emergency Exits','First Aid Kit'
    ]},
    { key: 'room', title: 'Room Features', icon: 'bed', items: [
      'Bed Frame','Mattress','Wardrobe','Study Desk','Chair','Fan','Reading Light'
    ]},
    { key: 'washroom', title: 'Washroom Facilities', icon: 'bathtub', items: [
      'Private Bathroom','Shared Bathroom','Hot Water','Shower','Mirror','Towel Rack'
    ]},
    { key: 'kitchen', title: 'Kitchen & Dining', icon: 'restaurant', items: [
      'Shared Kitchen','Cooking Gas','Refrigerator','Microwave','Dining Area','Water Dispenser'
    ]},
    { key: 'recreation', title: 'Recreation & Study', icon: 'menu_book', items: [
      'Study Area','Common Room','TV Room','Outdoor Space','Gym'
    ]}
  ];

  const selected: string[] = form.watch('amenities') || [];
  const isSelected = (label: string) => selected.includes(label);
  const toggleAmenity = (label: string, checked: boolean) => {
    const next = checked ? Array.from(new Set([...(selected || []), label])) : (selected || []).filter(l => l !== label);
    form.setValue('amenities', next, { shouldValidate: true, shouldDirty: true });
  };

  const addCustomAmenity = () => {
    if (!newAmenityName.trim()) return;
    toggleAmenity(newAmenityName.trim(), true);
    setNewAmenityName("");
    setCustomAmenityOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[22px] font-bold leading-tight tracking-[-0.015em]">Select all available amenities</h3>
        <Button variant="outline" onClick={() => setCustomAmenityOpen(true)} className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Custom Amenity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.key} className="bg-white border border-neutral-400/50 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
              <h4 className="text-lg font-bold">{cat.title}</h4>
            </div>
            <div className="space-y-3">
              {cat.items.map((label) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-neutral-400 text-primary focus:ring-primary/50"
                    checked={isSelected(label)}
                    onChange={(e) => toggleAmenity(label, e.target.checked)}
                  />
                  <span className="text-sm text-neutral-900">{label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

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
            <Button onClick={addCustomAmenity}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AmenitiesFields;
