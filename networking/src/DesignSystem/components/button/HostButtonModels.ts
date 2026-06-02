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

export enum HostButtonShape {
  INTRO,
  GAMEPLAY,
}

export enum HostButtonVariant {
  FILLED,
  OUTLINE,
}

type ButtonContentMapProps = {
  [key in HostButtonType]: {
    shape: HostButtonShape;
    variant: HostButtonVariant;
    width?: string;
  };
};

// shape: INTRO = lobby/interim footers (FooterStartGame, FooterInterim)
//        GAMEPLAY = in-progress footer (FooterGameInProgress)
// variant: OUTLINE only for END_ANSWERING; everything else FILLED
export const hostButtonContentMap: ButtonContentMapProps = {
  [HostButtonType.PREPARE_GAME]: { shape: HostButtonShape.INTRO, variant: HostButtonVariant.FILLED },
  [HostButtonType.START_GAME]: { shape: HostButtonShape.INTRO, variant: HostButtonVariant.FILLED },
  [HostButtonType.NEXT_QUESTION]: { shape: HostButtonShape.INTRO, variant: HostButtonVariant.FILLED },
  [HostButtonType.END_GAME]: { shape: HostButtonShape.INTRO, variant: HostButtonVariant.FILLED },
  [HostButtonType.EXIT_TO_CENTRAL]: { shape: HostButtonShape.INTRO, variant: HostButtonVariant.FILLED },
  [HostButtonType.PLAY_SELECTED_GAME]: { shape: HostButtonShape.INTRO, variant: HostButtonVariant.FILLED },
  [HostButtonType.CONTINUE_PHASE_TWO]: { shape: HostButtonShape.GAMEPLAY, variant: HostButtonVariant.FILLED },
  [HostButtonType.CONTINUE]: { shape: HostButtonShape.GAMEPLAY, variant: HostButtonVariant.FILLED },
  [HostButtonType.END_ANSWERING]: { shape: HostButtonShape.GAMEPLAY, variant: HostButtonVariant.OUTLINE },
};
