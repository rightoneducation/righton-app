// A teacher's school, derived from their email domain (Account notes: email
// and school depend on each other, so neither is editable).
//
// Known pilot domains map to their proper names; any other domain gets a
// readable name built from it ("lincoln-high.org" -> "Lincoln High").
const SCHOOLS_BY_DOMAIN: Record<string, string> = {
  'camden-prep.org': 'Camden Prep',
};

// Mail providers say nothing about the school.
const PERSONAL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
]);

// Labels that sit between a school's name and the TLD without naming it:
// lincoln.k12.nj.us, oxford.ac.uk, school.edu.au.
const GENERIC_LABELS = new Set(['k12', 'ac', 'edu', 'sch', 'co']);

// US district domains carry the state before .us (lincoln.k12.nj.us).
const US_STATES = new Set([
  'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'dc', 'fl', 'ga', 'hi', 'id',
  'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo',
  'mt', 'ne', 'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa',
  'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy',
]);

/** The school for an email, or null when the domain does not name one. */
// eslint-disable-next-line import/prefer-default-export
export function schoolFromEmail(email: string): string | null {
  const domain = email.split('@')[1]?.trim().toLowerCase();
  if (!domain || PERSONAL_DOMAINS.has(domain)) return null;
  if (SCHOOLS_BY_DOMAIN[domain]) return SCHOOLS_BY_DOMAIN[domain];
  // Drop the TLD, then the generic labels (and a US state) in front of it;
  // the label left last names the school. Any subdomain prefix like "mail."
  // or "students." sits before it and is ignored.
  const parts = domain.split('.');
  const isUs = parts.length > 1 && parts[parts.length - 1] === 'us';
  if (parts.length > 1) parts.pop();
  while (
    parts.length > 1 &&
    (GENERIC_LABELS.has(parts[parts.length - 1]) ||
      (isUs && US_STATES.has(parts[parts.length - 1])))
  ) {
    parts.pop();
  }
  const label = parts[parts.length - 1];
  return label
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
