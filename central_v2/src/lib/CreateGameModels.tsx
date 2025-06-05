import { 
    PublicPrivateType, 
    CentralQuestionTemplateInput, 
    IQuestionTemplate, 
    IGameTemplate,
    AnswerType
} from "@righton/networking";
import { CreateQuestionHighlightCard } from "./CentralModels";

// draft game type
// Create Game
export type TGameTemplateProps = {
  gameTemplate: IGameTemplate;
  isGameCardSubmitted: boolean;
  questionCount: number;
  openQuestionBank: boolean;
  openCreateQuestion: boolean;
  publicPrivateGame: PublicPrivateType;
  isGameCardErrored: boolean;
  isGameImageUploadVisible: boolean;
  isGameURLUploadVisible: boolean;
  isCreatingTemplate: boolean;
  isCloneGameImageChanged: boolean;
  image?: File | null;
  imageUrl?: string | undefined;
};

// draft questions 
export type TDraftQuestionsList = {
  publicPrivate: PublicPrivateType;
  isAIEnabled: boolean;
  isAIError: boolean;
  question: CentralQuestionTemplateInput;
  questionImageModalIsOpen: boolean;
  isCCSSVisibleModal: boolean;
  isImageUploadVisible: boolean;
  isImageURLVisible: boolean;
  isCreatingTemplate: boolean;
  isQuestionCardErrored: boolean;
  isQuestionCardSubmitted: boolean;
  isCloneQuestionImageChanged: boolean;
  highlightCard: CreateQuestionHighlightCard;
  isMultipleChoice: boolean;
  questionTemplate: IQuestionTemplate;
  isLibraryViewOnly: boolean;
};

// empty centralQuestionTemplate for creating question templates
export const newEmptyTemplate: CentralQuestionTemplateInput = {
    questionCard: {
      title: '',
      ccss: 'CCSS',
      isFirstEdit: true,
      isCardComplete: false,
    },
    correctCard: {
      answer: '',
      answerSteps: ['', '', ''],
      answerSettings: {
        answerType: AnswerType.MULTICHOICE,
      },
      isFirstEdit: true,
      isCardComplete: false,
    },
    incorrectCards: [
      {
        id: 'card-1',
        answer: '',
        explanation: '',
        isFirstEdit: true,
        isCardComplete: false,
      },
      {
        id: 'card-2',
        answer: '',
        explanation: '',
        isFirstEdit: true,
        isCardComplete: false,
      },
      {
        id: 'card-3',
        answer: '',
        explanation: '',
        isFirstEdit: true,
        isCardComplete: false,
      },
    ],
  };

  // empty question template
  export const emptyQuestionTemplate: IQuestionTemplate = {
    id: '',
    userId: '',
    publicPrivateType: PublicPrivateType.PUBLIC,
    title: '',
    lowerCaseTitle: '',
    version: 0,
    ccss: '',
    domain: '',
    cluster: '',
    grade: '',
    gradeFilter: '',
    standard: '',
    gameTemplatesCount: 0,
    timesPlayed: 0,
  };

  export const draftTemplate: TDraftQuestionsList = {
    publicPrivate: PublicPrivateType.PUBLIC,
    isAIEnabled: false,
    isAIError: false,
    question: newEmptyTemplate,
    questionImageModalIsOpen: false,
    isCCSSVisibleModal: false,
    isImageUploadVisible: false,
    isImageURLVisible: false,
    isCreatingTemplate: false,
    isQuestionCardErrored: false,
    isQuestionCardSubmitted: false,
    isCloneQuestionImageChanged: false,
    highlightCard: CreateQuestionHighlightCard.QUESTIONCARD,
    isMultipleChoice: true,
    isLibraryViewOnly: false,
    questionTemplate: emptyQuestionTemplate,
  };

  export type TPhaseTime = {
    phaseOne: string;
    phaseTwo: string;
  };

  export const newGameTemplate: IGameTemplate = {
    id: '',
    userId: '',
    publicPrivateType: PublicPrivateType.PUBLIC,
    title: '',
    lowerCaseTitle: '',
    owner: '',
    version: 0,
    description: '',
    lowerCaseDescription: '',
    phaseOneTime: 0,
    phaseTwoTime: 0,
    questionTemplatesCount: 0,
    questionTemplatesOrder: [],
    imageUrl: null,
    timesPlayed: 0,
    questionTemplates: [{ gameQuestionId: String(0), questionTemplate: emptyQuestionTemplate }],
  };

  export const gameTemplate: TGameTemplateProps = {
    gameTemplate: newGameTemplate,
    isGameCardErrored: false,
    isGameCardSubmitted: false,
    questionCount: 1,
    openCreateQuestion: false,
    openQuestionBank: false,
    publicPrivateGame: PublicPrivateType.PUBLIC,
    isGameImageUploadVisible: false,
    isGameURLUploadVisible: false,
    isCloneGameImageChanged: false,
    isCreatingTemplate: false,
    image: null,
    imageUrl: '',
  };