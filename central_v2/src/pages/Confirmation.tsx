import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';

export default function Confirmation() {
    const [code, setCode] = useState('');
    const [username, setUsername] = useState('muqureshar')
    const apiClients = useTSAPIClientsContext(APIClientsContext);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await apiClients.auth.awsConfirmSignUp(username, code);

    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh', padding: 2 }}
        >
            <Typography variant="h5" component="h1" gutterBottom>
                Confirm Your Email
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: '100%', maxWidth: 400 }}
            >
                <TextField
                    label="Confirmation Code"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter your code"
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Verify
                </Button>
            </Box>
        </Box>
    );
}
