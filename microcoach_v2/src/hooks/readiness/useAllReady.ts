/**
 * Composes readiness signals into the single flag a page gates its skeleton on.
 *
 * Each primitive (useI18nReady, a future useDataReady) both *starts* its work
 * and reports when it has settled, so adding a dependency never introduces a
 * waterfall — they all run in parallel from mount.
 *
 *   const isReady = useAllReady(useI18nReady(), useDataReady(x));
 *   if (!isReady) return <LandingSkeleton screenSize={screenSize} />;
 *
 * Images are deliberately not part of this. They own their own loading state
 * via ImageWithSkeleton, which keeps the request scoped to the element that
 * needs it instead of blocking a whole page on one asset.
 *
 * The primitives are called inline as arguments, which is safe: they run
 * unconditionally and in a fixed order. Never wrap one in a conditional.
 */
// eslint-disable-next-line import/prefer-default-export
export function useAllReady(...flags: boolean[]): boolean {
  return flags.every(Boolean);
}
