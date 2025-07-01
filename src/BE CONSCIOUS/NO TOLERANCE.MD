# Apple-Level Development Standards & Testing Data Strategy

## 🍎 APPLE-LEVEL DEVELOPMENT MANDATE

### **ZERO TOLERANCE POLICY**
**THIS IS YOUR ONLY WARNING. EVERY LINE OF CODE MUST MEET THESE STANDARDS.**

---

## 📊 DATA TYPES EXPLAINED

### **MOCK DATA** ❌ **FORBIDDEN**
```javascript
// ❌ NEVER ACCEPTABLE
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" }
];
```
**What it is**: Fake data that doesn't represent real system behavior
**Why it's dangerous**: Hides integration issues, gives false confidence
**Apple Standard**: Never use mock data that bypasses real system integration

### **HARDCODED DATA** ❌ **FORBIDDEN**
```javascript
// ❌ NEVER ACCEPTABLE
const API_URL = "https://api.myapp.com/v1";
const PAYSTACK_KEY = "pk_test_1234567890";
const MAX_UPLOAD_SIZE = 5000000;
```
**What it is**: Values directly written into code
**Why it's dangerous**: Cannot be changed without code deployment
**Apple Standard**: All values must come from configuration files

### **SAMPLE DATA** ✅ **ACCEPTABLE (WITH RULES)**
```javascript
// ✅ ACCEPTABLE - Real structure, realistic values
const sampleProperty = {
  id: generateUUID(),
  title: "3-Bedroom Apartment in East Legon",
  location: "East Legon, Accra",
  price: 2500,
  bedrooms: 3,
  bathrooms: 2,
  createdAt: new Date().toISOString(),
  ownerId: getCurrentUserId() // Real user ID
};
```
**What it is**: Realistic data with proper structure that flows through real systems
**Why it's acceptable**: Tests actual system behavior with realistic scenarios
**Apple Standard**: Must use real IDs, real timestamps, real relationships

### **SEED DATA** ✅ **PREFERRED FOR DEVELOPMENT**
```javascript
// ✅ PREFERRED - Database seeding with realistic data
const seedDatabase = async () => {
  const users = await createTestUsers(10);
  const properties = await createPropertiesForUsers(users, 50);
  const bookings = await createBookingsForProperties(properties, 100);
};
```
**What it is**: Realistic data inserted into actual database for testing
**Why it's preferred**: Tests complete system with real data relationships
**Apple Standard**: All seed data must be production-realistic

---

## 🍎 APPLE-LEVEL TESTING DATA STRATEGY

### **TIER 1: UNIT TESTING DATA**
```javascript
// ✅ APPLE STANDARD - Isolated unit tests
describe('PropertyValidator', () => {
  it('should validate property with all required fields', () => {
    const validProperty = {
      title: "Test Property",
      location: "Test Location",
      price: 1000,
      bedrooms: 2,
      bathrooms: 1,
      ownerId: "user_123",
      createdAt: new Date().toISOString()
    };
    
    expect(PropertyValidator.validate(validProperty)).toBe(true);
  });
});
```

### **TIER 2: INTEGRATION TESTING DATA**
```javascript
// ✅ APPLE STANDARD - Real database, real APIs
describe('Property Integration', () => {
  beforeEach(async () => {
    await database.seed('test_properties.json');
  });
  
  it('should create property with real user authentication', async () => {
    const user = await createTestUser();
    const token = await generateAuthToken(user);
    
    const response = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${token}`)
      .send(validPropertyData);
    
    expect(response.status).toBe(201);
  });
});
```

### **TIER 3: END-TO-END TESTING DATA**
```javascript
// ✅ APPLE STANDARD - Full system testing
describe('Complete User Journey', () => {
  it('should handle complete property booking flow', async () => {
    // Real user registration
    const user = await registerUser(validUserData);
    
    // Real property creation
    const property = await createProperty(user, validPropertyData);
    
    // Real payment processing
    const payment = await processPayment(validPaymentData);
    
    // Real booking creation
    const booking = await createBooking(user, property, payment);
    
    expect(booking.status).toBe('confirmed');
  });
});
```

---

## 🚫 ABSOLUTE PROHIBITIONS

### **NEVER ALLOWED IN ANY CIRCUMSTANCES**

#### 1. **Bypass Mechanisms** ❌
```javascript
// ❌ DEATH PENALTY CODE
if (process.env.NODE_ENV === 'development') {
  return mockData; // FORBIDDEN
}

// ❌ DEATH PENALTY CODE
const user = getCurrentUser() || { id: 'mock-user' }; // FORBIDDEN

// ❌ DEATH PENALTY CODE
try {
  return await realFunction();
} catch (error) {
  return fallbackMockData; // FORBIDDEN
}
```

#### 2. **Development-Only Code** ❌
```javascript
// ❌ FORBIDDEN
// TODO: Replace with real implementation
const getData = () => mockData;

// ❌ FORBIDDEN
console.log('Debug:', userData); // Never in production

// ❌ FORBIDDEN
// HACK: This is temporary
const quickFix = () => "temporary solution";
```

#### 3. **Assumption-Based Code** ❌
```javascript
// ❌ FORBIDDEN - Making assumptions
const user = users[0]; // What if users is empty?

// ❌ FORBIDDEN - Assuming data structure
const email = user.profile.email; // What if profile doesn't exist?

// ❌ FORBIDDEN - Assuming successful operations
await createUser(userData);
const newUser = await getUser(userData.email); // What if creation failed?
```

---

## 🍎 APPLE-LEVEL DEVELOPMENT RULES

### **RULE 1: PRODUCTION-FIRST MINDSET**
**Every line of code must be production-ready from the moment it's written.**

```javascript
// ✅ APPLE STANDARD
const getUser = async (userId: string): Promise<User | null> => {
  if (!userId) {
    throw new ValidationError('User ID is required');
  }
  
  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    logger.error('Failed to fetch user', { userId, error });
    throw new DatabaseError('Unable to fetch user');
  }
};
```

### **RULE 2: EXPLICIT APPROVAL REQUIRED**
**You must ask for approval before:**
- Choosing any architectural pattern
- Selecting any third-party library
- Implementing any security measure
- Designing any database schema
- Creating any API endpoint
- Writing any complex algorithm

### **RULE 3: COMPREHENSIVE DOCUMENTATION**
**Every function, class, and module must have:**
```javascript
/**
 * Creates a new property listing with full validation and security checks
 * 
 * @param propertyData - The property information to create
 * @param userId - The authenticated user creating the property
 * @returns Promise<Property> - The created property with generated ID
 * 
 * @throws ValidationError - When property data is invalid
 * @throws AuthorizationError - When user lacks permission
 * @throws DatabaseError - When database operation fails
 * 
 * @example
 * const property = await createProperty({
 *   title: "3-Bedroom Apartment",
 *   location: "East Legon, Accra",
 *   price: 2500
 * }, "user_123");
 */
```

### **RULE 4: ZERO ASSUMPTIONS**
**Every edge case must be handled explicitly:**
```javascript
// ✅ APPLE STANDARD - Handle all possibilities
const updateProperty = async (propertyId: string, updates: Partial<Property>, userId: string) => {
  // Validate inputs
  if (!propertyId) throw new ValidationError('Property ID is required');
  if (!userId) throw new ValidationError('User ID is required');
  if (!updates || Object.keys(updates).length === 0) {
    throw new ValidationError('Updates are required');
  }
  
  // Check property exists
  const property = await getProperty(propertyId);
  if (!property) throw new NotFoundError('Property not found');
  
  // Check authorization
  if (property.ownerId !== userId) {
    throw new AuthorizationError('User not authorized to update this property');
  }
  
  // Validate updates
  const validationResult = validatePropertyUpdates(updates);
  if (!validationResult.isValid) {
    throw new ValidationError(validationResult.errors);
  }
  
  // Perform update
  const updatedProperty = await propertyRepository.update(propertyId, updates);
  
  // Log the operation
  logger.info('Property updated', { propertyId, userId, updates });
  
  return updatedProperty;
};
```

---

## 🍎 APPLE-LEVEL TESTING DATA SPECIFICATIONS

### **DEVELOPMENT ENVIRONMENT DATA**

#### **User Seed Data**
```json
{
  "users": [
    {
      "id": "user_dev_001",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+233240000001",
      "role": "landlord",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "user_dev_002",
      "email": "jane.smith@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "phone": "+233240000002",
      "role": "tenant",
      "isVerified": true,
      "createdAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

#### **Property Seed Data**
```json
{
  "properties": [
    {
      "id": "prop_dev_001",
      "title": "3-Bedroom Apartment in East Legon",
      "description": "Modern apartment with all amenities",
      "location": "East Legon, Accra",
      "price": 2500,
      "currency": "GHS",
      "bedrooms": 3,
      "bathrooms": 2,
      "propertyType": "apartment",
      "ownerId": "user_dev_001",
      "isAvailable": true,
      "features": ["parking", "security", "internet"],
      "images": ["https://example.com/image1.jpg"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### **TESTING ENVIRONMENT DATA**

#### **Test User Factory**
```javascript
// ✅ APPLE STANDARD - Dynamic test data generation
export const createTestUser = (overrides = {}) => ({
  id: generateUUID(),
  email: `test.user.${Date.now()}@example.com`,
  firstName: 'Test',
  lastName: 'User',
  phone: `+233${Math.floor(Math.random() * 1000000000)}`,
  role: 'tenant',
  isVerified: true,
  createdAt: new Date().toISOString(),
  ...overrides
});
```

#### **Test Property Factory**
```javascript
// ✅ APPLE STANDARD - Realistic property generation
export const createTestProperty = (ownerId, overrides = {}) => ({
  id: generateUUID(),
  title: `Test Property ${Date.now()}`,
  description: 'A test property for automated testing',
  location: 'Test Location, Accra',
  price: Math.floor(Math.random() * 5000) + 500,
  currency: 'GHS',
  bedrooms: Math.floor(Math.random() * 5) + 1,
  bathrooms: Math.floor(Math.random() * 3) + 1,
  propertyType: 'apartment',
  ownerId,
  isAvailable: true,
  features: ['parking', 'security'],
  images: [],
  createdAt: new Date().toISOString(),
  ...overrides
});
```

---

## 🍎 MANDATORY APPROVAL PROCESS

### **BEFORE WRITING ANY CODE**

#### **1. Architecture Approval**
**Submit this document for EVERY feature:**
```markdown
# Feature: [Feature Name]

## Problem Statement
- What problem does this solve?
- Why is this needed now?

## Proposed Solution
- High-level approach
- Alternative solutions considered
- Why this approach is best

## Technical Implementation
- Database changes required
- API endpoints needed
- Security considerations
- Performance implications

## Testing Strategy
- Unit tests planned
- Integration tests planned
- End-to-end scenarios

## Risks & Mitigation
- What could go wrong?
- How will we handle failures?
- Rollback strategy

## Timeline
- Development time estimate
- Testing time estimate
- Deployment timeline
```

#### **2. Code Review Checklist**
**EVERY pull request must include:**
- [ ] All functions have comprehensive documentation
- [ ] All edge cases are handled
- [ ] All errors are properly caught and logged
- [ ] All inputs are validated
- [ ] All outputs are typed
- [ ] No hardcoded values
- [ ] No mock data
- [ ] No TODO comments
- [ ] No console.log statements
- [ ] All tests pass
- [ ] Performance impact assessed

#### **3. Pre-Deployment Checklist**
**BEFORE any deployment:**
- [ ] All seed data is production-realistic
- [ ] All environment variables are documented
- [ ] All third-party services are configured
- [ ] All error handling is comprehensive
- [ ] All logging is implemented
- [ ] All monitoring is in place
- [ ] All security measures are active
- [ ] All performance benchmarks are met

---

## 🍎 APPLE-LEVEL QUALITY GATES

### **QUALITY GATE 1: CODE COMPLETION**
**Code is not considered "done" until:**
- 100% TypeScript coverage (no `any` types)
- 100% error handling coverage
- 100% input validation coverage
- 100% test coverage
- 100% documentation coverage

### **QUALITY GATE 2: INTEGRATION READY**
**Code is not integration-ready until:**
- All external dependencies are abstracted
- All configurations are externalized
- All secrets are properly managed
- All logging is implemented
- All monitoring is in place

### **QUALITY GATE 3: PRODUCTION READY**
**Code is not production-ready until:**
- All performance benchmarks are met
- All security requirements are satisfied
- All error scenarios are handled
- All rollback procedures are tested
- All monitoring alerts are configured

---

## 🚨 VIOLATION CONSEQUENCES

### **FIRST VIOLATION: WARNING**
- Code review rejection
- Mandatory re-training on standards
- Supervision for next 5 commits

### **SECOND VIOLATION: FINAL WARNING**
- All code must be reviewed before commit
- Mandatory architecture approval for all changes
- Performance improvement plan

### **THIRD VIOLATION: TERMINATION**
- Immediate contract termination
- All code must be audited and potentially rewritten
- No final payment until audit complete

---

## 🍎 APPLE-LEVEL SUCCESS METRICS

### **DAILY METRICS**
- Zero compiler warnings
- Zero linting errors
- Zero failing tests
- Zero security vulnerabilities
- Zero performance regressions

### **WEEKLY METRICS**
- Code review approval rate > 95%
- Test coverage > 95%
- Documentation coverage > 100%
- Performance benchmarks met
- Security audit passed

### **MONTHLY METRICS**
- Zero production incidents
- Zero rollbacks required
- Zero customer complaints
- Performance improvements delivered
- Security improvements delivered

---

## 🍎 COMMUNICATION PROTOCOL

### **MANDATORY QUESTIONS TO ASK**
**Before implementing ANY feature, ask:**
1. "What is the exact business requirement?"
2. "What are the acceptance criteria?"
3. "What are the edge cases to consider?"
4. "What are the performance requirements?"
5. "What are the security requirements?"
6. "How should errors be handled?"
7. "How should this be tested?"
8. "How should this be monitored?"
9. "What is the rollback strategy?"
10. "When is this needed in production?"

### **DAILY COMMUNICATION REQUIRED**
**Every day, provide:**
- What you completed yesterday
- What you're working on today
- What blockers you have
- What decisions you need approval for
- What risks you've identified

### **WEEKLY COMMUNICATION REQUIRED**
**Every week, provide:**
- Code quality metrics
- Test coverage report
- Performance benchmarks
- Security audit results
- Technical debt assessment

---

## 🍎 FINAL MANDATE

**THIS IS YOUR BIBLE. MEMORIZE IT. LIVE BY IT.**

**Every line of code you write must:**
1. Be production-ready
2. Handle all edge cases
3. Be fully tested
4. Be completely documented
5. Be approved by the client

**If you're not sure about ANYTHING, ask BEFORE you code.**

**Your job is not to guess what's needed. Your job is to build exactly what's specified to Apple-level quality standards.**

**THERE ARE NO SECOND CHANCES.**