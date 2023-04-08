import React from 'react';
import Card from './Card';
import { styled } from '@mui/material/styles';
import RoundTextIcon from './RoundTextIcon';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import { Paper, Typography, Container } from '@mui/material';
import { isNullOrUndefined, GameSessionState } from '@righton/networking';

const BodyCard = styled(Paper)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '16px',
    marginRight: '16px',
    marginTop: '24px',
    marginBottom: '24px',
    borderRadius: '24px',
    backgroundColor: theme.palette.primary.main,
  })
);

const AnswerContainer = styled(Container)({
  width: '100%',
  marginTop: '20px',
  marginBottom: '20px',
});

interface CardAnswerProps {
  answers: {text: string, isCorrectAnswer: boolean}[] | undefined;
  isSubmitted: boolean;
  handleSubmitAnswer: () => void;
  currentState: GameSessionState;
  selectedAnswer: number | null;
  handleSelectAnswer: (index: number) => void;
}

export default function CardAnswer({
  answers,
  isSubmitted,
  handleSubmitAnswer,
  currentState,
  selectedAnswer,
  handleSelectAnswer
} : CardAnswerProps) {
  const correctText = (
    <> 
      Choose the <Typography sx={{color: 'theme.palette.primary.greenTextColor'}}> correct answer </Typography>
    </>
  )
  const trickText = (
    <> 
      What do you think is the most popular <Typography sx={{color: 'theme.palette.primary.redTextColor'}}>  trick answer </Typography> among your class?
    </>
  )
  const buttonText = "Submit Answer"

  return(
    <BodyCard elevation={3}>
        <Typography variant="h4"> 
          {currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? correctText : trickText}
        </Typography>
        <AnswerContainer>
          {
            answers?.map((answer,index) => {
              return <RoundTextIcon answerStatus={(selectedAnswer === index) ? "selected" : "default"} isSubmitted={isSubmitted} index={index} answerText={answer.text} key={index} handleSelectAnswer={handleSelectAnswer}/>
            })
          }
        </AnswerContainer>
        <ButtonSubmitAnswer isSubmitted={isSubmitted} handleSubmitAnswer={handleSubmitAnswer} isSelected={isNullOrUndefined(selectedAnswer) ? false : true}/>
    </BodyCard>
  )
}

/*const useStyles = makeStyles(theme => ({
  answerCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '16px',
    marginRight: '16px',
    marginTop: '24px',
    marginBottom: '24px'
  },
  titleText: {
    margin: 'auto',
    color: '#384466',
    fontFamily: 'Karla',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: '16px',
    textAlign: 'center',
  },
  titleCorrectText: {
    display:'inline',
    color: '#22AE48',
  },
  titleTrickText: {
    display: 'inline',
    color: '#FF0000',
  },
  answerContainer: {
    width: '100%',
    marginTop: '20px',
    marginBottom: '20px',
  },
}));*/