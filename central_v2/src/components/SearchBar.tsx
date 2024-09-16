import React, { useState, ChangeEvent } from 'react';
import { Box, InputAdornment, Typography, Button, styled, TextField, MenuItem, Select, Chip, InputLabel, FormControl, OutlinedInput, SelectChangeEvent } from '@mui/material';
import debounce from 'lodash/debounce';
import SearchIcon from '../images/search.svg';
import { ScreenSize } from '../lib/HostModels';
import Filter from '../images/filter.svg';

interface SearchBarProps {
    screenSize?: ScreenSize;
    onSearchChange: (searchTerm: string) => void;
    onGradeChange: (selectedGrades: string[]) => void;
}
interface SearchBarProps2 {
    screenSize?: ScreenSize;
}

const SearchBarContainer = styled(TextField)(({ screenSize }: SearchBarProps2) => ({
    width: 'calc(100vw - 64px)',
    margin: screenSize === ScreenSize.SMALL ? '16px 8px 16px 24px' : '24px 16px 24px 32px',
    backgroundColor: '#FFFFFF',
    height: '38px',  
    borderRadius: '30px',
    '& .MuiOutlinedInput-root': {
        height: '100%',  
        borderRadius: '30px', 
        padding: '0 12px',
        boxSizing: 'border-box',
        '& .MuiInputBase-input': {
            padding: 0,  
            height: '38px', 
            lineHeight: '38px', 
            fontFamily: 'Rubik',             
            '&::placeholder': {
                color: '#02215F', 
                fontWeight: 400, 
                fontFamily: 'Rubik', 
                fontSize: '16px',
            },
        },
    },
}));

const SearchAndFilterContainer = styled(Box)(({ screenSize }: SearchBarProps2) => ({
    height: screenSize === ScreenSize.SMALL ? '70px' : '88px',
    width: '100%', 
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: '#02215F',
}));

// Define styled components
const FormControlStyled = styled(FormControl)({
  width: '125px',
  backgroundColor: '#E81144',
  borderRadius: '4px',
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
});

const InputLabelStyled = styled(InputLabel)({
  color: '#FFFFFF',
  '&.Mui-focused': {
    color: '#FFFFFF',
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
      '& .MuiMenuItem-root': {
        color: 'rgba(0, 0, 0, 0.5)',
        '&.Mui-selected': {
          color: 'black',
        },
      },
    },
  },
};

const MenuItemStyled = styled(MenuItem)(({ selected }: { selected: boolean }) => ({
  color: selected ? 'black' : 'rgba(0, 0, 0, 0.5)',
}));

const gradesList = ['High School', '8th Grade', '7th Grade', '6th Grade', '5th Grade', '4th Grade', '3rd Grade', '2nd Grade', '1st Grade', 'Kindergarten'];

export default function SearchBar({ screenSize, onSearchChange, onGradeChange }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

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

  return (
    <SearchAndFilterContainer screenSize={screenSize}>
      <FormControlStyled fullWidth margin="normal">
        <SelectStyled
          multiple
          value={selectedGrades}
          onChange={handleGradesChange}
          input={<OutlinedInput label="Grade" />}
          renderValue={() => 'Grade'}
          MenuProps={MenuPropsStyled}
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
          ? "Search for games..." 
          : "Search by topics, standards, games, and/or questions..."}
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
    </SearchAndFilterContainer>
  );
}
