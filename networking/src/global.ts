export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined
}

export function doesObjectHaveDate (object: any): boolean {
  return object.hasOwnProperty('createdAt') && object.hasOwnProperty('updatedAt');
}

// public cloudfront distribution URL
export const CloudFrontDistributionUrl = 'https://dksu6wxj1ol93.cloudfront.net/';