import React, { useState, useEffect } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CentralQuestionTemplateInput,
  IQuestionTemplate,
  PublicPrivateType,
  TemplateType,
  GradeTarget,
  SortType,
  SortDirection,
  IGameTemplate,
  CloudFrontDistributionUrl
} from '@righton/networking';
import { Box, Fade, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameBoxContainer,
  CreateGameContentContainer,
  QuestionHeaderText,
  QuestionBodyText,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import CreateQuestionCardUnified from '../components/question/CreateQuestionCardUnified';
import {
  LibraryTabEnum,
  ScreenSize,
  StorageKey,
  GameQuestionType,
  ModalStateType,
  StorageKeyIsFirstCreate,
  ModalObject, 
  ConfirmStateType 
} from '../lib/CentralModels';
import { timeLookup } from '../components/cards/creategamecard/time';
import {
  TGameTemplateProps,
  TDraftQuestionsList,
  draftTemplate,
  TPhaseTime,
  gameTemplate,
} from '../lib/CreateGameModels';
import ModalBackground from '../components/modal/ModalBackground';
import CreateGameCardBase from '../components/cards/creategamecard/CreateGameCardBase';
import CreateGameImageUploadModal from '../components/cards/creategamecard/CreateGameImageUpload';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import {
  assembleQuestionTemplate,
  updateGameTitle,
  updateGameDescription,
  updateGameTemplatePhaseTime,
  updatePhaseTime,
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
  openModalAtIndex,
  buildLibraryQuestionAtIndex,
  updateDraftListWithLibraryQuestion,
  handleQuestionListErrors,
} from '../lib/helperfunctions/createGame/CreateQuestionsListHelpers';
import {
  useCentralDataDispatch,
  useCentralDataState,
} from '../hooks/context/useCentralDataContext';
import CreateGameHeader from '../components/game/CreateGameHeader';
import CentralButton from '../components/button/Button';
import { ButtonType } from '../components/button/ButtonModels';
import LibraryTabsModalContainer from '../components/librarytabs/LibraryTabsModalContainer';
import CreateGameModalSwitch from '../components/modal/switches/CreateGameModalSwitch';

interface CreateGameProps {
  screenSize: ScreenSize;
  initPublicPrivate: PublicPrivateType;
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
  initPublicPrivate,
  setIsTabsOpen,
  fetchElement,
  fetchElements,
  handleChooseGrades,
  handleSearchChange,
  handleSortChange,
  loadMore,
}: CreateGameProps) {
  const theme = useTheme();
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
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(false);
  const [iconButtons, setIconButtons] = useState<number[]>([1]);
  const [modalObject, setModalObject] = useState<ModalObject>({
    modalState: ModalStateType.NULL,
    confirmState: ConfirmStateType.NULL,
  });
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
    phaseOne: '2:00',
    phaseTwo: '2:00',
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
      label = 'Your';
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
    setModalObject({
      modalState: ModalStateType.CREATEQUESTION,
      confirmState: ConfirmStateType.DRAFT,
    });
  };

  const handleOpenQuestionBank = () => {
    setIsQuestionBankOpen(true);
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
    setModalObject({
      modalState: ModalStateType.DISCARD,
      confirmState: ConfirmStateType.NULL,
    });
  };

  const handleDiscardClick = (value: boolean) => {
    if (value) {
      setModalObject({
        modalState: ModalStateType.NULL,
        confirmState: ConfirmStateType.NULL,
      });
      window.localStorage.setItem(StorageKey, '');
      navigate('/');
      return;
    }
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
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
      setModalObject({
        modalState: ModalStateType.SAVING,
        confirmState: ConfirmStateType.UPDATED,
      });
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
              draftGame.gameTemplate.publicPrivateType as TemplateType,
              updatedGame,
            );
            setModalObject({
              modalState: ModalStateType.CONFIRM,
              confirmState: ConfirmStateType.UPDATED,
            });
        } catch (err) {
          console.log(err);
        }

        setDraftGame((prev) => ({
          ...prev,
          isCreatingTemplate: false,
          isGameCardSubmitted: false,
        }));
        centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: '' });
        await fetchElements();
        // navigate(`/library/games/${draftGame.gameTemplate.publicPrivateType}`);
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

  const handlePublishGame = async () => {
    try {
      setModalObject({
        modalState: ModalStateType.PUBLISHING,
        confirmState: ConfirmStateType.PUBLISHED,
      });
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
              draftGame.gameTemplate.publicPrivateType as TemplateType,
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
                  draftGame.gameTemplate.publicPrivateType,
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
              draftGame.gameTemplate.publicPrivateType as TemplateType,
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
        setModalObject({
          modalState: ModalStateType.CONFIRM,
          confirmState: ConfirmStateType.PUBLISHED,
        });
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
        setModalObject({
          modalState: ModalStateType.NULL,
          confirmState: ConfirmStateType.NULL,
        });
      }
    } catch (err) {
      console.error('Error creating game template:', err);
      setDraftGame((prev) => ({ ...prev, isCreatingTemplate: false }));
    }
  };

  const handleEdit = () => {
      setModalObject({
        modalState: ModalStateType.UPDATE,
        confirmState: ConfirmStateType.NULL,
      });
  };


   const handleSaveEditedGame = async () => {
    try {
      if (draftGame.gameTemplate.publicPrivateType === originalGameType) {
        await handleUpdateEditedGame();
        return;
      }
      await handlePublishGame();
      await apiClients.gameTemplate.deleteGameTemplate(
          originalGameType as TemplateType,
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
              updatedDraftGame.gameTemplate.publicPrivateType as TemplateType,
              createGame,
            );
            if (gameTemplateResponse && selectedGameId) {
              await apiClients.gameTemplate.deleteGameTemplate(
                PublicPrivateType.DRAFT as TemplateType,
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
              updatedDraftGame.gameTemplate.publicPrivateType as TemplateType,
              createGame,
            );
             if (gameTemplateResponse && selectedGameId) {
              await apiClients.gameTemplate.deleteGameTemplate(
                PublicPrivateType.DRAFT as TemplateType,
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
        setModalObject({
          modalState: ModalStateType.CONFIRM,
          confirmState: ConfirmStateType.DRAFT,
        });
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
    // if (isEditDraft)
    //   return handleCreateFromDraftGame();
    // if (isEdit)
    //   return handleSaveEditedGame();
    if (!gameFormIsValid || !allDQAreValid) {
      setDraftGame((prev) => ({
        ...prev,
        ...(!gameFormIsValid && { isGameCardErrored: true }),
        isCreatingTemplate: false,
      }));
      if (!allDQAreValid) {
        setDraftQuestionsList((prev) => handleQuestionListErrors(prev));
      }
    }
    return setModalObject({
      modalState: ModalStateType.PUBLISH,
      confirmState: ConfirmStateType.PUBLISHED,
    });
  };

  const handleCloseSaveGameModal = () => {
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
  };

  const handleCloseDiscardModal = () => {
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
  };

  const handleCloseCreateQuestionModal = () => {
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
  };

  const handleSaveDraftGame = async () => {
    try {
      setModalObject({
        modalState: ModalStateType.SAVING,
        confirmState: ConfirmStateType.DRAFT,
      });
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

      // questions that are new (and will be saved as draft questions)
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

      const addedQuestionPublicTemplates = addedQuestionTemplates.filter((question) => question.questionTemplate.publicPrivateType === PublicPrivateType.PUBLIC);

      const addedQuestionPrivateTemplates = addedQuestionTemplates.filter((question) => question.questionTemplate.publicPrivateType === PublicPrivateType.PRIVATE);

      const draftPublicQuestionIds = addedQuestionPublicTemplates.map((question) => question.questionTemplate.id);
      const draftPrivateQuestionIds = addedQuestionPrivateTemplates.map((question) => question.questionTemplate.id);
      
      draftGameCopy.gameTemplate.publicQuestionIds = [...draftPublicQuestionIds];
      draftGameCopy.gameTemplate.privateQuestionIds = [...draftPrivateQuestionIds];
      // create & store game template in variable to retrieve id after response
      const createGame = buildGameTemplate(
        draftGameCopy,
        userId,
        draftQuestionsList,
        gameImgUrl,
        questionTemplateCCSS,
        true
      );
      const gameTemplateResponse =
        await apiClients.gameTemplate.createGameTemplate(
          PublicPrivateType.DRAFT as TemplateType,
          createGame,
        );
      // create an array of all the ids from the response
      const questionTemplateIds = questionTemplateResponse.map((question) =>
        String(question?.id),
      );

      // make sure we have a gameTemplate id as well as question template ids before creating a game question
      
      if (gameTemplateResponse.id && (questionTemplateIds.length > 0)) {
        try {
          // this is only for new questions so we don't write gamequestions that mix draft and public/private questions
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
        gameTemplate: {
          ...prev.gameTemplate,
          publicPrivateType: PublicPrivateType.DRAFT,
        },
        isCreatingTemplate: false,
        isGameCardSubmitted: false,
      }));
      setModalObject({
        modalState: ModalStateType.CONFIRM,
        confirmState: ConfirmStateType.DRAFT,
      });
    } catch (err) {
      console.error(`HandleSaveGame - error: `, err);
    }
  };

  const handleUpdateDraftGame = async () => {
     try {
      setModalObject({
        modalState: ModalStateType.SAVING,
        confirmState: ConfirmStateType.DRAFT,
      });
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
          PublicPrivateType.DRAFT as TemplateType,
          {...createGame, id: selectedGameId},
        );

      setDraftGame((prev) => ({
        ...prev,
        isCreatingTemplate: false,
        isGameCardSubmitted: false,
      }));
      setModalObject({
        modalState: ModalStateType.NULL,
        confirmState: ConfirmStateType.NULL,
      });
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
  const handleCloseQuestionModal = () => {
    setIsQuestionBankOpen(false);
    if (draftGame.isGameImageUploadVisible) {
      setDraftGame((prev) => ({ ...prev, isGameImageUploadVisible: false }));
    }
  };
  
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
    setIsQuestionBankOpen(false);
  };

  /** LIBRARY HANDLER HELPERS */
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
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  const handleContinue = () => {
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
    navigate(`/library/games/${draftGame.gameTemplate.publicPrivateType}`);
  };

  const handleCreateQuestion = (draftQuestion: CentralQuestionTemplateInput) => {
    setDraftQuestionsList((prev) => [{
      ...draftTemplate,
      question: draftQuestion,
      publicPrivate: draftGame.gameTemplate.publicPrivateType,
      isAIEnabled: false,
      isAIError: false,
      isQuestionCardSubmitted: false,
      isQuestionCardErrored: false,
      localId: uuidv4(),
    },...prev ]);
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
  };

  useEffect(() => {
    setIsLoading(false);
    if (localStorage.getItem(StorageKeyIsFirstCreate) === null){
      localStorage.setItem(StorageKeyIsFirstCreate, 'false');
      setDraftGame((prev) => ({
        ...prev,
        gameTemplate: {
          ...prev.gameTemplate,
          publicPrivateType: initPublicPrivate,
        },
      }));
    }
    centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: '' });
    const selected = centralData.selectedGame;
    const title = selected?.game?.title;
    if (selected !== null && (isClone || isEdit)) {
      // regex to detect [DUPLICATE OF] in title
      const regex = /\[DUPLICATE OF\]/i;
      if (selected?.game && title && !regex.test(title) && isClone)
        selected.game.title = `[DUPLICATE OF] ${title}`;
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
      setOriginalGameType(selected?.game?.publicPrivateType ?? PublicPrivateType.PUBLIC);
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
    <CreateGameMainContainer screenSize={screenSize}>
      <CreateGameBackground />
      {/* Modals for Question (below) */}
      <ModalBackground
        isModalOpen={openModal || modalObject.modalState !== ModalStateType.NULL}
        handleCloseModal={handleCloseQuestionModal}
      />
      <LibraryTabsModalContainer
        isPublic={ draftGame.gameTemplate.publicPrivateType ===
          PublicPrivateType.PUBLIC || draftGame.gameTemplate.publicPrivateType === PublicPrivateType.DRAFT}
        isTabsOpen={isQuestionBankOpen}
        handleCloseQuestionTabs={handleCloseQuestionModal}
        screenSize={screenSize}
        setIsTabsOpen={setIsTabsOpen}
        handleChooseGrades={handleChooseGrades}
        handleSortChange={handleSortChange}
        handleSearchChange={handleSearchChange}
        fetchElements={fetchElements}
        handleQuestionView={handleView}
      />
      <CreateGameModalSwitch
        modalObject={modalObject}
        screenSize={screenSize}
        publicPrivate={draftGame.gameTemplate.publicPrivateType}
        handleDiscard={handleDiscard}
        handleCloseDiscardModal={handleCloseDiscardModal}
        handlePublishGame={handlePublishGame}
        handleCloseSaveGameModal={handleCloseSaveGameModal}
        handleContinue={handleContinue}
        handleCreateQuestion={handleCreateQuestion}
        handleCloseCreateQuestionModal={handleCloseCreateQuestionModal}
        handleSaveDraft={handleDraftSave}
        isCardErrored={draftGame.isGameCardErrored}
        handleSaveEditedGame={handleSaveEditedGame}
      />

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
      <CreateGameContentContainer>
        <CreateGameHeader handleEdit={handleEdit} isEdit={isEdit} handleSaveGame={handleSave} handleBackClick={handleDiscardGame} label={label} screenSize={screenSize} />
        {screenSize !== ScreenSize.LARGE && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: `${theme.sizing.smPadding}px`,
            }}
          >
            <QuestionHeaderText>
              Questions
            </QuestionHeaderText>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: screenSize !== ScreenSize.MEDIUM ? 'column' : 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: `${theme.sizing.xSmPadding}px`,
              }}
            >
                <CentralButton
                  buttonType={ButtonType.CREATEQUESTION}
                  isEnabled
                  onClick={handleOpenCreateQuestion}
                />
                <CentralButton
                  buttonType={ButtonType.QUESTIONBANK}
                  isEnabled
                  onClick={handleOpenQuestionBank}
                />
            </Box>
          </Box>
        )}
        <CreateGameBoxContainer screenSize={screenSize}>
          <CreateGameCardBase
            draftGame={draftGame}
            isClone={isClone}
            isEdit={isEdit}
            isEditDraft={isEditDraft}
            isCloneImageChanged={draftGame.isCloneGameImageChanged}
            label={label}
            screenSize={screenSize}
            handleImageUploadClick={handleGameImageUploadClick}
            handlePublicPrivateChange={handlePublicPrivateGameChange}
            handlePhaseTime={handlePhaseTime}
            onGameDescription={handleGameDescription}
            onGameTitle={handleGameTitle}
            isCardSubmitted={draftGame.isGameCardSubmitted}
            isCardErrored={draftGame.isGameCardErrored}
            phaseTime={phaseTime}
            gameTitle={draftGame.gameTemplate.title}
            gameDescription={draftGame.gameTemplate.description}
            openCreateQuestion={draftGame.openCreateQuestion}
            openQuestionBank={draftGame.openQuestionBank}
          />
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: `${theme.sizing.lgPadding}px`,
            }}
          >
            {screenSize === ScreenSize.LARGE && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <QuestionHeaderText>
                  Questions
                </QuestionHeaderText>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: `${theme.sizing.xSmPadding}px`,
                  }}
                >
                    <CentralButton
                      buttonType={ButtonType.CREATEQUESTION}
                      isEnabled
                      onClick={handleOpenCreateQuestion}
                    />
                    <CentralButton
                      buttonType={ButtonType.QUESTIONBANK}
                      isEnabled
                      onClick={handleOpenQuestionBank}
                    />
                </Box>
              </Box>
            )}
            {draftQuestionsList.length > 0 ? (
              <Box 
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  gap: `${theme.sizing.lgPadding}px`,
                }}
              >
                {/* Create Question Form(s)  */}
                <AnimatePresence>
                  {draftQuestionsList.map((draftQuestionItem, index) => {
                    const uniqueKey = draftQuestionItem.questionTemplate?.id ||
                                     draftQuestionItem.localId ||
                                     `fallback-${index}`;
                    const isUserCreated = draftQuestionItem.questionTemplate?.userId === centralData.userProfile?.id;
                    return (
                        <motion.div
                          key={uniqueKey}
                          initial={{ opacity: 0, y: index === 0 ? 0 : -100 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          layout
                          style={{
                            width: '100%',
                            display: 'flex'
                          }}
                        >
                          <Box
                            sx={{
                              width: draftQuestionItem.isLibraryViewOnly
                                ? '100%'
                                : 'auto',
                              flex: 1,
                            }}
                          >
                            <CreateQuestionCardUnified
                              screenSize={screenSize}
                              question={draftQuestionItem.question}
                              questionTemplate={draftQuestionItem.questionTemplate ?? null}
                              isUserCreated={isUserCreated}
                              handleRemoveQuestion={() => handleDeleteQuestion(index)}
                              isViewGame
                              isCreateGame
                            />
                          </Box>
                        </motion.div>
                    );
                  })}
                </AnimatePresence>
              </Box>
            ) : (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: screenSize === ScreenSize.SMALL ? '0px' : '128px',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth:'520px',
                }}
              >
                <QuestionBodyText>
                  You can select <i>Add Question</i> to create questions from scratch or select <i>Question Bank</i> to add ready-made public questions.
                </QuestionBodyText>
              </Box>
            </Box>
          )}
          </Box>
        </CreateGameBoxContainer>
      </CreateGameContentContainer>
    </CreateGameMainContainer>
  );
}
