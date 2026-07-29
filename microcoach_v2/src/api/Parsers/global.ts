export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined
}

/**
 * Sanitize a value for AWSJSON serialization.
 * Strips keys with undefined values, converts to a JSON-safe plain object.
 * Returns null if the input is null/undefined.
 */
export function sanitizeForAwsJson(value: unknown): string | null {
  if (isNullOrUndefined(value)) return null
  try {
    return JSON.stringify(value, (_, v) => (v === undefined ? null : v))
  } catch {
    return null
  }
}
