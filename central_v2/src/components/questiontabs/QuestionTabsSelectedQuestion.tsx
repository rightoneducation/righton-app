import React from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { IQuestionTemplate } from '@righton/networking';
import DetailedQuestionCardBase from '../cards/detailedquestion/DetailedQuestionCardBase';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import DetailedQuestionSubCard from '../cards/detailedquestion/DetailedQuestionSubCard';
import { CardType, ScreenSize, UserStatusType, LibraryTabEnum } from '../../lib/CentralModels';
import OwnerTag from '../profile/OwnerTag';
import { 
  DetailedQuestionContainer, 
  ContentContainer, 
  ButtonContainer,
  ButtonContainerLeft,
  ButtonContainerRight,
  CardContainer,
  SubCardGridItem,
  GridItem
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import { useCentralDataState, useCentralDataDispatch } from '../../hooks/context/useCentralDataContext';

interface TabContainerProps {
  screenSize: ScreenSize;
  isLoading: boolean;
  isFavorite: boolean;
  question: IQuestionTemplate;
  handleBackToExplore: () => void;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  handleCloneButtonClick: () => void;
  handleFavoriteButtonClick: () => void;
}

export default function QuestionTabsSelectedQuestion({
  screenSize,
  question,
  isLoading,
  isFavorite,
  handleBackToExplore,
  handlePrevQuestion,
  handleNextQuestion,
  handleCloneButtonClick,
  handleFavoriteButtonClick
}: TabContainerProps) {
  const theme = useTheme();
  const centralData = useCentralDataState();
  const isScreenLgst = useMediaQuery('(min-width: 1200px)');

  return (
    <ContentContainer>
      <ButtonContainer>
        <ButtonContainerLeft>
          <CentralButton
            buttonType={ButtonType.PREVIOUSQUESTION}
            isEnabled
            isOnQuestionTab
            iconOnlyOverride={!isScreenLgst}
            onClick={handlePrevQuestion}
          />
          <CentralButton
            buttonType={ButtonType.BACKTOEXPLORE}
            isEnabled
            isOnQuestionTab
            iconOnlyOverride={!isScreenLgst}
            onClick={handleBackToExplore}
          />
        </ButtonContainerLeft>
        <ButtonContainerLeft>
          <ButtonContainerRight>
            {screenSize !== ScreenSize.SMALL &&
            <>
              {centralData.userStatus === UserStatusType.LOGGEDIN &&
                <Box>
                  {!isLoading ? 
                    <CentralButton 
                      buttonType={!isFavorite ? ButtonType.FAVORITE : ButtonType.UNFAVORITE} 
                      isEnabled 
                      isOnQuestionTab
                      iconOnlyOverride={!isScreenLgst}
                      onClick={handleFavoriteButtonClick}
                    />
                    : <Box><CircularProgress style={{ color: '#FFF' }}/></Box>
                  }
                </Box>
              }
            <Box>
              <CentralButton
                buttonType={ButtonType.CLONEANDEDIT}
                isEnabled
                isOnQuestionTab
                iconOnlyOverride={!isScreenLgst}
                onClick={handleCloneButtonClick}
              />
            </Box>
            </>
            }
            <CentralButton
              buttonType={ButtonType.NEXTQUESTION}
              isEnabled
              isOnQuestionTab
              iconOnlyOverride={!isScreenLgst}
              onClick={handleNextQuestion}
            />
          </ButtonContainerRight>
          <ButtonContainerRight>
          {screenSize === ScreenSize.SMALL &&
            <>
              {centralData.userStatus === UserStatusType.LOGGEDIN &&
                <Box>
                  {!isLoading ? 
                    <CentralButton 
                      buttonType={!isFavorite ? ButtonType.FAVORITE : ButtonType.UNFAVORITE} 
                      isEnabled 
                      isOnQuestionTab
                      iconOnlyOverride={!isScreenLgst}
                      onClick={handleFavoriteButtonClick}
                    />
                    : <Box><CircularProgress style={{ color: '#FFF' }}/></Box>
                  }
                </Box>
              }
            <Box>
              <CentralButton
                buttonType={ButtonType.CLONEANDEDIT}
                isEnabled
                isOnQuestionTab
                iconOnlyOverride={!isScreenLgst}
                onClick={handleCloneButtonClick}
              />
            </Box>
            </>
            
            }
            </ButtonContainerRight>
        </ButtonContainerLeft>
      </ButtonContainer>
      <CardContainer style={{paddingBottom: '50px'}}>
        {screenSize !== ScreenSize.LARGE &&
          <OwnerTag screenSize={screenSize}/>
        }
        <DetailedQuestionContainer
          container
        >
          <Grid
            sm
            md
            item
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            {screenSize === ScreenSize.LARGE &&
              <OwnerTag screenSize={screenSize}/>
            }
          </Grid>
          <GridItem
            sm={10}
            md={12}
            item
            style={{
              maxWidth: '672px',
            }}
          >
            <DetailedQuestionCardBase screenSize={screenSize} question={question} />
            <Grid
              container
              spacing={`${theme.sizing.smPadding}px`}
            >
              <SubCardGridItem 
                item
                sm={12}
                md={6}
              >
                <DetailedQuestionSubCard
                  cardType={CardType.CORRECT}
                  answer={
                    question?.choices?.find((answer) => answer.isAnswer)
                      ?.text ?? ''
                  }
                  instructions={question?.instructions ?? []}
                />
              </SubCardGridItem>
              <SubCardGridItem
                item
                sm={12}
                md={6}
              >
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
          </GridItem>
          <Grid sm md item />
        </DetailedQuestionContainer>
      </CardContainer>
    </ContentContainer>
)
}