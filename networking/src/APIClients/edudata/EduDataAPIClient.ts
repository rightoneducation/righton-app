import UpgradeClient, { UpGradeClientInterfaces } from 'upgrade_client_lib/dist/browser';
import { IEduDataAPIClient } from "./interfaces/IEduDataAPIClient";

export class EduDataAPIClient
  implements IEduDataAPIClient
{
  protected endpoint: string;
  protected client: UpgradeClient;
  protected user: UpGradeClientInterfaces.IExperimentUser | null;

  constructor(studentId: string) {
    this.endpoint = `http://edudata-alb-170633511.us-east-1.elb.amazonaws.com/api`;
    this.client = new UpgradeClient(studentId, this.endpoint, 'play-app');
    this.user = null;
  }

  public async init (){
    this.user = await this.client.init();
  }
}