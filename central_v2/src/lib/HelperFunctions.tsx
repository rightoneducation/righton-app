import { IAPIClients, IGameTemplate, PublicPrivateType, SortDirection, GradeTarget, SortType } from "@righton/networking";

export const handleGameSearch = async (apiClients: IAPIClients, type: PublicPrivateType, limit: number | null, nextToken: string | null, search: string, sortDirection: SortDirection, sortType: SortType, gradeTargets: GradeTarget[]) => { // eslint-disable-line
  console.log(nextToken);
  console.log(limit);
  switch(sortType){
    case SortType.listGameTemplatesByDate: {
      const response = await apiClients.gameTemplate.listGameTemplatesByDate(type, limit, nextToken, sortDirection, search, gradeTargets);
      console.log(response);
      if (response){
        return { nextToken: response.nextToken, games: response.gameTemplates };
      }
      break;
    }
    case SortType.listGameTemplatesByGrade: {
      const response = await apiClients.gameTemplate.listGameTemplatesByGrade(type, limit, nextToken, sortDirection, search, gradeTargets);
      if (response){
        return { nextToken: response.nextToken, games: response.gameTemplates };
      }
      break;
    }
    case SortType.listGameTemplatesByQuestionCount: {
      const response = await apiClients.gameTemplate.listGameTemplatesByQuestionTemplatesCount(type, limit, nextToken, sortDirection, search, gradeTargets);
      console.log(response);
      if (response){
        return { nextToken: response.nextToken, games: response.gameTemplates };
      }
      break;
    }
    case SortType.listGameTemplates:
    default: {
      const response = await apiClients.gameTemplate.listGameTemplates(type, limit, nextToken, sortDirection, search, gradeTargets);
      if (response){
        return { nextToken: response.nextToken, games: response.gameTemplates };
      }
      break; 
    }
  }
  return {nextToken: null, games: []};
};