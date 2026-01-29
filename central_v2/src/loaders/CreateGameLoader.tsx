import { StorageKeyCreateGame } from '../lib/CentralModels';
import {
  TGameTemplateProps,
  TDraftQuestionsList,
  TPhaseTime,
} from '../lib/CreateGameModels';

export type CreateGameDraftLocalData = {
  draftGame: TGameTemplateProps | null;
  draftQuestionsList: TDraftQuestionsList[] | null;
  phaseTime: TPhaseTime | null;
};

export default function CreateGameLoader(): CreateGameDraftLocalData {
  const storageObject = window.localStorage.getItem(StorageKeyCreateGame);
  if (!storageObject) {
    return {
      draftGame: null,
      draftQuestionsList: null,
      phaseTime: null,
    };
  }
  try {
    const parsed = JSON.parse(storageObject) as {
      draftGame?: TGameTemplateProps;
      draftQuestionsList?: TDraftQuestionsList[];
      phaseTime?: TPhaseTime;
    };
    return {
      draftGame: parsed.draftGame ?? null,
      draftQuestionsList: parsed.draftQuestionsList ?? null,
      phaseTime: parsed.phaseTime ?? null,
    };
  } catch {
    return {
      draftGame: null,
      draftQuestionsList: null,
      phaseTime: null,
    };
  }
}
