/**
 * Sort student name strings by first name, then last name.
 * Handles both "First Last" and "Last, First" formats — normalises to "First Last".
 */
export function normaliseStudentName(name) {
  if (!name) return name;
  // "Last, First" → "First Last"
  if (name.includes(',')) {
    const [last, first = ''] = name.split(',').map((s) => s.trim());
    return `${first} ${last}`.trim();
  }
  return name.trim();
}

export function sortStudentNames(names) {
  if (!names) return [];
  return [...names]
    .map(normaliseStudentName)
    .sort((a, b) => {
      const [aFirst = '', ...aRest] = a.split(' ');
      const [bFirst = '', ...bRest] = b.split(' ');
      const cmp = aFirst.localeCompare(bFirst);
      return cmp !== 0 ? cmp : aRest.join(' ').localeCompare(bRest.join(' '));
    });
}
