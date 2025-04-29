import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
import { useTheme, styled} from '@mui/material/styles';
import {Box, Typography, Select, TextField, MenuItem, InputAdornment, List, ListItem, ListItemText, Button,} from '@mui/material';
import { useCentralDataState, useCentralDataDispatch } from '../hooks/context/useCentralDataContext';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { UserStatusType } from '../lib/CentralModels';




export default function AuthStatus() {
    const apiClients = useTSAPIClientsContext(APIClientsContext);
    const centralDataDispatch = useCentralDataDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    
      useEffect(() => {
        const getSession = async () => {
          const response = await apiClients.auth.getUserEmail();
          if (response){
            const response2 = await apiClients.auth.getUserByEmailDB(response);
            if (response2){
                centralDataDispatch({type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDIN});
                navigate('/')
            }
            else{
                centralDataDispatch({type: 'SET_USER_STATUS', payload: UserStatusType.INCOMPLETE});
                navigate('/nextstep')
            }
          }
        };
      
        getSession();
        
      }, [apiClients.auth, centralDataDispatch, navigate]);


    return (
        <SignUpMainContainer/>
    )
}