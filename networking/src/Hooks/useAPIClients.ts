import { useState, useEffect } from 'react';
import { IAPIClients } from '../APIClients/interfaces/IAPIClients';
import { APIClients, AppType } from '../APIClients/APIClients';
import { Environment } from '../APIClients/BaseAPIClient';

export function useAPIClients(env: Environment, appType: AppType): { apiClients: IAPIClients | null , loading: Boolean } {
  const [apiClients, setAPIClients] = useState<IAPIClients | null >(null);
  const [loading, setLoading] = useState<Boolean>(true);

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
  }, [env]);

  return { apiClients, loading };
}
