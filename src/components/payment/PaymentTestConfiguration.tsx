
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TestData {
  packageType: 'standard' | 'premium' | 'luxury';
  studentEmail: string;
  propertyOwnerId: string;
  agentId: string;
}

interface PaymentTestConfigurationProps {
  testData: TestData;
  onTestDataChange: (data: TestData) => void;
}

const PaymentTestConfiguration: React.FC<PaymentTestConfigurationProps> = ({
  testData,
  onTestDataChange
}) => {
  const updateTestData = (field: keyof TestData, value: string) => {
    onTestDataChange({
      ...testData,
      [field]: value
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="packageType">Package Type</Label>
        <Select 
          value={testData.packageType} 
          onValueChange={(value: 'standard' | 'premium' | 'luxury') => 
            updateTestData('packageType', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard Package (₵2,700)</SelectItem>
            <SelectItem value="premium">Premium Package (₵3,600)</SelectItem>
            <SelectItem value="luxury">Luxury Package (₵4,000)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="studentEmail">Student Email</Label>
        <Input
          id="studentEmail"
          type="email"
          value={testData.studentEmail}
          onChange={(e) => updateTestData('studentEmail', e.target.value)}
          placeholder="test@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyOwnerId">Property Owner ID</Label>
        <Input
          id="propertyOwnerId"
          value={testData.propertyOwnerId}
          onChange={(e) => updateTestData('propertyOwnerId', e.target.value)}
          placeholder="550e8400-e29b-41d4-a716-446655440001"
        />
        <p className="text-xs text-gray-500">Use valid UUID format for testing</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agentId">Agent ID</Label>
        <Input
          id="agentId"
          value={testData.agentId}
          onChange={(e) => updateTestData('agentId', e.target.value)}
          placeholder="550e8400-e29b-41d4-a716-446655440002"
        />
        <p className="text-xs text-gray-500">Use valid UUID format for testing</p>
      </div>
    </div>
  );
};

export default PaymentTestConfiguration;
