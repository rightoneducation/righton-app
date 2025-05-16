import React from 'react';
import { ThemeProvider, StyledEngineProvider, useMediaQuery, useTheme } from '@mui/material';
import Theme from './lib/Theme';
import { MathBackground, QOTDMainContainer, QOTDBoxContainer, QuestionTitleStyled } from './lib/styledComponents/QOTDStyledComponents';
import QOTDCardBase, { QOTDTitleBarStyled } from './components/cards/QOTDCardBase';
import { ScreenSize } from './lib/CentralModels';

function App() {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const screenSize = isLargeScreen // eslint-disable-line
  ? ScreenSize.LARGE
  : isMediumScreen
    ? ScreenSize.MEDIUM
    : ScreenSize.SMALL;

  return (
    <StyledEngineProvider injectFirst>
   <ThemeProvider theme={Theme}>
    <MathBackground />
    <QOTDMainContainer>
      <QOTDBoxContainer>
          <QuestionTitleStyled align='center' sx={{ fontSize: "32px", color: "#384466" }}>
          Question of The Day
          </QuestionTitleStyled>
        <QOTDCardBase screenSize={screenSize} />
      </QOTDBoxContainer>
    </QOTDMainContainer>
   </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
