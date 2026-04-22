import UpgradeClient, { UpGradeClientInterfaces, IExperimentAssignmentv5, MARKED_DECISION_POINT_STATUS } from 'upgrade_client_lib/dist/browser';
import { IEduDataAPIClient } from './interfaces';

export class EduDataAPIClient
  implements IEduDataAPIClient
{
  protected endpoint: string;
  protected client: UpgradeClient;
  protected userId: string;
  protected user: UpGradeClientInterfaces.IExperimentUser | null;
  protected experiments: IExperimentAssignmentv5[];

  private constructor(studentId: string) {
    this.endpoint = `http://edudata-alb-170633511.us-east-1.elb.amazonaws.com/api`;
    this.client = new UpgradeClient(studentId, this.endpoint, 'play-app');
    this.userId = studentId;
    this.user = null;
    this.experiments = [];
  }

  static async create (studentId: string): Promise<EduDataAPIClient | null>{
    try {
      const c = new EduDataAPIClient(studentId);
      c.user = await c.client.init();
      c.experiments = await c.client.getAllExperimentConditions();
      return c;
    } catch (e) {
      console.error('Upgrade create failed');
      console.error(e);
      return null;            
    }
  }

  public getConditions(site: string, target: string): string[] | undefined {    
    const experiment = this.experiments.find(e => e.site === site && e.target === target);                                                                  
    return experiment?.assignedCondition.map(ac => ac.payload.value);
  }                                                                             
                  
  public async markExposure(site: string, target: string): Promise<void> {
    const experiment = this.experiments.find(e => e.site === site && e.target === target);                                                                  
    const conditionCode = experiment?.assignedCondition[0]?.conditionCode ?? null;                                                                         
    try {         
      await this.client.markDecisionPoint(                                      
        site,     
        target,
        conditionCode,
        MARKED_DECISION_POINT_STATUS.CONDITION_APPLIED
      );                                                                        
    } catch (e) {
      console.error('UpGrade markDecisionPoint failed');                    
      console.error(e);
    }             
  }

  public async logMetric(key: string, value: string | number): Promise<void> {
    try {
      await this.client.log([
        {                                                                                                                                                                                                        
          timestamp: new Date().toISOString(),              
          metrics: {
            attributes: { [key]: value },                                                                                                                                                                        
            groupedMetrics: [],
          },                                                                                                                                                                                                     
        },                                                  
      ]);      
    } catch (e){
      console.error('UpGrade logMetric failed');
      console.error(e);
    }
  }

}