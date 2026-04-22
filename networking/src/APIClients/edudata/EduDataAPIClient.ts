import UpgradeClient, { UpGradeClientInterfaces, IExperimentAssignmentv5 } from 'upgrade_client_lib/dist/browser';

export class EduDataAPIClient
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

  static async create (studentId: string): Promise<EduDataAPIClient>{
    const c = new EduDataAPIClient(studentId);
    c.user = await c.client.init();
    c.experiments = await c.client.getAllExperimentConditions();
    return c;
  }
}