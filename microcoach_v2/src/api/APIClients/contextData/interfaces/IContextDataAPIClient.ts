import {
  ContextDataType,
  CreateContextDataInput,
  UpdateContextDataInput,
} from "../../../../AWSAPI";
import { IMicroCoachContextData } from "../../../Models/IMicroCoachContextData";

export interface IContextDataAPIClient {
  getContextData(id: string): Promise<IMicroCoachContextData | null>;
  listContextData(): Promise<IMicroCoachContextData[]>;
  listContextDataByType(
    type: ContextDataType,
  ): Promise<IMicroCoachContextData[]>;
  createContextData(
    input: CreateContextDataInput,
  ): Promise<IMicroCoachContextData | null>;
  updateContextData(
    input: UpdateContextDataInput,
  ): Promise<IMicroCoachContextData | null>;
  deleteContextData(id: string): Promise<IMicroCoachContextData | null>;
}
