export interface IDecisionPoint {
  conditionCode: string,
  conditionValue: string
}

export interface IEduDataAPIClient {
  readonly userId: string;
  getConditionObj(site: string, target: string): Promise<IDecisionPoint | null>;
  markExposure(site: string, target: string, conditionCode: string): Promise<void>;
  logMetric(key: string, value: string | number): Promise<void>;
  isReady(): boolean;
  reinit(): Promise<void>;
}