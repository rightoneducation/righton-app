export enum ButtonType {
  DISCARD = 'discard',
}

export enum ButtonColor {
  RED,
  BLUE,
  NULL
}

type ButtonContentMapProps = {
  [key in ButtonType]: {
    icon?: string;
    textKey?: string;
    color?: ButtonColor;
    rightIcon?: string;
    width?: string;
  };
};

// textKey data is duplicated to improve clarity of object and centralize all button content properties
export const buttonContentMap: ButtonContentMapProps = {
  [ButtonType.DISCARD]: {
    textKey: ButtonType.DISCARD,
    color: ButtonColor.RED,
  },
};
