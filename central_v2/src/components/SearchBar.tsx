import React, { useState, ChangeEvent } from 'react';
import { Box, InputAdornment, Typography, Button, styled, TextField, MenuItem, Select, Chip, InputLabel, FormControl, OutlinedInput, SelectChangeEvent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import debounce from 'lodash/debounce';
import SearchIcon from '../images/search.svg';
import SortIcon from '../images/sort.svg';
import SortArrow from '../images/sortArrow.svg';
import GradeDropdown from '../images/GradeDropdown.svg';
import { ScreenSize } from '../lib/HostModels';

interface SearchBarProps {
    screenSize?: ScreenSize;
    onSearchChange: (searchTerm: string) => void;
    onGradeChange: (selectedGrades: string[]) => void;
    onSortChange: (sort: { field: string; direction: string | null }) => void;
}
interface SearchBarProps2 {
    screenSize?: ScreenSize;
}

const SearchBarContainer = styled(TextField)<SearchBarProps2>(({ screenSize, theme }) => ({
    width: 'calc(100% - 125px)', //  account for the dropdown width
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
    height: screenSize === ScreenSize.SMALL ? '70px' : '88px',
    width: '100%', 
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: `${theme.palette.primary.extraDarkBlue}`,
    padding: `${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px`,
    gap: '0px',
    boxSizing: 'border-box',
}));

const FormControlStyled = styled(FormControl)({
    height: '44px',
    width: '150px',
    backgroundColor: '#E81144',
    borderRadius: '30px 0px 0px 30px',
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
});


const SelectStyled = styled(Select)({
    color: '#FFFFFF',
    '& .MuiSelect-icon': {
        color: '#FFFFFF',
    },
});

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

const MenuItemStyled = styled(MenuItem)(({ selected }: { selected: boolean }) => ({
    color: selected ? 'black' : 'rgba(0, 0, 0, 0.5)',
}));

const gradesList = ['High School', '8th Grade', '7th Grade', '6th Grade', '5th Grade', '4th Grade', '3rd Grade', '2nd Grade', '1st Grade', 'Kindergarten'];
function GradeDropdownIcon (){
    return(
        <img src={GradeDropdown} alt="Grade Dropdown Icon"/>
    )}

function SearchBar({ screenSize, onSearchChange, onGradeChange, onSortChange }: SearchBarProps) {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
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

    const handleGradesChange = (event: SelectChangeEvent<unknown>) => {
        const newGrades = (event.target.value as string[]);
        setSelectedGrades(newGrades);
        onGradeChange(newGrades);
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
      const renderSortArrow = (field: string) => {
        if (selectedSort.field === field) {
          return (
            <img
              src={SortArrow}
              alt="sort arrow"
              style={{
                marginLeft: `${theme.sizing.xSmPadding}px`,
                transform: selectedSort.direction === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                visibility: selectedSort.direction ? 'visible' : 'hidden',
              }}
            />
          );
        }
        return null;
      };

      return (
        <SearchAndFilterContainer screenSize={screenSize}>
            <FormControlStyled>
            <InputLabel id="grade-label" shrink={false} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', bottom: '28.5px', padding: 0}}>
              <PrimaryButton2Text>Grade</PrimaryButton2Text>
            </InputLabel>
                <SelectStyled
                    multiple
                    value={selectedGrades}
                    onChange={handleGradesChange}
                    renderValue={() => null}
                    labelId="grade-label"
                    MenuProps={MenuPropsStyled}
                    IconComponent={GradeDropdownIcon}
                >
                    {gradesList.map((grade) => (
                        <MenuItemStyled key={grade} value={grade} selected={selectedGrades.includes(grade)}>
                            {grade}
                        </MenuItemStyled>
                    ))}
                </SelectStyled>
            </FormControlStyled>
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
            {searchTerm || selectedGrades.length > 0 ? (
          
          <FormControl style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: `${theme.sizing.mdPadding}px`}}>
            <InputLabel id="sort-label" shrink={false} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', bottom: '28.5px',}}>
                <img src={SortIcon} alt="sort icon" style={{marginRight:`${theme.sizing.xSmPadding}px`}} />
              {screenSize=== ScreenSize.SMALL ?
              null 
              : <PrimaryButton2Text>Sort</PrimaryButton2Text>}
            </InputLabel>
            <PrimaryButton2
              screenSize={screenSize}
              value={selectedSort.field}
              onChange={(e) => handleSortOptionClick(e.target.value as string)}
              renderValue={() => null}
              labelId="sort-label"
              MenuProps={MenuPropsStyled}
              IconComponent= {() => null}
              sx={{  
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 0
                },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none"
                },
              }}
              >
              {['Date Updated', 'Most Popular', 'Grade Level', 'Question Count'].map((field) => (
                <MenuItem key={field} value={field} onClick={() => handleSortOptionClick(field)}>
                  <Box display="flex" alignItems="center" >
                    <Typography
                      fontWeight={selectedSort.field === field && selectedSort.direction ? 'bold' : 'normal'}
                    >
                      {field}
                    </Typography>
                    {renderSortArrow(field)}
                  </Box>
                </MenuItem>
              ))}
            </PrimaryButton2>
          </FormControl>
            ) : null}
            
        </SearchAndFilterContainer>
    );
}
export default SearchBar;
