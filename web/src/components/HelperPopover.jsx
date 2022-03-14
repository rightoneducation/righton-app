import React from 'react';
import { IconButton, Typography, Popover } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';

export default function Helper({text}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return(
        <div>
            <IconButton aria-describedby={id} color='inherit' disableRipple style={{ backgroundColor: 'transparent' }} onClick={handleClick}>
                <HelpOutline/>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{fontWeight: 400, fontSize: '20px'}}>{text}</Typography>
            </Popover>
        </div>
    );
}