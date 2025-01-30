import React, { useState } from 'react';
import {
  Box,
  InputAdornment,
  Typography,
  styled,
  TextField,
  Select,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GradeTarget, SortType, SortDirection } from '@righton/networking';
import SearchIcon from '../../images/search.svg';
import { ScreenSize } from '../../lib/CentralModels';
import SelectGradesMenu from './SelectGradesMenu';
import SortSearchMenu from './SortSearchMenu';

interface SearchBarProps {
  screenSize?: ScreenSize;
  searchTerms: string;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSearchChange: (searchTerm: string) => void;
  handleSortChange: (sort: {
    field: SortType;
    direction: SortDirection;
  }) => void;
}
interface SearchBarProps2 {
  screenSize?: ScreenSize;
  searchTerms?: string;
}

const SearchBarContainer = styled(TextField)<SearchBarProps2>(
  ({ screenSize, searchTerms, theme }) => ({
    width: '100%',
    flexGrow: 1,
    margin: '0',
    backgroundColor: '#FFFFFF',
    height: '44px',
    borderRadius: `0px ${theme.sizing.xSmPadding}px ${theme.sizing.xSmPadding}px 0px`,
    '& .MuiOutlinedInput-root': {
      height: '100%',
      padding: '0 12px',
      boxSizing: 'border-box',
      borderRadius: `0px ${theme.sizing.xSmPadding}px ${theme.sizing.xSmPadding}px 0px`,
      borderColor: searchTerms && searchTerms.length === 0 ? 'none' : theme.palette.primary.darkGrey,
      borderStyle: searchTerms && searchTerms.length === 0 ? 'none' : 'solid',
      borderWidth: searchTerms && searchTerms.length === 0 ? '0px' : '2px',
      "& fieldset": { border: 'none' },
      '& .MuiInputBase-input': {
        padding: 0,
        whiteSpace: screenSize !== ScreenSize.SMALL ? 'nowrap' : 'normal',
        height: screenSize !== ScreenSize.SMALL ? '44px' : '16px',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '&::placeholder': {
          color: `${theme.palette.primary.extraDarkBlue}`,
          fontWeight: 400,
          fontFamily: 'Rubik',
          fontSize: `${theme.sizing.smPadding}px`,
        },
      },
    },
  }),
);

const SearchAndFilterContainer = styled(Box)<SearchBarProps2>(
  ({ screenSize, theme }) => ({
    height: '88px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px`,
    gap: '16px',
    boxSizing: 'border-box',
  }),
);

function SearchBar({
  screenSize,
  searchTerms,
  handleSearchChange,
  handleChooseGrades,
  handleSortChange,
}: SearchBarProps) {
  const theme = useTheme();
  const [searchBarText, setSearchBarText] = useState(searchTerms);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchBarText(value);
    handleSearchChange(value);
  };
  return (
    <SearchAndFilterContainer screenSize={screenSize}>
      <Box style={{ display: 'flex', width: '100%' }}>
        <SelectGradesMenu
          screenSize={screenSize ?? ScreenSize.SMALL}
          handleChooseGrades={handleChooseGrades}
        />
        <SearchBarContainer
          multiline
          maxRows={2}
          screenSize={screenSize}
          placeholder={
            screenSize === ScreenSize.SMALL
              ? 'Search Games'
              : 'Search by topics, standards, or games...'
          }
          variant="outlined"
          value={searchBarText}
          searchTerms={searchTerms}
          onChange={handleInputChange}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <img src={SearchIcon} alt="Search Icon" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <SortSearchMenu
        screenSize={screenSize ?? ScreenSize.SMALL}
        handleSortChange={handleSortChange}
      />
    </SearchAndFilterContainer>
  );
}
export default SearchBar;
