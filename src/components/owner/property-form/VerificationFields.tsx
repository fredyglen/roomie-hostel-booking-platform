import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "./FormSection";
import { PropertyFormValues } from "./PropertyFormSchema";

export function VerificationFields({ form }: { form: UseFormReturn<PropertyFormValues> }) {
  return (
    <FormSection title="Verification & Emergency Contact">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="emergency_contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormDescription>Name of emergency contact person</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="emergency_contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormDescription>Phone number of emergency contact</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="emergency_contact_relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="owner">Property Owner</SelectItem>
                      <SelectItem value="manager">Property Manager</SelectItem>
                      <SelectItem value="caretaker">Caretaker</SelectItem>
                      <SelectItem value="relative">Relative</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Relationship to the property</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="emergency_contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email address" {...field} />
                  </FormControl>
                  <FormDescription>Email of emergency contact</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Property Verification</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="property_ownership_proof"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proof of Ownership</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} value={undefined} onChange={(e) => {
                      field.onChange(e.target.files?.[0] || null);
                    }} />
                  </FormControl>
                  <FormDescription>Upload proof of property ownership</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="verification_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Verification Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional information for verification..." {...field} />
                  </FormControl>
                  <FormDescription>Provide any additional details that may help with verification</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}