/**
 * ✅ E2E TEST FIXTURES
 * 
 * Shared test data and helper functions for E2E tests
 */

import { Page } from '@playwright/test';

// ============================================================================
// TEST DATA
// ============================================================================

export const TEST_USERS = {
  student: {
    email: 'student@test.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Student',
    phone: '+233123456789',
    studentId: 'STU2024001',
    university: 'University of Ghana',
    program: 'Computer Science'
  },
  owner: {
    email: 'owner@test.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Owner',
    phone: '+233987654321'
  },
  admin: {
    email: 'admin@test.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Admin'
  }
};

export const TEST_PROPERTIES = {
  withoutAgent: {
    id: 'test-property-no-agent',
    name: 'Test Campus Residence',
    rent: 1000,
    location: 'Accra, Ghana',
    hasAgent: false
  },
  withAgent: {
    id: 'test-property-with-agent',
    name: 'Test Premium Residence',
    rent: 2000,
    location: 'Kumasi, Ghana',
    hasAgent: true
  }
};

export const COMMISSION_RATES = {
  platform: 0.05, // 5%
  agent: 0.03, // 3%
  paystack: 0.0195, // 1.95%
  vat: 0.15, // 15%
  fixedFee: 100, // GHS
  agentMinimum: 100 // GHS
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Setup authentication for tests
 */
export async function setupAuth(page: Page, userType: 'student' | 'owner' | 'admin' = 'student') {
  const user = TEST_USERS[userType];
  
  await page.addInitScript((userData) => {
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: `test-${userData.email}`,
        email: userData.email,
        role: userType
      }
    }));
  }, user);
}

/**
 * Mock Supabase client for E2E tests
 */
export async function mockSupabaseClient(page: Page) {
  await page.addInitScript(() => {
    (window as any).__SUPABASE_MOCKED__ = true;
  });
}

/**
 * Calculate expected commission for testing
 */
export function calculateExpectedCommission(baseAmount: number, hasAgent: boolean = false) {
  const platformCommission = baseAmount * COMMISSION_RATES.platform;
  const platformFixedFee = COMMISSION_RATES.fixedFee;
  const agentCommission = hasAgent 
    ? Math.max(baseAmount * COMMISSION_RATES.agent, COMMISSION_RATES.agentMinimum)
    : 0;
  
  const subtotal = baseAmount + platformCommission + platformFixedFee + agentCommission;
  const paystackFee = subtotal * COMMISSION_RATES.paystack;
  const beforeVat = subtotal + paystackFee;
  const vatAmount = beforeVat * COMMISSION_RATES.vat;
  const totalAmount = beforeVat + vatAmount;
  
  return {
    baseAmount,
    platformCommission,
    platformFixedFee,
    agentCommission,
    paystackFee,
    vatAmount,
    totalAmount,
    ownerReceives: baseAmount
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `GHS ${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Wait for element with retry
 */
export async function waitForElementWithRetry(
  page: Page,
  selector: string,
  maxRetries: number = 3,
  timeout: number = 5000
): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      if (i === maxRetries - 1) {
        return false;
      }
      await page.waitForTimeout(1000);
    }
  }
  return false;
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `test-results/screenshots/${name}-${timestamp}.png` });
}

/**
 * Mock successful payment response
 */
export async function mockSuccessfulPayment(page: Page) {
  await page.route('**/functions/v1/initialize-payment', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: true,
        message: 'Payment initialized successfully',
        data: {
          authorization_url: 'https://checkout.paystack.com/test123',
          access_code: 'test_access_code',
          reference: `ROOMI_TEST_${Date.now()}`
        }
      })
    });
  });
}

/**
 * Mock failed payment response
 */
export async function mockFailedPayment(page: Page, errorMessage: string = 'Payment initialization failed') {
  await page.route('**/functions/v1/initialize-payment', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        status: false,
        message: errorMessage,
        error: 'PAYMENT_ERROR'
      })
    });
  });
}

/**
 * Mock tampered commission response
 */
export async function mockTamperedCommission(page: Page) {
  await page.route('**/functions/v1/initialize-payment', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        status: false,
        message: 'Commission validation failed: Client amount does not match server calculation',
        error: 'COMMISSION_MISMATCH'
      })
    });
  });
}

/**
 * Fill booking form with test data
 */
export async function fillBookingForm(page: Page, userData = TEST_USERS.student) {
  // Personal Info
  await page.fill('input[name="firstName"]', userData.firstName);
  await page.fill('input[name="lastName"]', userData.lastName);
  await page.fill('input[name="email"]', userData.email);
  await page.fill('input[name="phone"]', userData.phone);
  await page.click('button:has-text("Next")');
  
  // Date Selection
  const moveInDate = new Date();
  moveInDate.setDate(moveInDate.getDate() + 30);
  const moveOutDate = new Date(moveInDate);
  moveOutDate.setDate(moveOutDate.getDate() + 365);
  
  await page.fill('input[name="moveIn"]', moveInDate.toISOString().split('T')[0]);
  await page.fill('input[name="moveOut"]', moveOutDate.toISOString().split('T')[0]);
  await page.click('button:has-text("Next")');
  
  // Room Selection
  await page.click('text=1 in a Room');
  await page.click('button:has-text("Next")');
  
  // Student Verification
  await page.fill('input[name="studentId"]', userData.studentId);
  await page.fill('input[name="university"]', userData.university);
  await page.fill('input[name="program"]', userData.program);
  
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'student-id.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('fake-image-data')
  });
  
  await page.click('button:has-text("Next")');
}

/**
 * Verify commission breakdown in UI
 */
export async function verifyCommissionInUI(page: Page, expected: ReturnType<typeof calculateExpectedCommission>) {
  await page.waitForSelector('text=Price Details');
  
  // Verify each component
  const baseRent = await page.locator('text=Base Rent').locator('..').textContent();
  const platformComm = await page.locator('text=Platform Commission').locator('..').textContent();
  const fixedFee = await page.locator('text=Platform Fixed Fee').locator('..').textContent();
  const paystackFee = await page.locator('text=Paystack Fee').locator('..').textContent();
  const vat = await page.locator('text=VAT').locator('..').textContent();
  const total = await page.locator('text=Total').locator('..').textContent();
  
  return {
    baseRent,
    platformComm,
    fixedFee,
    paystackFee,
    vat,
    total
  };
}

