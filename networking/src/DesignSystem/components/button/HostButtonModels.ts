import launchWhite from '../../icons/buttonIconLaunchWhite.svg';
import launchBlue from '../../icons/buttonIconLaunchBlue.svg';

export enum HostButtonType {
  PREPARE_GAME = 'prepareGame',
  START_GAME = 'startGame',
  NEXT_QUESTION = 'nextQuestion',
  CONTINUE_PHASE_TWO = 'continuePhaseTwo',
  CONTINUE = 'continue',
  END_ANSWERING = 'endAnswering',
  END_GAME = 'endGame',
  EXIT_TO_CENTRAL = 'exitToCentral',
  PLAY_SELECTED_GAME = 'playSelectedGame',
}

type ButtonContentMapProps = {
  [key in HostButtonType]: {
    icon: string | null;
    disableIcon?: string;
    width?: string;
  };
};

export const hostButtonContentMap: ButtonContentMapProps = {
  [HostButtonType.PREPARE_GAME]: { icon: launchBlue, disableIcon: launchWhite },
  [HostButtonType.START_GAME]: { icon: launchWhite, disableIcon: launchBlue },
  [HostButtonType.NEXT_QUESTION]: { icon: null },
  [HostButtonType.END_GAME]: { icon: null },
  [HostButtonType.EXIT_TO_CENTRAL]: { icon: null },
  [HostButtonType.PLAY_SELECTED_GAME]: { icon: null },
  [HostButtonType.CONTINUE_PHASE_TWO]: { icon: null },
  [HostButtonType.CONTINUE]: { icon: null },
  [HostButtonType.END_ANSWERING]: { icon: null }
};
