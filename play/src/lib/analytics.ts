import { IAPIClients } from '@righton/networking';
import posthog from 'posthog-js';

// ── Event catalogue ──────────────────────────────────────────────────────────

export enum PlayEvent {
  // Pregame
  GAME_JOIN_ATTEMPTED      = 'play_game_join_attempted',
  GAME_JOIN_SUCCESS        = 'play_game_join_success',
  GAME_JOIN_FAILURE        = 'play_game_join_failure',
  GAME_REJOIN_STARTED      = 'play_game_rejoin_started',
  GAME_REJOIN_RECOVERED    = 'play_game_rejoin_recovered',

  // Connection
  SUBSCRIPTION_ESTABLISHED = 'play_subscription_established',
  SUBSCRIPTION_ERROR       = 'play_subscription_error',
  TAB_VISIBILITY_CHANGE    = 'play_tab_visibility_change',

  // Game lifecycle
  GAME_STATE_CHANGED       = 'play_game_state_changed',
  CONNECTION_STATE_CHANGE = 'play_connection_state_change',
  SUBSCRIPTION_FIRST_DATA = 'play_subscription_first_data',
  SUBSCRIPTION_RESYNC     = 'play_subscription_resync',    // defined now;
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

    // Session recording
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '[data-ph-mask]',
    },

    autocapture: true,
    capture_pageview: true,

    // localStorage persistence
    persistence: 'localStorage',

    // Do Not Track
    respect_dnt: true,

    // Sanitize properties
    sanitize_properties: (properties) => {
      if (properties.$current_url) {
        try {
          const url = new URL(properties.$current_url as string);
          url.search = '';
          // eslint-disable-next-line no-param-reassign
          properties.$current_url = url.toString();
        } catch { /* leave as-is */ }
      }
      // eslint-disable-next-line no-param-reassign
      properties.$geoip_disable = true;
      // eslint-disable-next-line no-param-reassign
      delete properties.$ip;
      // eslint-disable-next-line no-param-reassign
      delete properties.$timezone;
      // eslint-disable-next-line no-param-reassign
      delete properties.$raw_user_agent;
      return properties;
    },
  });
  } catch (e) {
    console.error('[analytics] PostHog failed to initialize. Analytics disabled.', e);
  }
}

// ── Identity ─────────────────────────────────────────────────────────────────

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

// Derives the cause of a connection transition from Amplify's ConnectionState.
// The enum already encodes the cause, so we don't need separate event names.
function causeFromState(state: string): string {
  switch (state) {
    case 'ConnectedPendingNetwork':
    case 'ConnectionDisruptedPendingNetwork':
      return 'network';
    case 'ConnectedPendingKeepAlive':
      return 'keepalive';
    case 'ConnectionDisrupted':
      return 'socket'; // the silent-death class
    case 'Connecting':
    case 'Connected':
      return 'connect';
    case 'Disconnected':
    case 'ConnectedPendingDisconnect':
      return 'disconnect';
    default:
      return 'unknown';
  }
}

// Wires Amplify's AppSync connection-state changes into PostHog so socket
// drops/recoveries are visible instead of silent. Returns an unsubscribe fn.
export function initConnectionStateTracking(apiClients: IAPIClients): () => void {
  return apiClients.observability.onConnectionStateChange((state, previous) => {
    trackEvent(PlayEvent.CONNECTION_STATE_CHANGE, {
      connectionState: state,
      previousConnectionState: previous,
      cause: causeFromState(String(state)),
      isOnline: navigator.onLine,           // false  => network condition
      visibility: document.visibilityState, // 'hidden' => backgrounded
    });
  });
}

// Backgrounding never surfaces as an Amplify connection-state change (its
// detector freezes while hidden), so we track tab visibility separately.
// This is the only way to make the silent-background case observable.
export function initVisibilityTracking(): () => void {
  const handler = () => {
    trackEvent(PlayEvent.TAB_VISIBILITY_CHANGE, {
      visibility: document.visibilityState, // 'hidden' | 'visible'
      isOnline: navigator.onLine,
    });
  };
  document.addEventListener('visibilitychange', handler);
  return () => document.removeEventListener('visibilitychange', handler);
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
