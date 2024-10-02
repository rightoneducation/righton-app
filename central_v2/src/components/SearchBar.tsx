import React, { useState } from 'react';
import { TextField, styled, InputAdornment} from '@mui/material';
import SearchIcon from '../images/search.svg'
import { ScreenSize } from '../lib/HostModels';

interface SearchBarProps {
    screenSize?: ScreenSize;
  }

const SearchBarContainer = styled(TextField)<SearchBarProps> (( {theme, screenSize }) =>({
    width: 'calc(100vw - 64px)',
    // maxWidth: '400px',
    margin: screenSize === ScreenSize.SMALL ? '16px 8px 16px 24px': '24px 16px 24px 32px',
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
                color: `${theme.palette.primary.extraDarkBlue}`, // placeholder
                fontWeight: 400, 
                fontFamily: 'Rubik', 
                fontSize: '16px',
                
            },
        },
    },
}));

export default function SearchBar({ screenSize }: SearchBarProps) {
    const [searchText, setSearchText] = useState('');

    return (
        <SearchBarContainer screenSize={screenSize}
            placeholder={screenSize === ScreenSize.SMALL 
                ? "Search for games..." 
                : "Search by topics, standards, games, and/or questions..."}
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <img src={SearchIcon} alt="Search Icon" />
                    </InputAdornment>
                ),
            }}
        />
    );
}