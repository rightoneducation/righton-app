import { useState, useEffect } from 'react';
import { IAPIClients } from '../APIClients/interfaces/IAPIClients';
import { APIClients, AppType } from '../APIClients/APIClients';
import { IEduDataAPIClient } from '../APIClients/edudata/interfaces/IEduDataAPIClient';
import { EduDataAPIClient } from '../APIClients/edudata/EduDataAPIClient';
import { Environment } from '../APIClients/BaseAPIClient';

export function useAPIClients(env: Environment, appType: AppType): { apiClients: IAPIClients | null , loading: Boolean, eduDataClient?: IEduDataAPIClient | null } {
  const [apiClients, setAPIClients] = useState<IAPIClients | null >(null);
  const [eduDataClient, setEduDataClient] = useState<IEduDataAPIClient | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    async function initAPIClients() {
      try {
        const clients = await APIClients.create(env, appType);
        setAPIClients(clients);
        // init EduData separate from other APIClients for modularity & to ensure teamId present before eduData init
        if (appType === AppType.PLAY){
          const eduData = new EduDataAPIClient('test');
          await eduData.init();
          setEduDataClient(eduData);
        }
      } catch (error) {
        console.error('Failed to initialize API clients:', error);
      } finally {
        setLoading(false);
      }
    }
    initAPIClients();
  }, [env]);

  return { apiClients, loading, eduDataClient };
}
