import UpgradeClient, { UpGradeClientInterfaces, IExperimentAssignmentv5, MARKED_DECISION_POINT_STATUS } from 'upgrade_client_lib/dist/browser';
import { IEduDataAPIClient, IDecisionPoint } from './interfaces';

export class EduDataAPIClient
  implements IEduDataAPIClient
{
  protected endpoint: string;
  protected client: UpgradeClient;
  protected userId: string;
  protected user: UpGradeClientInterfaces.IExperimentUser | null;
  protected experiments: IExperimentAssignmentv5[];

  private constructor(studentId: string) {
    this.endpoint = `http://edudata-alb-170633511.us-east-1.elb.amazonaws.com`;
    this.client = new UpgradeClient(studentId, this.endpoint, 'righton-play');
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

  public async getConditionObj(site: string, target: string): Promise<IDecisionPoint | null> {
    try{
      const decisionPoint = await this.client.getDecisionPointAssignment(site, target);
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