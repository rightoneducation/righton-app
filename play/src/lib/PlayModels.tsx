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
  SPLASHSCREEN = 'SPLASHSCREEN',
  ENTERGAMECODE = 'ENTERGAMECODE',
  ENTERNAME = 'ENTERNAME',
  SELECTAVATAR = 'SELECTAVATAR',
  HOWTOPLAY = 'HOWTOPLAY',
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
