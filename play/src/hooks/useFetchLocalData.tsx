import { isNullOrUndefined } from '@righton/networking';
import { PregameModel } from '../lib/PlayModels';

export default function useFetchLocalData() {
  const pregameModel = window.localStorage.getItem('rightOn');
  if (isNullOrUndefined(pregameModel)) return null;

  const parsedPregameModel = JSON.parse(pregameModel);
  // checks for invalid data in pregameModel, returns null if found
  if (
    isNullOrUndefined(parsedPregameModel.gameSessionId) ||
    isNullOrUndefined(parsedPregameModel.teamId) ||
    isNullOrUndefined(parsedPregameModel.teamMemberId) ||
    isNullOrUndefined(parsedPregameModel.selectedAvatar)
  )
    return null;
  // passes validated pregameModel to GameInProgressContainer
  return parsedPregameModel;
}
