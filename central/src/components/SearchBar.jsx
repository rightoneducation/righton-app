import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { alpha, makeStyles } from '@material-ui/core/styles';

export default function SearchBar({ setSearchInput, searchInput, isResolutionMobile }) {
    const classes = useStyles();

    return (
    <div className = { classes.search } >
        <div className={classes.searchIcon}>
         <SearchIcon />
       </div>
      { !isResolutionMobile ? 
        <InputBase
          placeholder="Search games…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          value={searchInput}
          onChange={({ target }) => setSearchInput(target.value)}
          inputProps={{ 'aria-label': 'search' }} /> 
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
        marginLeft: 0,
        marginRight: 20,
        maxWidth: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
        display: 'inline-block',
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        paddingLeft: '2px',
        height: '30px',
        width: '30px',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#87B8DB',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '18ch',
        },
    },
}));