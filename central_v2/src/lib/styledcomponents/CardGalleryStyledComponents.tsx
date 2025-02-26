import React from 'react';
import { Typography, styled } from '@mui/material';
import { ScreenSize } from '../CentralModels';

interface MostPopularTextProps {
  screenSize: ScreenSize;
}

export const MostPopularText = styled(Typography)<MostPopularTextProps>(
  ({ theme, screenSize }) => ({
    lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize:
      screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : '40px',
    color: `${theme.palette.primary.extraDarkBlue}`,
  }),
);

interface SearchedTextProps {
  screenSize: ScreenSize;
}

export const SearchedText = styled(Typography)<SearchedTextProps>(
  ({ screenSize, theme }) => ({
    lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize:
      screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : '40px',
    color: `${theme.palette.primary.extraDarkBlue}`,
    textAlign: 'center',
  }),
);

export const GradesText = styled(Typography)<SearchedTextProps>(
  ({ screenSize, theme }) => ({
    lineHeight: screenSize === ScreenSize.SMALL ? '30px' : '36px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize:
      screenSize === ScreenSize.SMALL ? '20px' : `${theme.sizing.mdPadding}px`,
    color: `${theme.palette.primary.extraDarkBlue}`,
    fontStyle: 'italic',
    textAlign: 'center',
  }),
);

export const ResultsLengthText = styled(Typography)<SearchedTextProps>(
  ({ screenSize, theme }) => ({
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize:
      screenSize === ScreenSize.SMALL ? `${theme.sizing.smPadding}px` : '20px',
    color: `${theme.palette.primary.extraDarkBlue}`,
  }),
);

export const NoResultsText = styled(Typography)<SearchedTextProps>(
  ({ screenSize, theme }) => ({
    lineHeight:
      screenSize === ScreenSize.SMALL
        ? `${theme.sizing.smPadding}px`
        : `${theme.sizing.mdPadding}px`,
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize:
      screenSize === ScreenSize.SMALL ? '12px' : `${theme.sizing.smPadding}px`,
    color: '#384466',
    justifyContent: 'center',
    display: 'flex',
    textAlign: 'center',
  }),
);
