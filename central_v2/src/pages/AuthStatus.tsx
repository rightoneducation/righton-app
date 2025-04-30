import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
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
          const response = await apiClients.user.getUser();
          if (response){
            // const response2 = await apiClients.auth.getUserByEmailDB(response);
            // if (response2){
            //     centralDataDispatch({type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDIN});
            //     navigate('/')
            // }
            // else{
            //     const {firstName, lastName} = await apiClients.auth.getFirstAndLastName();
            //     centralDataDispatch({type: 'SET_USER_PROFILE', payload: {firstName, lastName}});
            //     centralDataDispatch({type: 'SET_USER_STATUS', payload: UserStatusType.INCOMPLETE});
            //     navigate('/nextstep')
            // }
          }
        };
      
        getSession();
        
      }, [apiClients.auth, centralDataDispatch, navigate]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <SignUpMainContainer/>
    )
}