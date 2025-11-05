import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { FormSection } from "./FormSection";
import { PropertyFormValues } from "./PropertyFormSchema";
import { getPropertyTypeOptions } from '@/config/property-types.config';

// Mock data for universities - replace with actual API data
const UNIVERSITIES = [
  { label: "University of Ghana", value: "university_of_ghana" },
  { label: "Kwame Nkrumah University of Science and Technology", value: "knust" },
  { label: "University of Cape Coast", value: "ucc" },
  { label: "Ashesi University", value: "ashesi" },
  { label: "Ghana Institute of Management and Public Administration", value: "gimpa" },
  { label: "University of Professional Studies", value: "upsa" },
  { label: "Central University", value: "central_university" },
  { label: "Valley View University", value: "valley_view" },
  { label: "University of Education, Winneba", value: "uew" },
  { label: "Academic City University College", value: "academic_city" }
];

// Mock data for regions - replace with actual API data
const REGIONS = [
  { label: "Greater Accra", value: "greater_accra" },
  { label: "Ashanti", value: "ashanti" },
  { label: "Western", value: "western" },
  { label: "Eastern", value: "eastern" },
  { label: "Central", value: "central" },
  { label: "Volta", value: "volta" },
  { label: "Northern", value: "northern" },
  { label: "Upper East", value: "upper_east" },
  { label: "Upper West", value: "upper_west" },
  { label: "Bono", value: "bono" },
  { label: "Bono East", value: "bono_east" },
  { label: "Ahafo", value: "ahafo" },
  { label: "Western North", value: "western_north" },
  { label: "Oti", value: "oti" },
  { label: "Savannah", value: "savannah" },
  { label: "North East", value: "north_east" }
];

export function BasicInfoFields({ form }: { form: UseFormReturn<PropertyFormValues> }) {
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [areaSuggestions, setAreaSuggestions] = useState<string[]>([]);
  const [landmarkSuggestions, setLandmarkSuggestions] = useState<string[]>([]);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);

  // Mock function to simulate address suggestions - replace with actual API
  const fetchAddressSuggestions = (input: string) => {
    // This would be an API call in a real implementation
    const mockSuggestions = [
      `${input} Street`, 
      `${input} Avenue`, 
      `${input} Road`, 
      `${input} Lane`
    ];
    setAddressSuggestions(mockSuggestions);
  };

  // Similar mock functions for other location fields
  const fetchAreaSuggestions = (input: string) => {
    const mockSuggestions = [
      `${input} Area`, 
      `${input} Heights`, 
      `${input} Gardens`, 
      `${input} Estate`
    ];
    setAreaSuggestions(mockSuggestions);
  };

  const fetchLandmarkSuggestions = (input: string) => {
    const mockSuggestions = [
      `${input} Mall`, 
      `${input} Market`, 
      `${input} Junction`, 
      `${input} Plaza`
    ];
    setLandmarkSuggestions(mockSuggestions);
  };

  const fetchCitySuggestions = (input: string) => {
    const mockSuggestions = [
      `${input}town`, 
      `${input} City`, 
      `New ${input}`, 
      `${input} Central`
    ];
    setCitySuggestions(mockSuggestions);
  };

  return (
    <FormSection title="Basic Information">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="property_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter property name" {...field} />
                </FormControl>
                <FormDescription>The name of your property</FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="property_category"
            render={({ field }) => {
              const propertyTypeOptions = getPropertyTypeOptions();

              return (
                <FormItem>
                  <FormLabel>Property Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Type of student accommodation</FormDescription>
                </FormItem>
              );
            }}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="street_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter street address" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        fetchAddressSuggestions(e.target.value);
                      }}
                      list="address-suggestions"
                    />
                  </FormControl>
                  <datalist id="address-suggestions">
                    {addressSuggestions.map((suggestion, index) => (
                      <option key={index} value={suggestion} />
                    ))}
                  </datalist>
                  <FormDescription>Street address of the property</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area/Suburb</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter area or suburb" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        fetchAreaSuggestions(e.target.value);
                      }}
                      list="area-suggestions"
                    />
                  </FormControl>
                  <datalist id="area-suggestions">
                    {areaSuggestions.map((suggestion, index) => (
                      <option key={index} value={suggestion} />
                    ))}
                  </datalist>
                  <FormDescription>Area or suburb of the property</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landmark</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter nearby landmark" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        fetchLandmarkSuggestions(e.target.value);
                      }}
                      list="landmark-suggestions"
                    />
                  </FormControl>
                  <datalist id="landmark-suggestions">
                    {landmarkSuggestions.map((suggestion, index) => (
                      <option key={index} value={suggestion} />
                    ))}
                  </datalist>
                  <FormDescription>Nearby landmark for easy location</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter city" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        fetchCitySuggestions(e.target.value);
                      }}
                      list="city-suggestions"
                    />
                  </FormControl>
                  <datalist id="city-suggestions">
                    {citySuggestions.map((suggestion, index) => (
                      <option key={index} value={suggestion} />
                    ))}
                  </datalist>
                  <FormDescription>City where the property is located</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Type to search regions" 
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      list="region-suggestions"
                    />
                  </FormControl>
                  <datalist id="region-suggestions">
                    {REGIONS.map((region) => (
                      <option key={region.value} value={region.label} />
                    ))}
                  </datalist>
                  <FormDescription>Region where the property is located</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nearest University</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Type to search universities" 
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      list="university-suggestions"
                    />
                  </FormControl>
                  <datalist id="university-suggestions">
                    {UNIVERSITIES.map((university) => (
                      <option key={university.value} value={university.label} />
                    ))}
                  </datalist>
                  <FormDescription>University this property primarily serves</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Availability & Booking</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="availability_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available From</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>When the property becomes available</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="minimum_stay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Stay (months)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 6" {...field} />
                  </FormControl>
                  <FormDescription>Minimum booking duration</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="semester_availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester Availability</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="semester_1">First Semester Only</SelectItem>
                      <SelectItem value="semester_2">Second Semester Only</SelectItem>
                      <SelectItem value="year_round">Year Round</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>When the property is available during the academic year</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="booking_policy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Policy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="instant">Instant Booking</SelectItem>
                      <SelectItem value="approval">Requires Approval</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>How booking requests are handled</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}