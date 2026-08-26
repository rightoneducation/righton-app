/**
 * Stub for the approved-teacher check.
 *
 * Only vetted teachers may create a profile, so the sign-up form checks the
 * address before it will let the wizard continue. A Lambda replaces the body
 * of `checkEmailApproval` later — the signature and the returned shape are
 * what the real call has to honour, so nothing above this file changes.
 */

export interface ApprovalResult {
  isApproved: boolean;
  /** Why it was refused, for logging. The screen shows catalogue copy. */
  reason?: string;
}

/**
 * Long enough that the "checking" state is actually visible. Without it the
 * promise settles inside a frame and the pending treatment never renders,
 * which is precisely what this prototype needs to demonstrate.
 */
const STUB_LATENCY_MS = 900;

/** Stands in for the vetted list until the real one is queried. */
const APPROVED_DOMAINS = ['justiceschools.org', 'righton.education'];

export default function checkEmailApproval(
  email: string,
): Promise<ApprovalResult> {
  const domain = email.trim().toLowerCase().split('@')[1] ?? '';

  return new Promise((resolve) => {
    setTimeout(() => {
      const isApproved = APPROVED_DOMAINS.includes(domain);
      resolve({
        isApproved,
        reason: isApproved ? undefined : 'DOMAIN_NOT_APPROVED',
      });
    }, STUB_LATENCY_MS);
  });
}
