import React, { useState } from 'react'
import { useTheme, styled} from '@mui/material/styles';
import {Box, Typography, Select, TextField, MenuItem, InputAdornment, List, ListItem, ListItemText, Button,} from '@mui/material';
import { useCentralDataState, useCentralDataDispatch } from '../hooks/context/useCentralDataContext';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';

export default function AuthStatus() {
    console.log("Im rendering empty auth page!!")

    return (
        <SignUpMainContainer/>
    )
}