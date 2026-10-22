// How a student's name reads where space is short (the misconception modal's
// "Show students" pills): the first name alone, unless another student in the
// same list shares it, then the first name and last initial ("Kira S."). The
// same rule as Reflect, so a student reads the same way across screens.

const firstNameOf = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? '';

const lastInitialOf = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : '';
};

/** Maps each full name to its display form, judged against the whole list. */
// eslint-disable-next-line import/prefer-default-export
export function displayNames(fullNames: string[]): Map<string, string> {
  const unique = Array.from(new Set(fullNames.map((name) => name.trim()).filter(Boolean)));
  const firstNameCounts = new Map<string, number>();
  unique.forEach((name) => {
    const key = firstNameOf(name).toLowerCase();
    firstNameCounts.set(key, (firstNameCounts.get(key) ?? 0) + 1);
  });
  return new Map(
    unique.map((name) => {
      const first = firstNameOf(name);
      const initial = lastInitialOf(name);
      const clashes = (firstNameCounts.get(first.toLowerCase()) ?? 0) > 1;
      return [name, clashes && initial ? `${first} ${initial}.` : first];
    }),
  );
}
