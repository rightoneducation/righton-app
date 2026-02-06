import React, { useState } from 'react';
import { Box } from '@mui/material';
import { 
  Container, 
  Title, 
  SectionTitle, 
  StyledTextField, 
  StyledButton, 
  OutputBox, 
  PlaceholderText 
} from './components/Components';
import './App.css';

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
            placeholder="Enter Classroom Name"
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
