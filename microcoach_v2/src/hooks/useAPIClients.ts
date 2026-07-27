import { useState, useEffect } from 'react';
import { APIClients, AppType, Environment } from '../api';

// Constructs the MicroCoach API clients once on mount. Mirrors networking's
// useAPIClients. Amplify must already be configured (see src/index.tsx →
// configureAmplify) before any client method runs.
// eslint-disable-next-line import/prefer-default-export
export function useAPIClients(
  env: Environment,
  appType: AppType,
): { apiClients: APIClients | null; loading: boolean } {
  const [apiClients, setAPIClients] = useState<APIClients | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAPIClients() {
      try {
        const clients = await APIClients.create(env, appType);
        setAPIClients(clients);
      } catch (error) {
        console.error('Failed to initialize API clients:', error);
      } finally {
        setLoading(false);
      }
    }
    initAPIClients();
  }, [env, appType]);

  return { apiClients, loading };
}
