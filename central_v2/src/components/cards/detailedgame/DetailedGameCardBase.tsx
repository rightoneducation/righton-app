import React from 'react';
import { Typography, RadioGroup, Box, styled } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  PublicPrivateType,
  IGameTemplate,
  CloudFrontDistributionUrl,
} from '@righton/networking';
import {
  QuestionTitleStyled,
  RadioContainerStyled,
  RadioLabelStyled,
  RadioStyled,
  ContentContainerStyled,
  ImageStyled,
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import {
  BaseCardStyled,
  TextContainerStyled,
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import { ButtonCCSS } from '../../../lib/styledcomponents/ButtonStyledComponents';
import { ScreenSize } from '../../../lib/CentralModels';
import PublicPrivateButton from '../../button/publicprivatebutton/PublicPrivateButton';

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
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: screenSize === ScreenSize.SMALL ? 'flex-start' : 'center',
  gap:
    screenSize === ScreenSize.SMALL
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
      isHighlight={false}
      isCardComplete={false}
      dropShadow={dropShadow}
    >
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
        {screenSize !== ScreenSize.SMALL && (
          <Box
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PublicPrivateButton isPublic={isPublic} isDisabled />
          </Box>
        )}
      </CreateQuestionTitleBarStyled>
      <ContentContainerStyled screenSize={screenSize}>
        <CreateQuestionContentRightContainerStyled>
          <Box
            style={{
              height: '100%',
              width: '100%',
              margin: 0,
              padding: '8px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography>{game?.description ?? ''}</Typography>
            <Box
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginTop: '8px',
              }}
            >
              {ccssChips.length > 0 &&
                ccssChips.map((chip) => {
                  return <ButtonCCSS key={uuidv4()}>{chip}</ButtonCCSS>;
                })}
            </Box>
          </Box>
        </CreateQuestionContentRightContainerStyled>
        <Box
          style={{
            width: '100%',
            height: 'auto',
            margin: 0,
            boxSizing: 'border-box',
          }}
        >
          <img
            src={`${CloudFrontDistributionUrl}${game?.imageUrl ?? ''}`}
            alt="question"
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
        </Box>
        {screenSize === ScreenSize.SMALL && (
          <Box
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <PublicPrivateButton isPublic={isPublic} isDisabled={false} />
          </Box>
        )}
      </ContentContainerStyled>
    </BaseCardStyled>
  );
}
