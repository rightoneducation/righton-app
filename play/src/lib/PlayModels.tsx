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
import MonsterHandsUp0 from '../img/MonsterHandsUp0.svg';
import MonsterHandsUp1 from '../img/MonsterHandsUp1.svg';
import MonsterHandsUp2 from '../img/MonsterHandsUp2.svg';
import MonsterHandsUp3 from '../img/MonsterHandsUp3.svg';
import MonsterHandsUp4 from '../img/MonsterHandsUp4.svg';
import MonsterHandsUp5 from '../img/MonsterHandsUp5.svg';

export enum AnswerState {
  DEFAULT = 'DEFAULT', // any answer not correct or selected by player
  CORRECT = 'CORRECT', // correct answer per gameSession object
  PLAYER_CORRECT = 'PLAYER_CORRECT', // player has chosen correct answer
  SELECTED = 'SELECTED', // answer player has selected
  PREVIOUS = 'PREVIOUS', // answer player has selected in previous phase
}

export enum JoinGameState {
  SPLASH_SCREEN = 'SPLASH_SCREEN',
  ENTER_GAME_CODE = 'ENTER_GAME_CODE',
  ENTER_NAME = 'ENTER_NAME',
  SELECT_AVATAR = 'SELECT_AVATAR',
  HOW_TO_PLAY = 'HOW_TO_PLAY',
}

export enum FinalResultsState {
  CONGRATS = 'CONGRATS',
  LEADERBOARD = 'LEADERBOARD',
}

interface MonsterMap {
  [key: number]: {
    icon: string;
    monster?: string;
    handsup?: string;
    gradient?: string;
  };
}

export const monsterMap: MonsterMap = {
  0: {
    icon: Icon0,
    monster: Monster0,
    handsup: MonsterHandsUp0,
    gradient: 'linear-gradient(90deg, #4DED66 0%, #5ACD3D 100%)',
  },
  1: {
    icon: Icon1,
    monster: Monster1,
    handsup: MonsterHandsUp1,
    gradient: 'linear-gradient(90deg, #7E00C4 0%, #9139F8 100%)',
  },
  2: {
    icon: Icon2,
    monster: Monster2,
    handsup: MonsterHandsUp2,
    gradient: 'linear-gradient(90deg, #69000B 0%, #8B000A 100%)',
  },
  3: {
    icon: Icon3,
    monster: Monster3,
    handsup: MonsterHandsUp3,
    gradient: 'linear-gradient(90deg, #0A4178 0%, #0F56A1 100%)',
  },
  4: {
    icon: Icon4,
    monster: Monster4,
    handsup: MonsterHandsUp4,
    gradient: 'linear-gradient(90deg, #FED52B 0%, #C64E0F 100%)',
  },
  5: {
    icon: Icon5,
    monster: Monster5,
    handsup: MonsterHandsUp5,
    gradient: 'linear-gradient(90deg, #036496 0%, #1F81B3 100%)',
  },
};

export enum InputPlaceholder {
  FIRST_NAME = 'First Name',
  LAST_NAME = 'Last Name',
  GAME_CODE = '####',
}
