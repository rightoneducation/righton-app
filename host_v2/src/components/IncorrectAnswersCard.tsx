import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { IHostTeamAnswersResponse } from '@righton/networking';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import { BodyCardStyled } from '../lib/styledcomponents/BodyCardStyled';
import AnswerOptionStyled from '../lib/styledcomponents/AnswerOptionStyled';

interface IncorrectAnswersCardProps {
  responses: IHostTeamAnswersResponse[] | null;
  isShortAnswerEnabled: boolean;
}

export default function IncorrectAnswersCard({
  responses,
  isShortAnswerEnabled
}: IncorrectAnswersCardProps) {
  const theme = useTheme(); // eslint-disable-line

  return (
    <BodyCardStyled elevation={6}>
      <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
        <Box style={{ width: '100%', gap: '16px' }}>
          <Typography variant='rubikBody'> Incorrect Answer </Typography>

          {responses && responses.map((response, index) => (
            response.multiChoiceCharacter !== `…` && (
            <>
              <AnswerOptionStyled
                sx={{
                  backgroundColor: theme.palette.primary.lightGrey,
                }}
              >
                {!isShortAnswerEnabled && 
                  <Typography
                    variant='rubikBodyLarge'
                    sx={{
                      color: theme.palette.designSystem.surface.play,
                      marginRight: `${theme.sizing.xSmPadding}px`,
                      opacity: 0.5
                    }}
                  >
                    <b>{response.multiChoiceCharacter}</b>
                  </Typography>
                }
                <Typography 
                  variant='rubikBodyLarge' 
                  sx={{
                    color: `${theme.palette.designSystem.surface.play}`, 
                    whiteSpace: 'pre-line'
                  }}
                >
                    {response.rawAnswer}
                </Typography>
              </AnswerOptionStyled>
              
              <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
  
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
                          whiteSpace: 'pre-line'
                        }}
                      >
                        {response.reason}
                      </Typography>
                    </Box>
              </BodyCardContainerStyled>
            </>
          )))}
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
