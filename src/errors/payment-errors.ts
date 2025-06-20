/**
 * Payment-related Error Classes for ROOMi Platform
 */

import { AppError, ErrorContext } from './base';

/**
 * Payment failed error
 */
export class PaymentFailedError extends AppError {
  readonly code = 'PAYMENT_FAILED';
  readonly statusCode = 402;
  readonly userMessage = 'Payment could not be processed';

  constructor(
    message: string,
    public readonly paymentMethod?: string,
    public readonly gatewayError?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, paymentMethod, gatewayError });
  }
}

/**
 * Insufficient funds error
 */
export class InsufficientFundsError extends AppError {
  readonly code = 'INSUFFICIENT_FUNDS';
  readonly statusCode = 402;
  readonly userMessage = 'Insufficient funds to complete this transaction';

  constructor(
    message: string,
    public readonly requiredAmount?: number,
    public readonly availableAmount?: number,
    context?: ErrorContext
  ) {
    super(message, { ...context, requiredAmount, availableAmount });
  }
}

/**
 * Payment method not supported error
 */
export class PaymentMethodNotSupportedError extends AppError {
  readonly code = 'PAYMENT_METHOD_NOT_SUPPORTED';
  readonly statusCode = 400;
  readonly userMessage = 'This payment method is not supported';

  constructor(
    message: string,
    public readonly paymentMethod?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, paymentMethod });
  }
}

/**
 * Payment already processed error
 */
export class PaymentAlreadyProcessedError extends AppError {
  readonly code = 'PAYMENT_ALREADY_PROCESSED';
  readonly statusCode = 409;
  readonly userMessage = 'This payment has already been processed';

  constructor(
    message: string,
    public readonly transactionId?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, transactionId });
  }
}

/**
 * Payment expired error
 */
export class PaymentExpiredError extends AppError {
  readonly code = 'PAYMENT_EXPIRED';
  readonly statusCode = 410;
  readonly userMessage = 'Payment session has expired';

  constructor(
    message: string,
    public readonly expiryTime?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, expiryTime });
  }
}

/**
 * Invalid payment amount error
 */
export class InvalidPaymentAmountError extends AppError {
  readonly code = 'INVALID_PAYMENT_AMOUNT';
  readonly statusCode = 400;
  readonly userMessage = 'Payment amount is invalid';

  constructor(
    message: string,
    public readonly amount?: number,
    public readonly expectedAmount?: number,
    context?: ErrorContext
  ) {
    super(message, { ...context, amount, expectedAmount });
  }
}

/**
 * Payment gateway error
 */
export class PaymentGatewayError extends AppError {
  readonly code = 'PAYMENT_GATEWAY_ERROR';
  readonly statusCode = 502;
  readonly userMessage = 'Payment service is temporarily unavailable';

  constructor(
    message: string,
    public readonly gateway?: string,
    public readonly gatewayCode?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, gateway, gatewayCode });
  }
}

/**
 * Refund failed error
 */
export class RefundFailedError extends AppError {
  readonly code = 'REFUND_FAILED';
  readonly statusCode = 400;
  readonly userMessage = 'Refund could not be processed';

  constructor(
    message: string,
    public readonly refundAmount?: number,
    public readonly originalTransactionId?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, refundAmount, originalTransactionId });
  }
}

/**
 * Payment verification failed error
 */
export class PaymentVerificationFailedError extends AppError {
  readonly code = 'PAYMENT_VERIFICATION_FAILED';
  readonly statusCode = 400;
  readonly userMessage = 'Payment verification failed';

  constructor(
    message: string,
    public readonly transactionReference?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, transactionReference });
  }
}

/**
 * Duplicate payment error
 */
export class DuplicatePaymentError extends AppError {
  readonly code = 'DUPLICATE_PAYMENT';
  readonly statusCode = 409;
  readonly userMessage = 'A payment for this booking already exists';

  constructor(
    message: string,
    public readonly bookingId?: string,
    public readonly existingPaymentId?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, bookingId, existingPaymentId });
  }
}
