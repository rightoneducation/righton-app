import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useMatch } from 'react-router-dom';
import { PublicPrivateType } from '@righton/networking';
import { Box, CircularProgress, useTheme, Fade, styled } from '@mui/material';
import DetailedQuestionCardUnified from '../components/cards/detailedquestion/DetailedQuestionCardUnified';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameBoxContainer,
  CreateGameContentContainer,
  TitleText,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import {
  ScreenSize,
  UserStatusType,
  GameQuestionType,
  CardType,
} from '../lib/CentralModels';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../hooks/context/useCentralDataContext';
import EditModal from '../components/modal/EditModal';
import DeleteModal from '../components/modal/DeleteModal';
import ModalBackground from '../components/modal/ModalBackground';
import OwnerTag from '../components/profile/OwnerTag';
import DetailedQuestionSubCard from '../components/cards/detailedquestion/DetailedQuestionSubCard';
import ViewQuestionHeader from '../components/question/ViewQuestionHeader';


interface ViewQuestionProps {
  screenSize: ScreenSize;
  fetchElement: (type: GameQuestionType, id: string) => void;
  fetchElements: () => void;
  deleteQuestionTemplate: (
    questionId: string,
    type: PublicPrivateType,
  ) => Promise<void>;
}

export default function ViewQuestion({
  screenSize,
  fetchElement,
  fetchElements,
  deleteQuestionTemplate,
}: ViewQuestionProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const route = useMatch('/questions/:type/:questionId');
  const libRoute = useMatch('/library/questions/:type/:questionId');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const isOwner = centralData.userStatus === UserStatusType.LOGGEDIN && centralData.userProfile?.id === centralData.selectedQuestion?.question?.userId;

  const isEditEnabled =
    centralData.userStatus === UserStatusType.LOGGEDIN &&
    centralData.userProfile?.id === centralData.selectedQuestion?.question?.userId;

  useEffect(() => {
    setIsLoading(false);
    let id = '';
    if (route) id = route?.params.questionId ?? '';
    else if (libRoute) id = libRoute?.params.questionId ?? '';
    if (!centralData.selectedQuestion || (!centralData.selectedQuestion.question && id)) {
      setIsLoading(true);
      fetchElement(GameQuestionType.QUESTION, id);
    }
  }, [centralData.selectedQuestion, route]); // eslint-disable-line

  const handleCloneQuestion = () => {
    navigate(
      `/clone/question/${centralData.selectedQuestion?.question?.publicPrivateType}/${centralData.selectedQuestion?.question?.id}`,
    );
  };

  const handleProceedToEdit = () => {
    navigate(
      `/edit/question/${centralData.selectedQuestion?.question?.publicPrivateType}/${centralData.selectedQuestion?.question?.id}`,
    );
  };

  const handleEditQuestion = () => {
    if (
      centralData.selectedQuestion?.question?.publicPrivateType ===
      PublicPrivateType.PUBLIC
    ) {
      setIsModalOpen(true);
    } else {
      handleProceedToEdit();
    }
  };

  const handleProceedToDelete = async () => {
    try {
      if (
        centralData &&
        centralData.selectedQuestion &&
        centralData.selectedQuestion.question
      ) {
        const { question } = centralData.selectedQuestion;
        if (question && question.publicPrivateType && question.id) {
          await deleteQuestionTemplate(
            question.id,
            question.publicPrivateType,
          );
        }
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
    setIsDeleteModalOpen(false);
    centralDataDispatch({ type: 'SET_SELECTED_QUESTION', payload: null });
    fetchElements();
    centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: null });
    navigate('/questions');
  };

  const handleDeleteQuestion = () => {
    if (
      centralData.selectedQuestion?.question?.publicPrivateType ===
      PublicPrivateType.PUBLIC
    ) {
      setIsDeleteModalOpen(true);
    } else {
      handleProceedToDelete();
    }
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
  };

  const handleBackClick = () => {
    if (libRoute) {
      navigate('/library');
    } else {
      navigate('/questions');
    }
  };

  type BodyContainerProps = {
    screenSize: ScreenSize;
  };

  const BodyContainer = styled(Box, {
    shouldForwardProp: (prop: string) => prop !== 'screenSize',
  })<BodyContainerProps>(({ screenSize: size, theme: th }: any) => ({
    width: '100%',
    display: 'flex',
    flexDirection: size !== ScreenSize.LARGE ? 'column' : 'row',
    gap: size !== ScreenSize.LARGE ? '20px' : `${theme.sizing.xLgPadding}px`,
  }));

  return (
    <CreateGameMainContainer screenSize={screenSize}>
      <CreateGameBackground />
      <ModalBackground
        isModalOpen={isModalOpen || isDeleteModalOpen}
        handleCloseModal={handleCloseEditModal}
      />
      <EditModal
        isModalOpen={isModalOpen}
        gameQuestion={GameQuestionType.QUESTION}
        setIsModalOpen={setIsModalOpen}
        handleProceedToEdit={handleProceedToEdit}
      />
      <DeleteModal
        isModalOpen={isDeleteModalOpen}
        gameQuestion={GameQuestionType.QUESTION}
        setIsModalOpen={setIsDeleteModalOpen}
        handleProceedToDelete={handleProceedToDelete}
      />
      {isLoading ? (
        <Box
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress
            style={{ color: `${theme.palette.primary.circularProgress}` }}
          />
        </Box>
      ) : (
        centralData.selectedQuestion && (
          <CreateGameContentContainer>
            <ViewQuestionHeader
              handleBackClick={handleBackClick}
              handleEditQuestion={handleEditQuestion}
              handleCloneQuestion={handleCloneQuestion}
              handleDeleteQuestion={handleDeleteQuestion}
              isEditEnabled={isEditEnabled}
              screenSize={screenSize}
              isOwner={isOwner}
            />
            <CreateGameBoxContainer screenSize={screenSize}>
              <BodyContainer screenSize={screenSize}>
                <Box
                  style={{
                    width: '100%',
                    maxWidth: screenSize !== ScreenSize.LARGE ? '100%' : '410px',
                    display: 'flex',
                    flexDirection:  'column',
                    gap: `${theme.sizing.mdPadding}px`,
                  }}
                >
                  {centralData.selectedQuestion.question && (
                    <DetailedQuestionCardUnified
                      screenSize={screenSize}
                      question={centralData.selectedQuestion.question}
                    />
                  )}
                  <OwnerTag
                    screenSize={screenSize}
                    isViewGame={false}
                  />
                </Box>
                <Box
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${theme.sizing.mdPadding}px`,
                  }}
                >
                  {centralData.selectedQuestion.question && (
                    <Fade
                      timeout={500}
                      in
                      mountOnEnter
                      unmountOnExit
                      style={{ width: '100%' }}
                    >
                      <Box style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: `${theme.sizing.mdPadding}px` }}>
                        <DetailedQuestionSubCard
                          cardType={CardType.CORRECT}
                          answer={
                            centralData.selectedQuestion.question?.choices?.find((answer) => answer.isAnswer)?.text ?? ''
                          }
                          instructions={centralData.selectedQuestion.question?.instructions ?? []}
                        />
                        <Box
                          style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: `${theme.sizing.xSmPadding}px`,
                          }}
                        >
                          {centralData.selectedQuestion.question?.choices
                            ?.filter((choice) => !choice.isAnswer)
                            .map((choice) => (
                              <DetailedQuestionSubCard
                                key={uuidv4()}
                                cardType={CardType.INCORRECT}
                                answer={choice.text}
                                answerReason={choice.reason}
                              />
                            ))}
                        </Box>
                      </Box>
                    </Fade>
                  )}
                </Box>
              </BodyContainer>
            </CreateGameBoxContainer>
          </CreateGameContentContainer>
        )
      )}
    </CreateGameMainContainer>
  );
}

