import React from 'react';
import {
  IQuestionTemplate,
  CloudFrontDistributionUrl,
} from '@righton/networking';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import { ButtonCCSS } from '../../lib/styledcomponents/ButtonStyledComponents';
import FavouriteButton from '../button/favouritebutton/FavouriteButton';
import { useCentralDataState } from '../../hooks/context/useCentralDataContext';
import { UserStatusType } from '../../lib/CentralModels';

interface StyledQuestionCardProps {
  id: string;
  title: string;
  image: string;
  question: IQuestionTemplate;
  isCarousel: boolean;
  isFavorite: boolean;
  // per-consumer clamp, same strategy as GameCard's isCarousel ? 5 : 3. Default
  // keeps the carousel and the masonry CardGallery exactly as they were.
  descriptionLineClamp?: number;
  // the card has a definite height, so the text box must size to its clamp
  // rather than being stretched to fill the leftover space
  isFixedHeight?: boolean;
  handleViewButtonClick: (element: IQuestionTemplate) => void;
  handleCloneButtonClick: (element: IQuestionTemplate) => void;
}

const QuestionImage = styled('img')({
  width: '100%',
  height: '186px',
  minHeight: '186px',
  objectFit: 'cover',
});

const CarouselQuestionImage = styled(QuestionImage)(({ theme }) => ({
  borderRadius: `${theme.sizing.xSmPadding}px 0 0 0`,
  paddingTop: '1px',
  paddingLeft: '1px',
  paddingRight: '1px',
  boxSizing: 'border-box',
}));

const QuestionCard = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  boxShadow: `0px ${theme.sizing.xSmPadding}px ${theme.sizing.smPadding}px -4px #5C769166`,
  background: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  overflow: 'hidden',
  position: 'relative',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  gap: `${theme.sizing.xSmPadding + theme.sizing.xxSmPadding}px`,
  paddingTop: `${theme.sizing.smPadding}px`,
  paddingLeft: `${theme.sizing.mdPadding}px`,
  paddingRight: `${theme.sizing.mdPadding}px`,
  paddingBottom: `${theme.sizing.mdPadding}px`,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}));

const TitleContainer = styled(Box)(() => ({
  width: '100%',
  height: '25px',
  display: 'flex',
  justifyContent: 'space-between',
}));

const DescriptionText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'lineClamp' && prop !== 'isFixedHeight',
})<{ lineClamp: number; isFixedHeight: boolean }>(
  ({ theme, lineClamp, isFixedHeight }) => ({
    // flex: 1 stretches this past the clamped text, leaving overflow: hidden
    // nothing to clip -- lines past the clamp then render below its ellipsis.
    // Only bites when the card has a definite height.
    flex: isFixedHeight ? 'none' : 1,
    height: 'auto',
    fontFamily: 'Rubik',
    fontWeight: '400',
    fontSize: `${theme.sizing.smPadding}px`,
    lineHeight: '18.96px',
    color: '#384466',
    display: '-webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lineClamp,
  }),
);

const BottomButtonBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFixedHeight',
})<{ isFixedHeight: boolean }>(({ theme, isFixedHeight }) => ({
  width: '100%',
  gap: `${theme.sizing.xSmPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  // takes over the bottom-pinning that flex: 1 on DescriptionText was doing
  marginTop: isFixedHeight ? 'auto' : undefined,
}));

export default function StyledQuestionCard({
  id,
  title,
  image,
  question,
  isCarousel,
  isFavorite,
  descriptionLineClamp = 5,
  isFixedHeight = false,
  handleViewButtonClick,
  handleCloneButtonClick,
}: StyledQuestionCardProps) {
  const domainAndGrade = `${question.grade}.${question.domain}`;
  const centralData = useCentralDataState();
  return (
    <QuestionCard>
      {isCarousel ? (
        <CarouselQuestionImage
          src={`${CloudFrontDistributionUrl}${image}`}
          alt="Tag"
        />
      ) : (
        <QuestionImage src={`${CloudFrontDistributionUrl}${image}`} alt="Tag" />
      )}
      {centralData.userStatus === UserStatusType.LOGGEDIN && (
        <FavouriteButton isEnabled isGame={false} id={id} />
      )}
      <ContentContainer>
        <TitleContainer>
          <ButtonCCSS key={`${domainAndGrade}-${id}`}>
            {domainAndGrade}
          </ButtonCCSS>
        </TitleContainer>
        <DescriptionText
          lineClamp={descriptionLineClamp}
          isFixedHeight={isFixedHeight}
        >
          {title}
        </DescriptionText>
        <BottomButtonBox isFixedHeight={isFixedHeight}>
          <CentralButton
            buttonType={ButtonType.VIEW}
            isEnabled
            onClick={() => handleViewButtonClick(question)}
          />
          {centralData.userStatus === UserStatusType.LOGGEDIN && (
            <CentralButton
              buttonType={ButtonType.CLONE}
              isEnabled
              onClick={() => handleCloneButtonClick(question)}
            />
          )}
        </BottomButtonBox>
      </ContentContainer>
    </QuestionCard>
  );
}
