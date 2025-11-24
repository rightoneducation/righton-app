import React from 'react';
import { Typography, Box, styled, useTheme } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  PublicPrivateType,
  IGameTemplate,
  CloudFrontDistributionUrl,
} from '@righton/networking';
import {
  QuestionTitleStyled,
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import {
  BaseCardStyled,
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import { ButtonCCSS } from '../../../lib/styledcomponents/ButtonStyledComponents';
import { ScreenSize } from '../../../lib/CentralModels';

interface DetailedGameCardBaseProps {
  screenSize: ScreenSize;
  game: IGameTemplate | null;
  dropShadow?: boolean;
}

interface CreateQuestionTitleBarStyledProps {
  screenSize: ScreenSize;
}

export const CreateQuestionTitleBarStyled = styled(
  Box,
)<CreateQuestionTitleBarStyledProps>(({ theme, screenSize }) => ({
  width: '100%',
  height: 'fit-content',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: screenSize !== ScreenSize.LARGE ? 'flex-start' : 'center',
  gap:
    screenSize !== ScreenSize.LARGE
      ? `${theme.sizing.xSmPadding}px`
      : `${theme.sizing.smPadding}px`,
}));

export const CreateQuestionContentRightContainerStyled = styled(Box)(
  ({ theme }) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.sizing.xSmPadding}px`,
  }),
);

export default function DetailedGameCardBase({
  screenSize,
  game,
  dropShadow,
}: DetailedGameCardBaseProps) {
  const theme = useTheme();
  const [questionType, setQuestionType] = React.useState<string>('A');
  const [isPublic, setIsPublic] = React.useState<boolean>(
    game?.publicPrivateType === PublicPrivateType.PUBLIC,
  );
  const handleQuestionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionType((event.target as HTMLInputElement).value);
  };
  let ccssChips: string[] = [];
  if (game?.questionTemplates)
    ccssChips = game.questionTemplates?.map(
      (question) => question.questionTemplate.ccss,
    );
  const handlePublicPrivateChange = () => {
    setIsPublic((prev) => !prev);
  };

  return (
    <BaseCardStyled
      elevation={6}
      isCardComplete={false}
      style={{
        maxWidth: screenSize !== ScreenSize.LARGE ? '100%' : '410px',
      }}
    >
      <Box style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.sizing.xSmPadding}px`,
      }}>
        <CreateQuestionTitleBarStyled screenSize={screenSize}>
          <Box
            style={{
              width: '100%',
              display: 'flex',
              justifyContent:
                screenSize === ScreenSize.SMALL ? 'space-between' : 'flex-start',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <QuestionTitleStyled>{game?.title || ''}</QuestionTitleStyled>
          </Box>
          <Box
            style={{
              width: 'fit-content',
              padding: `${theme.sizing.xxSmPadding}px ${theme.sizing.smPadding}px`,
              borderRadius: '12px',
              backgroundColor: `${theme.palette.primary.buttonPrimaryDefault}`,
              color: '#FFFFFF',
            }}
          >
            {game?.publicPrivateType === PublicPrivateType.PUBLIC ? 'Public' : 'Private'}
          </Box>
        </CreateQuestionTitleBarStyled>
        <Box
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {ccssChips.length > 0 &&
            ccssChips.map((chip) => {
              return <ButtonCCSS key={uuidv4()}>{chip}</ButtonCCSS>;
            })}
        </Box>
      </Box>
      <Box
        style={{
          height: '100%',
          width: '100%',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '8px'
        }}
      >
        <Typography
          sx={{whiteSpace: 'pre-line',}}
        >
          {game?.description ?? ''}
        </Typography>
      </Box>
      <Box
        style={{
          width: '100%',
          height: 'auto',
          margin: 0,
          boxSizing: 'border-box'
        }}
      >
        <img
          src={`${CloudFrontDistributionUrl}${game?.imageUrl ?? ''}`}
          alt="question"
          style={{ width: '100%', height: '185px', objectFit: 'cover', borderRadius: '8px', }}
        />
      </Box>      
    </BaseCardStyled>
  );
}
