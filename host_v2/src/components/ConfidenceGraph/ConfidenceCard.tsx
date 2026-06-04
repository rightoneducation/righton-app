import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IHostTeamAnswersConfidence } from '@righton/networking';
import { IGraphClickInfo } from '../../lib/HostModels';
import BodyCardContainerStyled from '../../lib/styledcomponents/BodyCardContainerStyled';
import HostDefaultCardStyled from '../../lib/styledcomponents/HostDefaultCardStyled';
import ConfidenceResponsesGraph from './ConfidenceResponseGraph';
import ConfidenceResponseDropdown from './ConfidenceResponseDropdown';

interface CardProps {
  confidences: IHostTeamAnswersConfidence[];
  graphClickInfo: { graph: string | null; selectedIndex: number | null};
  setGraphClickInfo: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}

const CardContentContainer = styled(Box)({
  width: '100%',
  display: 'inline',
});

const SmallTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  marginTop: `${theme.sizing.xSmPadding}px`,
}));

const InstructionsText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.feedbackCardsInstructionsColor}`,
  fontSize: `${theme.typography.h4.fontSize}`,
}));

export default function ConfidenceCard({
  confidences,
  graphClickInfo,
  setGraphClickInfo,
}: CardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <HostDefaultCardStyled elevation={10}>
      <BodyCardContainerStyled spacing={2}>
        <CardContentContainer>
          <Typography variant='h3' style={{color: theme.palette.primary.main}}>
            {t('gamesession.confidenceCard.title')}
          </Typography>
          <SmallTextContainer>
             <Typography variant='label' style={{color: theme.palette.primary.main}}>
              {t('gamesession.confidenceCard.description')}
            </Typography>
          </SmallTextContainer>
          <ConfidenceResponsesGraph
            confidences={confidences}
            graphClickIndex={graphClickInfo.graph === 'confidence' ? graphClickInfo.selectedIndex : null}
            setGraphClickInfo={setGraphClickInfo}
          />
          {graphClickInfo.selectedIndex !== null ? (
            <ConfidenceResponseDropdown
              graphClickIndex={graphClickInfo.selectedIndex}
              selectedConfidence={confidences[graphClickInfo.selectedIndex]}
            />
          ) : (
            <SmallTextContainer>
              <InstructionsText>
                {t('gamesession.confidenceCard.instructions')}
              </InstructionsText>
            </SmallTextContainer>
          )}
        </CardContentContainer>
      </BodyCardContainerStyled>
    </HostDefaultCardStyled>
  );
}
