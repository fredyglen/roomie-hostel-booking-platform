
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyFormValues } from './PropertyFormSchema';
import { Badge } from '@/components/ui/badge';

interface AmenitiesFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  hasFeatureAccess?: (feature: string) => boolean;
}

const AmenitiesFields: React.FC<AmenitiesFieldsProps> = ({ 
  form, 
  hasFeatureAccess = () => true 
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>
              Amenities
              {!hasFeatureAccess('detailed_amenities') && <Badge variant="outline" className="ml-1">Basic List</Badge>}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={hasFeatureAccess('detailed_amenities') 
                  ? "List amenities (one per line):\nWiFi\nAir Conditioning\nLaundry\nParking\nKitchen\nGym\nSwimming Pool\nSecurity\nCleaning Service\n24/7 Reception"
                  : "List basic amenities (one per line):\nWiFi\nParking\nSecurity\nWater\nElectricity"
                }
                rows={hasFeatureAccess('detailed_amenities') ? 8 : 5}
                {...field}
              />
            </FormControl>
            <FormDescription>
              {hasFeatureAccess('detailed_amenities') 
                ? "List all available amenities, one per line"
                : "Basic amenities only. Upgrade for detailed amenity listings."
              }
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="all_inclusive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-normal">
                All-Inclusive Pricing
              </FormLabel>
              <FormDescription className="text-xs">
                Rent includes utilities and other services
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="utilities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Utilities
              {!hasFeatureAccess('detailed_utilities') && <Badge variant="outline" className="ml-1">Basic</Badge>}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={hasFeatureAccess('detailed_utilities')
                  ? "List utilities (one per line):\nElectricity\nWater\nInternet\nGas\nCable TV\nHeating\nAir Conditioning\nWaste Management"
                  : "List basic utilities (one per line):\nElectricity\nWater\nInternet"
                }
                rows={hasFeatureAccess('detailed_utilities') ? 6 : 3}
                {...field}
              />
            </FormControl>
            <FormDescription>
              {hasFeatureAccess('detailed_utilities')
                ? "List all utilities included, one per line"
                : "Basic utilities only. Upgrade for detailed utility management."
              }
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="house_rules"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>
              House Rules
              {!hasFeatureAccess('detailed_rules') && <Badge variant="outline" className="ml-1">Basic</Badge>}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={hasFeatureAccess('detailed_rules')
                  ? "List house rules (one per line):\nNo smoking\nNo pets\nNo loud music after 10 PM\nNo unauthorized guests\nKeep common areas clean\nRespect other tenants\nNo alcohol in rooms\nVisitors must register"
                  : "List basic rules (one per line):\nNo smoking\nNo pets\nQuiet hours after 10 PM"
                }
                rows={hasFeatureAccess('detailed_rules') ? 6 : 3}
                {...field}
              />
            </FormControl>
            <FormDescription>
              {hasFeatureAccess('detailed_rules')
                ? "List all house rules, one per line"
                : "Basic rules only. Upgrade for comprehensive rule management."
              }
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AmenitiesFields;
