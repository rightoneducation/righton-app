import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '../images/SearchIcon.svg';
import { alpha, makeStyles } from '@material-ui/core/styles';

export default function SearchBar({ isGames, handleSearchChange, searchInput, isSearchClick, handleSearchClick, isResolutionMobile }) {
    const classes = useStyles(isResolutionMobile)();
    return (
    <div className = { classes.search } >
       <div className={classes.searchIcon} onClick={() => handleSearchClick(!isSearchClick)}>
          <img src={SearchIcon} alt="Search Icon" />
       </div>
       { isSearchClick ? 
          <InputBase
            placeholder={isGames ? "Search Games" : "Search Questions"}
            className={classes.inputInput}
            value={searchInput}
            onChange={({ target }) => handleSearchChange(target.value)}
            inputProps={{ 'aria-label': 'search' }} /> 
        : null }
     </div>
    );
}

const useStyles = (isResolutionMobile) => makeStyles(theme => ({ 
    search: {
        minHeight: '30px',
        width: 'calc(100vw - 65px)',
        borderRadius: '20px',
        border: '2px solid #B1BACB', 
        display: 'flex',
        justifyContent: 'flexStart',
        alignItems:'center',
    },
    searchIcon: {
        paddingLeft: '2px',
        marginLeft: '2px',
        height: '30px',
        width: '30px',
        color: '#87B8DB',
    },
    inputInput: {
        color: 'inherit',
        width: '100%',
    },
}));