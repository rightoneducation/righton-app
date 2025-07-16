import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import {
  CentralQuestionTemplateInput,
  IncorrectCard,
  IQuestionTemplate,
  PublicPrivateType,
  GradeTarget,
  SortType,
  SortDirection,
  AnswerType,
  AnswerPrecision,
  IGameTemplate,
  CloudFrontDistributionUrl
} from '@righton/networking';
import { Box, Fade } from '@mui/material';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameBoxContainer,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import ViewQuestionCards from '../components/question/ViewQuestionCards';
import {
  CreateQuestionHighlightCard,
  LibraryTabEnum,
  ScreenSize,
  StorageKey,
  TemplateType,
  GameQuestionType,
} from '../lib/CentralModels';
import { timeLookup } from '../components/cards/creategamecard/time';
import {
  TGameTemplateProps,
  TDraftQuestionsList,
  draftTemplate,
  TPhaseTime,
  gameTemplate,
  emptyQuestionTemplate,
} from '../lib/CreateGameModels';
import DiscardModal from '../components/modal/DiscardModal';
import ModalBackground from '../components/modal/ModalBackground';
import CreatingTemplateModal from '../components/modal/CreatingTemplateModal';
import CreateGameComponent from '../components/game/CreateGameComponent';
import QuestionElements from '../components/game/QuestionGridItems';
import LibraryTabsQuestions from '../components/librarytabs/LibraryTabsQuestions';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import ImageUploadModal from '../components/modal/ImageUploadModal';
import CreateGameImageUploadModal from '../components/cards/creategamecard/CreateGameImageUpload';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import {
  assembleQuestionTemplate,
  updateGameTitle,
  updateGameDescription,
  updateGameTemplatePhaseTime,
  updatePhaseTime,
  toggleCreateQuestion,
  toggleQuestionBank,
  updateGameImageChange,
  updateGameImageSave,
  buildGameTemplate,
  buildEditedGameTemplate,
  checkGameFormIsValid,
  buildGameQuestionPromises,
  createGameImagePath,
} from '../lib/helperfunctions/createGame/CreateGameTemplateHelperFunctions';
import {
  checkDQsAreValid,
  buildRemoveQuestionTemplatePromises,
  buildQuestionTemplatePromises,
  updatePublicPrivateAtIndex,
  updateAIIsEnabledAtIndex,
  updateQuestionImageChangeAtIndex,
  updateQuestionImageSaveAtIndex,
  updateQuestionTitleChangeAtIndex,
  updateCorrectAnswerAtIndex,
  updateCorrectAnswerStepsAtIndex,
  updateQuestionAnswerTypeAtIndex,
  updateCloseQuestionModelAtIndex,
  handleCardClickAtIndex,
  updateCCSSAtIndex,
  updateNextButtonClickAtIndex,
  updateIncorrectCardStackAtIndex,
  updateCCSSClickAtIndex,
  updateAIErrorAtIndex,
  updateImageUploadClickAtIndex,
  openModalAtIndex,
  buildLibraryQuestionAtIndex,
  updateDraftListWithLibraryQuestion,
  handleQuestionListErrors,
} from '../lib/helperfunctions/createGame/CreateQuestionsListHelpers';
import { updateDQwithAnswerSettings } from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import {
  useCentralDataDispatch,
  useCentralDataState,
} from '../hooks/context/useCentralDataContext';

interface CreateGameProps {
  screenSize: ScreenSize;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  fetchElement: (type: GameQuestionType, id: string) => void;
  fetchElements: (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
    isFromLibrary?: boolean,
  ) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  loadMore: () => void;
}

export default function CreateGame({
  screenSize,
  setIsTabsOpen,
  fetchElement,
  fetchElements,
  handleChooseGrades,
  handleSearchChange,
  handleSortChange,
  loadMore,
}: CreateGameProps) {
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const route = useMatch('/clone/game/:type/:gameId');
  const editRoute = useMatch('/edit/game/:type/:gameId');
  const isClone =
    route?.params.gameId !== null &&
    route?.params.gameId !== undefined &&
    route?.params.gameId.length > 0;
  const isEdit =
    editRoute?.params.gameId !== null &&
    editRoute?.params.gameId !== undefined &&
    editRoute?.params.gameId.length > 0;
  const isEditDraft = 
    editRoute?.params.type === 'Draft';
  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState<boolean>(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [iconButtons, setIconButtons] = useState<number[]>([1]);
  const [draftGame, setDraftGame] = useState<TGameTemplateProps>(gameTemplate);
  const [originalGameType, setOriginalGameType] = useState<PublicPrivateType>(gameTemplate.gameTemplate.publicPrivateType);
  const [originalGameImageUrl, setOriginalGameImageUrl] = useState<string>('');
  // used when saving an edited game
  const [originalQuestionTemplates, setOriginalQuestionTemplates] = useState<
    IQuestionTemplate[]
  >([]);
  const [removedQuestionTemplateIds, setRemovesQuestionTemplateIds] = useState<
    string[]
  >([]);
  const [draftQuestionsList, setDraftQuestionsList] = useState<
    TDraftQuestionsList[]
  >([]);
  const [originalQuestionImageUrls, setOriginalQuestionImageUrls] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const [phaseTime, setPhaseTime] = useState<TPhaseTime>({
    phaseOne: '',
    phaseTwo: '',
  });

  const openModal = openModalAtIndex(
    draftGame,
    draftQuestionsList,
    selectedQuestionIndex,
  );
  const gameFormIsValid = checkGameFormIsValid(draftGame);
  const allDQAreValid = checkDQsAreValid(draftQuestionsList);
  // const hasGameError = (draftGame.isGameCardErrored && !gameFormIsValid)
  // || (draftGame.isGameCardSubmitted && (!gameFormIsValid || !allDQAreValid));

  let label = 'Create';
  let selectedGameId = '';
  switch (true) {
    case isEdit:
      label = 'Edit';
      selectedGameId = editRoute?.params.gameId || '';
      break;
    case isClone:
      label = 'Clone';
      selectedGameId = route?.params.gameId || '';
      break;
    default:
      label = 'Create';
      break;
  }

  /** CREATE GAME HANDLERS START HERE */
  const handleGameTitle = (val: string) => {
    setDraftGame((prev) => updateGameTitle(prev, val));
  };

  const handleGameDescription = (val: string) => {
    setDraftGame((prev) => updateGameDescription(prev, val));
  };

  const handlePhaseTime = (time: TPhaseTime) => {
    setDraftGame((prev) => updateGameTemplatePhaseTime(prev, time));
    setPhaseTime((prev) => updatePhaseTime(time));
  };

  const handleOpenCreateQuestion = () => {
    setDraftGame((prev) => toggleCreateQuestion(prev, gameFormIsValid));
  };

  const handleOpenQuestionBank = () => {
    setDraftGame((prev) => toggleQuestionBank(prev, gameFormIsValid));
  };

  const handlePublicPrivateGameChange = (value: PublicPrivateType) => {
    const isPublicPrivateMatch = draftQuestionsList.every(
      (question) => question.publicPrivate === value,
    );
    if (!isPublicPrivateMatch) {
      const newDraft = [{ ...draftTemplate, publicPrivate: value }];
      setDraftQuestionsList(newDraft);
      setIconButtons([1]);
      setSelectedQuestionIndex(0);
      setDraftGame((prev) => ({
        ...prev,
        gameTemplate: {
          ...prev.gameTemplate,
          publicPrivateType: value,
        },
        questionCount: newDraft.length,
        // isGameCardErrored: false,
      }));
      return;
    }
    setDraftGame((prev) => ({
      ...prev,
      gameTemplate: {
        ...prev.gameTemplate,
        publicPrivateType: value,
      },
    }));
    setDraftQuestionsList((prev) => updatePublicPrivateAtIndex(prev, value));
  };

  const handleDiscardGame = () => {
    setIsDiscardModalOpen(true);
  };

  const handleDiscardClick = (value: boolean) => {
    if (value) {
      setIsDiscardModalOpen(false);
      window.localStorage.setItem(StorageKey, '');
      navigate('/');
      return;
    }
    setIsDiscardModalOpen(false);
  };

  const handleGameImageUploadClick = () => {
    setDraftGame((prev) => ({
      ...prev,
      isGameImageUploadVisible: !prev.isGameImageUploadVisible,
    }));
  };

  const handleCloseGameCardModal = () => {
    setDraftGame((prev) => ({ ...prev, isGameImageUploadVisible: false }));
  };

  const handleGameImageSave = async (inputImage?: File, inputUrl?: string) => {
    setDraftGame((prev) => updateGameImageSave(prev, inputImage, inputUrl));
  };

  const handleGameImageChange = async (
    inputImage?: File,
    inputUrl?: string,
  ) => {
    setDraftGame((prev) => updateGameImageChange(prev, inputImage, inputUrl));
  };

  const handleUpdateEditedGame = async () => {
    try {
      setDraftGame((prev) => ({
        ...prev,
        isGameCardSubmitted: true,
      }));
      setIsUpdatingTemplate(true);
      const dqValid = checkDQsAreValid(draftQuestionsList);
      if (gameFormIsValid && dqValid) {
        // check if game img has been changed
        let gameImgUrl: string | null = null;
        if (
          draftGame.imageUrl !== originalGameImageUrl ||
          draftGame.isCloneGameImageChanged
        ) {
          gameImgUrl = await createGameImagePath(draftGame, apiClients);
        } else {
          gameImgUrl = draftGame.imageUrl || null;
        }
        const userId = centralData.userProfile?.id || '';

        // need to generate two arrays of promises, one for questions removed from game, one for new questions created for game
        // newly created questions are handled just like in regular Create Game flow
        const newQuestions = draftQuestionsList.filter(
          (dq) => !dq.questionTemplate.id,
        );
        const newQuestionPromises = buildQuestionTemplatePromises(
          newQuestions,
          userId,
          apiClients,
        );
        const newQuestionPromisesResponse =
          await Promise.all(newQuestionPromises);

        const newQuestionTemplateIds = newQuestionPromisesResponse.map(
          (question) => String(question?.id),
        );
        // array to store newly added CCSSDescriptions
        const newQuestionTemplateCCSS = newQuestionPromisesResponse.map(
          (question) => String(question?.ccssDescription),
        );

        // added questions are those added from question bank (they are already created so have ids)
        const addedQuestionTemplateIds = draftQuestionsList
          .filter((dq) => dq.questionTemplate.id)
          .map((draftQuestion) => draftQuestion.questionTemplate.id);

        const filteredQuestionTemplateIds = addedQuestionTemplateIds.filter(
          (dq) => !originalQuestionTemplates.map((oq) => oq.id).includes(dq),
        );
        const questionTemplateIds = [
          ...newQuestionTemplateIds,
          ...filteredQuestionTemplateIds,
        ];

        const addedQuestionTemplates = draftQuestionsList
          .filter((dq) => filteredQuestionTemplateIds.includes(dq.questionTemplate.id))

        const addQuestionTemplateCCSS = addedQuestionTemplates
          .map((draftQuestion) => String(draftQuestion.questionTemplate.ccssDescription));

        // make sure we have a gameTemplate id as well as question template ids before creating a game question
        if (draftGame.gameTemplate.id && questionTemplateIds.length > 0) {
          try {
            const createGameQuestions = buildGameQuestionPromises(
              draftGame,
              draftGame.gameTemplate.id,
              questionTemplateIds,
              apiClients,
            );
            // create new gameQuestion with gameTemplate.id & questionTemplate.id pairing
            await Promise.all(createGameQuestions);
          } catch (err) {
            setDraftGame((prev) => ({ ...prev, isCreatingTemplate: false }));
            console.error(`Failed to create one or more game questions:`, err);
          }
        }
        try {
          // removed questions are handled by removing deleting the associated gameQuestions object
          const removedQuestionPromises = buildRemoveQuestionTemplatePromises(
            removedQuestionTemplateIds,
            draftGame.gameTemplate,
            userId,
            apiClients,
          );
          await Promise.all(removedQuestionPromises);

          const existingQuestionTemplateCCSS = draftGame?.gameTemplate?.questionTemplates?.filter((qt) => !removedQuestionTemplateIds.includes(qt.questionTemplate.id)).map((template) => template.questionTemplate.ccssDescription);
          const newCCSSDescription = [
            ...(existingQuestionTemplateCCSS || []),
            ...addQuestionTemplateCCSS,
            ...newQuestionTemplateCCSS,
          ].join(' ');

          // update questionTemplateCount in gameTemplate
          const newQuestionTemplateCount =
            draftGame.gameTemplate.questionTemplatesCount +
            questionTemplateIds.length -
            removedQuestionTemplateIds.length;

          const updatedDraftGame = {
            ...draftGame,
            gameTemplate: {
              ...draftGame.gameTemplate,
              questionTemplatesCount: newQuestionTemplateCount,
            },
          };
          const updatedGame = buildEditedGameTemplate(
            updatedDraftGame,
            userId,
            draftQuestionsList,
            gameImgUrl,
            newCCSSDescription
          );
          const gameTemplateResponse =
            await apiClients.gameTemplate.updateGameTemplate(
              draftGame.gameTemplate.publicPrivateType,
              updatedGame,
            );
            setIsUpdatingTemplate(false);
        } catch (err) {
          console.log(err);
        }

        setDraftGame((prev) => ({
          ...prev,
          isCreatingTemplate: false,
          isGameCardSubmitted: false,
        }));
        centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: '' });
        fetchElements();
        navigate('/');
      } else {
        setDraftGame((prev) => ({
          ...prev,
          ...(!gameFormIsValid && { isGameCardErrored: true }),
          isCreatingTemplate: false,
        }));
        if (!allDQAreValid) {
          setDraftQuestionsList((prev) => handleQuestionListErrors(prev));
          // then find first errored card and set index to that question
        }
      }
    } catch (err) {
      setDraftGame((prev) => ({ ...prev, isCreatingTemplate: false }));
    }
  };

  const handleSaveGame = async () => {
    try {
      setDraftGame((prev) => ({
        ...prev,
        isGameCardSubmitted: true,
        isCreatingTemplate: true,
      }));
      // confirm game & question form validity
      if (gameFormIsValid && allDQAreValid) {
        // check for images on draft game
        let gameImgUrl: string | null = null;
        if (draftGame.image || draftGame.imageUrl) {
          if (
            (!draftGame?.imageUrl?.startsWith('https://') ||
            !draftGame?.imageUrl?.startsWith('http://')) && 
            draftGame?.imageUrl
          ) {
            gameImgUrl = draftGame.imageUrl;
          } else {
            if ( draftGame && draftGame.imageUrl && draftGame?.imageUrl?.length > 0){
              draftGame.imageUrl = `${CloudFrontDistributionUrl}${draftGame.imageUrl}`;
            }
            gameImgUrl = await createGameImagePath(draftGame, apiClients);
          }
      }
        const userId = centralData.userProfile?.id || '';
       
        try {
          if (draftQuestionsList.length > 0) {
            // convert questions to array of promises & write to db
            const newQuestionTemplates = buildQuestionTemplatePromises(
              draftQuestionsList.filter((dq) => !dq.questionTemplate.id),
              userId,
              apiClients,
            );
            const questionTemplateResponse =
              await Promise.all(newQuestionTemplates);
                       
            // create an array of all the ids from the response
            const questionTemplateCCSS = questionTemplateResponse.map(
              (question) => String(question?.ccssDescription),
            );

            // addedQuestionTemplates are those added from question bank (they are already created so have ids)
            const addedQuestionTemplates = draftQuestionsList.filter((dq) => dq.questionTemplate.id);
            const addQuestionTemplateCCSS = addedQuestionTemplates
              .map((draftQuestion) => String(draftQuestion.questionTemplate.ccssDescription));
            questionTemplateCCSS.push(...addQuestionTemplateCCSS);
            
            const createGame = buildGameTemplate(
              draftGame,
              userId,
              draftQuestionsList,
              gameImgUrl,
              questionTemplateCCSS
            );
            const gameTemplateResponse =
              await apiClients.gameTemplate.createGameTemplate(
              draftGame.gameTemplate.publicPrivateType,
              createGame,
            );
           
            // create an array of all the ids from the response
            let questionTemplateIds = questionTemplateResponse.map(
              (question) => String(question?.id),
            );

            const addedQuestionTemplatesIds = addedQuestionTemplates.map(
              (question) => String(question?.questionTemplate?.id),
            )

            questionTemplateIds = [...questionTemplateIds, ...addedQuestionTemplatesIds]

            // make sure we have a gameTemplate id as well as question template ids before creating a game question
            if (gameTemplateResponse.id && questionTemplateIds.length > 0) {
              try {
                const createGameQuestions = buildGameQuestionPromises(
                  draftGame,
                  gameTemplateResponse.id,
                  questionTemplateIds,
                  apiClients,
                );
                // create new gameQuestion with gameTemplate.id & questionTemplate.id pairing
                await Promise.all(createGameQuestions);
              } catch (err) {
                setDraftGame((prev) => ({
                  ...prev,
                  isCreatingTemplate: false,
                }));
                console.error(
                  `Failed to create one or more game questions:`,
                  err,
                );
              }
            }
          } else {
            // no question templates so ccss description not relevant
            const createGame = buildGameTemplate(
              draftGame,
              userId,
              draftQuestionsList,
              gameImgUrl,
            );

            await apiClients.gameTemplate.createGameTemplate(
              draftGame.gameTemplate.publicPrivateType,
              createGame,
            );
          }
        } catch (err) {
          console.error('Error creating game template:', err);
        }
        // update user stats
        const existingNumGames = centralData.userProfile?.gamesMade || 0;
        const existingNumQuestions =
          centralData.userProfile?.questionsMade || 0;
        const newNumGames = existingNumGames + 1;
        // add new questions to user number of questions
        const newNumQuestions =
          existingNumQuestions +
          draftQuestionsList.filter((dq) => !dq.questionTemplate.id).length;
        await apiClients.user.updateUser({
          id: centralData.userProfile?.id || '',
          gamesMade: newNumGames,
          questionsMade: newNumQuestions,
        });

        setDraftGame((prev) => ({
          ...prev,
          isCreatingTemplate: false,
          isGameCardSubmitted: false,
        }));
        fetchElements();
        navigate('/');
      } else {
        setDraftGame((prev) => ({
          ...prev,
          ...(!gameFormIsValid && { isGameCardErrored: true }),
          isCreatingTemplate: false,
        }));
        if (!allDQAreValid) {
          setDraftQuestionsList((prev) => handleQuestionListErrors(prev));
          // then find first errored card and set index to that question
        }
      }
    } catch (err) {
      setDraftGame((prev) => ({ ...prev, isCreatingTemplate: false }));
    }
  };

   const handleSaveEditedGame = async () => {
    try {
      if (draftGame.gameTemplate.publicPrivateType === originalGameType) {
        await handleUpdateEditedGame();
        return;
      }
      await handleSaveGame();
      await apiClients.gameTemplate.deleteGameTemplate(
          originalGameType,
          selectedGameId
      );
      fetchElements(LibraryTabEnum.PUBLIC, '', null , true);
      fetchElements(LibraryTabEnum.PRIVATE, '', null , true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateFromDraftGame = async () => {
    try{
      const updatedDraftGame: typeof draftGame = {
        ...draftGame,
        isGameCardSubmitted: true,
        isCreatingTemplate: true,
        gameTemplate: {
          ...draftGame.gameTemplate,
          publicPrivateType: draftGame.gameTemplate.publicPrivateType === PublicPrivateType.DRAFT ?
            PublicPrivateType.PUBLIC : draftGame.gameTemplate.publicPrivateType,
        }
      }
       setDraftGame(updatedDraftGame);
      // confirm game & question form validity
      if (gameFormIsValid && allDQAreValid) {
        // check for images on draft game
        let gameImgUrl: string | null = null;
        if (updatedDraftGame.image || updatedDraftGame.imageUrl) {
          if (
            (!updatedDraftGame?.imageUrl?.startsWith('https://') ||
            !updatedDraftGame?.imageUrl?.startsWith('http://')) && 
            updatedDraftGame?.imageUrl
          ) {
            gameImgUrl = updatedDraftGame.imageUrl;
          } else {
            if ( updatedDraftGame && updatedDraftGame.imageUrl && updatedDraftGame?.imageUrl?.length > 0){
             updatedDraftGame.imageUrl = `${CloudFrontDistributionUrl}${updatedDraftGame.imageUrl}`;
            }
            gameImgUrl = await createGameImagePath(updatedDraftGame, apiClients);
          }
        }
        const userId = centralData.userProfile?.id || '';
       
        try {
          if (draftQuestionsList.length > 0) {
            // convert questions to array of promises & write to db
            const newQuestionTemplates = buildQuestionTemplatePromises(
              draftQuestionsList.filter((dq) => !dq.questionTemplate.id),
              userId,
              apiClients,
            );
            const questionTemplateResponse =
              await Promise.all(newQuestionTemplates);
                       
            // create an array of all the ids from the response
            const questionTemplateCCSS = questionTemplateResponse.map(
              (question) => String(question?.ccssDescription),
            );

            // addedQuestionTemplates are those added from question bank (they are already created so have ids)
            const addedQuestionTemplates = draftQuestionsList.filter((dq) => dq.questionTemplate.id);
            const addQuestionTemplateCCSS = addedQuestionTemplates
              .map((draftQuestion) => String(draftQuestion.questionTemplate.ccssDescription));
            questionTemplateCCSS.push(...addQuestionTemplateCCSS);
            
            const createGame = buildGameTemplate(
              updatedDraftGame,
              userId,
              draftQuestionsList,
              gameImgUrl,
              questionTemplateCCSS
            );
            const gameTemplateResponse =
              await apiClients.gameTemplate.createGameTemplate(
              updatedDraftGame.gameTemplate.publicPrivateType,
              createGame,
            );
            if (gameTemplateResponse && selectedGameId) {
              await apiClients.gameTemplate.deleteGameTemplate(
                PublicPrivateType.DRAFT,
                selectedGameId
              )
            }
            // create an array of all the ids from the response
            let questionTemplateIds = questionTemplateResponse.map(
              (question) => String(question?.id),
            );

            const addedQuestionTemplatesIds = addedQuestionTemplates.map(
              (question) => String(question?.questionTemplate?.id),
            )

            questionTemplateIds = [...questionTemplateIds, ...addedQuestionTemplatesIds]

            // make sure we have a gameTemplate id as well as question template ids before creating a game question
            if (gameTemplateResponse.id && questionTemplateIds.length > 0) {
              try {
                questionTemplateIds = Array.from(new Set(questionTemplateIds));
                const createGameQuestions = buildGameQuestionPromises(
                  updatedDraftGame,
                  gameTemplateResponse.id,
                  questionTemplateIds,
                  apiClients
                );
                // create new gameQuestion with gameTemplate.id & questionTemplate.id pairing
                await Promise.all(createGameQuestions);
              } catch (err) {
                setDraftGame((prev) => ({
                  ...prev,
                  isCreatingTemplate: false,
                }));
                console.error(
                  `Failed to create one or more game questions:`,
                  err,
                );
              }
            }
          } else {
            // no question templates so ccss description not relevant
            const createGame = buildGameTemplate(
              updatedDraftGame,
              userId,
              draftQuestionsList,
              gameImgUrl,
            );

            const gameTemplateResponse = await apiClients.gameTemplate.createGameTemplate(
              updatedDraftGame.gameTemplate.publicPrivateType,
              createGame,
            );
             if (gameTemplateResponse && selectedGameId) {
              await apiClients.gameTemplate.deleteGameTemplate(
                PublicPrivateType.DRAFT,
                selectedGameId
              )
            }
          }

        } catch (err) {
          console.error('Error creating game template:', err);
        }
        // update user stats
        const existingNumGames = centralData.userProfile?.gamesMade || 0;
        const existingNumQuestions =
          centralData.userProfile?.questionsMade || 0;
        const newNumGames = existingNumGames + 1;
        // add new questions to user number of questions
        const newNumQuestions =
          existingNumQuestions +
          draftQuestionsList.filter((dq) => !dq.questionTemplate.id).length;
        await apiClients.user.updateUser({
          id: centralData.userProfile?.id || '',
          gamesMade: newNumGames,
          questionsMade: newNumQuestions,
        });

        setDraftGame((prev) => ({
          ...prev,
          isCreatingTemplate: false,
          isGameCardSubmitted: false,
        }));
        fetchElements();
        navigate('/');
      } else {
        setDraftGame((prev) => ({
          ...prev,
          ...(!gameFormIsValid && { isGameCardErrored: true }),
          isCreatingTemplate: false,
        }));
        if (!allDQAreValid) {
          setDraftQuestionsList((prev) => handleQuestionListErrors(prev));
          // then find first errored card and set index to that question
        }
      }
    } catch (err) {
      setDraftGame((prev) => ({ ...prev, isCreatingTemplate: false }));
    }
  };

  const handleSave = async () => {
    if (isEditDraft)
      return handleCreateFromDraftGame();
    if (isEdit)
      return handleSaveEditedGame();
    return handleSaveGame();
  };


  const handleSaveDraftGame = async () => {
    try {
      if (!draftGame.gameTemplate.title) {
        setDraftGame((prev) => ({
          ...prev,
          isDraftGameErrored: true,
        }));
        return;
      }
      const draftGameCopy = {
        ...draftGame,
        publicPrivateGame: PublicPrivateType.DRAFT,
        isGameCardSubmitted: true,
        isCreatingTemplate: true,
      };
      setDraftGame(draftGameCopy);
      // check for images on draft game
      let gameImgUrl: string | null = null;
      if (draftGame.image || draftGame.imageUrl) {
        if (
          (!draftGame?.imageUrl?.startsWith('https://') ||
          !draftGame?.imageUrl?.startsWith('http://')) && 
          draftGame?.imageUrl
        ) {
          gameImgUrl = draftGame.imageUrl;
        } else {
          gameImgUrl = await createGameImagePath(draftGame, apiClients);
        }
      }
      const userId = centralData.userProfile?.id || '';

       // convert questions to array of promises & write to db
      const newQuestionTemplates = buildQuestionTemplatePromises(
        draftQuestionsList.filter((dq) => !dq.questionTemplate.id),
        userId,
        apiClients,
        PublicPrivateType.DRAFT,
      );
      const questionTemplateResponse = await Promise.all(newQuestionTemplates);

      // extract ccssDescription from question templates
      const questionTemplateCCSS = questionTemplateResponse.map(
        (question) => String(question?.ccssDescription),
      );

      // addedQuestionTemplates are those added from question bank (they are already created so have ids)
      const addedQuestionTemplates = draftQuestionsList.filter((dq) => dq.questionTemplate.id);
      const addQuestionTemplateCCSS = addedQuestionTemplates
        .map((draftQuestion) => String(draftQuestion.questionTemplate.ccssDescription));
      questionTemplateCCSS.push(...addQuestionTemplateCCSS);
      
      // create & store game template in variable to retrieve id after response
      const createGame = buildGameTemplate(
        draftGameCopy,
        userId,
        draftQuestionsList,
        gameImgUrl,
        questionTemplateCCSS
      );
      const gameTemplateResponse =
        await apiClients.gameTemplate.createGameTemplate(
          PublicPrivateType.DRAFT,
          createGame,
        );
     
      // create an array of all the ids from the response
      let questionTemplateIds = questionTemplateResponse.map((question) =>
        String(question?.id),
      );

      const addedQuestionTemplatesIds = addedQuestionTemplates.map(
        (question) => String(question?.questionTemplate?.id),
      )

      questionTemplateIds = [...questionTemplateIds, ...addedQuestionTemplatesIds]

      // make sure we have a gameTemplate id as well as question template ids before creating a game question
      if (gameTemplateResponse.id && questionTemplateIds.length > 0) {
        try {
          const createGameQuestions = buildGameQuestionPromises(
            draftGameCopy,
            gameTemplateResponse.id,
            questionTemplateIds,
            apiClients,
            PublicPrivateType.DRAFT,
          );
          // create new gameQuestion with gameTemplate.id & questionTemplate.id pairing
          await Promise.all(createGameQuestions);
        } catch (err) {
          setDraftGame((prev) => ({ ...prev, isCreatingTemplate: false }));
          console.error(`Failed to create one or more game questions:`, err);
        }
      }

      setDraftGame((prev) => ({
        ...prev,
        isCreatingTemplate: false,
        isGameCardSubmitted: false,
      }));
      fetchElements();
      navigate('/');
    } catch (err) {
      console.error(`HandleSaveGame - error: `, err);
    }
  };

  const handleUpdateDraftGame = async () => {
     try {
      setIsUpdatingTemplate(true);
      if (!draftGame.gameTemplate.title) {
        setDraftGame((prev) => ({
          ...prev,
          isDraftGameErrored: true,
        }));
        return;
      }
      const draftGameCopy = {
        ...draftGame,
        publicPrivateGame: PublicPrivateType.DRAFT,
        isGameCardSubmitted: true,
        isCreatingTemplate: true,
      };
      setDraftGame(draftGameCopy);
      // check for images on draft game
      let gameImgUrl: string | null = null;
      if (draftGame.image || draftGame.imageUrl) {
        if (
          (!draftGame?.imageUrl?.startsWith('https://') ||
          !draftGame?.imageUrl?.startsWith('http://')) && 
          draftGame?.imageUrl
        ) {
          gameImgUrl = draftGame.imageUrl;
        } else {
          gameImgUrl = await createGameImagePath(draftGame, apiClients);
        }
      }
      const userId = centralData.userProfile?.id || '';

      // create & store game template in variable to retrieve id after response
      const createGame = buildGameTemplate(
        draftGameCopy,
        userId,
        draftQuestionsList,
        gameImgUrl
      );
      const gameTemplateResponse =
        await apiClients.gameTemplate.updateGameTemplate(
          PublicPrivateType.DRAFT,
          {...createGame, id: selectedGameId},
        );

      setDraftGame((prev) => ({
        ...prev,
        isCreatingTemplate: false,
        isGameCardSubmitted: false,
      }));
      setIsUpdatingTemplate(false);
      fetchElements();
      navigate('/');
    } catch (err) {
      console.error(`HandleSaveGame - error: `, err);
    }
  }

  const handleDraftSave = () => {
    if (isEditDraft) {
      return handleUpdateDraftGame();
    }
    return handleSaveDraftGame();
  }

  /** END OF CREATE GAME HANDLERS  */



  /** CREATE QUESTION HANDLERS START */
  const handlePublicPrivateQuestionChange = (value: PublicPrivateType) => {
    setDraftQuestionsList((prev) => updatePublicPrivateAtIndex(prev, value));
  };

  const handleAIIsEnabled = () => {
    setDraftQuestionsList((prev) =>
      updateAIIsEnabledAtIndex(prev, selectedQuestionIndex),
    );
  };

  const handleImageChange = async (inputImage?: File, inputUrl?: string) => {
    setDraftQuestionsList((prev) =>
      updateQuestionImageChangeAtIndex(
        prev,
        selectedQuestionIndex,
        inputImage,
        inputUrl,
      ),
    );
  };

  const handleImageSave = async (inputImage?: File, inputUrl?: string) => {
    setDraftQuestionsList((prev) =>
      updateQuestionImageSaveAtIndex(
        prev,
        selectedQuestionIndex,
        inputImage,
        inputUrl,
      ),
    );
  };

  const handleDebouncedTitleChange = useCallback(
    // eslint-disable-line
    (title: string) => {
      setDraftQuestionsList((prev) =>
        updateQuestionTitleChangeAtIndex(prev, selectedQuestionIndex, title),
      );
    },
    [selectedQuestionIndex],
  );

  const handleDebouncedCorrectAnswerChange = useCallback(
    // eslint-disable-line
    (
      correctAnswer: string,
      draftQuestionInput: CentralQuestionTemplateInput,
    ) => {
      setDraftQuestionsList((prev) =>
        updateCorrectAnswerAtIndex(prev, selectedQuestionIndex, correctAnswer),
      );
    },
    [selectedQuestionIndex],
  );

  const handleDebouncedCorrectAnswerStepsChange = useCallback(
    // eslint-disable-line
    (steps: string[], draftQuestionInput: CentralQuestionTemplateInput) => {
      setDraftQuestionsList((prev) =>
        updateCorrectAnswerStepsAtIndex(prev, selectedQuestionIndex, steps),
      );
    },
    [selectedQuestionIndex],
  );

  const handleAnswerSettingsChange = (
    draftQuestionInput: CentralQuestionTemplateInput,
    answerType: AnswerType,
    answerPrecision?: AnswerPrecision,
  ) => {
    setDraftQuestionsList((prev) => {
      return prev.map((draftItem, i) => {
        if (i === selectedQuestionIndex) {
          const currentDraftQuestion = draftItem.question;
          const newQuestion = updateDQwithAnswerSettings(
            currentDraftQuestion,
            answerType,
            answerPrecision,
          );
          return {
            ...draftItem,
            question: newQuestion,
          };
        }
        return draftItem;
      });
    });
  };

  const handleAnswerType = () => {
    setDraftQuestionsList((prev) =>
      updateQuestionAnswerTypeAtIndex(prev, selectedQuestionIndex),
    );
  };

  const handleCloseQuestionModal = () => {
    setIsDiscardModalOpen(false);
    setIsUpdatingTemplate(false);
    if (draftGame.isGameImageUploadVisible) {
      setDraftGame((prev) => ({ ...prev, isGameImageUploadVisible: false }));
    }
    setDraftQuestionsList((prev) =>
      updateCloseQuestionModelAtIndex(prev, selectedQuestionIndex),
    );
  };

  const handleClick = (cardType: CreateQuestionHighlightCard) => {
    setDraftQuestionsList((prev) =>
      handleCardClickAtIndex(prev, selectedQuestionIndex, cardType),
    );
  };

  const handleCCSSSubmit = (ccssString: string) => {
    setDraftQuestionsList((prev) =>
      updateCCSSAtIndex(prev, selectedQuestionIndex, ccssString),
    );
  };

  const handleNextCardButtonClick = (cardData: IncorrectCard) => {
    setDraftQuestionsList((prev) =>
      updateNextButtonClickAtIndex(prev, selectedQuestionIndex, cardData),
    );
  };

  const handleIncorrectCardStackUpdate = (
    cardData: IncorrectCard,
    draftQuestionInput: CentralQuestionTemplateInput,
    completeAnswers: IncorrectCard[],
    incompleteAnswers: IncorrectCard[],
    isAIEnabledCard?: boolean,
  ) => {
    setDraftQuestionsList((prev) =>
      updateIncorrectCardStackAtIndex(
        prev,
        selectedQuestionIndex,
        cardData,
        completeAnswers,
        incompleteAnswers,
        isAIEnabledCard,
      ),
    );
  };

  const handleCCSSClicks = () => {
    setDraftQuestionsList((prev) =>
      updateCCSSClickAtIndex(prev, selectedQuestionIndex),
    );
  };

  const handleAIError = () => {
    setDraftQuestionsList((prev) =>
      updateAIErrorAtIndex(prev, selectedQuestionIndex),
    );
  };

  const handleQuestionImageUploadClick = () => {
    setDraftQuestionsList((prev) =>
      updateImageUploadClickAtIndex(prev, selectedQuestionIndex),
    );
  };

  const handleSaveQuestion = async () => {
    try {
      // Make sure all cards are completed for question.
      if (!allDQAreValid) {
        return;
      }
      const userId = centralData.userProfile?.id || '';
      // process valid questions in order
      const questionTemplate = buildQuestionTemplatePromises(
        draftQuestionsList,
        userId,
        apiClients,
      );
      await Promise.all(questionTemplate);

      // Reset data and re-direct user
      setDraftQuestionsList([]);
      fetchElements();
      navigate('/');
    } catch (err) {
      console.error('Error during save process:', err);
    }
  };

  /** END OF CREATE QUESTION HANDLERS  */

  /** LIBRARY HANDLER HELPERS */
  const getLabel = (screen: ScreenSize, isSelected: boolean, value: string) => {
    if (screen === ScreenSize.LARGE) return value;
    if (screen === ScreenSize.MEDIUM && isSelected) return value;
    return '';
  };

  const handleView = (
    question: IQuestionTemplate,
    questions: IQuestionTemplate[],
  ) => {
    const libraryQuestion = buildLibraryQuestionAtIndex(
      question,
      draftGame.gameTemplate.publicPrivateType,
    );
    const { updatedList, addNew } = updateDraftListWithLibraryQuestion(
      draftQuestionsList,
      selectedQuestionIndex,
      libraryQuestion,
    );
    setDraftQuestionsList(updatedList);
    setDraftGame((prevGame) => ({
      ...prevGame,
      openQuestionBank: false,
      openCreateQuestion: true,
      ...(addNew && { questionCount: prevGame.questionCount + 1 }),
    }));
    setSelectedQuestionIndex((prevIndex) =>
      addNew && prevIndex !== 0 ? prevIndex + 1 : prevIndex,
    );
    setIconButtons((prevButtons) =>
      addNew ? [...prevButtons, prevButtons.length + 1] : prevButtons,
    );
  };

  /** LIBRARY HANDLER HELPERS */

  // game questions index handlers
  const handleQuestionIndexChange = (index: number) => {
    setSelectedQuestionIndex(index);
    if (draftGame.openQuestionBank) {
      setDraftGame((prev) => toggleCreateQuestion(draftGame, gameFormIsValid));
    }
  };

  const handleAddMoreQuestions = () => {
    const numOfQuestions = draftQuestionsList.length;
    setDraftQuestionsList((prev) => [
      ...prev,
      {
        ...draftTemplate,
        publicPrivate: draftGame.gameTemplate.publicPrivateType,
      },
    ]);
    setDraftGame((prev) => ({
      ...prev,
      questionCount: prev.questionCount + 1,
      isGameCardSubmitted: false,
    }));
    setIconButtons((prev) => [...prev, prev.length + 1]);
    const newIndex = numOfQuestions;
    setSelectedQuestionIndex(newIndex);
  };

  const handleDeleteQuestion = (index: number) => {
    if (index === 0 && draftQuestionsList.length === 1) {
      setDraftQuestionsList([]);
      setDraftGame((prev) => ({
        ...prev,
        questionCount: 0,
        isGameCardSubmitted: false,
      }));
      setIconButtons([]);
      setSelectedQuestionIndex(0);
      setRemovesQuestionTemplateIds((prev) => {
        const questionId = draftQuestionsList[index].questionTemplate.id;
        if (questionId && questionId.length > 0) {
          return [...prev, questionId];
        }
        return prev;
      });
      return;
    }
    setRemovesQuestionTemplateIds((prev) => {
      const questionId = draftQuestionsList[index].questionTemplate.id;
      if (questionId && questionId.length > 0) {
        return [...prev, questionId];
      }
      return prev;
    });

    setDraftQuestionsList((prev) => {
      return prev.filter((_, i) => i !== index);
    });
    setDraftGame((prev) => ({
      ...prev,
      questionCount: prev.questionCount - 1,
      isGameCardSubmitted: false,
    }));
    setIconButtons((prev) => prev.filter((_, i) => i !== index));
    setSelectedQuestionIndex(0);
  };
  const handleDiscard = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };
  useEffect(() => {
    setIsLoading(false);
    centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: '' });
    const selected = centralData.selectedGame;
    const title = selected?.game?.title;
    if (selected !== null && (isClone || isEdit)) {
      // regex to detect (clone of) in title
      const regex = /\(Clone of\)/i;
      if (selected?.game && title && !regex.test(title) && isClone)
        selected.game.title = `(Clone of) ${title}`;
      if (selected.game) {
        setDraftGame((prev) => ({
          ...prev,
          gameTemplate: selected.game as IGameTemplate,
          openCreateQuestion: true,
          imageUrl: selected?.game?.imageUrl ?? '',
        }));
      }
      setOriginalGameImageUrl(selected.game?.imageUrl ?? '');
      setPhaseTime({
        phaseOne: timeLookup(selected.game?.phaseOneTime ?? 0),
        phaseTwo: timeLookup(selected.game?.phaseTwoTime ?? 0),
      });
      const originals = selected?.game?.questionTemplates;
      if (originals && originals.length > 0) {
        const oqTemplates = originals.map((q) => q.questionTemplate);
        setOriginalQuestionTemplates(oqTemplates);
      }
      const assembled = originals?.map((q) =>
        assembleQuestionTemplate(q.questionTemplate),
      );

      if (originals && assembled && assembled.length > 0) {
        setDraftQuestionsList(() =>
          originals.map((orig, i) => {
            setOriginalQuestionImageUrls((prev) => [
              ...prev,
              orig.questionTemplate.imageUrl ?? '',
            ]);
            return {
              ...draftTemplate,
              question: assembled[i],
              questionTemplate: orig.questionTemplate,
              isLibraryViewOnly: true,
            };
          }),
        );
      }
    }
    if (
      !centralData.selectedGame?.game &&
      selectedGameId &&
      (isClone || isEdit)
    ) {
      setIsLoading(true);
      fetchElement(GameQuestionType.GAME, selectedGameId);
    }
  }, [centralData.selectedGame, route, selectedGameId]); // eslint-disable-line
  return (
    <CreateGameMainContainer>
      <CreateGameBackground />
      {/* Modals for Question (below) */}
      <ModalBackground
        isModalOpen={openModal || isDiscardModalOpen || draftGame.isCreatingTemplate || isUpdatingTemplate}
        handleCloseModal={handleCloseQuestionModal}
      />
      <DiscardModal
        isModalOpen={isDiscardModalOpen}
        screenSize={screenSize}
        handleDiscardClick={handleDiscardClick}
      />
      <CreatingTemplateModal
        isModalOpen={draftGame.isCreatingTemplate || isUpdatingTemplate}
        isUpdatingTemplate={isUpdatingTemplate}
        templateType={TemplateType.GAME}
      />

      {/* tracks ccss state according to index */}
      {draftQuestionsList.length > 0 &&
        selectedQuestionIndex !== null &&
        draftQuestionsList[selectedQuestionIndex] != null &&
        draftQuestionsList[selectedQuestionIndex]?.isCCSSVisibleModal && (
          <CCSSTabs
            screenSize={screenSize}
            isTabsOpen={
              draftQuestionsList[selectedQuestionIndex].isCCSSVisibleModal
            }
            handleCCSSSubmit={handleCCSSSubmit}
            ccss={
              draftQuestionsList[selectedQuestionIndex].question.questionCard
                .ccss ?? ''
            }
          />
        )}

      {/* open modals according to correct index */}
      {draftQuestionsList.length > 0 &&
        selectedQuestionIndex !== null &&
        draftQuestionsList[selectedQuestionIndex] != null && (
          <ImageUploadModal
            draftQuestion={draftQuestionsList[selectedQuestionIndex].question}
            screenSize={screenSize}
            isClone={isClone}
            isCloneImageChanged={
              draftQuestionsList[selectedQuestionIndex]
                .isCloneQuestionImageChanged
            }
            isModalOpen={
              draftQuestionsList[selectedQuestionIndex].questionImageModalIsOpen
            }
            handleImageChange={handleImageChange}
            handleImageSave={handleImageSave}
            handleCloseModal={handleCloseQuestionModal}
          />
        )}

      {/* Create Game Image Upload Modal */}
      <CreateGameImageUploadModal
        draftGame={draftGame}
        isClone={isClone}
        isCloneImageChanged={draftGame.isCloneGameImageChanged}
        screenSize={screenSize}
        isModalOpen={draftGame.isGameImageUploadVisible}
        handleImageChange={handleGameImageChange}
        handleImageSave={handleGameImageSave}
        handleCloseModal={handleCloseGameCardModal}
      />

      {/* Create Game Card flow starts here */}
      <CreateGameBoxContainer>
        <CreateGameComponent
          draftGame={draftGame}
          draftQuestionsList={draftQuestionsList}
          isClone={isClone}
          isEdit={isEdit}
          isEditDraft={isEditDraft}
          isLoading={centralData.isLoading || isLoading}
          isCloneImageChanged={draftGame.isCloneGameImageChanged}
          label={label}
          screenSize={screenSize}
          handleSaveGame={handleSave}
          handleSaveDraftGame={handleDraftSave}
          handleDiscard={handleDiscardGame}
          handlePublicPrivateChange={handlePublicPrivateGameChange}
          handleImageUploadClick={handleGameImageUploadClick}
          onCreateQuestion={handleOpenCreateQuestion}
          onOpenQuestionBank={handleOpenQuestionBank}
          handlePhaseTime={handlePhaseTime}
          onGameDescription={handleGameDescription}
          onGameTitle={handleGameTitle}
          phaseTime={phaseTime}
          selectedIndex={selectedQuestionIndex}
          iconButtons={iconButtons}
          setSelectedIndex={handleQuestionIndexChange}
          addMoreQuestions={handleAddMoreQuestions}
          handleDeleteQuestion={handleDeleteQuestion}
        />

        {/* Create Question Form(s)  */}
        {draftQuestionsList.map((draftQuestionItem, index) => {
          return (
            index === selectedQuestionIndex && (
              <Fade
                timeout={500}
                in={draftGame.openCreateQuestion}
                mountOnEnter
                unmountOnExit
                key={`Question--${index + 1}`}
              >
                <Box
                  sx={{
                    width: draftQuestionItem.isLibraryViewOnly
                      ? '100%'
                      : 'auto',
                  }}
                >
                  {draftQuestionItem.isLibraryViewOnly ? (
                    <ViewQuestionCards
                      screenSize={screenSize}
                      question={draftQuestionItem.questionTemplate}
                      isViewGame
                      isCreateGame
                    />
                  ) : (
                    <QuestionElements
                      screenSize={screenSize}
                      isClone={isClone}
                      isEdit={isEdit}
                      isCloneImageChanged={
                        draftQuestionItem.isCloneQuestionImageChanged
                      }
                      label={label}
                      draftQuestion={draftQuestionItem.question}
                      completeIncorrectAnswers={draftQuestionItem.question.incorrectCards.filter(
                        (card) => card.isCardComplete,
                      )}
                      incompleteIncorrectAnswers={draftQuestionItem.question.incorrectCards.filter(
                        (card) => !card.isCardComplete,
                      )}
                      isCardSubmitted={
                        draftQuestionItem.isQuestionCardSubmitted
                      }
                      isCardErrored={draftQuestionItem.isQuestionCardErrored}
                      highlightCard={draftQuestionItem.highlightCard}
                      isAIEnabled={draftQuestionItem.isAIEnabled}
                      isAIError={draftQuestionItem.isAIError}
                      isPublic={
                        draftQuestionItem.publicPrivate ===
                        PublicPrivateType.PUBLIC
                      }
                      isMultipleChoice={draftQuestionItem.isMultipleChoice}
                      handleAnswerType={handleAnswerType}
                      handleDebouncedCorrectAnswerChange={
                        handleDebouncedCorrectAnswerChange
                      }
                      handleDebouncedCorrectAnswerStepsChange={
                        handleDebouncedCorrectAnswerStepsChange
                      }
                      handleAnswerSettingsChange={handleAnswerSettingsChange}
                      handleDebouncedTitleChange={handleDebouncedTitleChange}
                      handlePublicPrivateChange={
                        handlePublicPrivateQuestionChange
                      }
                      handleDiscardQuestion={handleDiscard}
                      handleSaveQuestion={handleSaveQuestion}
                      handleAIError={handleAIError}
                      handleAIIsEnabled={handleAIIsEnabled}
                      handleNextCardButtonClick={handleNextCardButtonClick}
                      handleIncorrectCardStackUpdate={
                        handleIncorrectCardStackUpdate
                      }
                      handleClick={handleClick}
                      handleCCSSClick={handleCCSSClicks}
                      handleImageUploadClick={handleQuestionImageUploadClick}
                    />
                  )}
                </Box>
              </Fade>
            )
          );
        })}
        <Fade
          in={draftGame.openQuestionBank}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <Box sx={{ width: '100%' }}>
            <LibraryTabsQuestions
              isPublic={
                draftGame.gameTemplate.publicPrivateType ===
                PublicPrivateType.PUBLIC || draftGame.gameTemplate.publicPrivateType === PublicPrivateType.DRAFT
              }
              screenSize={screenSize}
              setIsTabsOpen={setIsTabsOpen}
              handleChooseGrades={handleChooseGrades}
              handleSortChange={handleSortChange}
              handleSearchChange={handleSearchChange}
              fetchElements={fetchElements}
              handleView={handleView}
            />
          </Box>
        </Fade>
      </CreateGameBoxContainer>
    </CreateGameMainContainer>
  );
}
