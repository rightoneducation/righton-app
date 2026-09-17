import { Amplify } from "aws-amplify";
import { IAuthAPIClient } from './auth/interfaces/IAuthAPIClient';
import { AuthAPIClient } from './auth/AuthAPIClient';
import { UserAPIClient } from './user/UserAPIClient';
import { PipelineRunAPIClient } from './pipelineRun/PipelineRunAPIClient';
import { Environment } from './interfaces/IAPIClients';
import awsconfig from "../../aws-exports";
import { MisconceptionAPIClient } from "./misconception/MisconceptionAPIClient";
import { ActivityAPIClient } from "./activity/ActivityAPIClient";
import { SessionAPIClient } from "./session/SessionAPIClient";
import { SavedPlanAPIClient } from "./savedPlan/SavedPlanAPIClient";
import { ClassroomAPIClient } from "./classroom/ClassroomAPIClient";
import { AssessmentAPIClient } from "./assessment/AssessmentAPIClient";
import { ContextDataAPIClient } from "./contextData/ContextDataAPIClient";
import { StudentAPIClient } from "./student/StudentAPIClient";

// Single app type today; kept for signature parity with central's factory.
export enum AppType {
  MICROCOACH,
}

export class APIClients {
  auth: IAuthAPIClient;
  user: UserAPIClient;
  misconception: MisconceptionAPIClient;
  activity: ActivityAPIClient;
  session: SessionAPIClient;
  savedPlan: SavedPlanAPIClient;
  classroom: ClassroomAPIClient;
  assessment: AssessmentAPIClient;
  contextData: ContextDataAPIClient;
  student: StudentAPIClient;
  // TEMPORARY — /preview reads eval runs through this. Delete with the
  // MicroCoachPipelineRun model.
  pipelineRun: PipelineRunAPIClient;

  constructor(env: Environment, authClient: IAuthAPIClient) {
    this.configAmplify(awsconfig);
    this.auth = authClient;
    this.user = new UserAPIClient(env, this.auth);
    this.misconception = new MisconceptionAPIClient(env, this.auth);
    this.activity = new ActivityAPIClient(env, this.auth);
    this.session = new SessionAPIClient(env, this.auth);
    this.savedPlan = new SavedPlanAPIClient(env, this.auth);
    this.classroom = new ClassroomAPIClient(env, this.auth);
    this.assessment = new AssessmentAPIClient(env, this.auth);
    this.contextData = new ContextDataAPIClient(env, this.auth);
    this.student = new StudentAPIClient(env, this.auth);
    this.pipelineRun = new PipelineRunAPIClient(env, this.auth);
  }

  static async create(env: Environment, appType: AppType): Promise<APIClients> {
    const authClient = new AuthAPIClient();
    return new APIClients(env, authClient);
  }

  configAmplify(awsconfig: any) {
    Amplify.configure(awsconfig);
  }
}
