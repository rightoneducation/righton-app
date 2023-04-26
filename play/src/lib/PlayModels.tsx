import Icon0 from '../img/MonsterIcon0.svg';
import Icon1 from '../img/MonsterIcon1.svg';
import Icon2 from '../img/MonsterIcon2.svg';
import Icon3 from '../img/MonsterIcon3.svg';
import Icon4 from '../img/MonsterIcon4.svg';
import Icon5 from '../img/MonsterIcon5.svg';
import Monster0 from '../img/Monster0.svg';
import Monster1 from '../img/Monster1.svg';
import Monster2 from '../img/Monster2.svg';
import Monster3 from '../img/Monster3.svg';
import Monster4 from '../img/Monster4.svg';
import Monster5 from '../img/Monster5.svg';

export enum AnswerState {
  DEFAULT = 'DEFAULT',
  CORRECT = 'CORRECT',
  SELECTED = 'SELECTED',
}

export enum JoinGameState {
  SPLASH_SCREEN = 'SPLASH_SCREEN',
  ENTER_GAME_CODE = 'ENTER_GAME_CODE',
  ENTER_NAME = 'ENTER_NAME',
  SELECT_AVATAR = 'SELECT_AVATAR',
  HOW_TO_PLAY = 'HOW_TO_PLAY',
}

interface MonsterMap {
  [key: number]: {
    icon: string;
    monster?: string;
  };
}

export const monsterMap: MonsterMap = {
  0: { icon: Icon0, monster: Monster0 },
  1: { icon: Icon1, monster: Monster1 },
  2: { icon: Icon2, monster: Monster2 },
  3: { icon: Icon3, monster: Monster3 },
  4: { icon: Icon4, monster: Monster4 },
  5: { icon: Icon5, monster: Monster5 },
};

export enum InputPlaceholder {
  FIRST_NAME = 'First Name',
  LAST_NAME = 'Last Name',
  GAME_CODE = '####',
}
