export enum ButtonType {
  START = 'start',
  JOIN = 'join',
  JOINING = 'joining',
  REJOIN = 'rejoin',
  DONTREJOIN = 'dontrejoin',
  RETRY = 'retry',
  QUIT = 'quit',
  REFRESH = 'refresh',
  SUBMIT = 'submit',
  SUBMITTED = 'submitted',
  HINT = 'hint',
  LEADERBOARD = 'leaderboard',
}

export enum PlayButtonShape {
  INTRO,
  GAMEPLAY,
}

type ButtonContentMapProps = {
  [key in ButtonType]: {
    shape: PlayButtonShape;
    width?: string;
  };
};

export const buttonContentMap: ButtonContentMapProps = {
  [ButtonType.START]: { shape: PlayButtonShape.INTRO },
  [ButtonType.JOIN]: { shape: PlayButtonShape.INTRO },
  [ButtonType.JOINING]: { shape: PlayButtonShape.INTRO },
  [ButtonType.REJOIN]: { shape: PlayButtonShape.INTRO },
  [ButtonType.DONTREJOIN]: { shape: PlayButtonShape.INTRO },
  [ButtonType.RETRY]: { shape: PlayButtonShape.INTRO },
  [ButtonType.QUIT]: { shape: PlayButtonShape.INTRO },
  [ButtonType.REFRESH]: { shape: PlayButtonShape.INTRO },
  [ButtonType.SUBMIT]: { shape: PlayButtonShape.GAMEPLAY },
  [ButtonType.SUBMITTED]: { shape: PlayButtonShape.GAMEPLAY },
  [ButtonType.HINT]: { shape: PlayButtonShape.GAMEPLAY },
  [ButtonType.LEADERBOARD]: { shape: PlayButtonShape.GAMEPLAY },
};
