# Security Vulnerabilities Report

This report lists potential security vulnerabilities found in your codebase, focusing on exposed secrets, hardcoded credentials, and insecure patterns. Please review and address each item accordingly.

---

## 1. Exposed Secrets & Hardcoded Credentials

### a. Supabase Key (Critical)
- **File:** `test-database-connection.js`
- **Line:** 5
- **Issue:** Hardcoded Supabase key
- **Action:** Move to environment variable and never commit secrets to source control.

### b. Hardcoded Passwords (Critical)
- **Files:**
  - `src/services/userService.ts` (Line 33)
  - `src/utils/data-seeder.ts` (Lines 103, 153)
  - `src/utils/admin-setup.ts` (Line 23)
  - `src/tests/auth/adminAuth.test.ts` (Lines 232, 238, 253, 380)
- **Issue:** Hardcoded passwords for users/admins/testing
- **Action:** Use environment variables or secure test fixtures. Never use real passwords in code.

---

## 2. Potentially Sensitive Keys (Review)
- **Files:**
  - `src/utils/environment-validator.ts` (Lines 41, 47, 53, 59, 65)
- **Issue:** References to environment variable keys (not actual secrets, but ensure values are not hardcoded elsewhere).

---

## 3. Cache Keys (Not Sensitive, but Review Naming)
- **Files:**
  - `src/services/enhanced-property.service.ts` (Lines 118, 285)
  - `src/services/hostel-management.service.ts` (Lines 189, 679)
  - `src/services/apple-grade-hostel-transformation.service.ts` (Lines 178, 511)
- **Issue:** These are cache keys, not secrets, but review to ensure no sensitive data is embedded in cache keys.

---

## 4. CSRF Token Key (Review)
- **File:** `src/utils/csrf-protection.ts` (Line 8)
- **Issue:** CSRF token key name is hardcoded. Ensure the actual token value is securely generated and stored.

---

## Recommendations
- Move all secrets and credentials to environment variables (e.g., `.env` files).
- Never commit `.env` or secret files to version control.
- Use secure password management for test and admin accounts.
- Regularly audit your codebase for accidental secret exposure.

---

**Generated on:** July 13, 2025
