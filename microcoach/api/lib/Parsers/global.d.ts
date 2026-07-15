export declare function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined;
/**
 * Sanitize a value for AWSJSON serialization.
 * Strips keys with undefined values, converts to a JSON-safe plain object.
 * Returns null if the input is null/undefined.
 */
export declare function sanitizeForAwsJson(value: unknown): string | null;
