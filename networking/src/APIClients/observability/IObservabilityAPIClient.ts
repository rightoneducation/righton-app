import { ConnectionState } from 'aws-amplify/api';

export interface IObservabilityAPIClient {
    onConnectionStateChange: (callback: (state: ConnectionState, previous: ConnectionState | null) => void ) => (() => void);
}