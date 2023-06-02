import { isNullOrUndefined } from '@righton/networking';

export default function useFetchAndLocalData() {
  const pregameModel = window.localStorage.getItem('rightOn');  
  if (isNullOrUndefined(pregameModel)) 
    return null;
  // passes either pregameModel or empty object to GameInProgressContainer
  return JSON.parse(pregameModel);
}
