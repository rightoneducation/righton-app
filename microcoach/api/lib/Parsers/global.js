"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNullOrUndefined = isNullOrUndefined;
exports.sanitizeForAwsJson = sanitizeForAwsJson;
function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
/**
 * Sanitize a value for AWSJSON serialization.
 * Strips keys with undefined values, converts to a JSON-safe plain object.
 * Returns null if the input is null/undefined.
 */
function sanitizeForAwsJson(value) {
    if (isNullOrUndefined(value))
        return null;
    try {
        return JSON.stringify(value, (_, v) => (v === undefined ? null : v));
    }
    catch {
        return null;
    }
}
