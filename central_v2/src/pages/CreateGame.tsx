import React, { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
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
  StorageKeyCreateGame,
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
import { DraftAssetHandler } from '../lib/services/DraftAssetHandler';
import useCreateGameLoader from '../loaders/useCreateGameLoader';

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
  const draftAssetHandler = new DraftAssetHandler();
  const route = useMatch('/clone/game/:type/:gameId');
  const editRoute = useMatch('/edit/game/:type/:gameId');
  const addQuestionRoute = useMatch('/edit/game/:type/:gameId/add/:questionId');
  const isClone =
    route?.params.gameId !== null &&
    route?.params.gameId !== undefined &&
    route?.params.gameId.length > 0;
  const isEdit =
    editRoute?.params.gameId !== null &&
    editRoute?.params.gameId !== undefined &&
    editRoute?.params.gameId.length > 0;
  const isEditDraft =
    editRoute?.params.type === 'Draft' || addQuestionRoute?.params.type === 'Draft';
  const isAddQuestion =
    addQuestionRoute?.params.questionId !== null &&
    addQuestionRoute?.params.questionId !== undefined &&
    addQuestionRoute?.params.questionId.length > 0;
  const localData = useCreateGameLoader();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(false);
  const [iconButtons, setIconButtons] = useState<number[]>([1]);
  const [modalObject, setModalObject] = useState<ModalObject>({
    modalState: ModalStateType.NULL,
    confirmState: ConfirmStateType.NULL,
  });
  const [draftGame, setDraftGame] = useState<TGameTemplateProps>(() =>
    localData.draftGame ?? gameTemplate,
  );
  const [originalGame, setOriginalGame] = useState<IGameTemplate | null>(null);
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
  >(() => localData.draftQuestionsList ?? []);
  const [originalQuestionImageUrls, setOriginalQuestionImageUrls] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editQuestionDraft, setEditQuestionDraft] = useState<CentralQuestionTemplateInput | null>(null);
  const [editQuestionIndex, setEditQuestionIndex] = useState<number | null>(null);

  const [phaseTime, setPhaseTime] = useState<TPhaseTime>(() =>
    localData.phaseTime ?? { phaseOne: '2:00', phaseTwo: '2:00' },
  );
  
  const [gameFormIsValid, setGameFormIsValid] = useState(false);
  const [allDQAreValid, setAllDQAreValid] = useState(false);
  const [editedPublicPrivateType, setEditedPublicPrivateType] = useState<PublicPrivateType>(isEditDraft ? draftGame.gameTemplate.finalPublicPrivateType : draftGame.gameTemplate.publicPrivateType);

  const openModal = openModalAtIndex(
    draftGame,
    draftQuestionsList,
    selectedQuestionIndex,
  );

  // const hasGameError = (draftGame.isGameCardErrored && !gameFormIsValid)
  // || (draftGame.isGameCardSubmitted && (!gameFormIsValid || !allDQAreValid));
  let label = 'Create';
  let selectedGameId = '';
  switch (true) {
    case isAddQuestion:
      label = 'Edit';
      selectedGameId = addQuestionRoute?.params.gameId || '';
      break;
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

  const isCreate = !isClone && !isEdit && !isAddQuestion;

  const persistGameDraftDebounced = useMemo(
    () =>
      debounce(
        (snapshot: {
          draftGame: TGameTemplateProps;
          draftQuestionsList: TDraftQuestionsList[];
          phaseTime: TPhaseTime;
        }) => {
          if (!isCreate) return;
          const { draftGame: dg, draftQuestionsList: dql, phaseTime: pt } = snapshot;
          const d = { ...dg, image: undefined };
          const q = dql.map((item) => ({
            ...item,
            question: {
              ...item.question,
              questionCard: { ...item.question.questionCard, image: undefined },
            },
          }));
          window.localStorage.setItem(
            StorageKeyCreateGame,
            JSON.stringify({ draftGame: d, draftQuestionsList: q, phaseTime: pt }),
          );
        },
        1000,
      ),
    [isCreate],
  );

  /** CREATE GAME HANDLERS START HERE */
  const handleGameTitle = (val: string) => {
    setDraftGame((prev) => {
      const next = updateGameTitle(prev, val);
      persistGameDraftDebounced({ draftGame: next, draftQuestionsList, phaseTime });
      return next;
    });
  };

  const handleGameDescription = (val: string) => {
    setDraftGame((prev) => {
      const next = updateGameDescription(prev, val);
      persistGameDraftDebounced({ draftGame: next, draftQuestionsList, phaseTime });
      return next;
    });
  };

  const handlePhaseTime = (time: TPhaseTime) => {
    const nextDraft = updateGameTemplatePhaseTime(draftGame, time);
    const nextPhase = updatePhaseTime(time);
    setDraftGame(() => nextDraft);
    setPhaseTime(() => nextPhase);
    persistGameDraftDebounced({
      draftGame: nextDraft,
      draftQuestionsList,
      phaseTime: nextPhase,
    });
  };

  const handleOpenCreateQuestion = () => {
    setModalObject({
      modalState: ModalStateType.CREATEQUESTION,
      confirmState: ConfirmStateType.DRAFT,
    });
  };

  const handleOpenQuestionBank = () => {
    setIsQuestionBankOpen(true);
    const isGameFormIsValid = checkGameFormIsValid(draftGame);
    setGameFormIsValid(isGameFormIsValid);
    setDraftGame((prev) => toggleQuestionBank(prev, isGameFormIsValid));
  };

  // editing the public/private of a game is complicated
  // if we switch the type, any existing, published questions need to be removed
  // if we switch the type during draft edit, we need to maintain the original draft type and flip the local state
  const handlePublicPrivateGameChange = (value: PublicPrivateType) => {
    // regardless of case, we need to remove any published questions (cant cross types)
    const newDraftQuestionList = 
      draftQuestionsList
      .filter((question) => (!question.questionTemplate.id && ((!isEditDraft && question.questionTemplate.publicPrivateType !== value) || (isEditDraft && question.questionTemplate.finalPublicPrivateType !== value))))
      .map((question) => ({
        ...question,
        questionTemplate: {
          ...question.questionTemplate,
          publicPrivateType: value,
      },
    }));
    // case 1, editing a draft game
    // remove any published questions (cant cross types)
    // then switch all question types to new type
    if (isEditDraft) {
      setEditedPublicPrivateType(value);
      const nextDraft = {
        ...draftGame,
        gameTemplate: {
          ...draftGame.gameTemplate,
          finalPublicPrivateType: value,
        },
      };
      setDraftGame(() => nextDraft);
      setDraftQuestionsList(newDraftQuestionList);
      persistGameDraftDebounced({
        draftGame: nextDraft,
        draftQuestionsList: newDraftQuestionList,
        phaseTime,
      });
    }
    // case 2, creating/editing a game
    else {
      setDraftQuestionsList(newDraftQuestionList);
      setIconButtons([1]);
      setSelectedQuestionIndex(0);
      const nextDraft = {
        ...draftGame,
        gameTemplate: {
          ...draftGame.gameTemplate,
          publicPrivateType: value,
        },
        questionCount: newDraftQuestionList.length,
      };
      setDraftGame(() => nextDraft);
      persistGameDraftDebounced({
        draftGame: nextDraft,
        draftQuestionsList: newDraftQuestionList,
        phaseTime,
      });
    }
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
      window.localStorage.setItem(StorageKeyCreateGame, '');
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
      const isDqValid = checkDQsAreValid(draftQuestionsList);
      const isGameFormIsValid = checkGameFormIsValid(draftGame);
      setAllDQAreValid(isDqValid);
      setGameFormIsValid(isGameFormIsValid);
      if (isGameFormIsValid && isDqValid) {
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

        // handle edited questions - update existing question templates
        const editedQuestions = draftQuestionsList.filter(
          (dq) => dq.isEdited && dq.questionTemplate.id && dq.questionTemplate.id.length > 0
        );
        if (editedQuestions.length > 0) {
          try {
            const updatePromises = editedQuestions.map(async (dq) => {
              let imageUrl = dq.questionTemplate.imageUrl || '';

              // Handle image upload if there's a new image
              if (dq.question.questionCard.image || dq.question.questionCard.imageUrl) {
                if (dq.question.questionCard.image) {
                  const img = await apiClients.questionTemplate.storeImageInS3(
                    dq.question.questionCard.image
                  );
                  const result = await img.result;
                  if (result && result.path && result.path.length > 0) {
                    imageUrl = result.path;
                  }
                } else if (dq.question.questionCard.imageUrl &&
                           dq.question.questionCard.imageUrl !== dq.questionTemplate.imageUrl) {
                  // New image URL provided
                  imageUrl = await apiClients.questionTemplate.storeImageUrlInS3(
                    dq.question.questionCard.imageUrl
                  );
                }
              }

              return apiClients.questionTemplate.updateQuestionTemplate(
                dq.publicPrivate as TemplateType,
                imageUrl,
                userId,
                dq.question,
                dq.questionTemplate.id
              );
            });
            await Promise.all(updatePromises);
          } catch (err) {
            console.error('Failed to update one or more edited questions:', err);
          }
        }

        // make sure we have a gameTemplate id as well as question template ids before creating a game question
        if (draftGame.gameTemplate.id && questionTemplateIds.length > 0) {
          try {
            const createGameQuestions = buildGameQuestionPromises(
              draftGame,
              draftGame.gameTemplate.id,
              questionTemplateIds,
              apiClients,
              draftGame.gameTemplate.publicPrivateType,
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
          // ensures new question templates are in correct order
          let newIdIndex = 0;
          const resolvedDraftQuestionsList = draftQuestionsList.map((dq) => {
            if (dq.questionTemplate.id) {
              return dq;
            }
            const resolvedId = newQuestionTemplateIds[newIdIndex];
            newIdIndex += 1;
            return {
              ...dq,
              questionTemplate: {
                ...dq.questionTemplate,
                id: resolvedId,
              },
            };
          });
          const updatedGame = buildEditedGameTemplate(
            updatedDraftGame,
            userId,
            resolvedDraftQuestionsList,
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
        if (!isDqValid) {
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
      const isGameFormIsValid = checkGameFormIsValid(draftGame);
      setGameFormIsValid(isGameFormIsValid);
      const isDqValid = checkDQsAreValid(draftQuestionsList);
      setAllDQAreValid(isDqValid);
      if (isGameFormIsValid && isDqValid) {
        // check for images on draft game: upload File or external URL to S3; use existing S3 key as-is
        let gameImgUrl: string | null = null;
        if (draftGame.image || draftGame.imageUrl) {
          const isExternalUrl =
            draftGame?.imageUrl?.startsWith('https://') ||
            draftGame?.imageUrl?.startsWith('http://');
          if (!isExternalUrl && draftGame?.imageUrl) {
            // already an S3 path (e.g. from draft)
            gameImgUrl = draftGame.imageUrl;
          } else {
            if (!isExternalUrl && draftGame?.imageUrl && draftGame.imageUrl.length > 0) {
              draftGame.imageUrl = `${CloudFrontDistributionUrl}${draftGame.imageUrl}`;
            }
            gameImgUrl = await createGameImagePath(draftGame, apiClients);
          }
      }
        const userId = centralData.userProfile?.id || '';
        try {
          if (draftQuestionsList.length > 0) {
            // handle edited questions - update existing question templates first
            const editedQuestions = draftQuestionsList.filter(
              (dq) => dq.isEdited && dq.questionTemplate.id && dq.questionTemplate.id.length > 0
            );
            if (editedQuestions.length > 0) {
              try {
                const updatePromises = editedQuestions.map(async (dq) => {
                  let imageUrl = dq.questionTemplate.imageUrl || '';

                  // Handle image upload if there's a new image
                  if (dq.question.questionCard.image || dq.question.questionCard.imageUrl) {
                    if (dq.question.questionCard.image) {
                      const img = await apiClients.questionTemplate.storeImageInS3(
                        dq.question.questionCard.image
                      );
                      const result = await img.result;
                      if (result && result.path && result.path.length > 0) {
                        imageUrl = result.path;
                      }
                    } else if (dq.question.questionCard.imageUrl &&
                               dq.question.questionCard.imageUrl !== dq.questionTemplate.imageUrl) {
                      imageUrl = await apiClients.questionTemplate.storeImageUrlInS3(
                        dq.question.questionCard.imageUrl
                      );
                    }
                  }
                  return apiClients.questionTemplate.updateQuestionTemplate(
                    dq.publicPrivate as TemplateType,
                    imageUrl,
                    userId,
                    dq.question,
                    dq.questionTemplate.id
                  );
                });
                await Promise.all(updatePromises);
              } catch (err) {
                console.error('Failed to update one or more edited questions:', err);
              }
            }

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

            // addedQuestionTemplates are those added from question bank (they are already created so have ids) and not edited
            const addedQuestionTemplates = draftQuestionsList.filter((dq) => dq.questionTemplate.id && !dq.isEdited);
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

            // Include edited question IDs
            const editedQuestionTemplatesIds = editedQuestions.map(
              (question) => String(question?.questionTemplate?.id),
            )

            questionTemplateIds = [...questionTemplateIds, ...addedQuestionTemplatesIds, ...editedQuestionTemplatesIds]

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
          setDraftGame((prev) => ({
            ...prev,
            isCreatingTemplate: false,
            isGameCardSubmitted: false,
          }));
          setModalObject({
            modalState: ModalStateType.NULL,
            confirmState: ConfirmStateType.NULL,
          });
          return;
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
    setModalObject({
      modalState: ModalStateType.PUBLISHING,
      confirmState: ConfirmStateType.PUBLISHED,
    });
    const publishDraftGameResponse = await draftAssetHandler.publishDraftGame(centralData, draftGame, draftQuestionsList, apiClients, selectedGameId);
    setDraftGame(publishDraftGameResponse);
    if (publishDraftGameResponse.isGameCardErrored) {
      if (!checkDQsAreValid(draftQuestionsList)) {
        setDraftQuestionsList((prev) => handleQuestionListErrors(prev));
        // then find first errored card and set index to that question
      }
    } else {
      setModalObject({
        modalState: ModalStateType.CONFIRM,
        confirmState: ConfirmStateType.PUBLISHED,
      });
    }
  };

  const handlePublishSwitch = async () => {
    if (draftGame.gameTemplate.publicPrivateType === PublicPrivateType.DRAFT) {
      await handleCreateFromDraftGame();
    } else {
      await handlePublishGame();
    }
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
      const createDraftGameResponse = await draftAssetHandler.createDraftGame(centralData, draftGame, draftQuestionsList, apiClients);
      setDraftGame(createDraftGameResponse);
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
      const updateDraftGameResponse = await draftAssetHandler.updateDraftGame(centralData, draftGame, draftQuestionsList, apiClients);
      setDraftGame(updateDraftGameResponse);
      setModalObject({
        modalState: ModalStateType.CONFIRM,
        confirmState: ConfirmStateType.DRAFT,
      });
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
    window.localStorage.setItem(StorageKeyCreateGame, '');
    navigate(`/library/games/${centralData.selectedGame?.game?.publicPrivateType}`);
  };

  const handleContinue = () => {
    let navigateTo = '';
    if (draftGame.gameTemplate.publicPrivateType === PublicPrivateType.DRAFT && modalObject.confirmState === ConfirmStateType.PUBLISHED) {
      navigateTo = `/library/games/${draftGame.gameTemplate.finalPublicPrivateType}`;
    } else {
      navigateTo = `/library/games/${draftGame.gameTemplate.publicPrivateType}`;
    }
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
    navigate(navigateTo);
  };

  const handleCreateQuestion = (draftQuestion: CentralQuestionTemplateInput) => {
    setDraftQuestionsList((prev) => [{
      ...draftTemplate,
      question: draftQuestion,
      publicPrivate: isEditDraft ? draftGame.gameTemplate.finalPublicPrivateType : draftGame.gameTemplate.publicPrivateType,
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

  const handleSave = async () => {
    if (isEdit && !isEditDraft) {
      return setModalObject({
        modalState: ModalStateType.UPDATE,
        confirmState: ConfirmStateType.NULL,
      });
    }
    const isGameFormIsValid = checkGameFormIsValid(draftGame);
    const isDqValid = checkDQsAreValid(draftQuestionsList);
    setAllDQAreValid(isDqValid);
    setGameFormIsValid(isGameFormIsValid);
    if (!isGameFormIsValid || !isDqValid) {
      setDraftGame((prev) => ({
        ...prev,
        ...(!isGameFormIsValid && { isGameCardErrored: true }),
        isCreatingTemplate: false,
      }));
      if (!allDQAreValid) {
        setDraftQuestionsList((prev) => handleQuestionListErrors(prev));
      }
    } else {
      setDraftGame((prev) => ({
        ...prev,
        isGameCardErrored: false,
      }));
    }
    return setModalObject({
      modalState: ModalStateType.PUBLISH,
      confirmState: ConfirmStateType.PUBLISHED,
    });
  };

  const handleEditQuestion = (index: number) => {
    const questionToEdit = draftQuestionsList[index].question;
    setEditQuestionDraft(questionToEdit);
    setEditQuestionIndex(index);
    setModalObject({
      modalState: ModalStateType.GAMEEDITQUESTION,
      confirmState: ConfirmStateType.NULL,
    });
  };
  
  const handleSaveEditedQuestion = (editedQuestion: CentralQuestionTemplateInput) => {

    if (editQuestionIndex !== null) {
      setDraftQuestionsList((prev) =>
        prev.map((item, idx) => {
          if (idx === editQuestionIndex) {
            // Update the question and mark it as edited (keep the ID to update existing template)
            return {
              ...item,
              question: editedQuestion,
              isEdited: true, // Mark as edited so we know to update it
            };
          }
          return item;
        })
      );
    }
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
    setEditQuestionDraft(null);
    setEditQuestionIndex(null);
  };

  // Effect 1: Fetch game when missing or wrong, and first-time create (localStorage + initPublicPrivate).
  // Does NOT depend on centralData.selectedGame to avoid refetch loop when populate runs.
  useEffect(() => {
    setIsLoading(false);
    if (localStorage.getItem(StorageKeyIsFirstCreate) === null && !isEdit) {
      localStorage.setItem(StorageKeyIsFirstCreate, 'false');
      setDraftGame((prev) => ({
        ...prev,
        gameTemplate: {
          ...prev.gameTemplate,
          publicPrivateType: initPublicPrivate,
        },
      }));
    }
    const shouldFetch =
      (!centralData.selectedGame?.game &&
        selectedGameId &&
        (isClone || isEdit || isAddQuestion)) ||
      (centralData.selectedGame?.game?.id !== selectedGameId);
    if (shouldFetch) {
      setIsLoading(true);
      fetchElement(GameQuestionType.GAME, selectedGameId);
    }
  }, [route, editRoute, addQuestionRoute, selectedGameId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect 2: Populate local state from centralData.selectedGame when we have the right game (clone/edit/add).
  // Depends on centralData.selectedGame so it re-runs after fetch on refresh.
  useEffect(() => {
    const selected = centralData.selectedGame;
    if (!selected || !(isClone || isEdit || isAddQuestion) || selected.game?.id !== selectedGameId) {
      return;
    }
    setIsLoading(false);
    const title = selected?.game?.title;
    const regex = /\[DUPLICATE OF\]/i;
    if (selected?.game && title && !regex.test(title) && isClone) {
      selected.game.title = `[DUPLICATE OF] ${title}`;
    }
    if (selected.game) {
      setOriginalGame(selected.game as IGameTemplate);
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

    const getQuestion = async () => {
      const response = await apiClients?.questionTemplate.getQuestionTemplate(
        addQuestionRoute?.params.type as TemplateType,
        addQuestionRoute?.params.questionId ?? '',
      );
      return response;
    };

    if (isAddQuestion) {
      getQuestion().then((addedQuestion) => {
        const originals = [
          addedQuestion as IQuestionTemplate,
          ...(selected?.game?.questionTemplates ?? []),
        ];
        if (originals && originals.length > 0) {
          const oqTemplates = originals.map((q) =>
            'questionTemplate' in q ? q.questionTemplate : q,
          );
          setOriginalQuestionTemplates(oqTemplates);
        }
        const assembled = originals?.map((q) =>
          assembleQuestionTemplate('questionTemplate' in q ? q.questionTemplate : q),
        );
        if (originals && assembled && assembled.length > 0) {
          const imageUrls = originals.map((orig) => {
            const questionTemplate =
              'questionTemplate' in orig ? orig.questionTemplate : orig;
            return questionTemplate.imageUrl ?? '';
          });
          setOriginalQuestionImageUrls(imageUrls);
          setDraftQuestionsList(() =>
            originals.map((orig, i) => {
              const questionTemplate =
                'questionTemplate' in orig ? orig.questionTemplate : orig;
              return {
                ...draftTemplate,
                question: assembled[i],
                questionTemplate,
                isLibraryViewOnly: true,
              };
            }),
          );
        }
      });
    } else {
      const originals = selected?.game?.questionTemplates;
      if (originals && originals.length > 0) {
        const oqTemplates = originals.map((q) => q.questionTemplate);
        setOriginalQuestionTemplates(oqTemplates);
      }
      const assembled = originals?.map((q) =>
        assembleQuestionTemplate(q.questionTemplate),
      );
      if (originals && assembled && assembled.length > 0) {
        const imageUrls = originals.map(
          (orig) => orig.questionTemplate.imageUrl ?? '',
        );
        setOriginalQuestionImageUrls(imageUrls);
        setDraftQuestionsList(() =>
          originals.map((orig, i) => ({
            ...draftTemplate,
            question: assembled[i],
            questionTemplate: orig.questionTemplate,
            isLibraryViewOnly: true,
          })),
        );
      }
    }
  }, [centralData.selectedGame, route, editRoute, addQuestionRoute, selectedGameId]); // eslint-disable-line react-hooks/exhaustive-deps

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
          PublicPrivateType.PUBLIC || (draftGame.gameTemplate.publicPrivateType === PublicPrivateType.DRAFT && editedPublicPrivateType === PublicPrivateType.PUBLIC)}
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
        title={draftGame.gameTemplate.title ?? ''}
        screenSize={screenSize}
        publicPrivate={isEditDraft ? draftGame.gameTemplate.finalPublicPrivateType : draftGame.gameTemplate.publicPrivateType}
        handleDiscard={handleDiscard}
        handleCloseDiscardModal={handleCloseDiscardModal}
        handlePublishGame={handlePublishSwitch}
        handleCloseSaveGameModal={handleCloseSaveGameModal}
        handleContinue={handleContinue}
        handleCreateQuestion={handleCreateQuestion}
        handleCloseCreateQuestionModal={handleCloseCreateQuestionModal}
        handleSaveDraft={handleDraftSave}
        isCardErrored={draftGame.isGameCardErrored}
        handleSaveEditedGame={handleSaveEditedGame}
        editQuestionDraft={editQuestionDraft}
        handleSaveEditedQuestion={handleSaveEditedQuestion}
        draftGame={draftGame.gameTemplate}
        draftQuestionList={draftQuestionsList}
        originalGame={originalGame}
      />

      {/* Create Game Image Upload Modal */}
      <CreateGameImageUploadModal
        draftGame={draftGame}
        isClone={isClone}
        isEdit={isEdit}
        isCloneImageChanged={draftGame.isCloneGameImageChanged}
        screenSize={screenSize}
        isModalOpen={draftGame.isGameImageUploadVisible}
        handleImageChange={handleGameImageChange}
        handleImageSave={handleGameImageSave}
        handleCloseModal={handleCloseGameCardModal}
      />

      {/* Create Game Card flow starts here */}
      <CreateGameContentContainer>
        <CreateGameHeader handleSaveGame={handleSave} handleBackClick={handleDiscardGame} label={label} screenSize={screenSize} isQuestionAdded={draftQuestionsList.length > 0}/>
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
            editedPublicPrivateType={editedPublicPrivateType}
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
                              handleEditQuestion={() => handleEditQuestion(index)}
                              isViewGame
                              isCreateGame
                              isEditGame={isEdit}
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
