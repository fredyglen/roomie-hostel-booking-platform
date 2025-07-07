/**
 * Jest Type Definitions for ROOMi Platform
 * Apple-Grade TypeScript definitions for testing framework
 * 
 * Eliminates all Jest-related TypeScript errors
 * 
 * @version 1.0.0
 * @author ROOMi Platform Team
 */

import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveValue(value: string | number): R;
      toBeChecked(): R;
      toHaveFocus(): R;
      toBeEmptyDOMElement(): R;
      toContainElement(element: HTMLElement | null): R;
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toBeRequired(): R;
      toHaveDescription(text?: string | RegExp): R;
      toHaveAccessibleDescription(text?: string | RegExp): R;
      toHaveAccessibleName(text?: string | RegExp): R;
      toHaveErrorMessage(text?: string | RegExp): R;
      toBePartiallyChecked(): R;
      toHaveRole(role: string): R;
      toHaveStyle(css: string | Record<string, any>): R;
    }
  }

  // Jest globals
  const describe: jest.Describe;
  const test: jest.It;
  const it: jest.It;
  const expect: jest.Expect;
  const beforeAll: jest.Lifecycle;
  const beforeEach: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
  const jest: typeof import('jest');

  namespace jest {
    interface Describe {
      (name: string, fn: () => void): void;
      each<T extends readonly any[]>(cases: readonly T[]): (name: string, fn: (...args: T) => void) => void;
      only: Describe;
      skip: Describe;
    }

    interface It {
      (name: string, fn?: () => void | Promise<void>): void;
      each<T extends readonly any[]>(cases: readonly T[]): (name: string, fn: (...args: T) => void | Promise<void>) => void;
      only: It;
      skip: It;
      todo: (name: string) => void;
    }

    interface Lifecycle {
      (fn: () => void | Promise<void>): void;
    }

    interface Expect {
      <T = any>(actual: T): jest.Matchers<void> & Inverse<jest.Matchers<void>> & PromiseMatchers<T>;
      extend(matchers: Record<string, any>): void;
      anything(): any;
      any(constructor: any): any;
      arrayContaining<E = any>(sample: readonly E[]): any;
      objectContaining<E = {}>(sample: E): any;
      stringContaining(sample: string): any;
      stringMatching(sample: string | RegExp): any;
      addSnapshotSerializer(serializer: any): void;
    }

    interface Inverse<T> {
      not: T;
    }

    interface PromiseMatchers<T> {
      resolves: jest.Matchers<Promise<T>>;
      rejects: jest.Matchers<Promise<T>>;
    }

    interface MockInstance<T extends (...args: any[]) => any> {
      (...args: Parameters<T>): ReturnType<T>;
      mockClear(): this;
      mockReset(): this;
      mockRestore(): void;
      mockImplementation(fn?: T): this;
      mockImplementationOnce(fn: T): this;
      mockName(name: string): this;
      mockReturnThis(): this;
      mockReturnValue(value: ReturnType<T>): this;
      mockReturnValueOnce(value: ReturnType<T>): this;
      mockResolvedValue(value: Awaited<ReturnType<T>>): this;
      mockResolvedValueOnce(value: Awaited<ReturnType<T>>): this;
      mockRejectedValue(value: any): this;
      mockRejectedValueOnce(value: any): this;
      getMockName(): string;
      mock: MockContext<T>;
    }

    interface MockContext<T extends (...args: any[]) => any> {
      calls: Parameters<T>[];
      instances: ReturnType<T>[];
      invocationCallOrder: number[];
      results: MockResult<ReturnType<T>>[];
      lastCall?: Parameters<T>;
    }

    interface MockResult<T> {
      type: 'return' | 'throw' | 'incomplete';
      value: T;
    }

    interface Mock<T extends (...args: any[]) => any = (...args: any[]) => any> extends MockInstance<T> {
      new (...args: any[]): any;
      (...args: any[]): any;
    }

    const fn: {
      <T extends (...args: any[]) => any>(implementation?: T): MockInstance<T>;
      (): MockInstance<(...args: any[]) => any>;
    };

    const spyOn: {
      <T extends {}, M extends keyof T>(object: T, method: M): T[M] extends (...args: any[]) => any ? MockInstance<T[M]> : never;
      <T extends {}>(object: T, method: keyof T): MockInstance<(...args: any[]) => any>;
    };

    const mocked: {
      <T>(item: T, deep?: false): T extends (...args: any[]) => any ? MockInstance<T> : T;
      <T>(item: T, deep: true): MaybeMockedDeep<T>;
    };

    type MaybeMockedDeep<T> = T extends (...args: any[]) => any
      ? MockInstance<T>
      : T extends object
      ? MaybeMockedDeepObject<T>
      : T;

    type MaybeMockedDeepObject<T> = {
      [K in keyof T]: MaybeMockedDeep<T[K]>;
    };

    const clearAllMocks: () => void;
    const resetAllMocks: () => void;
    const restoreAllMocks: () => void;
  }
}

export {};
