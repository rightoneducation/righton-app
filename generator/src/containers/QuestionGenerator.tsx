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
  solutionExplanation: string;
  ccss: string;
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
    solutionExplanation: '',
    ccss: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value } = event.target;
    
    if (index !== undefined) {
      setFormData((prev) => {
        const updatedArray = [...prev.wrongAnswers];
        updatedArray[index] = value;
        return {
          ...prev,
          wrongAnswers: updatedArray
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSolutionExplanationChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, solutionExplanation: event.target.value }));
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
        // Only update fields that were actually generated (merge with existing data)
        setFormData(prev => ({
          ...prev,
          question: result.question || prev.question,
          correctAnswer: result.correctAnswer || prev.correctAnswer,
          wrongAnswers: result.wrongAnswers || prev.wrongAnswers,
          solutionExplanation: result.solutionExplanation || prev.solutionExplanation,
          ccss: result.ccss || prev.ccss
        }));

        // Show user what was generated
        const generatedFields = result.generatedFields || [];
        if (generatedFields.length > 0) {
          alert(`Successfully generated: ${generatedFields.join(', ')}`);
        }
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
        formData.wrongAnswers.some(answer => !answer.trim())) {
      alert('Please fill in all required fields');
      return;
    }

    // Filter out empty wrong answers
    const filteredWrongAnswers = formData.wrongAnswers.filter(answer => answer.trim() !== '');
    
    const questionData: QuestionData = {
      ...formData,
      wrongAnswers: filteredWrongAnswers
    };

    onSubmit(questionData);
  };

  const isFormValid = formData.question.trim() !== '' && 
                     formData.correctAnswer.trim() !== '' && 
                     formData.ccss.trim() !== '' &&
                     formData.wrongAnswers.some(answer => answer.trim() !== '');

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

            {/* Solution Explanation Field */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Solution Explanation"
                value={formData.solutionExplanation}
                onChange={handleSolutionExplanationChange}
                placeholder="Enter the steps that led to the correct answer"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#4caf50',
                    },
                  },
                }}
              />
            </Grid>

            {/* Wrong Answer Fields */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#d32f2f' }}>
                Incorrect Answer Choices
              </Typography>
            </Grid>

            {formData.wrongAnswers.map((wrongAnswer, index) => (
              <Grid item xs={12} md={4} key={index}>
                <TextField
                  fullWidth
                  label={`Wrong Answer ${index + 1}`}
                  value={wrongAnswer}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder={`Enter wrong answer ${index + 1}`}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#d32f2f',
                      },
                    },
                  }}
                />
              </Grid>
            ))}

            {/* Form Actions */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ marginTop: 3 }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    textTransform: 'none',
                    padding: '8px 24px',
                    borderColor: '#666',
                    color: '#666',
                    '&:hover': {
                      borderColor: '#333',
                      color: '#333',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    textTransform: 'none',
                    padding: '8px 24px',
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                    '&:disabled': {
                      backgroundColor: '#ccc',
                      color: '#666',
                    },
                  }}
                >
                  Generate Explanations
                </Button>
              </Stack>
            </Grid>
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
              label={`Wrong Answers: ${formData.wrongAnswers.filter(a => a.trim()).length}/3`} 
              color={formData.wrongAnswers.some(a => a.trim()) ? 'success' : 'error'} 
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
