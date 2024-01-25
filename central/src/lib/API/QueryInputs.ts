export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum SortField {
  GRADE = 'grade',
  UPDATEDAT = 'updatedAt',
  QUESTIONCOUNT = 'questionCount',
}

export interface IListQuerySettings {
  nextToken: string | null
  sortDirection?: SortDirection
  sortField?: SortField
  filterString?: string
  limit: number
}