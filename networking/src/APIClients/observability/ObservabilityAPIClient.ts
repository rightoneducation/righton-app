import { Hub } from 'aws-amplify/utils';
import { CONNECTION_STATE_CHANGE, ConnectionState } from 'aws-amplify/api';
import { IObservabilityAPIClient } from './IObservabilityAPIClient';

export class ObservabilityAPIClient implements IObservabilityAPIClient {
  /**
   * Registers a single global listener for AWS AppSync WebSocket connection-state
   * transitions (Amplify emits these on the 'api' Hub channel).
   *
   * Used for observability (emit a telemetry event per change) and, later, as a
   * trigger to re-fetch/re-establish a subscription when the socket is disrupted.
   *
   * @param callback invoked on each change with (currentState, previousState).
   * @returns an unsubscribe function — call it to stop listening.
   */
  onConnectionStateChange(
    callback: (state: ConnectionState, previous: ConnectionState | null) => void,
  ): (() => void) {
    let previous: ConnectionState | null = null;
  
    return Hub.listen('api', (data) => {
      const { payload } = data;
      if (payload.event === CONNECTION_STATE_CHANGE) {
        const state = (payload as { data: { connectionState: ConnectionState } })
          .data.connectionState;
        callback(state, previous);
        previous = state;
      }
    });
  };
  
}