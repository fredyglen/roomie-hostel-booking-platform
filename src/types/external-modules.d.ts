/**
 * Type declarations for external modules
 * Provides TypeScript support for third-party packages without built-in types
 * 
 * @fileoverview External Module Type Declarations
 * @author ROOMi Development Team
 * @version 1.0.0
 */

/**
 * Paystack Inline JS module declaration
 * Used for payment processing integration
 */
declare module '@paystack/inline-js' {
  interface PaystackOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    callback?: (response: PaystackResponse) => void;
    onClose?: () => void;
    metadata?: Record<string, unknown>;
    channels?: string[];
    plan?: string;
    quantity?: number;
    subaccount?: string;
    transaction_charge?: number;
    bearer?: string;
    label?: string;
  }

  interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    trans: string;
    transaction: string;
    trxref: string;
    redirecturl: string;
  }

  interface PaystackPop {
    setup(options: PaystackOptions): {
      openIframe(): void;
    };
    newTransaction(options: PaystackOptions): void;
  }

  const PaystackPop: PaystackPop;
  export default PaystackPop;
}

/**
 * Lodash debounce module declaration
 * Used for performance optimization
 */
declare module 'lodash/debounce' {
  interface DebounceSettings {
    leading?: boolean;
    maxWait?: number;
    trailing?: boolean;
  }

  interface DebouncedFunc<T extends (...args: unknown[]) => unknown> {
    (...args: Parameters<T>): ReturnType<T> | undefined;
    cancel(): void;
    flush(): ReturnType<T> | undefined;
  }

  function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait?: number,
    options?: DebounceSettings
  ): DebouncedFunc<T>;

  export default debounce;
}

/**
 * Lodash throttle module declaration
 * Used for performance optimization
 */
declare module 'lodash/throttle' {
  interface ThrottleSettings {
    leading?: boolean;
    trailing?: boolean;
  }

  interface ThrottledFunc<T extends (...args: unknown[]) => unknown> {
    (...args: Parameters<T>): ReturnType<T>;
    cancel(): void;
    flush(): ReturnType<T>;
  }

  function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait?: number,
    options?: ThrottleSettings
  ): ThrottledFunc<T>;

  export default throttle;
}

/**
 * Testing Library User Event module declaration
 * Used for testing user interactions
 */
declare module '@testing-library/user-event' {
  interface UserEventAPI {
    click(element: Element): Promise<void>;
    type(element: Element, text: string): Promise<void>;
    clear(element: Element): Promise<void>;
    selectOptions(element: Element, values: string | string[]): Promise<void>;
    upload(element: Element, file: File | File[]): Promise<void>;
    hover(element: Element): Promise<void>;
    unhover(element: Element): Promise<void>;
    tab(options?: { shift?: boolean }): Promise<void>;
    keyboard(text: string): Promise<void>;
  }

  interface UserEventOptions {
    delay?: number;
    skipClick?: boolean;
    skipAutoClose?: boolean;
    initialSelectionStart?: number;
    initialSelectionEnd?: number;
  }

  function setup(options?: UserEventOptions): UserEventAPI;

  const userEvent: UserEventAPI;
  export default userEvent;
  export { setup };
}

/**
 * Supabase configuration module declaration
 * Used for database operations
 */
declare module '@/config/supabase' {
  import { SupabaseClient } from '@supabase/supabase-js';
  
  export const supabase: SupabaseClient;
}

/**
 * ✅ MOCK DATA DECLARATIONS REMOVED - BE CONSCIOUS COMPLIANCE
 *
 * Mock data module declarations have been eliminated following BE CONSCIOUS
 * Apple-Grade standards. All data now comes from centralized database systems.
 *
 * Replacement systems:
 * - Properties: useDynamicProperties hook + enhancedPropertyService
 * - Users: Supabase auth + user management system
 * - Bookings: Database-driven booking system
 * - Reviews: Database-driven review system
 */

/**
 * Global test utilities
 * Extends Jest matchers and global functions
 */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: Record<string, unknown>): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toHaveValue(value: string | number): R;
      toHaveDisplayValue(value: string | string[]): R;
      toBeChecked(): R;
      toHaveFocus(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }

  // Global test functions
  function expect(actual: unknown): jest.Matchers<void>;
  
  // Global test setup
  const beforeEach: (fn: () => void | Promise<void>) => void;
  const afterEach: (fn: () => void | Promise<void>) => void;
  const beforeAll: (fn: () => void | Promise<void>) => void;
  const afterAll: (fn: () => void | Promise<void>) => void;
  
  // Global test functions
  const describe: (name: string, fn: () => void) => void;
  const it: (name: string, fn: () => void | Promise<void>) => void;
  const test: (name: string, fn: () => void | Promise<void>) => void;
}

/**
 * Environment variable extensions
 * Provides type safety for environment variables
 */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_PAYSTACK_PUBLIC_KEY: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_ENVIRONMENT: string;
  }
}

/**
 * Import meta environment extensions
 * Provides type safety for Vite environment variables
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_PAYSTACK_PUBLIC_KEY: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENVIRONMENT: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
