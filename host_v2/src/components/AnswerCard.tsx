import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box, LinearProgress } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { GameSessionState, IHostTeamAnswersResponse } from '@righton/networking';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import AnswerOptionStyled from '../lib/styledcomponents/AnswerOptionStyled';
import InputNum from '../lib/styledcomponents/footer/InputNum';

interface AnswerCardProps {
  isCorrectAnswer: boolean;
  answerIndex: number;
  answerContent: string;
  instructions: string[] | null;
  answerReason: string | null;
  isShortAnswerEnabled: boolean;
  response: IHostTeamAnswersResponse | null;
}

const BarContainer = styled(Box)({
  position: 'relative',
  width: '100%',
});

const StyledAnswerBar = styled(LinearProgress)({
  height: '18px',
  width: '100%',
  borderRadius: '3px',
  paddingLeft: '4px',
  paddingRight: '4px',
  boxSizing: 'border-box'
});

const AnswerTitleTypography = styled(Typography)({
  lineHeight: '28px',
  fontFamily: 'Karla',
  fontWeight: '800',
  fontSize: '24px',
  color: 'black',
});

export default function  AnswerCard({
  isCorrectAnswer,
  answerIndex,
  answerContent,
  instructions,
  answerReason,
  isShortAnswerEnabled,
  response,
}: AnswerCardProps) {
  const theme = useTheme(); // eslint-disable-line
  const letterCode = response?.multiChoiceCharacter;
  const correctAnswerInstruction = (index: number) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: `${theme.sizing.xSmPadding}px`,
        }}
        key={uuidv4()}
      >
        <Typography
          sx={{
            marginLeft: `${theme.sizing.smPadding}px`,
            fontSize: `${theme.typography.h3.fontSize}px`,
            fontWeight: `${theme.typography.h3.fontWeight}`,
            color: `${theme.palette.primary.darkPurple}`,
            opacity: 0.5
          }}
        >
          {index + 1}
        </Typography>
        <Typography
          sx={{
            marginLeft: `${theme.sizing.xSmPadding}px`,
          }}
        >
          {instructions !== null ? instructions[index] : null}
        </Typography>
      </Box>
    );
  };

  const incorrectAnswerReasoning = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: `${theme.sizing.xSmPadding}px`,
        }}
      >
        <Typography
          sx={{
            marginLeft: `${theme.sizing.xSmPadding}px`,
          }}
        >
          {answerReason}
        </Typography>
      </Box>
    );
  };

  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
        <Box style={{ width: '100%', gap: '16px' }}>
        {isCorrectAnswer
              ? <AnswerTitleTypography> Correct Answer </AnswerTitleTypography>
              : <AnswerTitleTypography> Incorrect Answer </AnswerTitleTypography>}
          <AnswerOptionStyled
            sx={{
              backgroundColor: isCorrectAnswer
                ? theme.palette.primary.correctColor
                : theme.palette.primary.lightGrey,
            }}
          >
            {!isShortAnswerEnabled && 
              <Typography
                sx={{
                  color: `${theme.palette.primary.darkPurple}`,
                  marginRight: `${theme.sizing.xSmPadding}px`,
                  fontWeight: `${theme.typography.h5.fontWeight}`,
                }}
              >
                {letterCode}
              </Typography>
            }
            <Typography>{answerContent}</Typography>
          </AnswerOptionStyled>
          
          <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
            {isCorrectAnswer && instructions !== null
              ? instructions.map((instruction) =>
                  correctAnswerInstruction(instructions.indexOf(instruction)),
                )
              : incorrectAnswerReasoning()}
          </BodyCardContainerStyled>
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
