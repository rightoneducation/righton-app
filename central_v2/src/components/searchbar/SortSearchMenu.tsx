import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
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

interface SortSearchMenuProps {
  screenSize: ScreenSize;
  handleChooseGrades: (grades: GradeTarget[]) => void;
}

export default function SortSearchMenu ({
  screenSize,
  handleChooseGrades,
}: SortSearchMenuProps ){
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<{ field: SortType, direction: SortDirection }>({ field: SortType.listGameTemplatesByDate, direction: SortDirection.ASC });
  const sortTypeMap = {
    'Date Updated': SortType.listGameTemplatesByDate,
    'Most Popular': SortType.listGameTemplates,
    'Grade Level': SortType.listGameTemplatesByGrade,
    'Question Count': SortType.listGameTemplatesByQuestionCount,
  };

  // updates copy of array that will be sent to parent component on click of choose button
  const handleSortChange = (selectSort: {field: SortType, direction: SortDirection}) => {
    const inverseDirection = selectSort.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
    const newDirection = selectedSort.field === selectSort.field ? inverseDirection : SortDirection.ASC;
    setSelectedSort({field: selectSort.field, direction: newDirection});
  };
  return (
    <SortContainer>
    <SortButton screenSize={screenSize ?? ScreenSize.SMALL} onClick={(prev) => setIsSortOpen(!isSortOpen)}>
      <SortArrowContainer isSortOpen={isSortOpen}>
        <img src={SortArrows} alt="Sort Arrow" />
      </SortArrowContainer>
      { screenSize !== ScreenSize.SMALL &&
        <SortLabel>Sort</SortLabel>
      }
    </SortButton>
      <SortMenu isSortOpen={isSortOpen}>
      {Object.keys(sortTypeMap).map((sortType) => (
        <SortMenuItem key={sortType} onClick={() => handleSortChange({field: sortTypeMap[sortType as keyof typeof sortTypeMap], direction: selectedSort.direction})}>
          <Box style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
            <Typography
              fontSize='16px'
              fontWeight={selectedSort.field === sortTypeMap[sortType as keyof typeof sortTypeMap] && selectedSort.direction ? 'bold' : 'normal'}
            >
              {sortType}
            </Typography>
            <SortMenuArrowContainer isSortOpen selectedSort={selectedSort} currentSort={sortTypeMap[sortType as keyof typeof sortTypeMap]}>
              <img src={SortArrow} alt="Sort Direction Icon"/>
            </SortMenuArrowContainer>
          </Box>
        </SortMenuItem>
          ))}
      </SortMenu>
    </SortContainer>
  );
}