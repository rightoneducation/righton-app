import posthog from 'posthog-js';

// ── Event catalogue ──────────────────────────────────────────────────────────

export enum HostEvent {
  // Session lifecycle
  GAME_SESSION_CREATED         = 'host_game_session_created',
  GAME_SESSION_CREATION_FAILED = 'host_game_session_creation_failed',
  GAME_SESSION_INIT_ERROR      = 'host_game_session_init_error',

  // Lobby
  TEAM_JOINED                  = 'host_team_joined',

  // Teacher actions
  GAME_STARTED                 = 'host_game_started',
  GAME_PHASE_ADVANCED          = 'host_game_phase_advanced',

  // Game state
  GAME_STATE_CHANGED           = 'host_game_state_changed',

  // Errors
  UNHANDLED_JS_ERROR           = 'host_unhandled_js_error',
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

      // Session recording — mask inputs by default
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: '[data-ph-mask]',
      },

      autocapture: true,
      capture_pageview: true,

      // localStorage persistence avoids cookies
      persistence: 'localStorage',

      // Honor browser Do Not Track
      respect_dnt: true,

      // Strip query params from URLs before sending
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
    // posthog.init can throw if localStorage is blocked. Swallow so the app still renders.
    console.error('[analytics] PostHog failed to initialize. Analytics disabled.', e);
  }
}

// ── Identity ─────────────────────────────────────────────────────────────────
// Uses gameSessionId (UUID) as distinct ID — no teacher email or real name

export function identifySession(
  gameSessionId: string,
  properties: { gameCode: number; questionCount: number }
): void {
  posthog.identify(gameSessionId, properties);
}

// ── Event tracking ───────────────────────────────────────────────────────────

export function trackEvent(
  event: HostEvent,
  properties?: Record<string, unknown>
): void {
  posthog.capture(event, properties);
}

export function trackError(
  event: HostEvent,
  error: unknown,
  additionalProperties?: Record<string, unknown>
): void {
  posthog.capture(event, {
    errorMessage: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? (error.stack ?? '') : '',
    ...additionalProperties,
  });
}
