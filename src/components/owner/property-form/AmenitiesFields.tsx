
import React from 'react';
import AmenitiesSelector from './AmenitiesSelector';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FormSection } from "./FormSection";

interface FormType {
  setValue: (name: string, value: boolean) => void;
  watch: (name: string) => boolean;
  getValues: () => Record<string, unknown>;
}

export function AmenitiesFields({ form }: { form: FormType }) {
  const [customAmenityOpen, setCustomAmenityOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");
  const [newAmenityName, setNewAmenityName] = useState("");
  const [newAmenityCategory, setNewAmenityCategory] = useState("basic");
  const [showChallengesModal, setShowChallengesModal] = useState(false);

  const addCustomAmenity = () => {
    if (!newAmenityName.trim()) return;
    
    // Add the custom amenity to the form
    const amenityKey = newAmenityName.toLowerCase().replace(/\s+/g, '_');
    form.setValue(`amenities.${newAmenityCategory}.${amenityKey}`, true);
    
    // Reset and close dialog
    setNewAmenityName("");
    setCustomAmenityOpen(false);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setNewAmenityCategory(value);
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="basic">Basic Amenities</TabsTrigger>
        <TabsTrigger value="kitchen">Kitchen & Dining</TabsTrigger>
        <TabsTrigger value="common">Common Area</TabsTrigger>
        <TabsTrigger value="laundry">Laundry & Cleaning</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="custom">Custom Amenities</TabsTrigger>
      </TabsList>
      <TabsContent value="basic">
        <AmenitiesSelector form={form} category="basic" />
      </TabsContent>
      <TabsContent value="kitchen">
        <AmenitiesSelector form={form} category="kitchen" />
      </TabsContent>
      <TabsContent value="common">
        <AmenitiesSelector form={form} category="common" />
      </TabsContent>
      <TabsContent value="laundry">
        <AmenitiesSelector form={form} category="laundry" />
      </TabsContent>
      <TabsContent value="security">
        <AmenitiesSelector form={form} category="security" />
      </TabsContent>
      <TabsContent value="custom">
        <div className="space-y-4">
          <AmenitiesSelector form={form} category="custom" />
          <Button onClick={() => setCustomAmenityOpen(true)}>Add Custom Amenity</Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AmenitiesFields;
