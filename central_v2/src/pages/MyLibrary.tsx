import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IAPIClients, IQuestionTemplate } from '@righton/networking';
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box, Button } from '@mui/material';
import LibraryTabs from '../components/librarytabs/LibraryTabs';
import { ScreenSize } from '../lib/CentralModels';
import { MyLibraryMainContainer, MyLibraryBackground } from '../lib/styledcomponents/MyLibraryStyledComponent';

interface MyLibraryProps {
  apiClients: IAPIClients;
}


  // screenSize: ScreenSize;
  // isTabsOpen: boolean;
  // question: IQuestionTemplate;
  // questions: IQuestionTemplate[];
  // handleBackToExplore: () => void;
  // handlePrevQuestion: () => void;
  // handleNextQuestion: () => void;

export default function MyLibrary({ apiClients }: MyLibraryProps) {
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
  const [questions, setQuestions] = useState<IQuestionTemplate[]>([]);

  return (
        <MyLibraryMainContainer>
          <MyLibraryBackground/>
            <LibraryTabs screenSize={screenSize} questions={questions}/>
        </MyLibraryMainContainer>
  );
}
