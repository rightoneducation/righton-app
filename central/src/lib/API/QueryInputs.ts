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
  sortDirection?: SortDirection | null
  sortField?: SortField | null
  filterString?: string
  limit: number
}