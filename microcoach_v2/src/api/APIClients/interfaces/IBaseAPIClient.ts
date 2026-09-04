// Deployment environment selector, mirroring networking's Environment enum.
// Retained for signature parity with central's useAPIClients(env, appType);
// MicroCoach currently runs a single backend, so this is a forward-looking hook.
export enum Environment {
  Staging = 'staging',
  Developing = 'developing',
  Testing = 'testing',
}
