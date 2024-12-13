import wae_gen from '../img/button/waeGen.svg';
import wae_regen from '../img/button/waeRegen.svg';

export enum AIButtonType {
  WAE_GEN = 'wae_gen',
  WAE_REGEN = 'wae_regen',
}

type AIButtonContentMapProps = {
  [key in AIButtonType]: {
    icon?: string;
    textKey?: string;
    color?: string;
  };
}

export const aiButtonContentMap: AIButtonContentMapProps = {
  [AIButtonType.WAE_GEN]: {
    icon: wae_gen,
  },
  [AIButtonType.WAE_REGEN]: {
    icon: wae_regen,
  }
}
