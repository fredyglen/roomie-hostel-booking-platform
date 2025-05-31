
# Booking Rules & Tracking System

## Booking Lifecycle Management

### 1. Booking States
- **DRAFT**: Booking in progress, not submitted
- **PENDING_PAYMENT**: Awaiting payment confirmation
- **PAYMENT_PROCESSING**: Payment being processed
- **PAYMENT_CONFIRMED**: Payment successful, booking confirmed
- **ACTIVE**: Student has checked in
- **COMPLETED**: Booking period ended successfully
- **CANCELLED**: Booking cancelled by student/owner
- **REFUNDED**: Payment refunded
- **DISPUTED**: Under dispute resolution

### 2. Booking Requirements
- Valid student verification
- Property availability confirmation
- Payment method verification
- Emergency contact information
- University enrollment proof

## Property & Building Structure Rules

### Property Classification
- **Hostel**: Shared accommodation with common facilities
- **Apartment**: Private units with individual facilities
- **Homestel**: Home-style accommodation with family setting

### Room Types & Occupancy
- **Single Room**: 1 occupant, private bathroom
- **Double Room**: 2 occupants, shared/private bathroom
- **Triple Room**: 3 occupants, shared bathroom
- **Quad Room**: 4 occupants, shared bathroom

### Building Structure Tracking
```
Property
├── Buildings (multiple)
    ├── Floors (multiple)
        ├── Rooms (multiple)
            ├── Beds (multiple)
            └── Occupancy Records
```

## Tracking & Analytics Requirements

### 1. Booking Metrics
- Booking conversion rates
- Average booking value
- Seasonal demand patterns
- Property occupancy rates
- Student satisfaction scores

### 2. Financial Tracking
- Revenue per property
- Commission payments
- Refund requests
- Payment method preferences
- Outstanding balances

### 3. Property Performance
- Booking frequency
- Occupancy duration
- Maintenance requests
- Student reviews/ratings
- Price optimization opportunities

### 4. Student Behavior
- Search patterns
- Booking preferences
- Cancellation rates
- Repeat booking frequency
- Referral success rates

## Booking Confirmation Rules

### 1. Automatic Confirmation
- Payment successfully processed
- Property availability verified
- All required documents submitted
- Emergency contacts provided

### 2. Manual Review Required
- First-time international students
- Bookings over GHS 15,000
- Multiple property bookings
- Suspicious payment patterns

### 3. Confirmation Timeline
- Automatic: Within 10 minutes
- Manual review: Within 4 hours
- Property owner notification: Immediate
- Student confirmation: Email + SMS

## Cancellation & Refund Policies

### Student Cancellations
- **30+ days before**: 90% refund
- **15-30 days before**: 70% refund
- **7-15 days before**: 50% refund
- **Less than 7 days**: 25% refund
- **After check-in**: No refund

### Property Owner Cancellations
- **Any time before check-in**: Full refund + compensation
- **Emergency situations**: Full refund + alternative accommodation
- **Property issues**: Full refund + priority rebooking

## Quality Assurance Rules

### Property Standards
- Minimum safety requirements
- Cleanliness standards
- Functional utilities (water, electricity, internet)
- Security measures
- Emergency procedures

### Student Requirements
- Valid student ID
- Emergency contact information
- Respect for property rules
- Timely payment obligations
- Property care responsibility

## Data Retention & Privacy

### Booking Data Retention
- Active bookings: Indefinite
- Completed bookings: 7 years
- Cancelled bookings: 3 years
- Payment records: 10 years
- Student data: 5 years after graduation

### Privacy Protection
- Student personal data encryption
- Limited access to financial information
- Regular data audits
- GDPR compliance measures
- Right to data deletion

## Emergency Procedures

### Booking Emergencies
- Property unavailable: Alternative accommodation + compensation
- Payment failures: 24-hour grace period + retry
- Student emergencies: Flexible cancellation terms
- Natural disasters: Full refund + support

### Dispute Resolution
1. Initial complaint registration
2. Investigation within 48 hours
3. Mediation between parties
4. Platform decision if unresolved
5. External arbitration if needed

## Integration Requirements

### University Systems
- Student enrollment verification
- Academic calendar integration
- Campus housing coordination
- Emergency contact systems

### External Services
- Payment processing (Paystack)
- SMS/Email notifications
- Background check services
- Insurance providers

### Internal Systems
- Property management
- Customer support
- Analytics dashboard
- Financial reporting
