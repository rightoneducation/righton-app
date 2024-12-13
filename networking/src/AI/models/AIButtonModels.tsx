import waeGenIcon from '../icons/button/waeGen';
import waeRegenIcon from '../icons/button/waeRegen';

export enum AIButtonType {
  WAE_GEN = 'wae_gen',
  WAE_REGEN = 'wae_regen',
}

type AIButtonContentMapProps = {
  [key in AIButtonType]: {
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
    textKey?: string;
    color?: string;
  };
}

export const aiButtonContentMap: AIButtonContentMapProps = {
  [AIButtonType.WAE_GEN]: {
    icon: waeGenIcon,
  },
  [AIButtonType.WAE_REGEN]: {
    icon: waeRegenIcon,
  }
}

export type waegenInput = {
  question: {
    question: string;
    correctAnswer: string;
    wrongAnswer: string;
    discardedExplanations: string[];
  }
}