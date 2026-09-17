import { IAuthAPIClient } from "../auth/interfaces/IAuthAPIClient";
import { IUserAPIClient } from "../user/interfaces/IUserAPIClient";
import { IMisconceptionAPIClient } from "../misconception/interfaces/IMisconceptionAPIClient";
import { IActivityAPIClient } from "../activity/interfaces/IActivityAPIClient";
import { ISessionAPIClient } from "../session/interfaces/ISessionAPIClient";
import { ISavedPlanAPIClient } from "../savedPlan/interfaces/ISavedPlanAPIClient";
import { IClassroomAPIClient } from "../classroom/interfaces/IClassroomAPIClient";
import { IAssessmentAPIClient } from "../assessment/interfaces/IAssessmentAPIClient";
import { IContextDataAPIClient } from "../contextData/interfaces/IContextDataAPIClient";
import { IStudentAPIClient } from "../student/interfaces/IStudentAPIClient";

import { IPipelineRunAPIClient } from "../pipelineRun/interfaces/IPipelineRunAPIClient";

export enum Environment {
  Staging = 'staging',
  Developing = 'developing',
  Testing = 'testing',
}

export interface IAPIClients {
  auth: IAuthAPIClient,
  user: IUserAPIClient,
  misconception: IMisconceptionAPIClient,
  activity: IActivityAPIClient,
  session: ISessionAPIClient,
  savedPlan: ISavedPlanAPIClient,
  classroom: IClassroomAPIClient,
  assessment: IAssessmentAPIClient,
  contextData: IContextDataAPIClient,
  student: IStudentAPIClient,
  pipelineRun: IPipelineRunAPIClient // TEMPORARY — see MicroCoachPipelineRun
}
