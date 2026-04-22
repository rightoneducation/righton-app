export interface IEduDataAPIClient {
  create(studentId: string): Promise<IEduDataAPIClient>;
}