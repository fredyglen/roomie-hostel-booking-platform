
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Bed, Shirt, Fan, Square } from 'lucide-react';

interface RoomFeaturesFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const RoomFeaturesFields: React.FC<RoomFeaturesFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bed className="w-5 h-5" />
            <span>Furniture & Furnishing</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="has_bedframes"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <FormLabel>Bed Frames</FormLabel>
                    <FormDescription>Rooms include bed frames</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_mattresses"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <FormLabel>Mattresses</FormLabel>
                    <FormDescription>Rooms include mattresses</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_wardrobes"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <FormLabel className="flex items-center space-x-2">
                      <Shirt className="w-4 h-4" />
                      <span>Wardrobes</span>
                    </FormLabel>
                    <FormDescription>Rooms include wardrobes/closets</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_fan"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <FormLabel className="flex items-center space-x-2">
                      <Fan className="w-4 h-4" />
                      <span>Ceiling Fans</span>
                    </FormLabel>
                    <FormDescription>Rooms have ceiling fans</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_tiled_room"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <FormLabel className="flex items-center space-x-2">
                      <Square className="w-4 h-4" />
                      <span>Tiled Floors</span>
                    </FormLabel>
                    <FormDescription>Rooms have tiled flooring</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Utility Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="washroom_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Washroom Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select washroom type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inside">Inside Room</SelectItem>
                      <SelectItem value="outside">Outside Room</SelectItem>
                      <SelectItem value="shared">Shared</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Location of washroom facilities
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meter_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meter Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meter type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="self">Self Meter</SelectItem>
                      <SelectItem value="shared">Shared Meter</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Electricity meter configuration
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="has_individual_meters"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <FormLabel>Individual Meters</FormLabel>
                  <FormDescription>Each room has its own electricity meter</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allow_bill_sharing"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <FormLabel>Allow Bill Sharing</FormLabel>
                  <FormDescription>Students can share utility bills</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomFeaturesFields;
