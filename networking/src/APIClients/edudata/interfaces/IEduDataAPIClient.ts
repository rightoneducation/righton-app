export interface IEduDataAPIClient {
  getConditions(site: string, target: string): string[] | undefined;
  markExposure(site: string, target: string): Promise<void>;
  logMetric(key: string, value: string | number): Promise<void>;
}