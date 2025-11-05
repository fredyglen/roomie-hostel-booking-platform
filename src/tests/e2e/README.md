# E2E Tests for ROOMie Booking Flow

## Overview

This directory contains end-to-end tests for the complete booking flow with commission calculations using Playwright.

## Test Coverage

### 1. Complete Booking Flow
- Property selection to payment initialization
- All 5 booking steps (Personal Info, Dates, Room, Verification, Payment)
- Commission calculation display
- Payment initialization

### 2. Commission Display
- Breakdown visibility
- Correct calculations
- Mobile responsiveness
- Currency formatting

### 3. Payment Initialization
- Successful payment flow
- Tampered commission rejection
- Payment failure handling
- Commission metadata validation

### 4. Security Testing
- Client-side manipulation prevention
- Server-side validation
- Security event logging
- Commission tampering detection

### 5. UI/UX Validation
- Readable formatting
- Loading states
- Mobile viewport
- Help text/tooltips

### 6. Payment Flows
- Success scenarios
- Cancellation handling
- Failure recovery
- Data persistence

### 7. Edge Cases
- Missing configuration
- Network timeouts
- Terms validation
- Error handling

## Running Tests

### Prerequisites

1. **Install Playwright browsers** (first time only):
   ```bash
   npx playwright install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

### Run All E2E Tests

```bash
npm run test:e2e
```

### Run Tests in UI Mode

```bash
npm run test:e2e:ui
```

### Run Tests in Debug Mode

```bash
npm run test:e2e:debug
```

### Run Tests in Headed Mode (see browser)

```bash
npm run test:e2e:headed
```

### Run Specific Test File

```bash
npx playwright test bookingFlowWithCommission.spec.ts
```

### Run Specific Test

```bash
npx playwright test -g "should complete full booking flow"
```

## Test Structure

```
src/tests/e2e/
├── bookingFlowWithCommission.spec.ts  # Main E2E test suite
├── fixtures.ts                         # Shared test data and helpers
└── README.md                           # This file
```

## Test Data

### Test Users
- **Student**: `student@test.com` / `TestPassword123!`
- **Owner**: `owner@test.com` / `TestPassword123!`
- **Admin**: `admin@test.com` / `TestPassword123!`

### Test Properties
- **Without Agent**: Base rent 1000 GHS
- **With Agent**: Base rent 2000 GHS

### Expected Commission (1000 GHS base, no agent)
- Base Amount: 1000 GHS
- Platform Commission: 50 GHS (5%)
- Platform Fixed Fee: 100 GHS
- Paystack Fee: 22.43 GHS (1.95%)
- VAT: 192.78 GHS (15%)
- **Total: 1365.21 GHS**

## Mocking Strategy

### Supabase Edge Functions
Tests mock the `initialize-payment` Edge Function with three scenarios:
- **Success**: Returns valid payment authorization
- **Tampered**: Returns commission validation error
- **Failure**: Returns generic error

### Paystack API
Tests mock Paystack API responses for:
- Successful payment initialization
- Failed payment initialization

### Authentication
Tests use mock authentication tokens stored in localStorage.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Debugging Tests

### View Test Report

After running tests, view the HTML report:

```bash
npx playwright show-report
```

### Debug Specific Test

```bash
npx playwright test --debug -g "should complete full booking flow"
```

### View Trace

If a test fails, view the trace:

```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

## Best Practices

1. **Always mock external services** (Supabase, Paystack)
2. **Use fixtures** for shared test data
3. **Wait for elements** before interacting
4. **Take screenshots** on failure
5. **Clean up** after each test
6. **Use descriptive test names**
7. **Test both success and failure paths**
8. **Verify security measures**

## Troubleshooting

### Tests Timeout
- Increase timeout in `playwright.config.ts`
- Check if dev server is running
- Verify network mocks are working

### Elements Not Found
- Check selectors match actual UI
- Wait for page load before interacting
- Use `page.waitForSelector()` for dynamic content

### Authentication Issues
- Verify mock auth tokens are set
- Check localStorage in browser DevTools
- Ensure auth state is cleared between tests

### Commission Calculations Wrong
- Verify expected values in `fixtures.ts`
- Check commission rates match production
- Update calculations if rates change

## Maintenance

### Updating Test Data

Edit `fixtures.ts` to update:
- Test users
- Test properties
- Commission rates
- Expected calculations

### Adding New Tests

1. Create test in `bookingFlowWithCommission.spec.ts`
2. Use fixtures for test data
3. Mock external services
4. Add descriptive test name
5. Document in this README

### Updating Selectors

If UI changes, update selectors in:
- Helper functions in `fixtures.ts`
- Test assertions in spec files

## Performance

### Target Metrics
- Test suite duration: < 60 seconds
- Individual test: < 10 seconds
- Page load: < 3 seconds
- Element interaction: < 1 second

### Optimization Tips
- Run tests in parallel (default)
- Use `page.waitForLoadState('networkidle')`
- Minimize `page.waitForTimeout()` usage
- Reuse browser contexts when possible

## Related Documentation

- [Playwright Documentation](https://playwright.dev/)
- [CP#1.5 Testing Plan](../../../docs/04-DEVELOPMENT/CP1.5_TESTING_PLAN.md)
- [Commission Engine Documentation](../../../docs/03-BUSINESS-LOGIC/COMMISSION_ENGINE.md)
- [Phase 5 Completion Report](../../../docs/04-DEVELOPMENT/CP1.5_PHASE5_COMPLETION_REPORT.md)

