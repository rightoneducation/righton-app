import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { alpha, makeStyles } from '@material-ui/core/styles';

export default function SearchBar({ setSearchInput, searchInput, isSearchClick, handleSearchClick, isResolutionMobile }) {
    const classes = useStyles();

    return (
    <div className = { classes.search } >
       <div className={classes.searchIcon} onClick={() => handleSearchClick(!isSearchClick)}>
         <SearchIcon/>
       </div>
       { !isResolutionMobile || isSearchClick ? 
        <div>
          <InputBase
            placeholder="Search games…"
            className={classes.inputInput}
            value={searchInput}
            onChange={({ target }) => setSearchInput(target.value)}
            inputProps={{ 'aria-label': 'search' }} /> 
         </div>
        : null }
     </div>
    );
}


const useStyles = makeStyles(theme => ({ 
    search: {
       position: 'absolute',
       right: 0,
        minHeight: '30px',
        minWidth: '30px',
        borderRadius: '20px',
        border: '3px solid #87B8DB',
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: 20,      
        display: 'flex',
        justifyContent: 'flexStart',
        alignItems:'center',
    },
    searchIcon: {
        paddingLeft: '2px',
        marginLeft: '2px',
        marginTop:'3px',
        height: '30px',
        width: '30px',
        color: '#87B8DB',
    },
    inputInput: {
        color: 'inherit',
        maxWidth: '100%',
    },
}));