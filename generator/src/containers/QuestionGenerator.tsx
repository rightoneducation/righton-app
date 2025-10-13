import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Stack
} from '@mui/material';
import { autoGenerateQuestion } from '../lib/API';

interface QuestionData {
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  wrongAnswerExplanations: string[];
  wrongAnswerSummaries: string[];
  solutionExplanation: string;
  ccss: string;
}

interface GeneratedWrongAnswers {
  allWrongAnswers: string[];
  selectedWrongAnswers: string[];
  allWrongAnswerExplanations: string[];
  selectedWrongAnswerExplanations: string[];
  allWrongAnswerSummaries: string[];
  selectedWrongAnswerSummaries: string[];
}

interface QuestionGeneratorProps {
  onSubmit: (questionData: QuestionData) => void;
  onCancel: () => void;
}

export default function QuestionGenerator({ onSubmit, onCancel }: QuestionGeneratorProps) {
  const [formData, setFormData] = useState<QuestionData>({
    question: '',
    correctAnswer: '',
    wrongAnswers: ['', '', ''],
    wrongAnswerExplanations: ['', '', ''],
    wrongAnswerSummaries: ['', '', ''],
    solutionExplanation: '',
    ccss: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWrongAnswers, setGeneratedWrongAnswers] = useState<GeneratedWrongAnswers>({
    allWrongAnswers: [],
    selectedWrongAnswers: [],
    allWrongAnswerExplanations: [],
    selectedWrongAnswerExplanations: [],
    allWrongAnswerSummaries: [],
    selectedWrongAnswerSummaries: []
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleWrongAnswerSelection = (answer: string, answerIndex: number) => {
    setGeneratedWrongAnswers(prev => {
      const isSelected = prev.selectedWrongAnswers.includes(answer);
      let newSelected: string[];
      let newSelectedExplanations: string[];
      let newSelectedSummaries: string[];
      
      if (isSelected) {
        // Remove from selection
        const selectedIndex = prev.selectedWrongAnswers.indexOf(answer);
        newSelected = prev.selectedWrongAnswers.filter(a => a !== answer);
        newSelectedExplanations = prev.selectedWrongAnswerExplanations.filter((_, index) => index !== selectedIndex);
        newSelectedSummaries = prev.selectedWrongAnswerSummaries.filter((_, index) => index !== selectedIndex);
      } else {
        // Add to selection (max 3)
        if (prev.selectedWrongAnswers.length < 3) {
          newSelected = [...prev.selectedWrongAnswers, answer];
          newSelectedExplanations = [...prev.selectedWrongAnswerExplanations, prev.allWrongAnswerExplanations[answerIndex]];
          newSelectedSummaries = [...prev.selectedWrongAnswerSummaries, prev.allWrongAnswerSummaries[answerIndex]];
        } else {
          // Replace the first one if we already have 3
          newSelected = [answer, ...prev.selectedWrongAnswers.slice(1)];
          newSelectedExplanations = [prev.allWrongAnswerExplanations[answerIndex], ...prev.selectedWrongAnswerExplanations.slice(1)];
          newSelectedSummaries = [prev.allWrongAnswerSummaries[answerIndex], ...prev.selectedWrongAnswerSummaries.slice(1)];
        }
      }
      
      // Update form data with selected wrong answers, explanations, and summaries
      setFormData(formPrev => ({
        ...formPrev,
        wrongAnswers: newSelected.length === 3 ? newSelected : [...newSelected, ...Array(3 - newSelected.length).fill('')],
        wrongAnswerExplanations: newSelectedExplanations.length === 3 ? newSelectedExplanations : [...newSelectedExplanations, ...Array(3 - newSelectedExplanations.length).fill('')],
        wrongAnswerSummaries: newSelectedSummaries.length === 3 ? newSelectedSummaries : [...newSelectedSummaries, ...Array(3 - newSelectedSummaries.length).fill('')]
      }));
      
      return {
        ...prev,
        selectedWrongAnswers: newSelected,
        selectedWrongAnswerExplanations: newSelectedExplanations,
        selectedWrongAnswerSummaries: newSelectedSummaries
      };
    });
  };

  const handleAutoGenerate = async () => {
    // Check if at least one field has content
    const hasContent = formData.question.trim() || 
                      formData.correctAnswer.trim() || 
                      formData.wrongAnswers.some(answer => answer.trim()) || 
                      formData.solutionExplanation.trim() || 
                      formData.ccss.trim();

    if (!hasContent) {
      alert('Please fill in at least one field before auto-generating');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Prepare data to send (only non-empty fields)
      const questionData = {
        question: formData.question.trim() || undefined,
        correctAnswer: formData.correctAnswer.trim() || undefined,
        wrongAnswers: formData.wrongAnswers.filter(answer => answer.trim()).length > 0 
          ? formData.wrongAnswers.filter(answer => answer.trim()) 
          : undefined,
        solutionExplanation: formData.solutionExplanation.trim() || undefined,
        ccss: formData.ccss.trim() || undefined
      };

      const result = await autoGenerateQuestion(questionData);
      
      if (result) {
        // Only update fields that were actually generated AND are currently empty
        setFormData(prev => {
          const updated = { ...prev };
          
          // Only update if the field is currently empty
          if (!prev.question.trim() && result.data.question) {
            updated.question = result.data.question;
          }
          if (!prev.correctAnswer.trim() && result.data.correctAnswer) {
            updated.correctAnswer = result.data.correctAnswer;
          }
          if (!prev.solutionExplanation.trim() && result.data.solutionExplanation) {
            updated.solutionExplanation = result.data.solutionExplanation;
          }
          if (!prev.ccss.trim() && result.data.ccss) {
            updated.ccss = result.data.ccss;
          }
          
          return updated;
        });

        // Handle wrong answers specially - store all 6 and let user select 3
        if (result.data.wrongAnswers && result.data.wrongAnswers.length === 6) {
          const defaultSelected = result.data.wrongAnswers.slice(0, 3);
          const defaultExplanations = result.data.wrongAnswerExplanations ? result.data.wrongAnswerExplanations.slice(0, 3) : [];
          const defaultSummaries = result.data.wrongAnswerSummaries ? result.data.wrongAnswerSummaries.slice(0, 3) : [];
          
          setGeneratedWrongAnswers({
            allWrongAnswers: result.data.wrongAnswers,
            selectedWrongAnswers: defaultSelected,
            allWrongAnswerExplanations: result.data.wrongAnswerExplanations || [],
            selectedWrongAnswerExplanations: defaultExplanations,
            allWrongAnswerSummaries: result.data.wrongAnswerSummaries || [],
            selectedWrongAnswerSummaries: defaultSummaries
          });
          
          // Update form data with the first 3 as default
          setFormData(prev => ({
            ...prev,
            wrongAnswers: defaultSelected,
            wrongAnswerExplanations: defaultExplanations,
            wrongAnswerSummaries: defaultSummaries
          }));
        } else if (result.data.wrongAnswers && result.data.wrongAnswers.length > 0) {
          // Handle case where we get fewer than 6 wrong answers
          const maxAnswers = Math.min(3, result.data.wrongAnswers.length);
          const defaultSelected = result.data.wrongAnswers.slice(0, maxAnswers);
          const defaultExplanations = result.data.wrongAnswerExplanations ? result.data.wrongAnswerExplanations.slice(0, maxAnswers) : [];
          const defaultSummaries = result.data.wrongAnswerSummaries ? result.data.wrongAnswerSummaries.slice(0, maxAnswers) : [];
          
          setGeneratedWrongAnswers({
            allWrongAnswers: result.data.wrongAnswers,
            selectedWrongAnswers: defaultSelected,
            allWrongAnswerExplanations: result.data.wrongAnswerExplanations || [],
            selectedWrongAnswerExplanations: defaultExplanations,
            allWrongAnswerSummaries: result.data.wrongAnswerSummaries || [],
            selectedWrongAnswerSummaries: defaultSummaries
          });
          
          // Update form data
          setFormData(prev => ({
            ...prev,
            wrongAnswers: defaultSelected,
            wrongAnswerExplanations: defaultExplanations,
            wrongAnswerSummaries: defaultSummaries
          }));
        }

        // Fields have been generated and populated silently
      } else {
        throw new Error('Failed to generate question data');
      }
    } catch (error) {
      console.error('Error generating question data:', error);
      alert('Failed to generate question data. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    // Validate that all required fields are filled
    if (!formData.question.trim() || 
        !formData.correctAnswer.trim() || 
        !formData.ccss.trim() ||
        generatedWrongAnswers.selectedWrongAnswers.length === 0) {
      alert('Please fill in all required fields and select wrong answers');
      return;
    }

    // Use selected wrong answers from the selection UI
    const questionData: QuestionData = {
      ...formData,
      wrongAnswers: generatedWrongAnswers.selectedWrongAnswers,
      wrongAnswerExplanations: generatedWrongAnswers.selectedWrongAnswerExplanations,
      wrongAnswerSummaries: generatedWrongAnswers.selectedWrongAnswerSummaries
    };

    onSubmit(questionData);
  };

  const isFormValid = formData.question.trim() !== '' && 
                     formData.correctAnswer.trim() !== '' && 
                     formData.ccss.trim() !== '' &&
                     generatedWrongAnswers.selectedWrongAnswers.length > 0;

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#1976d2' }}>
            Create New Question
          </Typography>
          
          <Grid container spacing={3}>
            {/* Question Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Enter your question here"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                placeholder="Type your math question here..."
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              />
            </Grid>

            {/* Auto-Generate Button */}
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                💡 Fill in any fields you have, then click Smart Auto-Generate to complete the rest!
              </Typography>
              <Button
                variant="contained"
                onClick={handleAutoGenerate}
                disabled={isGenerating}
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  textTransform: 'none',
                  padding: '12px 24px',
                  backgroundColor: '#ff9800',
                  '&:hover': {
                    backgroundColor: '#f57c00',
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                    color: '#666',
                  },
                }}
              >
                {isGenerating ? 'Generating...' : '🤖 Smart Auto-Generate'}
              </Button>
            </Grid>

            {/* CCSS Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CCSS (Common Core State Standards)"
                name="ccss"
                value={formData.ccss}
                onChange={handleInputChange}
                placeholder="e.g., 7.RP.A.3, 8.EE.C.7, 6.NS.B.3"
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#ff9800',
                    },
                  },
                }}
              />
            </Grid>

            {/* Correct Answer Field */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Correct Answer"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleInputChange}
                placeholder="Enter the correct answer"
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#4caf50',
                    },
                  },
                }}
              />
            </Grid>

             {/* Solution Explanation Preview */}
             <Grid item xs={12} md={6}>
               {formData.solutionExplanation ? (
                 <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, border: '1px solid #ddd' }}>
                   <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                     Solution Explanation:
                   </Typography>
                   <Typography 
                     variant="body2" 
                     sx={{ 
                       whiteSpace: 'pre-line',
                       fontFamily: 'monospace',
                       fontSize: '0.875rem'
                     }}
                   >
                     {formData.solutionExplanation.replace(/Step \d+:/g, '\n$&').trim()}
                   </Typography>
                 </Box>
               ) : (
                 <Box sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 1, border: '1px solid #ddd', textAlign: 'center' }}>
                   <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                     Solution explanation will appear here after auto-generation
                   </Typography>
                 </Box>
               )}
             </Grid>

            {/* Wrong Answer Selection UI */}
            {generatedWrongAnswers.allWrongAnswers.length > 0 && (
              <Grid item xs={12}>
                <Card sx={{ backgroundColor: '#fff3e0', border: '2px solid #ff9800' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#e65100' }}>
                      🎯 Select 3 Wrong Answers from Generated Options
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Choose the 3 most appropriate wrong answers from the 6 generated options:
                    </Typography>
                    
                     <Grid container spacing={2}>
                       {generatedWrongAnswers.allWrongAnswers.map((answer, index) => {
                         const isSelected = generatedWrongAnswers.selectedWrongAnswers.includes(answer);
                         const explanation = generatedWrongAnswers.allWrongAnswerExplanations[index] || '';
                         const summary = generatedWrongAnswers.allWrongAnswerSummaries[index] || '';
                         return (
                           <Grid item xs={12} md={6} key={index}>
                             <Card 
                               sx={{ 
                                 cursor: 'pointer',
                                 backgroundColor: isSelected ? '#4caf50' : '#fff',
                                 border: isSelected ? '2px solid #2e7d32' : '1px solid #ddd',
                                 '&:hover': {
                                   backgroundColor: isSelected ? '#388e3c' : '#f5f5f5',
                                   borderColor: isSelected ? '#1b5e20' : '#ff9800'
                                 }
                               }}
                               onClick={() => handleWrongAnswerSelection(answer, index)}
                             >
                               <CardContent sx={{ p: 2 }}>
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                   <Box
                                     sx={{
                                       width: 20,
                                       height: 20,
                                       borderRadius: '50%',
                                       backgroundColor: isSelected ? '#fff' : '#ff9800',
                                       display: 'flex',
                                       alignItems: 'center',
                                       justifyContent: 'center',
                                       fontSize: '12px',
                                       fontWeight: 'bold',
                                       color: isSelected ? '#4caf50' : '#fff'
                                     }}
                                   >
                                     {isSelected ? '✓' : (index + 1)}
                                   </Box>
                                   <Typography 
                                     variant="body2" 
                                     sx={{ 
                                       fontWeight: isSelected ? 600 : 400,
                                       color: isSelected ? '#fff' : 'text.primary'
                                     }}
                                   >
                                     {answer}
                                   </Typography>
                                 </Box>
                                 {summary && (
                                   <Typography 
                                     variant="caption" 
                                     sx={{ 
                                       color: isSelected ? '#e8f5e8' : 'text.secondary',
                                       fontStyle: 'italic',
                                       fontSize: '0.75rem',
                                       fontWeight: 600,
                                       display: 'block',
                                       mb: 0.5
                                     }}
                                   >
                                     📝 {summary}
                                   </Typography>
                                 )}
                                 {explanation && (
                                   <Typography 
                                     variant="caption" 
                                     sx={{ 
                                       color: isSelected ? '#e8f5e8' : 'text.secondary',
                                       fontStyle: 'italic',
                                       fontSize: '0.75rem'
                                     }}
                                   >
                                     💡 {explanation}
                                   </Typography>
                                 )}
                               </CardContent>
                             </Card>
                           </Grid>
                         );
                       })}
                     </Grid>
                     
                     <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                       Selected: {generatedWrongAnswers.selectedWrongAnswers.length}/3
                     </Typography>
                   </CardContent>
                 </Card>
               </Grid>
             )}


          </Grid>
        </CardContent>
      </Card>

      {/* Form Summary */}
      <Card sx={{ backgroundColor: '#f5f5f5' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
            Form Summary
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={`Question: ${formData.question ? '✓' : '✗'}`} 
              color={formData.question ? 'success' : 'error'} 
              size="small" 
            />
            <Chip 
              label={`CCSS: ${formData.ccss ? '✓' : '✗'}`} 
              color={formData.ccss ? 'success' : 'error'} 
              size="small" 
            />
            <Chip 
              label={`Correct Answer: ${formData.correctAnswer ? '✓' : '✗'}`} 
              color={formData.correctAnswer ? 'success' : 'error'} 
              size="small" 
            />
            <Chip 
              label={`Wrong Answers: ${generatedWrongAnswers.selectedWrongAnswers.length}/3`} 
              color={generatedWrongAnswers.selectedWrongAnswers.length > 0 ? 'success' : 'error'} 
              size="small" 
            />
             <Chip 
               label={`Explanations: ${generatedWrongAnswers.selectedWrongAnswerExplanations.length}/3`} 
               color={generatedWrongAnswers.selectedWrongAnswerExplanations.length > 0 ? 'success' : 'error'} 
               size="small" 
             />
             <Chip 
               label={`Summaries: ${generatedWrongAnswers.selectedWrongAnswerSummaries.length}/3`} 
               color={generatedWrongAnswers.selectedWrongAnswerSummaries.length > 0 ? 'success' : 'error'} 
               size="small" 
             />
            <Chip 
              label={`Solution: ${formData.solutionExplanation ? '✓' : '✗'}`} 
              color={formData.solutionExplanation ? 'success' : 'error'} 
              size="small" 
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
