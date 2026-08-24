import React from 'react';
import { Box, useTheme, CircularProgress } from '@mui/material';
import {
  IGameTemplate,
  IQuestionTemplate,
  GalleryType,
  GradeTarget,
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
  /** noun for the grade-only headline, e.g. 'Games' / 'Questions' */
  elementLabel?: string;
}

/**
 * Canonical order. A plain .sort() is lexicographic, which puts K after 8 and
 * HS, so ['K','6','HS'] would read "6, HS, and K".
 */
const GRADE_ORDER: string[] = [
  GradeTarget.KINDERGARTEN,
  GradeTarget.GRADEONE,
  GradeTarget.GRADETWO,
  GradeTarget.GRADETHREE,
  GradeTarget.GRADEFOUR,
  GradeTarget.GRADEFIVE,
  GradeTarget.GRADESIX,
  GradeTarget.GRADESEVEN,
  GradeTarget.GRADEEIGHT,
  GradeTarget.HIGHSCHOOL,
];

function formatGrades(grades: string[]): string {
  // copy first -- the caller passes React state straight in, and Array.sort
  // orders in place
  const gradesSorted = [...grades].sort(
    (a, b) => GRADE_ORDER.indexOf(a) - GRADE_ORDER.indexOf(b),
  );
  if (gradesSorted.length === 0) return '';
  if (gradesSorted.length === 1) return gradesSorted[0];
  if (gradesSorted.length === 2) return `${gradesSorted[0]} and ${gradesSorted[1]}`;
  return `${gradesSorted.slice(0, -1).join(', ')}, and ${gradesSorted[gradesSorted.length - 1]}`;
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
  elementLabel = 'Results',
}: GalleryHeaderTextProps<T>) {
  const theme = useTheme();
  const formattedGrades = formatGrades(grades ?? []);
  const hasSearch = (searchedTerm ?? '').trim().length > 0;
  const hasGrades = (grades ?? []).length > 0;
  // a grade-only filter reads as "Games for Grades 6, 7, and 8" rather than
  // `Results for ""` above a separate grades line. With a term present the two
  // stay split, so the grades are never shown twice.
  const gradeSuffix = `for Grade${(grades ?? []).length > 1 ? 's' : ''} ${formattedGrades}`;
  let headline = elementLabel;
  if (hasSearch) headline = `Results for "${searchedTerm}"`;
  else if (hasGrades) headline = `${elementLabel} ${gradeSuffix}`;
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
      <SearchedText screenSize={screenSize}>{headline}</SearchedText>
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
          {hasSearch && hasGrades && (
            <GradesText screenSize={screenSize}>{gradeSuffix}</GradesText>
          )}
          {searchedElements && searchedElements.length === 0 && (
            <>
              <ResultsLengthText
                screenSize={screenSize}
                style={{ fontSize: '16px', paddingTop: '24px' }}
              >
                There are no results for {searchedTerm}.
              </ResultsLengthText>
              <ResultsLengthText
                screenSize={screenSize}
                style={{ fontSize: '16px' }}
              >
                Please check your spelling or try a different term
              </ResultsLengthText>
            </>
          )}
        </>
      )}
    </Box>
  );
}
