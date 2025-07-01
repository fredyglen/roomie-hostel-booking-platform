# 🍎 APPLE-LEVEL CODE STANDARDS
## NON-NEGOTIABLE RULES FOR YOUR DEVELOPER

*For Non-Technical Founders: These rules ensure your platform works like Apple products - flawlessly, at massive scale, with zero tolerance for errors.*

---

## 🚨 **ZERO TOLERANCE VIOLATIONS**
**If ANY of these are found, code is AUTOMATICALLY REJECTED:**

### ❌ **FORBIDDEN CODE PATTERNS**
```typescript
// ❌ NEVER ALLOWED - Will cause immediate rejection
function transform(data: any) // No 'any' types allowed
let result = data || 0; // No silent failures
// TODO: fix this later // No unfinished work
console.log("debug info"); // No debug code
if (user) { // No assumptions about data
```

### ✅ **REQUIRED CODE PATTERNS**
```typescript
// ✅ APPLE STANDARD - Always required
function transform(data: ValidatedPropertyData): Result<Property, TransformError>
const result = validateAndTransform(data);
if (!result.success) throw new SpecificError("Exact problem description");
logger.info("Operation completed successfully", { userId, duration });
if (!user?.isValidated()) throw new InvalidUserError("User validation required");
```

---

## 📋 **MANDATORY CHECKLIST FOR EVERY CODE FILE**

### **BEFORE WRITING ANY CODE - DEVELOPER MUST CONFIRM:**
- [ ] I understand exactly what this code should do
- [ ] I know what happens when it fails
- [ ] I know how to test it works correctly
- [ ] I know how to monitor it in production

### **DURING CODING - EVERY FUNCTION MUST HAVE:**
- [ ] **Clear Input Types**: No `any`, `unknown`, or `object` types
- [ ] **Clear Output Types**: Exactly what it returns
- [ ] **Error Handling**: What happens when things go wrong
- [ ] **Documentation**: Explains WHY, not just what
- [ ] **Validation**: Checks all inputs are correct
- [ ] **Logging**: Records what happened for debugging

### **AFTER CODING - EVERY FUNCTION MUST PASS:**
- [ ] **Build Test**: Code compiles without warnings
- [ ] **Type Test**: TypeScript passes in strict mode
- [ ] **Unit Test**: Function works with good data
- [ ] **Error Test**: Function fails safely with bad data
- [ ] **Performance Test**: Function is fast enough
- [ ] **Security Test**: Function doesn't leak data

---

## 🎯 **APPLE-LEVEL REQUIREMENTS**

### **1. ERROR HANDLING - ZERO CRASHES ALLOWED**

**❌ CURRENT PROBLEM CODE:**
```typescript
const price = Number(data.price || 0); // Silently uses 0 if no price!
```

**✅ APPLE STANDARD REQUIRED:**
```typescript
if (!data.price || typeof data.price !== 'number') {
  throw new InvalidPriceError(`Property must have valid price, got: ${data.price}`);
}
const price = data.price;
```

**RULE**: Every function must explicitly handle ALL possible failure cases.

### **2. TYPE SAFETY - ZERO GUESSING ALLOWED**

**❌ CURRENT PROBLEM CODE:**
```typescript
function transform(dbItem: any): Property // Don't know what dbItem contains!
```

**✅ APPLE STANDARD REQUIRED:**
```typescript
interface DatabaseProperty {
  id: string;
  title: string;
  price: number;
  // ... every field defined
}
function transform(dbItem: DatabaseProperty): Property
```

**RULE**: Every piece of data must have exact type definition.

### **3. VALIDATION - ZERO BAD DATA ALLOWED**

**❌ CURRENT PROBLEM CODE:**
```typescript
const user = { id: data.id }; // Assumes data.id exists and is valid
```

**✅ APPLE STANDARD REQUIRED:**
```typescript
if (!data.id || typeof data.id !== 'string' || data.id.length === 0) {
  throw new InvalidUserIdError(`User ID must be non-empty string, got: ${data.id}`);
}
const user = { id: data.id };
```

**RULE**: All data must be validated before use.

### **4. PERFORMANCE - ZERO SLOWNESS ALLOWED**

**❌ CURRENT PROBLEM CODE:**
```typescript
properties.forEach(prop => {
  database.query(`SELECT * FROM users WHERE id = ${prop.ownerId}`); // One query per property!
})
```

**✅ APPLE STANDARD REQUIRED:**
```typescript
const ownerIds = properties.map(p => p.ownerId);
const owners = await database.query(`SELECT * FROM users WHERE id IN (${ownerIds.join(',')})`);
const ownerMap = new Map(owners.map(o => [o.id, o]));
// One query for all owners
```

**RULE**: Code must handle 1000+ items efficiently.

---

## 🔍 **MANDATORY CODE REVIEWS**

### **BEFORE ACCEPTING ANY CODE, VERIFY:**

#### **1. THE "APPLE CRASH TEST"**
- Change any input to `null` - does code crash?
- Change any input to `undefined` - does code crash?
- Change any input to empty string - does code crash?
- Change any number to `0` - does code crash?
- **If ANY crash occurs, code is REJECTED**

#### **2. THE "APPLE SCALE TEST"**
- Will this work with 1,000 properties?
- Will this work with 10,000 users?
- Will this work when database is slow?
- Will this work when internet is slow?
- **If ANY performance issue, code is REJECTED**

#### **3. THE "APPLE SECURITY TEST"**
- Can malicious user break this?
- Does this leak sensitive information?
- Does this validate all inputs?
- Does this log security events?
- **If ANY security issue, code is REJECTED**

---

## 📊 **DAILY PROGRESS TRACKING**

### **DEVELOPER MUST REPORT DAILY:**
```
DATE: [Today's Date]

COMPLETED TODAY:
- [Specific function/feature completed]
- [Number of TypeScript errors fixed]
- [Tests written and passing]

APPLE STANDARDS MET:
- [ ] Zero 'any' types in new code
- [ ] All functions have error handling
- [ ] All functions have input validation
- [ ] All functions have tests
- [ ] All functions have documentation

TOMORROW'S PLAN:
- [Specific tasks planned]
- [Expected completion time]

BLOCKERS/QUESTIONS:
- [Any issues preventing progress]
```

---

## ⚡ **IMMEDIATE ACTION ITEMS**

### **FOR THE CURRENT PROPERTY TRANSFORM FILE:**

**DEVELOPER MUST FIX THESE ISSUES TODAY:**

1. **Replace `any` type:**
   ```typescript
   // CURRENT: transformDbProperty(dbItem: any)
   // REQUIRED: transformDbProperty(dbItem: DatabasePropertyRecord)
   ```

2. **Add error handling:**
   ```typescript
   // REQUIRED: What happens if dbItem.id is missing?
   // REQUIRED: What happens if dbItem.price is negative?
   // REQUIRED: What happens if dbItem.owner_id doesn't exist?
   ```

3. **Remove TODO comments:**
   ```typescript
   // CURRENT: buildings: [], // TODO: Implement building structure
   // REQUIRED: Either implement buildings or create proper BuildingService abstraction
   ```

4. **Add validation:**
   ```typescript
   // REQUIRED: Validate all required fields exist
   // REQUIRED: Validate all numbers are positive
   // REQUIRED: Validate all strings are not empty
   ```

5. **Add logging:**
   ```typescript
   // REQUIRED: Log when transformation starts
   // REQUIRED: Log when transformation succeeds
   // REQUIRED: Log when transformation fails with details
   ```

---

## 🎯 **SUCCESS CRITERIA**

### **CODE IS ONLY ACCEPTABLE WHEN:**
- [ ] No TypeScript errors or warnings
- [ ] No `any` types anywhere
- [ ] No TODO/FIXME comments
- [ ] No console.log statements
- [ ] All functions handle errors explicitly
- [ ] All inputs are validated
- [ ] All functions have comprehensive tests
- [ ] All functions have performance benchmarks
- [ ] All functions work with large datasets
- [ ] All functions are documented completely

### **PLATFORM IS ONLY ACCEPTABLE WHEN:**
- [ ] Handles 1000+ concurrent users
- [ ] Responds in under 100ms for all operations
- [ ] Never crashes under any input
- [ ] Provides helpful error messages to users
- [ ] Logs all important events for debugging
- [ ] Passes all security audits
- [ ] Works perfectly on mobile and desktop
- [ ] Scales to handle university-wide usage

---

## 🚨 **ENFORCEMENT**

**DAILY CODE REVIEW REQUIRED:**
- Every evening, review all code written that day
- Use the checklists above to verify standards
- Reject any code that doesn't meet 100% of requirements

**WEEKLY QUALITY AUDIT:**
- Test entire platform end-to-end
- Verify performance benchmarks
- Check error handling with bad data
- Confirm security measures are working

**MONTHLY PRODUCTION READINESS:**
- Load test with realistic user volumes
- Security penetration testing
- Disaster recovery testing
- Performance optimization review

---

## 💡 **FOR NON-TECHNICAL FOUNDERS**

**You can verify quality by asking:**
1. "Show me what happens when a user enters invalid data"
2. "Show me how the system handles 1000 users at once"
3. "Show me how we know if something breaks in production"
4. "Show me how long each operation takes to complete"

**If your developer can't demonstrate any of these, the code isn't Apple-level quality.**

**Remember**: Apple products work flawlessly because they follow these exact standards. ROOMi deserves the same level of excellence.