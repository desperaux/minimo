export type ErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_FAILED"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "IDEMPOTENCY_CONFLICT"
  | "INVOICE_NOT_EDITABLE"
  | "INVALID_STATUS_TRANSITION"
  | "PLAN_LIMIT_REACHED"
  | "EMAIL_NOT_VERIFIED"
  | "DELIVERY_SUPPRESSED"
  | "PAYMENTS_NOT_READY"
  | "PAYMENT_ALREADY_PROCESSING"
  | "PAYMENT_NOT_ALLOWED"
  | "PROVIDER_UNAVAILABLE"
  | "INTERNAL_ERROR";

export type Money = { amountMinor: number; currency: "USD" };
export type Page<T> = { items: T[]; nextCursor: string | null };
export type Success<T> = { ok: true; data: T; requestId: string };
export type Failure = { ok: false; error: { code: ErrorCode; message: string; fieldErrors?: Record<string, string[]>; retryable?: boolean }; requestId: string };
export type ApiResult<T> = Success<T> | Failure;

export const success = <T>(data: T, requestId: string): Success<T> => ({ ok: true, data, requestId });
export const failure = (code: ErrorCode, message: string, requestId: string, options?: { fieldErrors?: Record<string, string[]>; retryable?: boolean }): Failure => ({ ok: false, error: { code, message, ...options }, requestId });
