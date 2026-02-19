import posthog from 'posthog-js';

// ── Event catalogue ──────────────────────────────────────────────────────────

export enum PlayEvent {
  // Pregame
  GAME_JOIN_ATTEMPTED      = 'play_game_join_attempted',
  GAME_JOIN_SUCCESS        = 'play_game_join_success',
  GAME_JOIN_FAILURE        = 'play_game_join_failure',
  GAME_REJOIN_STARTED      = 'play_game_rejoin_started',

  // Connection
  SUBSCRIPTION_ESTABLISHED = 'play_subscription_established',
  SUBSCRIPTION_ERROR       = 'play_subscription_error',

  // Game lifecycle
  GAME_STATE_CHANGED       = 'play_game_state_changed',
  STUDENT_DROPPED          = 'play_student_dropped',

  // Gameplay
  ANSWER_SUBMITTED         = 'play_answer_submitted',

  // Errors / recovery
  ERROR_MODAL_SHOWN        = 'play_error_modal_shown',
  RETRY_ATTEMPTED          = 'play_retry_attempted',
  UNHANDLED_JS_ERROR       = 'play_unhandled_js_error',
}

// ── Init ─────────────────────────────────────────────────────────────────────

export function initAnalytics(): void {
  const key = process.env.REACT_APP_POSTHOG_KEY;
  const host = process.env.REACT_APP_POSTHOG_HOST;

  if (!key) {
    console.error('[analytics] REACT_APP_POSTHOG_KEY is not set. Analytics disabled.');
    return;
  }

  try {
  posthog.init(key, {
    api_host: host ?? 'https://us.i.posthog.com',

    // Session recording — privacy settings for minors/COPPA
    session_recording: {
      maskAllInputs: true,               // masks game code, name fields
      maskTextSelector: '[data-ph-mask]', // opt-in for dynamic text (e.g. teamName display)
    },

    autocapture: true,
    capture_pageview: true,

    // localStorage persistence avoids cookies (simpler COPPA posture than cookie consent)
    persistence: 'localStorage',

    // Honor browser Do Not Track
    respect_dnt: true,

    // Strip query params from URLs before sending (defense-in-depth for PII)
    sanitize_properties: (properties) => {
      if (properties.$current_url) {
        try {
          const url = new URL(properties.$current_url as string);
          url.search = '';
          // eslint-disable-next-line no-param-reassign
          properties.$current_url = url.toString();
        } catch { /* leave as-is */ }
      }
      return properties;
    },
  });
  } catch (e) {
    // posthog.init can throw if localStorage is blocked (managed school devices,
    // content blockers, Safari ITP). Swallow the error so the app still renders.
    console.error('[analytics] PostHog failed to initialize. Analytics disabled.', e);
  }
}

// ── Identity ─────────────────────────────────────────────────────────────────
// teamId is a UUID — never include real names or PII

export function identifyStudent(
  teamId: string,
  properties: { gameSessionId: string; avatarIndex: number }
): void {
  posthog.identify(teamId, properties);
}

// ── Event tracking ───────────────────────────────────────────────────────────

export function trackEvent(
  event: PlayEvent,
  properties?: Record<string, unknown>
): void {
  posthog.capture(event, properties);
}

export function trackError(
  event: PlayEvent,
  error: unknown,
  additionalProperties?: Record<string, unknown>
): void {
  posthog.capture(event, {
    errorMessage: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? (error.stack ?? '') : '',
    ...additionalProperties,
  });
}

// Call before redirecting away so PostHog has time to flush the pending event
export function flushAndRedirect(url: string, delayMs = 300): void {
  setTimeout(() => { window.location.replace(url); }, delayMs);
}

export function resetAnalyticsIdentity(): void {
  posthog.reset();
}
