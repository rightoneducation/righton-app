import React from 'react';
import { ElementType, IGameTemplate, IQuestionTemplate } from '@righton/networking';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import CardCarousal from './CardCarousal';
import { ScreenSize } from '../../lib/CentralModels';
import PaginationContainerStyled from '../../lib/PaginationContainerStyled';

interface RecommendedProps {
  screenSize: ScreenSize;
  recommendedElements: IGameTemplate[] | IQuestionTemplate[];
  elementType: ElementType;
}
interface RecommendedGamesContainerProps {
  screenSize: ScreenSize;
}

const RecommendedContainer = styled(Box)<RecommendedGamesContainerProps>(({ theme, screenSize }) => ({
  height: screenSize === ScreenSize.SMALL ? '368px': '408px', 
  gap: `${theme.sizing.smPadding}px`,
  display: 'flex', 
  width: '100%',
  flexDirection: 'column', 
  alignItems: 'center', 
  backgroundColor: `${theme.palette.primary.extraDarkBlue}` 
}));

const Title = styled(Typography)<{ screenSize: ScreenSize }>(({ screenSize, theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : '40px',
  lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
  color: '#FFFFFF',
}));

export default function Recommended({ screenSize, recommendedElements, elementType }: RecommendedProps) {
  const theme = useTheme(); 

  return (
    <RecommendedContainer screenSize={screenSize}>
      <Title screenSize={screenSize}>
        Recommended {elementType === ElementType.GAME ? 'Games' : 'Questions' }
      </Title>
      <CardCarousal recommendedElements={recommendedElements} elementType={elementType}/>
      <PaginationContainerStyled className="swiper-pagination-container"/>
    </RecommendedContainer>
  );
}