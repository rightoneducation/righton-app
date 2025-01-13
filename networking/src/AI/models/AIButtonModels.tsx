import waeGenIcon from '../icons/button/waeGen';
import waeRegenIcon from '../icons/button/waeRegen';

export enum AIButtonType {
  WAE_GEN = 'wae_gen',
  WAE_REGEN = 'wae_regen',
  WAE_REGENSUBMIT = 'wae_regensubmit',
}

type AIButtonContentMapProps = {
  [key in AIButtonType]: {
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
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
  },
  [AIButtonType.WAE_REGENSUBMIT]: {},
}

export type WaegenInput = {
  question: string;
  correctAnswer: string;
  wrongAnswer: string;
  discardedExplanations: string;
}

export type DiscardExplanation = {
  explanation: string;
  prompt: string;
  incorrectMath: boolean;
  toneClarity: boolean;
  other: boolean;
}

export type RegenInput = {
  question: string;
  correctAnswer: string;
  wrongAnswer: string;
  currentExplanation: string;
  currentPrompt: string;
  incorrectMath: boolean;
  toneClarity: boolean;
  other: boolean
  discardedExplanations?: DiscardExplanation[];
}