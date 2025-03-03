import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IAPIClients, IQuestionTemplate } from '@righton/networking';
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box, Button } from '@mui/material';
import LibraryTabsContainer from '../components/librarytabs/LibraryTabsContainer';
import { ScreenSize, GameQuestionType } from '../lib/CentralModels';
import { MyLibraryMainContainer, MyLibraryBackground } from '../lib/styledcomponents/MyLibraryStyledComponent';

interface MyLibraryProps {
  apiClients: IAPIClients;
  gameQuestion: GameQuestionType;
}

export default function MyLibrary({ apiClients, gameQuestion }: MyLibraryProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isXLScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const screenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;

  return (
    <MyLibraryMainContainer>
      <MyLibraryBackground/>
        <LibraryTabsContainer screenSize={screenSize} gameQuestion={gameQuestion}/>
    </MyLibraryMainContainer>
  );
}
