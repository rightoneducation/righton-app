import React from 'react';
import { Box, useTheme, CircularProgress } from '@mui/material';
import {
  IGameTemplate,
  IQuestionTemplate,
  GalleryType,
} from '@righton/networking';
import { ScreenSize } from '../../lib/CentralModels';
import {
  SearchedText,
  GradesText,
  ResultsLengthText,
  MostPopularText,
} from '../../lib/styledcomponents/CardGalleryStyledComponents';

interface GalleryHeaderTextProps<T> {
  searchedElements?: T[];
  searchedTerm?: string;
  grades?: string[];
  isLoading?: boolean;
  screenSize: ScreenSize;
  galleryType: GalleryType;
}

function formatGrades(grades: string[]): string {
  if (grades.length === 0) return '';
  if (grades.length === 1) return grades[0];
  if (grades.length === 2) return `${grades[0]} and ${grades[1]}`;
  return `${grades.slice(0, -1).join(', ')}, and ${grades[grades.length - 1]}`;
}

export default function GalleryHeaderText<
  T extends IGameTemplate | IQuestionTemplate,
>({
  searchedElements,
  searchedTerm,
  grades,
  isLoading,
  screenSize,
  galleryType,
}: GalleryHeaderTextProps<T>) {
  const theme = useTheme();
  const formattedGrades = formatGrades(grades ?? []);
  return galleryType === GalleryType.MOST_POPULAR ? (
    <MostPopularText screenSize={screenSize}>Most Popular</MostPopularText>
  ) : (
    <Box
      style={{
        gap: `${theme.sizing.xSmPadding}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <SearchedText screenSize={screenSize}>
        Results for &quot;{searchedTerm}&quot;
      </SearchedText>
      {isLoading ? (
        <CircularProgress
          style={{ color: `${theme.palette.primary.circularProgress}` }}
        />
      ) : (
        <>
          {searchedElements && (
            <ResultsLengthText screenSize={screenSize}>
              {searchedElements.length} results
            </ResultsLengthText>
          )}
          {grades && grades.length > 0 && (
            <GradesText screenSize={screenSize}>
              in {formattedGrades}
            </GradesText>
          )}
            {searchedElements && searchedElements.length === 0 && (
            <>
              <ResultsLengthText screenSize={screenSize} style={{fontSize: '16px', paddingTop: '24px'}}>
                There are no results for {searchedTerm}.
              </ResultsLengthText>
              <ResultsLengthText screenSize={screenSize} style={{fontSize: '16px'}}>
                Please check your spelling or try a different term
              </ResultsLengthText>
            </>
          )}
        </>
      )}
    </Box>
  );
}
