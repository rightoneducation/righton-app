import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, styled } from '@mui/material';
import { APIClients, IGameTemplate } from '@righton/networking';
import StyledGameCard from './GameCard';
import { ScreenSize } from '../lib/HostModels';
import placeHolder from '../images/placeHolder.svg';


interface SearchResultsProps {
  screenSize: ScreenSize;
  apiClients: APIClients;
  searchedGames: IGameTemplate[];
  searchTerm: string;
  grades: string[];
}

interface SearchedTextProps {
    screenSize: ScreenSize;
  }

const SearchedText = styled(Typography)(({ screenSize }: SearchedTextProps) => ({
 lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: screenSize === ScreenSize.SMALL ? '24px' : '40px',
  color: '#02215F',
}));
const GradesText = styled(Typography)(({ screenSize }: SearchedTextProps) => ({
    lineHeight: screenSize === ScreenSize.SMALL ? '30px' : '36px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: screenSize === ScreenSize.SMALL ? '20px' : '24px',
    color: '#02215F',
    fontStyle: 'italic',
  }));
  const ResultsLengthText = styled(Typography)(({ screenSize }: SearchedTextProps) => ({
    // lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: screenSize === ScreenSize.SMALL ? '16px' : '20px',
    color: '#02215F',
  }));

interface SearchResultsContainerProps {
  screenSize: ScreenSize;
  children: React.ReactNode;
}

function SearchResultsContainer({ screenSize, children }: SearchResultsContainerProps) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#E9F1FF',
        padding: screenSize === ScreenSize.SMALL ? '16px 24px 16px 24px' : '24px 32px 24px 32px',
        boxSizing: 'border-box',
        gap: screenSize === ScreenSize.SMALL ? '16px' : '24px',
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

  
export default function SearchResults({ screenSize, apiClients, searchedGames, searchTerm, grades }: SearchResultsProps) {
    const formattedGrades = formatGrades(grades);

  return (
    <SearchResultsContainer screenSize={screenSize}>
        <Box style={{gap: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <SearchedText screenSize={screenSize}>
            Results for &quot;{searchTerm}&quot;
        </SearchedText>
      {grades.length > 0 && (
        <GradesText screenSize={screenSize}>
          in {formattedGrades}
        </GradesText>
      )}
      </Box>
       <ResultsLengthText screenSize={screenSize}>
            {searchedGames.length} results
        </ResultsLengthText>
        <Grid container spacing={2} id="scrollableDiv" style={{ }}>
          {searchedGames.map((game) => (
            <Grid
              item
              xs={12}
              md={6} // 700
              xl={4}
              key={game.id} 
            >
              <StyledGameCard
                game={game}
                id={game.id}
                title={game.title}
                description={game.description}
                image={game.imageUrl || placeHolder}
                apiClients={apiClients}
              />
            </Grid>
          ))}
        </Grid>
    </SearchResultsContainer>
  );
}
