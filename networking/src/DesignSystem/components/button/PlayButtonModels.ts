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

export enum ButtonShape {
  INTRO,
  GAMEPLAY,
}

type ButtonContentMapProps = {
  [key in ButtonType]: {
    shape: ButtonShape;
    width?: string;
  };
};

export const buttonContentMap: ButtonContentMapProps = {
  [ButtonType.START]: { shape: ButtonShape.INTRO },
  [ButtonType.JOIN]: { shape: ButtonShape.INTRO, width: '135px' },
  [ButtonType.JOINING]: { shape: ButtonShape.INTRO, width: '135px' },
  [ButtonType.REJOIN]: { shape: ButtonShape.INTRO },
  [ButtonType.DONTREJOIN]: { shape: ButtonShape.INTRO },
  [ButtonType.RETRY]: { shape: ButtonShape.INTRO },
  [ButtonType.QUIT]: { shape: ButtonShape.INTRO },
  [ButtonType.REFRESH]: { shape: ButtonShape.INTRO },
  [ButtonType.SUBMIT]: { shape: ButtonShape.GAMEPLAY },
  [ButtonType.SUBMITTED]: { shape: ButtonShape.GAMEPLAY },
  [ButtonType.HINT]: { shape: ButtonShape.GAMEPLAY },
  [ButtonType.LEADERBOARD]: { shape: ButtonShape.GAMEPLAY },
};
