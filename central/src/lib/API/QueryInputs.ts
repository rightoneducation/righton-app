import { PublicPrivateType } from '@righton/networking';
export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum SortField {
  GRADE = 'grade',
  UPDATEDAT = 'updatedAt',
  COUNT = 'count',
}

export interface IListQuerySettings {
  publicPrivateType: PublicPrivateType
  nextToken: string | null
  sortDirection?: SortDirection | null
  sortField?: SortField | null
  filterString?: string
  queryLimit?: number
}