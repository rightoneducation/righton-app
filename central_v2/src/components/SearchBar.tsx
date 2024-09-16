import React, { useState, useCallback } from 'react';
import { TextField, styled, InputAdornment, Button, Typography, Box } from '@mui/material';
import debounce from 'lodash/debounce';
import SearchIcon from '../images/search.svg';
import { ScreenSize } from '../lib/HostModels';
import Filter from '../images/filter.svg';

interface SearchBarProps {
    screenSize?: ScreenSize;
    onSearchChange: (searchTerm: string) => void;
}
interface SearchBarProps2 {
    screenSize?: ScreenSize;
}

const SearchBarContainer = styled(TextField)(({ screenSize }: SearchBarProps2) => ({
    width: 'calc(100vw - 64px)',
    margin: screenSize === ScreenSize.SMALL ? '16px 8px 16px 24px' : '24px 16px 24px 32px',
    backgroundColor: '#FFFFFF',
    height: '38px',  // Ensure the overall container is 38px
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
                color: '#02215F', // placeholder color
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

const PrimaryButton2 = styled(Button)(({ screenSize }: SearchBarProps2) => ({
    width: screenSize === ScreenSize.SMALL ? 'auto' :'115px',
    minWidth: '44px',
    height: '38px',
    padding: '4px 12px 4px 12px',
    gap: '8px',
    borderRadius: '54px',
    background: 'linear-gradient(90deg, #E81144 0%, #E31C5E 100%)',
    boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
    color: '#FFFFFF',
    textTransform: 'none',
    marginRight: '32px',
}));

const PrimaryButton2Text = styled(Typography)(() => ({
    width: '52px',
    height: '30px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: '20px',
    lineHeight: '30px',
    color: '#FFFFFF',
}));

export default function SearchBar({ screenSize, onSearchChange }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);

        // Debounce the onSearchChange call
        debounce(() => {
            onSearchChange(value);
        }, 800)(); // Immediately invoke the debounced function
    };

    return (
        <SearchAndFilterContainer screenSize={screenSize}>
            <SearchBarContainer
                screenSize={screenSize}
                placeholder={screenSize === ScreenSize.SMALL 
                    ? "Search for games..." 
                    : "Search by topics, standards, games, and/or questions..."}
                variant="outlined"
                value={searchTerm}
                onChange={handleInputChange} // handle input change
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <img src={SearchIcon} alt="Search Icon" />
                        </InputAdornment>
                    ),
                }}
            />      
            <PrimaryButton2 screenSize={screenSize}> 
                <img src={Filter} alt="Filter Icon" />
                {screenSize !== ScreenSize.SMALL && (
                    <PrimaryButton2Text>Filter</PrimaryButton2Text> 
                )}
            </PrimaryButton2>
        </SearchAndFilterContainer>
    );
}
