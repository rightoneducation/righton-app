---
name: Check existing styles before swapping CSS classes
description: When replacing one element class with another, verify the new class doesn't carry constraints (max-width, overflow, etc.) that break the old element's layout
type: feedback
---

When replacing an element (e.g. `.standard-code`) with a component that uses a different CSS class (e.g. `.ccss-tag`), audit the new class for inherited constraints like `max-width`, `overflow: hidden`, or `text-overflow: ellipsis` that the original didn't have. Swapping classes silently introduces these regressions.

**Why:** Replacing `.standard-code` with `CcssHoverPill` (which uses `.ccss-tag`) caused text cropping because `.ccss-tag` has `max-width: 120px; overflow: hidden; text-overflow: ellipsis` — none of which `.standard-code` had.

**How to apply:** Before using a shared CSS class on a new element, grep for its definition and check for dimension/overflow constraints. If they conflict with the new context, override them inline or with a modifier class rather than silently inheriting them.
