import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import './App.css';

const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '32px',
  maxWidth: '800px',
  margin: '0 auto',
});

const Title = styled(Typography)({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700,
  fontSize: '32px',
  color: '#02215F',
  marginBottom: '16px',
});

const SectionTitle = styled(Typography)({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 600,
  fontSize: '20px',
  color: '#02215F',
  marginTop: '16px',
});

const StyledTextField = styled(TextField)({
  borderRadius: '8px',
  backgroundColor: '#FFFFFF',
  width: '100%',
  '& .MuiInputBase-root': {
    height: '43px',
    '& fieldset': {
      borderWidth: '2px',
      borderColor: '#CCCCCC',
      borderRadius: '8px',
    },
    '&.Mui-focused fieldset': {
      borderWidth: '2px',
      borderColor: '#909090',
    },
    '&:hover fieldset': {
      borderWidth: '2px',
      borderColor: '#909090',
    },
  },
  '& .MuiInputBase-input': {
    color: '#384466',
    height: '10px',
  },
});

const StyledButton = styled(Button)({
  borderRadius: '8px',
  textTransform: 'none',
  height: '38px',
  backgroundColor: '#159EFA',
  color: '#FFFFFF',
  fontWeight: 600,
  fontSize: '16px',
  whiteSpace: 'nowrap',
  minWidth: 'fit-content',
  padding: '0 16px',
  '&:hover': {
    backgroundColor: '#168CDC',
  },
});

const OutputBox = styled(Paper)({
  padding: '16px',
  backgroundColor: '#F4F4F4',
  borderRadius: '8px',
  minHeight: '60px',
  fontFamily: 'Rubik, sans-serif',
  fontSize: '14px',
  color: '#384466',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});

const PlaceholderText = styled(Typography)({
  fontFamily: 'Rubik, sans-serif',
  fontSize: '14px',
  color: '#909090',
  fontStyle: 'italic',
  opacity: 0.7,
});

function App() {
  const [classroomId, setClassroomId] = useState('');
  const [ccss, setCcss] = useState('');
  const [knowledgeGraphOutput, setKnowledgeGraphOutput] = useState('');
  const [llmOutput, setLlmOutput] = useState('');
  const [updateOutput, setUpdateOutput] = useState('');

  const handleQueryClassroom = () => {
    // Empty function - to be implemented
    console.log('Query classroom:', classroomId);
  };

  const handleQueryKnowledgeGraph = () => {
    // Empty function - to be implemented
    console.log('Query knowledge graph:', ccss);
  };

  const handleQueryLLM = () => {
    // Empty function - to be implemented
    console.log('Query LLM');
  };

  const handleUpdateClassroom = () => {
    // Empty function - to be implemented
    console.log('Update classroom:', classroomId);
  };

  return (
    <Container>
      <Title>MicroCoach API Testing</Title>

      <Box>
        <SectionTitle>Classroom Query</SectionTitle>
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
          <StyledTextField
            placeholder="Enter Classroom ID"
            value={classroomId}
            onChange={(e) => setClassroomId(e.target.value)}
            variant="outlined"
          />
          <StyledButton onClick={handleQueryClassroom} variant="contained">
            Query Classroom
          </StyledButton>
        </Box>
      </Box>

      <Box>
        <SectionTitle>Knowledge Graph Query</SectionTitle>
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
          <StyledTextField
            placeholder="Enter CCSS"
            value={ccss}
            onChange={(e) => setCcss(e.target.value)}
            variant="outlined"
          />
          <StyledButton onClick={handleQueryKnowledgeGraph} variant="contained">
            Query KG
          </StyledButton>
        </Box>
        <Box sx={{ marginTop: '12px' }}>
          <OutputBox>
            {knowledgeGraphOutput || (
              <PlaceholderText>
                Knowledge graph data will be displayed here after querying...
              </PlaceholderText>
            )}
          </OutputBox>
        </Box>
      </Box>

      <Box>
        <SectionTitle>LLM Query</SectionTitle>
        <Box sx={{ marginTop: '8px' }}>
          <StyledButton onClick={handleQueryLLM} variant="contained" fullWidth>
            Query LLM
          </StyledButton>
        </Box>
        <Box sx={{ marginTop: '12px' }}>
          <OutputBox>
            {llmOutput || (
              <PlaceholderText>
                LLM response will appear here after querying...
              </PlaceholderText>
            )}
          </OutputBox>
        </Box>
      </Box>

      <Box>
        <SectionTitle>Update Classroom</SectionTitle>
        <Box sx={{ marginTop: '8px' }}>
          <StyledButton onClick={handleUpdateClassroom} variant="contained" fullWidth>
            Update Classroom
          </StyledButton>
        </Box>
        <Box sx={{ marginTop: '12px' }}>
          <OutputBox>
            {updateOutput || (
              <PlaceholderText>
                Update confirmation and results will appear here...
              </PlaceholderText>
            )}
          </OutputBox>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
