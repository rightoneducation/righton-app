import React, { useState, ChangeEvent } from 'react';
import { Box, InputAdornment, Typography, Button, Collapse, styled, TextField, MenuItem, Select, Checkbox, Chip, InputLabel, FormControl, OutlinedInput, SelectChangeEvent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import debounce from 'lodash/debounce';
import { GradeTarget } from '@righton/networking';
import SearchIcon from '../../images/search.svg';
import { ScreenSize } from '../../lib/CentralModels';
import SelectGradesMenu from './SelectGradesMenu';
import SortSearchMenu from './SortSearchMenu';


interface SearchBarProps {
    screenSize?: ScreenSize;
    handleChooseGrades: (grades: GradeTarget[]) => void;
    onSearchChange: (searchTerm: string) => void;
    onSortChange: (sort: { field: string; direction: string | null }) => void;
}
interface SearchBarProps2 {
    screenSize?: ScreenSize;
}

const SearchBarContainer = styled(TextField)<SearchBarProps2>(({ screenSize, theme }) => ({
    width: '100%',
    flexGrow: 1,
    margin: '0', 
    backgroundColor: '#FFFFFF',
    height: '44px',  
    borderRadius: '0px 30px 30px 0px', 
    '& .MuiOutlinedInput-root': {
        height: '100%',
        padding: '0 12px',
        boxSizing: 'border-box',
        borderRadius: '0px 30px 30px 0px',             
        '& .MuiInputBase-input': {
            padding: 0,
            height: '38px',
            lineHeight: '38px',
            fontFamily: 'Rubik',
            '&::placeholder': {
                color: `${theme.palette.primary.extraDarkBlue}`, 
                fontWeight: 400, 
                fontFamily: 'Rubik', 
                fontSize: `${theme.sizing.smPadding}px`,
            },
        },
    },
}));

const SearchAndFilterContainer = styled(Box)<SearchBarProps2>(({ screenSize, theme }) => ({
    height:  '88px',
    width: '100%', 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    backgroundColor: `${theme.palette.primary.extraDarkBlue}`,
    padding: `${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px`,
    gap: '16px',
    boxSizing: 'border-box',
}));

const MenuPropsStyled = {
    PaperProps: {
        sx: {
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            gap: '10px',
            '& .MuiMenuItem-root': {
                color: 'rgba(0, 0, 0, 0.5)',
                '&.Mui-selected': {
                    color: 'black',
                },
            },
        },
    },
};

const PrimaryButton2 = styled(Select)<SearchBarProps2>(({ screenSize, theme }) => ({
    width: screenSize === ScreenSize.SMALL ? '44px' : '110px',
    minWidth: '44px',
    height: '44px',
    gap: `${theme.sizing.xSmPadding}px`,
    borderRadius: '54px',
    background: 'linear-gradient(90deg, #E81144 0%, #E31C5E 100%)',
    boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
    color: '#FFFFFF',
    textTransform: 'none',
    boxSizing: 'border-box',
    padding: '0px'
  }));
  
  const PrimaryButton2Text = styled(Typography)(() => ({
    height: '30px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: '20px',
    lineHeight: '30px',
    color: '#FFFFFF',
  }));

function SearchBar({ screenSize, onSearchChange, handleChooseGrades, onSortChange }: SearchBarProps) {
    const theme = useTheme();
    
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [selectedSort, setSelectedSort] = useState<{ field: string; direction: string | null }>({
        field: '',
        direction: null,
      });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);
        debounce(() => {
            onSearchChange(value);
        }, 800)();
    };

    const handleSortOptionClick = (field: string) => {
        let newDirection: string | null = 'desc';
    
        if (selectedSort.field === field) {
          if (selectedSort.direction === 'desc') {
            newDirection = 'asc';
          } else if (selectedSort.direction === 'asc') {
            newDirection = null; // reset sorting
          } else {
            newDirection = 'desc'; // start with descending
          }
        }
        setSelectedSort({ field, direction: newDirection });
        onSortChange({ field, direction: newDirection });
      };
      return (
        <SearchAndFilterContainer screenSize={screenSize}>
          <Box style={{display: 'flex', width: '100%'}}>
            <SelectGradesMenu screenSize={screenSize ?? ScreenSize.SMALL} handleChooseGrades={handleChooseGrades} />
            <SearchBarContainer
                screenSize={screenSize}
                placeholder={screenSize === ScreenSize.SMALL 
                    ? "Search for Games..." 
                    : "Search by topics, standards, or games..."}
                variant="outlined"
                value={searchTerm}
                onChange={handleInputChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <img src={SearchIcon} alt="Search Icon" />
                        </InputAdornment>
                    ),
                }}
            />
          </Box>
          <SortSearchMenu screenSize={screenSize ?? ScreenSize.SMALL} handleChooseGrades={handleChooseGrades}/>
        </SearchAndFilterContainer>
    );
}
export default SearchBar;
