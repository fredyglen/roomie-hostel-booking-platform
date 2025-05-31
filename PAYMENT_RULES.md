
# Payment Rules & Commission Structure

## Core Payment Principles

### Base Commission Structure
- **Platform Commission**: 4.2% of total booking value
- **Agent Commission**: 3.7% flat rate (minimum GHS 100)
- **Property Owner**: 98% of original amount (after 2% booking fee deduction)
- **Moving Fee**: Eliminated (GHS 0)
- **Paystack Fees**: Absorbed by platform

### Commission Calculation Formula

```
Total Booking Amount = Property Price
Agent Fee = max(Total * 3.7%, GHS 100)
Platform Fee = Total * 4.2%
Property Owner Gets = Total * 98%
Paystack Fee = Total * 1.95% (absorbed by platform)
```

## Property Type Commission Examples

| Property Type | Semester Price | Agent Fee (3.7%) | Platform Fee | Property Owner Gets |
|---------------|----------------|------------------|--------------|-------------------|
| 4-in-room | GHS 2,700 | GHS 100 | GHS 113 | GHS 2,646 |
| 3-in-room | GHS 3,600 | GHS 133 | GHS 150 | GHS 3,528 |
| 2-in-room | GHS 4,000 | GHS 148 | GHS 161 | GHS 3,920 |
| 1-in-room Executive | GHS 10,000 | GHS 370 | GHS 403 | GHS 9,800 |

## Payment Distribution Rules

### 1. Student Payment Processing
- Student pays full amount upfront
- Single transaction through Paystack
- Automatic distribution to stakeholders
- Transparent fee breakdown displayed

### 2. Property Owner Payment
- Receives 98% of booking amount
- Payment processed within 24 hours
- Bank transfer or mobile money
- Automatic payment confirmation

### 3. Agent Commission
- 3.7% of booking amount (minimum GHS 100)
- Paid after successful booking confirmation
- Monthly consolidated payments
- Performance bonuses for volume

### 4. Platform Revenue
- 4.2% commission from each booking
- Covers Paystack fees (1.95%)
- Net platform revenue: ~2.25%
- Additional revenue from premium features

## Premium Features & Additional Revenue

### Property Owner Premium Services
- **Free**: 1 property listing
- **Basic Plan**: GHS 50/month per additional property
- **Professional Plan**: GHS 150/month per property
  - Professional photography
  - Priority placement
  - Virtual tours
  - Enhanced analytics
- **Enterprise Plan**: GHS 300/month per property
  - All Professional features
  - Dedicated account manager
  - Custom booking terms

### Student Premium Subscriptions
- **Basic**: Free (standard features)
- **Student Plus**: GHS 30/semester
  - Priority booking alerts
  - Advanced filters
  - Booking history
- **Student Premium**: GHS 60/semester
  - All Plus features
  - Concierge service
  - Roommate matching

### Agent Premium Tools
- **Standard**: Free (basic tools)
- **Agent Pro**: GHS 100/month
  - Advanced CRM
  - Marketing automation
  - Performance analytics
- **Agent Enterprise**: GHS 250/month
  - Team management
  - White-label solutions
  - Priority support

## Payment Security Rules

### 1. Escrow System
- All payments held in escrow until booking confirmation
- 24-hour confirmation window
- Automatic refund for failed bookings
- Dispute resolution mechanism

### 2. Verification Requirements
- Property owner bank account verification
- Agent identity verification
- Student payment method verification
- Regular compliance audits

### 3. Fraud Prevention
- Transaction monitoring
- Suspicious activity alerts
- Multi-factor authentication
- Regular security updates

## Discount & Promotion Rules

### Early Booking Discounts
- 30+ days advance: 5% discount
- 60+ days advance: 8% discount
- Full academic year: 10% discount

### Loyalty Discounts
- Second booking: 3% discount
- Third+ booking: 5% discount
- Referral bonus: GHS 50 credit

### Seasonal Promotions
- Off-peak periods: Up to 15% discount
- New property launch: 10% discount
- Partnership university: 5% discount

## Configuration Parameters

### Commission Rates (Easily Adjustable)
```json
{
  "platform_commission_rate": 0.042,
  "agent_commission_rate": 0.037,
  "agent_minimum_fee": 100,
  "property_owner_retention": 0.98,
  "paystack_fee_rate": 0.0195,
  "booking_fee_rate": 0.02
}
```

### Premium Pricing (Monthly/Semester)
```json
{
  "property_owner_premium": {
    "basic": 50,
    "professional": 150,
    "enterprise": 300
  },
  "student_premium": {
    "plus": 30,
    "premium": 60
  },
  "agent_premium": {
    "pro": 100,
    "enterprise": 250
  }
}
```

### Discount Rules
```json
{
  "early_booking": {
    "30_days": 0.05,
    "60_days": 0.08,
    "academic_year": 0.10
  },
  "loyalty": {
    "second_booking": 0.03,
    "third_plus": 0.05,
    "referral_bonus": 50
  }
}
```

## Update Procedures

### Changing Commission Rates
1. Update configuration in `PAYMENT_RULES.md`
2. Update constants in `src/utils/paymentCalculations.ts`
3. Run database migration if needed
4. Update documentation
5. Notify all stakeholders 48 hours in advance

### Adding New Premium Features
1. Define feature in rules file
2. Update pricing structure
3. Implement feature functionality
4. Update billing system
5. Launch with promotional pricing

### Modifying Discount Rules
1. Update discount configuration
2. Test calculation logic
3. Update user interface
4. Monitor impact on revenue
5. Adjust based on performance
