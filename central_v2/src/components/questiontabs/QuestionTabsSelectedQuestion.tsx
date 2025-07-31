import React from 'react';
import { Box, Grid, CircularProgress, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { IQuestionTemplate } from '@righton/networking';
import DetailedQuestionCardBase from '../cards/detailedquestion/DetailedQuestionCardBase';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import DetailedQuestionSubCard from '../cards/detailedquestion/DetailedQuestionSubCard';
import EditMenu from './EditMenu';
import {
  CardType,
  ScreenSize,
  UserStatusType,
  LibraryTabEnum,
} from '../../lib/CentralModels';
import OwnerTag from '../profile/OwnerTag';
import {
  DetailedQuestionContainer,
  ContentContainer,
  ButtonContainer,
  ButtonContainerLeft,
  ButtonContainerRight,
  CardContainer,
  SubCardGridItem,
  GridItem,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../../hooks/context/useCentralDataContext';

interface TabContainerProps {
  screenSize: ScreenSize;
  question: IQuestionTemplate | null;
  questions: IQuestionTemplate[];
  isLoading: boolean;
  isFavorite: boolean;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  handleCloneButtonClick: () => void;
  handleEditButtonClick: () => void;
  handleFavoriteButtonClick: () => void;
  handleDeleteButtonClick: () => void;
}

export default function QuestionTabsSelectedQuestion({
  screenSize,
  question,
  questions,
  isLoading,
  isFavorite,
  handlePrevQuestion,
  handleNextQuestion,
  handleCloneButtonClick,
  handleEditButtonClick,
  handleFavoriteButtonClick,
  handleDeleteButtonClick,
}: TabContainerProps) {
  const theme = useTheme();
  const centralData = useCentralDataState();
  const isScreenLgst = useMediaQuery('(min-width: 1200px)');
  const isEditEnabled =
    centralData.userStatus === UserStatusType.LOGGEDIN &&
    centralData.userProfile?.id === question?.userId;

  return (
      <>
      
        <ButtonContainer
          style={{
            paddingLeft:
              screenSize === ScreenSize.SMALL
                ? `0px`
                : `${theme.sizing.mdPadding}px`,
            paddingRight:
              screenSize === ScreenSize.SMALL
                ? `0px`
                : `${theme.sizing.mdPadding}px`,
          }}
        >
      
          <ButtonContainerLeft>
            {questions && questions.length > 1 && (
              <CentralButton
                buttonType={ButtonType.PREVIOUSQUESTION}
                isEnabled
                isOnQuestionTab
                iconOnlyOverride={
                  screenSize === ScreenSize.SMALL ||
                  screenSize === ScreenSize.MEDIUM
                }
                onClick={handlePrevQuestion}
              />
              )
            }
          </ButtonContainerLeft>

          <ButtonContainerRight
            style={{
              paddingLeft:
                screenSize === ScreenSize.SMALL
                  ? `${theme.sizing.xxSmPadding}px`
                  : `0px`,
              gap:
                screenSize === ScreenSize.SMALL
                  ? `${theme.sizing.xxSmPadding}px`
                  : `${theme.sizing.smPadding}px`,
            }}
          >
            {centralData.userStatus === UserStatusType.LOGGEDIN && (
              <Box>
                {!isLoading ? (
                  <CentralButton
                    buttonType={
                      !isFavorite ? ButtonType.FAVORITE : ButtonType.UNFAVORITE
                    }
                    isEnabled
                    isOnQuestionTab
                    iconOnlyOverride={screenSize === ScreenSize.SMALL}
                    onClick={handleFavoriteButtonClick}
                  />
                ) : (
                  <Box>
                    <CircularProgress style={{ color: '#FFF' }} />
                  </Box>
                )}
              </Box>
            )}
            <Box>
              <EditMenu
                screenSize={screenSize}
                isEditEnabled={isEditEnabled}
                handleCloneButtonClick={handleCloneButtonClick}
                handleEditButtonClick={handleEditButtonClick}
                handleDeleteButtonClick={handleDeleteButtonClick}
              />
            </Box>
            {questions && questions.length > 1 && (
              <CentralButton
                buttonType={ButtonType.NEXTQUESTION}
                isEnabled
                isOnQuestionTab
                iconOnlyOverride={
                  screenSize === ScreenSize.SMALL ||
                  screenSize === ScreenSize.MEDIUM
                }
                onClick={handleNextQuestion}
              />
            )}
          </ButtonContainerRight>
        </ButtonContainer>
        <CardContainer style={{ paddingBottom: '60px' }}>
            <DetailedQuestionContainer
              container
              sx={{
                gap:
                  screenSize === ScreenSize.SMALL
                    ? '0px'
                    : `${theme.sizing.mdPadding}`,
              }}
            >
              <Grid
                sm
                md
                item
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                {screenSize === ScreenSize.LARGE && (
                  <OwnerTag screenSize={screenSize} />
                )}
              </Grid>
              <GridItem
                screenSize={screenSize}
                sm={10}
                md={12}
                item
                style={{
                  maxWidth: '672px',
                }}
              >
                {(screenSize === ScreenSize.SMALL ||
                  screenSize === ScreenSize.MEDIUM) && (
                  <Box
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <OwnerTag screenSize={screenSize} />
                  </Box>
                )}
                {question && (
                  <>
                    <DetailedQuestionCardBase
                      screenSize={screenSize}
                      question={question}
                    />
                    <Grid container spacing={`${theme.sizing.smPadding}px`}>
                      <SubCardGridItem item sm={12} md={6}>
                        <DetailedQuestionSubCard
                          cardType={CardType.CORRECT}
                          answer={
                            question?.choices?.find((answer) => answer.isAnswer)
                              ?.text ?? ''
                          }
                          instructions={question?.instructions ?? []}
                        />
                      </SubCardGridItem>
                      <SubCardGridItem item sm={12} md={6}>
                        {question &&
                          question.choices
                            ?.filter((choice) => !choice.isAnswer)
                            .map((choice, index) => (
                              <DetailedQuestionSubCard
                                key={uuidv4()}
                                cardType={CardType.INCORRECT}
                                answer={choice.text}
                                answerReason={choice.reason}
                              />
                            ))}
                      </SubCardGridItem>
                    </Grid>
                  </>
                )}
              </GridItem>
              <Grid sm md item />
            </DetailedQuestionContainer>
        </CardContainer>
      </>
  );
}
