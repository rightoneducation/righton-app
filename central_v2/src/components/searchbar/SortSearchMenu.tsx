import React, { useState } from 'react';
import { Box, Typography, useTheme, styled, Select } from '@mui/material';
import { GradeTarget, SortType, SortDirection } from '@righton/networking';
import { ScreenSize } from '../../lib/CentralModels';
import {
  SortContainer,
  SortButton,
  SortLabel,
  SortArrowContainer,
  SortMenuArrowContainer,
  SortMenu,
  SortMenuItem,
} from '../../lib/styledcomponents/SortSearch';
import SortArrows from '../../images/SortArrows.svg';
import SortArrow from '../../images/sortArrow.svg';

const SelectedIcon = styled('img')(({ theme }) => ({
  filter: 'invert(100%) sepia(8%) saturate(0%) hue-rotate(198deg) brightness(112%) contrast(101%)'
}));

interface SortSearchMenuProps {
  screenSize: ScreenSize;
  handleSortChange: (sort: {
    field: SortType;
    direction: SortDirection;
  }) => void;
}

export default function SortSearchMenu({
  screenSize,
  handleSortChange,
}: SortSearchMenuProps) {
  const theme = useTheme();
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<{
    field: SortType | null;
    direction: SortDirection;
  }>({ field: null, direction: SortDirection.ASC });
  const sortTypeMap = {
    'Date Updated': SortType.listGameTemplatesByDate,
    'Most Popular': SortType.listGameTemplates,
    'Grade Level': SortType.listGameTemplatesByGrade,
    'Question Count': SortType.listGameTemplatesByQuestionCount,
  };

  // updates copy of array that will be sent to parent component on click of choose button
  const preSortChange = (selectSort: {
    field: SortType;
    direction: SortDirection;
  }) => {
    const inverseDirection =
      selectSort.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;
    const newDirection =
      selectedSort.field === selectSort.field
        ? inverseDirection
        : SortDirection.ASC;
    setSelectedSort({ field: selectSort.field, direction: newDirection });
    handleSortChange({ field: selectSort.field, direction: newDirection });
  };
  return (
    <SortContainer>
      <SortButton
        screenSize={screenSize ?? ScreenSize.SMALL}
        onClick={(prev) => setIsSortOpen(!isSortOpen)}
      >
        <SortArrowContainer isSortOpen={isSortOpen}>
          <img src={SortArrows} alt="Sort Arrow" />
        </SortArrowContainer>
        {screenSize !== ScreenSize.SMALL && <SortLabel>Sort</SortLabel>}
      </SortButton>
      <SortMenu isSortOpen={isSortOpen}>
        {Object.keys(sortTypeMap).map((sortType) => (
          <SortMenuItem
            key={sortType}
            isSelected={selectedSort.field ===
              sortTypeMap[sortType as keyof typeof sortTypeMap]}
            onClick={() =>
              preSortChange({
                field: sortTypeMap[sortType as keyof typeof sortTypeMap],
                direction: selectedSort.direction,
              })
            }
          >
            <Typography
              fontSize="16px"
              color={
                selectedSort.field ===
                  sortTypeMap[sortType as keyof typeof sortTypeMap] &&
                selectedSort.direction
                  ? 'white'
                  : `${theme.palette.primary.sortText}`
              }
            >
              {sortType}
            </Typography>
            <SortMenuArrowContainer
              isSortOpen
              selectedSort={selectedSort}
              currentSort={sortTypeMap[sortType as keyof typeof sortTypeMap]}
            >
              { (selectedSort.field ===
                  sortTypeMap[sortType as keyof typeof sortTypeMap])
              ? <SelectedIcon src={SortArrow} alt="Sort Direction Icon" />
              : <img src={SortArrow} alt="Sort Direction Icon" />
              }
            </SortMenuArrowContainer>
          </SortMenuItem>
        ))}
      </SortMenu>
    </SortContainer>
  );
}
