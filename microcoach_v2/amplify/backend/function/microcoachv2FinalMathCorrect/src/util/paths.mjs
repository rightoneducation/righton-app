/**
 * Values in a misconception or activity, addressed the way the math check
 * names them: "content.facilitate.examples[1].steps[2].text".
 */

/** "a.b[1].c" → ['a', 'b', 1, 'c'] */
export function parsePath(path) {
  const keys = [];
  for (const [, name, index] of String(path).matchAll(/([^.[\]]+)|\[(\d+)\]/g)) {
    keys.push(index != null ? Number(index) : name);
  }
  return keys;
}

/** The value at `path`, or undefined when any step along it is missing. */
export function getAt(obj, path) {
  return parsePath(path).reduce((node, key) => (node == null ? undefined : node[key]), obj);
}

/** Sets the value at `path`. Only an existing value is replaced: a wrong path throws. */
export function setAt(obj, path, value) {
  const keys = parsePath(path);
  const last = keys.pop();
  const parent = keys.reduce((node, key) => (node == null ? undefined : node[key]), obj);
  if (parent == null || typeof parent !== 'object' || !(last in parent)) {
    throw new Error(`No value at ${path}`);
  }
  parent[last] = value;
}

/**
 * `value` (always a string from the model or the page) as the same kind of
 * value as `original`, so a number stays a number and a flag stays a flag.
 * Throws when it can't be.
 */
export function coerceLike(original, value, path) {
  const text = String(value);
  if (typeof original === 'string') return text;
  if (typeof original === 'number') {
    const n = Number(text.trim());
    if (text.trim() === '' || !Number.isFinite(n)) throw new Error(`${path} must stay a number, not "${text}"`);
    return n;
  }
  if (typeof original === 'boolean') {
    const t = text.trim().toLowerCase();
    if (t !== 'true' && t !== 'false') throw new Error(`${path} must stay true or false, not "${text}"`);
    return t === 'true';
  }
  throw new Error(`${path} is not a single value`);
}
