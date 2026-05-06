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

export enum ButtonColor {
  RED,
  CYAN,
}

export enum ButtonShape {
  INTRO,
  GAMEPLAY,
}

type ButtonContentMapProps = {
  [key in ButtonType]: {
    color: ButtonColor;
    shape: ButtonShape;
    width?: string;
  };
};

export const buttonContentMap: ButtonContentMapProps = {
  [ButtonType.START]: {
    color: ButtonColor.RED,
    shape: ButtonShape.INTRO,
  },
  [ButtonType.JOIN]: {
    color: ButtonColor.RED,
    shape: ButtonShape.INTRO,
    width: '135px',
  },
  [ButtonType.JOINING]: {
    color: ButtonColor.RED,
    shape: ButtonShape.INTRO,
    width: '135px',
  },
  [ButtonType.REJOIN]: {
    color: ButtonColor.CYAN,
    shape: ButtonShape.INTRO,
  },
  [ButtonType.DONTREJOIN]: {
    color: ButtonColor.RED,
    shape: ButtonShape.INTRO,
  },
  [ButtonType.RETRY]: {
    color: ButtonColor.CYAN,
    shape: ButtonShape.INTRO,
  },
  [ButtonType.QUIT]: {
    color: ButtonColor.RED,
    shape: ButtonShape.INTRO,
  },
  [ButtonType.REFRESH]: {
    color: ButtonColor.RED,
    shape: ButtonShape.INTRO,
  },
  [ButtonType.SUBMIT]: {
    color: ButtonColor.CYAN,
    shape: ButtonShape.GAMEPLAY,
  },
  [ButtonType.SUBMITTED]: {
    color: ButtonColor.CYAN,
    shape: ButtonShape.GAMEPLAY,
  },
  [ButtonType.HINT]: {
    color: ButtonColor.CYAN,
    shape: ButtonShape.GAMEPLAY,
  },
  [ButtonType.LEADERBOARD]: {
    color: ButtonColor.CYAN,
    shape: ButtonShape.GAMEPLAY,
  },
};
