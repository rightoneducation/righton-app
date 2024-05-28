import { useState, useEffect } from 'react';
import { IAPIClients } from '../APIClients/interfaces/IAPIClients';
import { APIClients } from '../APIClients/APIClients';
import { Environment } from '../APIClients/BaseAPIClient';

export function useAPIClients(env: Environment): { apiClients: IAPIClients | null , loading: Boolean } {
  const [apiClients, setAPIClients] = useState<IAPIClients | null >(null);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    async function initAPIClients() {
      try {
        const clients = await APIClients.create(env);
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
