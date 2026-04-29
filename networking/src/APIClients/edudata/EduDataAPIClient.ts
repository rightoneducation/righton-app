import UpgradeClient, { UpGradeClientInterfaces, IExperimentAssignmentv5, MARKED_DECISION_POINT_STATUS } from 'upgrade_client_lib/dist/browser';
import { IEduDataAPIClient, IDecisionPoint } from './interfaces';

const isDebugEduData = (): boolean => {
  try {
    return typeof window !== 'undefined' && window.localStorage?.getItem('DEBUG_EDUDATA') === 'true';
  } catch {
    return false;
  }
};

async function instrument<T>(label: string, fn: () => Promise<T>): Promise<T> {
  if (!isDebugEduData()) return fn();
  const t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  const startedAt = new Date().toISOString();
  console.log(`[EduData] ${startedAt} ${label} start`);
  try {
    const result = await fn();
    const dur = ((typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0).toFixed(0);
    console.log(`[EduData] ${label} ok ${dur}ms`);
    return result;
  } catch (e) {
    const dur = ((typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0).toFixed(0);
    console.error(`[EduData] ${label} err ${dur}ms`, e);
    throw e;
  }
}

export class EduDataAPIClient
  implements IEduDataAPIClient
{
  protected endpoint: string;
  protected client: UpgradeClient;
  public readonly userId: string;
  protected user: UpGradeClientInterfaces.IExperimentUser | null;
  protected experiments: IExperimentAssignmentv5[];

  private constructor(teamId: string) {
    this.endpoint = `http://edudata-alb-170633511.us-east-1.elb.amazonaws.com`;
    this.client = new UpgradeClient(teamId, this.endpoint, 'righton-play');
    this.userId = teamId;
    this.user = null;
    this.experiments = [];
  }

  private async withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T | null>{
    return instrument(`${label} timeout(${ms}ms)`, async () => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      const result = await Promise.race<{ type: 'value'; value: T } | { type: 'timeout' }>([
        p.then((value) => ({ type: 'value', value })),
        new Promise<{ type: 'timeout' }>((resolve) => {
          timeoutId = setTimeout(() => resolve({ type: 'timeout' }), ms);
        }),
      ]);
      if (timeoutId) clearTimeout(timeoutId);
      return result.type === 'timeout' ? null : result.value;
    });
  }
  
  static async create(teamId: string): Promise<EduDataAPIClient | null>{
    try {
      const c = new EduDataAPIClient(teamId);
      c.user = await c.withTimeout(c.client.init(), 5000, `init(${teamId})`);
      c.experiments = (await c.withTimeout(
        c.client.getAllExperimentConditions(),
        5000,
        'getAllExperimentConditions'
      )) ?? [];
      return c;
    } catch (e) {
      console.error('Upgrade create failed');
      console.error(e);
      return null;
    }
  }

  public async getConditionObj(site: string, target: string): Promise<IDecisionPoint | null> {
    try{
      const decisionPoint = await this.withTimeout(
        this.client.getDecisionPointAssignment(site, target),
        5000,
        `getDecisionPointAssignment(${site},${target})`
      );
      if (!decisionPoint)
        return null
      const conditionCode = decisionPoint.getCondition();
      const conditionValue = decisionPoint.getPayload()?.value ?? '';
      return { conditionCode, conditionValue };
    } catch (e) {
      console.error('UpGrade getDecisionPoint failed');
      console.error(e);
      return null;
    }

  }                                                                             
                  
  public async markExposure(site: string, target: string, conditionCode: string): Promise<void> {
    try {
      await this.withTimeout(this.client.markDecisionPoint(
        site,
        target,
        conditionCode,
        MARKED_DECISION_POINT_STATUS.CONDITION_APPLIED
      ), 5000, `markDecisionPoint(${site},${target},${conditionCode})`);
    } catch (e) {
      console.error('UpGrade markDecisionPoint failed');
      console.error(e);
    }
  }

  public async logMetric(key: string, value: string | number): Promise<void> {
    try {
      await this.withTimeout(this.client.log([
        {
          timestamp: new Date().toISOString(),
          metrics: {
            attributes: { [key]: value },
            groupedMetrics: [],
          },
        },
      ]), 5000, `log(${key}=${value})`);
    } catch (e){
      console.error('UpGrade logMetric failed');
      console.error(e);
    }
  }

  public isReady(): boolean{
    return this.user !== null && this.experiments.length > 0;
  }

  public async reinit(): Promise<void>{
    try {
      this.user = await this.withTimeout(this.client.init(), 5000, `init(${this.userId})`);
      this.experiments = (await this.withTimeout(
        this.client.getAllExperimentConditions(),
        5000,
        'getAllExperimentConditions'
      )) ?? [];
    } catch (e) {
      console.error('Upgrade reinit failed');
      console.error(e);
    }
  }

}