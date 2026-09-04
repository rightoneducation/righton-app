import { KgQueryType, MaskOptionEnum } from "../../types"

export const maskQuery = (query: KgQueryType, maskOption: MaskOptionEnum ) => {
  // keep function pure
  const clonedQuery: KgQueryType = structuredClone(query);
  // a standard with no LVN factors comes back without the array on some graph
  // responses, so the three nested masks below would throw on it
  const lvnFactors = clonedQuery.lvnFactors ?? [];
  // mask fields based on option provided
  switch (maskOption){
    case MaskOptionEnum.NO_PREREQ:
      clonedQuery.prerequisiteStandards = [];
      return clonedQuery;
    case MaskOptionEnum.NO_DOWNSTREAM:
      clonedQuery.futureDependentStandards = [];
      return clonedQuery;
    case MaskOptionEnum.NO_CHILD:
      clonedQuery.childStandards = [];
      return clonedQuery;
    case MaskOptionEnum.NO_RELATED:
      clonedQuery.relatedStandards = [];
      return clonedQuery;
    case MaskOptionEnum.NO_LVN_FULL:
      clonedQuery.lvnFactors = [];
      return clonedQuery;
    case MaskOptionEnum.NO_LVN_INTERACTSWITH:
      lvnFactors.forEach(f => { f.interactsWith = []; });
      return clonedQuery;
    case MaskOptionEnum.NO_LVN_LEARNERMODELS:
      lvnFactors.forEach(f => { f.learnerModels = []; });
      return clonedQuery;
    case MaskOptionEnum.NO_LVN_STRATEGY:
      lvnFactors.forEach(f => { f.strategies = []; });
      return clonedQuery;
    case MaskOptionEnum.NO_LC:
      clonedQuery.learningComponents = [];
      return clonedQuery;
    case MaskOptionEnum.FULL:
      clonedQuery.prerequisiteStandards = [];
      clonedQuery.futureDependentStandards = [];
      clonedQuery.childStandards = [];
      clonedQuery.relatedStandards = [];
      clonedQuery.learningComponents = [];
      clonedQuery.lvnFactors = [];
      return clonedQuery;
    case MaskOptionEnum.NONE:
    default:
      return clonedQuery;
  }
}