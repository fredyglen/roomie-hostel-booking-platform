# ROOMi Multi-Account Payment Distribution System

**Date**: December 17, 2024  
**Priority**: HIGH - Required for Business Model Implementation  
**Estimated Implementation Time**: 8-12 hours  

---

## 🎯 **SYSTEM OVERVIEW**

This document outlines the implementation of ROOMi's multi-account payment distribution system using Paystack subaccounts and split payments. The system automatically distributes payments between property owners, agents, and ROOMi's commission structure.

### **Payment Distribution Flow**
```
Student Payment → Paystack Gateway → Automatic Split → Multiple Accounts
     ↓                    ↓                ↓              ↓
Total Amount      Payment Processing    Split Logic    Final Distribution
```

### **Distribution Recipients**
1. **Property Owner**: Base property price (minus commissions)
2. **ROOMi Platform**: 5% commission + 100 GHS platform fee
3. **Agent** (Future): Commission percentage (TBD)
4. **Paystack**: 1.95% processing fee (automatically deducted)

---

## 💰 **PAYMENT DISTRIBUTION LOGIC**

### **Current Business Model Implementation**
```typescript
interface PaymentDistribution {
  basePropertyPrice: number;      // Original property price
  platformCommission: number;     // 5% of base price
  platformFee: number;           // Fixed 100 GHS
  agentCommission: number;       // Future implementation (currently 0)
  paystackFee: number;          // 1.95% of total
  totalAmount: number;          // Amount charged to student
  
  // Distribution amounts
  propertyOwnerAmount: number;   // Base price - commissions
  roomiAmount: number;          // Commission + platform fee
  agentAmount: number;          // Future agent commission
}

const calculatePaymentDistribution = (basePrice: number): PaymentDistribution => {
  const platformCommission = basePrice * 0.05;  // 5%
  const platformFee = 100;                      // 100 GHS
  const agentCommission = 0;                    // Future implementation
  
  const subtotal = basePrice + platformCommission + platformFee;
  const paystackFee = subtotal * 0.0195;        // 1.95%
  const totalAmount = subtotal + paystackFee;
  
  return {
    basePropertyPrice: basePrice,
    platformCommission,
    platformFee,
    agentCommission,
    paystackFee,
    totalAmount,
    propertyOwnerAmount: basePrice - agentCommission,
    roomiAmount: platformCommission + platformFee,
    agentAmount: agentCommission
  };
};
```

---

## 🏗️ **PAYSTACK SUBACCOUNT ARCHITECTURE**

### **Database Schema for Subaccounts**
```sql
-- Add subaccount fields to users table for property owners
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS paystack_subaccount_code TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS bank_account_number TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS bank_code TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS account_holder_name TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS subaccount_status TEXT DEFAULT 'pending';

-- Create subaccounts tracking table
CREATE TABLE IF NOT EXISTS paystack_subaccounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subaccount_code TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  settlement_bank TEXT NOT NULL,
  account_number TEXT NOT NULL,
  percentage_charge DECIMAL(5,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add split payment tracking to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS split_payment_code TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS property_owner_subaccount TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS agent_subaccount TEXT;
```

### **Subaccount Creation Service**
```typescript
// File: src/services/payment/SubaccountService.ts
import { supabase } from '@/lib/supabase';
import { ErrorHandler } from '@/utils/ErrorHandler';

interface CreateSubaccountData {
  userId: string;
  businessName: string;
  bankCode: string;
  accountNumber: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface PaystackSubaccountResponse {
  status: boolean;
  message: string;
  data: {
    subaccount_code: string;
    business_name: string;
    settlement_bank: string;
    account_number: string;
    percentage_charge: number;
    is_verified: boolean;
  };
}

export class SubaccountService {
  private static readonly PAYSTACK_SECRET_KEY = import.meta.env.VITE_PAYSTACK_SECRET_KEY;
  private static readonly PAYSTACK_BASE_URL = 'https://api.paystack.co';

  /**
   * Create a Paystack subaccount for property owner
   */
  static async createPropertyOwnerSubaccount(data: CreateSubaccountData): Promise<string> {
    try {
      // Create subaccount with Paystack
      const paystackResponse = await fetch(`${this.PAYSTACK_BASE_URL}/subaccount`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          business_name: data.businessName,
          settlement_bank: data.bankCode,
          account_number: data.accountNumber,
          percentage_charge: 0, // ROOMi handles all fee distribution
          description: `Property Owner: ${data.firstName} ${data.lastName}`,
          primary_contact_email: data.email,
          primary_contact_name: `${data.firstName} ${data.lastName}`,
          primary_contact_phone: data.phone,
          metadata: {
            user_id: data.userId,
            account_type: 'property_owner'
          }
        })
      });

      if (!paystackResponse.ok) {
        throw new Error(`Paystack API error: ${paystackResponse.statusText}`);
      }

      const result: PaystackSubaccountResponse = await paystackResponse.json();
      
      if (!result.status) {
        throw new Error(`Paystack subaccount creation failed: ${result.message}`);
      }

      // Store subaccount in database
      const { error: dbError } = await supabase
        .from('paystack_subaccounts')
        .insert({
          user_id: data.userId,
          subaccount_code: result.data.subaccount_code,
          business_name: result.data.business_name,
          settlement_bank: result.data.settlement_bank,
          account_number: result.data.account_number,
          percentage_charge: result.data.percentage_charge,
          is_verified: result.data.is_verified,
          metadata: {
            created_via: 'property_owner_registration',
            paystack_response: result.data
          }
        });

      if (dbError) {
        ErrorHandler.log('Database error storing subaccount:', dbError);
        throw new Error('Failed to store subaccount information');
      }

      // Update user record with subaccount code
      const { error: userUpdateError } = await supabase
        .from('auth.users')
        .update({
          paystack_subaccount_code: result.data.subaccount_code,
          bank_account_number: data.accountNumber,
          bank_code: data.bankCode,
          account_holder_name: `${data.firstName} ${data.lastName}`,
          subaccount_status: 'active'
        })
        .eq('id', data.userId);

      if (userUpdateError) {
        ErrorHandler.log('Error updating user with subaccount:', userUpdateError);
      }

      return result.data.subaccount_code;

    } catch (error) {
      ErrorHandler.handle(error, 'SubaccountService.createPropertyOwnerSubaccount');
      throw error;
    }
  }

  /**
   * Get subaccount details for a user
   */
  static async getUserSubaccount(userId: string) {
    try {
      const { data, error } = await supabase
        .from('paystack_subaccounts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }

      return data;
    } catch (error) {
      ErrorHandler.handle(error, 'SubaccountService.getUserSubaccount');
      return null;
    }
  }

  /**
   * Verify subaccount status with Paystack
   */
  static async verifySubaccount(subaccountCode: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.PAYSTACK_BASE_URL}/subaccount/${subaccountCode}`, {
        headers: {
          'Authorization': `Bearer ${this.PAYSTACK_SECRET_KEY}`
        }
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.status && result.data.is_verified;

    } catch (error) {
      ErrorHandler.handle(error, 'SubaccountService.verifySubaccount');
      return false;
    }
  }
}
```

---

## 🔄 **SPLIT PAYMENT IMPLEMENTATION**

### **Split Payment Service**
```typescript
// File: src/services/payment/SplitPaymentService.ts
import { SubaccountService } from './SubaccountService';
import { ErrorHandler } from '@/utils/ErrorHandler';

interface SplitPaymentConfig {
  totalAmount: number;
  propertyOwnerId: string;
  agentId?: string;
  bookingId: string;
}

interface PaystackSplitConfig {
  type: 'percentage' | 'flat';
  currency: 'GHS';
  subaccounts: Array<{
    subaccount: string;
    share: number;
  }>;
  bearer_type: 'all' | 'all-proportional' | 'account';
  bearer_subaccount?: string;
}

export class SplitPaymentService {
  private static readonly PAYSTACK_SECRET_KEY = import.meta.env.VITE_PAYSTACK_SECRET_KEY;
  private static readonly PAYSTACK_BASE_URL = 'https://api.paystack.co';
  private static readonly ROOMI_MAIN_SUBACCOUNT = import.meta.env.VITE_ROOMI_SUBACCOUNT_CODE;

  /**
   * Create split payment configuration for booking
   */
  static async createSplitPayment(config: SplitPaymentConfig): Promise<string> {
    try {
      // Get property owner subaccount
      const ownerSubaccount = await SubaccountService.getUserSubaccount(config.propertyOwnerId);
      if (!ownerSubaccount) {
        throw new Error('Property owner subaccount not found. Please complete bank account setup.');
      }

      // Calculate payment distribution
      const distribution = this.calculateDistribution(config.totalAmount);

      // Build subaccounts array
      const subaccounts = [
        {
          subaccount: ownerSubaccount.subaccount_code,
          share: Math.round((distribution.propertyOwnerAmount / config.totalAmount) * 100)
        },
        {
          subaccount: this.ROOMI_MAIN_SUBACCOUNT,
          share: Math.round((distribution.roomiAmount / config.totalAmount) * 100)
        }
      ];

      // Add agent subaccount if agent exists and has commission
      if (config.agentId && distribution.agentAmount > 0) {
        const agentSubaccount = await SubaccountService.getUserSubaccount(config.agentId);
        if (agentSubaccount) {
          subaccounts.push({
            subaccount: agentSubaccount.subaccount_code,
            share: Math.round((distribution.agentAmount / config.totalAmount) * 100)
          });
        }
      }

      // Ensure shares add up to 100%
      const totalShares = subaccounts.reduce((sum, sub) => sum + sub.share, 0);
      if (totalShares !== 100) {
        // Adjust ROOMi's share to make total 100%
        subaccounts[1].share += (100 - totalShares);
      }

      // Create split payment with Paystack
      const splitConfig: PaystackSplitConfig = {
        type: 'percentage',
        currency: 'GHS',
        subaccounts,
        bearer_type: 'all-proportional',
        bearer_subaccount: this.ROOMI_MAIN_SUBACCOUNT
      };

      const response = await fetch(`${this.PAYSTACK_BASE_URL}/split`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `ROOMi Booking Split - ${config.bookingId}`,
          ...splitConfig
        })
      });

      if (!response.ok) {
        throw new Error(`Split payment creation failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.status) {
        throw new Error(`Paystack split creation failed: ${result.message}`);
      }

      return result.data.split_code;

    } catch (error) {
      ErrorHandler.handle(error, 'SplitPaymentService.createSplitPayment');
      throw error;
    }
  }

  /**
   * Calculate payment distribution amounts
   */
  private static calculateDistribution(totalAmount: number) {
    // This should match the business model calculation
    const platformCommissionRate = 0.05;
    const platformFee = 100;
    const agentCommissionRate = 0; // Future implementation

    const baseAmount = totalAmount / (1 + 0.0195); // Remove Paystack fee to get base
    const platformCommission = baseAmount * platformCommissionRate;
    const agentCommission = baseAmount * agentCommissionRate;

    return {
      propertyOwnerAmount: baseAmount - platformCommission - agentCommission - platformFee,
      roomiAmount: platformCommission + platformFee,
      agentAmount: agentCommission
    };
  }

  /**
   * Get split payment details
   */
  static async getSplitPaymentDetails(splitCode: string) {
    try {
      const response = await fetch(`${this.PAYSTACK_BASE_URL}/split/${splitCode}`, {
        headers: {
          'Authorization': `Bearer ${this.PAYSTACK_SECRET_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch split details: ${response.statusText}`);
      }

      const result = await response.json();
      return result.status ? result.data : null;

    } catch (error) {
      ErrorHandler.handle(error, 'SplitPaymentService.getSplitPaymentDetails');
      return null;
    }
  }
}
```

---

## 🔧 **INTEGRATION WITH BOOKING FLOW**

### **Modified Payment Processing**
```typescript
// Update to useBookingViewModel.tsx processPayment function
const processPayment = async () => {
  try {
    setIsCreatingBooking(true);
    
    // Calculate payment distribution
    const distribution = calculatePaymentDistribution(totalPrice);
    
    // Create booking record
    const bookingData = {
      // ... existing booking data
      total_amount: distribution.totalAmount,
      platform_commission: distribution.platformCommission,
      platform_fee: distribution.platformFee,
      agent_commission: distribution.agentCommission
    };
    
    const booking = await BookingQueries.createBooking(bookingData);
    
    // Create split payment configuration
    const splitCode = await SplitPaymentService.createSplitPayment({
      totalAmount: distribution.totalAmount,
      propertyOwnerId: property.owner_id,
      agentId: property.agent_id,
      bookingId: booking.id
    });
    
    // Update booking with split code
    await supabase
      .from('bookings')
      .update({ split_payment_code: splitCode })
      .eq('id', booking.id);
    
    setBookingId(booking.id);
    setIsCreatingBooking(false);
    
    // Show payment modal with split payment
    setShowPaymentModal(true);
    
  } catch (error) {
    // Handle subaccount creation errors
    if (error.message.includes('subaccount not found')) {
      toast({
        title: "Bank Account Required",
        description: "Property owner needs to complete bank account setup before bookings can be processed.",
        variant: "destructive"
      });
      // Redirect to property owner to complete setup
    } else {
      // Handle other errors
      setIsCreatingBooking(false);
      toast({
        title: "Booking Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  }
};
```

### **Enhanced Payment Component Integration**
```typescript
// Update ModernPaystackPayment component call
<ModernPaystackPayment
  amount={paymentDistribution.totalAmount}
  email={formData.email}
  firstName={formData.fullName.split(' ')[0]}
  lastName={formData.fullName.split(' ').slice(1).join(' ')}
  phone={formData.phone}
  splitCode={splitPaymentCode} // Add split payment code
  onSuccess={handlePaymentSuccess}
  onError={handlePaymentError}
  title="Pay for Accommodation"
  description="Secure payment with automatic distribution"
/>
```

---

## 🏦 **PROPERTY OWNER BANK ACCOUNT SETUP**

### **Bank Account Collection Form**
```typescript
// File: src/components/owner/BankAccountSetup.tsx
interface BankAccountFormData {
  bankCode: string;
  accountNumber: string;
  accountHolderName: string;
  businessName: string;
}

const BankAccountSetup: React.FC = () => {
  const [formData, setFormData] = useState<BankAccountFormData>({
    bankCode: '',
    accountNumber: '',
    accountHolderName: '',
    businessName: ''
  });
  const [isCreatingSubaccount, setIsCreatingSubaccount] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsCreatingSubaccount(true);
      
      const subaccountCode = await SubaccountService.createPropertyOwnerSubaccount({
        userId: user.id,
        businessName: formData.businessName,
        bankCode: formData.bankCode,
        accountNumber: formData.accountNumber,
        email: user.email,
        phone: user.phone || '',
        firstName: user.user_metadata?.firstName || '',
        lastName: user.user_metadata?.lastName || ''
      });
      
      toast({
        title: "Bank Account Setup Complete",
        description: "Your account is now ready to receive payments from bookings.",
      });
      
      // Redirect to dashboard or properties page
      navigate('/owner/dashboard');
      
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsCreatingSubaccount(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Bank Account Setup</CardTitle>
        <CardDescription>
          Set up your bank account to receive payments from property bookings
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bank selection dropdown */}
          <div>
            <Label htmlFor="bankCode">Bank</Label>
            <Select value={formData.bankCode} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, bankCode: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="044">Access Bank</SelectItem>
                <SelectItem value="063">Access Bank (Diamond)</SelectItem>
                <SelectItem value="050">Ecobank Nigeria</SelectItem>
                <SelectItem value="011">First Bank of Nigeria</SelectItem>
                <SelectItem value="058">Guaranty Trust Bank</SelectItem>
                <SelectItem value="030">Heritage Bank</SelectItem>
                <SelectItem value="082">Keystone Bank</SelectItem>
                <SelectItem value="014">MainStreet Bank</SelectItem>
                <SelectItem value="057">Polaris Bank</SelectItem>
                <SelectItem value="076">Skye Bank</SelectItem>
                <SelectItem value="221">Stanbic IBTC Bank</SelectItem>
                <SelectItem value="068">Standard Chartered Bank</SelectItem>
                <SelectItem value="232">Sterling Bank</SelectItem>
                <SelectItem value="032">Union Bank of Nigeria</SelectItem>
                <SelectItem value="033">United Bank For Africa</SelectItem>
                <SelectItem value="215">Unity Bank</SelectItem>
                <SelectItem value="035">Wema Bank</SelectItem>
                <SelectItem value="057">Zenith Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Account number input */}
          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                accountNumber: e.target.value 
              }))}
              placeholder="Enter your account number"
              required
            />
          </div>
          
          {/* Account holder name */}
          <div>
            <Label htmlFor="accountHolderName">Account Holder Name</Label>
            <Input
              id="accountHolderName"
              value={formData.accountHolderName}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                accountHolderName: e.target.value 
              }))}
              placeholder="Full name as on bank account"
              required
            />
          </div>
          
          {/* Business name */}
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                businessName: e.target.value 
              }))}
              placeholder="Your property business name"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isCreatingSubaccount}
          >
            {isCreatingSubaccount ? 'Setting up...' : 'Complete Setup'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
```

---

## 🧪 **TESTING STRATEGY**

### **Test Scenarios**
1. **Subaccount Creation**: Test property owner bank account setup
2. **Split Payment Creation**: Verify correct percentage distribution
3. **Payment Processing**: Test end-to-end payment with splits
4. **Error Handling**: Test invalid bank accounts, failed subaccount creation
5. **Settlement Verification**: Confirm payments reach correct accounts

### **Test Environment Setup**
```bash
# Test environment variables
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_test_key
VITE_PAYSTACK_SECRET_KEY=sk_test_your_secret_key
VITE_ROOMI_SUBACCOUNT_CODE=ACCT_test_roomi_subaccount
```

This multi-account payment distribution system ensures automatic, transparent payment splitting while maintaining flexibility for future business model changes.
