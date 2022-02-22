import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';

export default function SearchBar({ setSearchInput, searchInput }) {
    const classes = useStyles();
    
    return ( 
    <div className = { classes.search } >
        <div className={classes.searchIcon}>
         <SearchIcon />
       </div>
      <InputBase
        placeholder="Search games…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
         }}
         value={ searchInput }
         onChange={({ target }) => setSearchInput(target.value)}
        inputProps={{ 'aria-label': 'search' }}
       />
     </div>
    );
}


const useStyles = makeStyles(theme => ({
    
    search: {
        position: 'absolute',
        right: 0,
        borderRadius: '20px',
        border: '3px solid #87B8DB',
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        marginRight: 20,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
        display: 'inline-block',
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        paddingLeft: '6px',
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#87B8DB'
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