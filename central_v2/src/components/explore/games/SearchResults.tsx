import React from 'react';
import { Grid, Typography, Box, CircularProgress, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IGameTemplate, IQuestionTemplate, ElementType } from '@righton/networking';
import StyledGameCard from '../../cards/GameCard';
import { ScreenSize } from '../../../lib/CentralModels';
import placeHolder from '../../../images/placeHolder.svg';


interface SearchResultsProps {
  screenSize: ScreenSize;
  searchedElements: IGameTemplate[] | IQuestionTemplate[];
  searchTerm: string;
  grades: string[];
  isLoading: boolean;
  elementType: ElementType;
}

interface SearchedTextProps {
    screenSize: ScreenSize;
  }

const SearchedText = styled(Typography)< SearchedTextProps>(({ screenSize, theme }) => ({
 lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : '40px',
  color: `${theme.palette.primary.extraDarkBlue}`,
  textAlign: 'center'
}));
const GradesText = styled(Typography)< SearchedTextProps>(({ screenSize, theme }) => ({
    lineHeight: screenSize === ScreenSize.SMALL ? '30px' : '36px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: screenSize === ScreenSize.SMALL ? '20px' : `${theme.sizing.mdPadding}px`,
    color: `${theme.palette.primary.extraDarkBlue}`,
    fontStyle: 'italic',
    textAlign: 'center'
  }));
  const ResultsLengthText = styled(Typography)< SearchedTextProps>(({ screenSize, theme }) => ({
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: screenSize === ScreenSize.SMALL ? `${theme.sizing.smPadding}px` : '20px',
    color: `${theme.palette.primary.extraDarkBlue}`,
  }));
  const NoResultsText = styled(Typography)<SearchedTextProps>(({ screenSize, theme }) => ({
    lineHeight: screenSize === ScreenSize.SMALL ? `${theme.sizing.smPadding}px` : `${theme.sizing.mdPadding}px`,
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: screenSize === ScreenSize.SMALL ? '12px' : `${theme.sizing.smPadding}px`,
    color: '#384466',
    justifyContent: 'center',
    display: 'flex',
    textAlign: 'center'
}));

interface SearchResultsContainerProps {
  screenSize: ScreenSize;
  children: React.ReactNode;
}

function SearchResultsContainer({ screenSize, children }: SearchResultsContainerProps) {
    const theme = useTheme();
    return (
    <Box
      sx={{
        minHeight: screenSize === ScreenSize.LARGE ? 'calc(100vh - 182px)' : 'calc(100vh - 147px)', // values so the baby blue covers page exactly
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#E9F1FF',
        padding: screenSize === ScreenSize.SMALL ? `${theme.sizing.smPadding}px ${theme.sizing.mdPadding}px` : `${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px`,
        boxSizing: 'border-box',
        gap: screenSize === ScreenSize.SMALL ? `${theme.sizing.smPadding}px` : `${theme.sizing.mdPadding}px`,
      }}
    >
      {children}
    </Box>
  );
}

function formatGrades(grades: string[]): string {
    if (grades.length === 0) return '';
    if (grades.length === 1) return grades[0];
    if (grades.length === 2) return `${grades[0]} and ${grades[1]}`;
    return `${grades.slice(0, -1).join(', ')}, and ${grades[grades.length - 1]}`;
  }

export default function SearchResults({ screenSize, searchedElements, searchTerm, grades, isLoading, elementType }: SearchResultsProps) {
    const formattedGrades = formatGrades(grades);
    const theme = useTheme();
  return (
    <SearchResultsContainer screenSize={screenSize}>
        <Box style={{gap: `${theme.sizing.xSmPadding}px`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <SearchedText screenSize={screenSize}>
              Results for &quot;{searchTerm}&quot;
          </SearchedText>
          {isLoading 
            ? <CircularProgress style={{color:`${theme.palette.primary.circularProgress}`}}/>
            : 
              <>
                {searchedElements.length > 0 && (
                  <ResultsLengthText screenSize={screenSize}>
                    {searchedElements.length} results
                  </ResultsLengthText>
                )}
                {grades.length > 0 && (
                <GradesText screenSize={screenSize}>
                  in {formattedGrades}
                </GradesText>
                )}
              </>
          }
      </Box> 
      {!isLoading && (        
        searchedElements.length > 0 ? (
          <Grid container spacing={2} id="scrollableDiv"/>
        ) : (
          <Box alignItems='center'>
            <NoResultsText screenSize={screenSize}>
              There are no results for &quot;{searchTerm}&quot;
            </NoResultsText>
            <NoResultsText screenSize={screenSize}>
              Please check your spelling or try a different term
            </NoResultsText>
          </Box>
        )
      )}
    </SearchResultsContainer>
  );
}
