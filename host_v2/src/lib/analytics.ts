import { IAPIClients } from '@righton/networking';
import posthog from 'posthog-js';

// ── Event catalogue ──────────────────────────────────────────────────────────

export enum HostEvent {
  // Session lifecycle
  GAME_SESSION_CREATED         = 'host_game_session_created',
  GAME_SESSION_CREATION_FAILED = 'host_game_session_creation_failed',
  GAME_SESSION_INIT_ERROR      = 'host_game_session_init_error',

  // Lobby
  TEAM_JOINED                  = 'host_team_joined',
  TEAMS_RESYNCED               = 'host_teams_resynced',

  // Connection
  CONNECTION_STATE_CHANGE      = 'host_connection_state_change',
  TAB_VISIBILITY_CHANGE        = 'host_tab_visibility_change',

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
    // posthog.init can throw if localStorage is blocked. Swallow so the app still renders.
    console.error('[analytics] PostHog failed to initialize. Analytics disabled.', e);
  }
}

// ── Identity ─────────────────────────────────────────────────────────────────

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

// ── Connection observability ─────────────────────────────────────────────────
// Mirrors play's wiring: socket death on the host is this app's #2577 root cause
// and was invisible because the host emitted no connection telemetry at all.

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
    trackEvent(HostEvent.CONNECTION_STATE_CHANGE, {
      connectionState: state,
      previousConnectionState: previous,
      cause: causeFromState(String(state)),
      isOnline: navigator.onLine,           // false  => network condition
      visibility: document.visibilityState, // 'hidden' => backgrounded
    });
  });
}
