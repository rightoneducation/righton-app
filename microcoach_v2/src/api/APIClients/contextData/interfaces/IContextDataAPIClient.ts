import {
  ContextDataType,
} from "../../../../AWSAPI";
import { IMicroCoachContextData } from "../../../Models/IMicroCoachContextData";

export interface IContextDataAPIClient {
  getContextData(id: string): Promise<IMicroCoachContextData | null>;
  listContextData(): Promise<IMicroCoachContextData[]>;
  listContextDataByType(
    type: ContextDataType,
  ): Promise<IMicroCoachContextData[]>;
  createContextData(
    contextData: IMicroCoachContextData,
  ): Promise<IMicroCoachContextData | null>;
  updateContextData(
    contextData: IMicroCoachContextData,
  ): Promise<IMicroCoachContextData | null>;
  deleteContextData(id: string): Promise<IMicroCoachContextData | null>;
}
