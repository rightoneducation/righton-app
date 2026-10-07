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

/** The school for an email, or null when the domain does not name one. */
// eslint-disable-next-line import/prefer-default-export
export function schoolFromEmail(email: string): string | null {
  const domain = email.split('@')[1]?.trim().toLowerCase();
  if (!domain || PERSONAL_DOMAINS.has(domain)) return null;
  if (SCHOOLS_BY_DOMAIN[domain]) return SCHOOLS_BY_DOMAIN[domain];
  // Drop the TLD and any subdomain prefix like "mail." or "students.".
  const parts = domain.split('.');
  const label = parts.length > 1 ? parts[parts.length - 2] : parts[0];
  return label
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
