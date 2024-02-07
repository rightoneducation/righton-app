export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined
}

export function doesObjectHaveDate (object: any): boolean {
  return object.hasOwnProperty('createdAt') && object.hasOwnProperty('updatedAt');
}