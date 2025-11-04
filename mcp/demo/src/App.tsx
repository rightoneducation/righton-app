import React, { useState, useRef } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { Container, Typography, Box, Paper, CircularProgress } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { subscribeToResponse } from './api/api';
import { MCPParsedResult, MCPParsedResultDisplay } from './lib/Types';
import Theme from './lib/Theme';
import {
  StyledTextField,
  StyledButton,
  StyledSwitch,
  CreateGameMainContainer,
  CreateGameBackground,
  StyledSubtitleText,
} from './lib/StyledComponents';
import './App.css';

function HomePage() {
  const [promptText, setPromptText] = useState('');
  const [rightonSwitch, setRightonSwitch] = useState(true);
  const [cziSwitch, setCziSwitch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [responseId, setResponseId] = useState('');
  const subscriptionRef = useRef<any>(null);
  

  const parseResponse = (result: string) => {
    try {
      // Try parsing as structured JSON first
      const parsed = JSON.parse(result);
      
      if (parsed.toolCalls && parsed.learningOutcomes && parsed.students && parsed.discussionQuestions) {
        // New structured format
        const toolNames = parsed.toolCalls.map((tc: any) => tc.name);
        const rightonTools = toolNames.filter((name: string) => name !== 'getLearningScienceDatabyCCSS');
        const learningCommonsTools = toolNames.filter((name: string) => name === 'getLearningScienceDatabyCCSS');
        
        return {
          rightonTools,
          learningCommonsTools,
          learningOutcomes: parsed.learningOutcomes,
          students: parsed.students, // Array of {name, performance, justification}
          discussionQuestions: parsed.discussionQuestions, // Array of {studentName, question}
          toolCalls: parsed.toolCalls
        };
      }
    } catch (e) {
      // Fall through to old parsing logic
    }
    
    // Fallback to old regex-based parsing
    const toolRegex = /\[Calling tool (\w+) with args \{[^}]*}]/g;
    const toolMatches = result.match(toolRegex) || [];
    const toolNames = toolMatches.map((match: string) => {
      const nameMatch = match.match(/\[Calling tool (\w+)/);
      return nameMatch ? nameMatch[1] : '';
    }).filter(Boolean);
    
    const rightonTools = toolNames.filter(name => name !== 'getLearningScienceDatabyCCSS');
    const learningCommonsTools = toolNames.filter(name => name === 'getLearningScienceDatabyCCSS');
    
    const cleanedText = result.replace(/\[Calling tool \w+ with args \{[^}]*}]/g, '').trim();
    
    let learningOutcomesText = '';
    let studentsText = '';
    let discussionText = '';
    
    const learningOutcomesMatch = cleanedText.match(/###\s*(?:Recent Game Review|Overview of Recent Game Sessions|Evidence of Struggles|Insights from Learning Science Data)([\s\S]*?)(?=###\s*(?:Emblematic Students|Student Analysis)|###\s*Discussion Questions|$)/i);
    const studentsMatch = cleanedText.match(/###\s*(?:Emblematic Students|Student Analysis)([\s\S]*?)(?=###\s*Discussion Questions|$)/i);
    const discussionMatch = cleanedText.match(/###\s*Discussion Questions([\s\S]*?)$/i);
    
    if (learningOutcomesMatch) {
      learningOutcomesText = learningOutcomesMatch[1].trim();
    } else {
      const oldMatch = cleanedText.match(/key challenges in your classroom related to:([\s\S]*?)(?=\*\*Two Students|\*\*Discussion|$)/i);
      learningOutcomesText = oldMatch ? oldMatch[1].trim() : '';
    }
    
    if (studentsMatch) {
      studentsText = studentsMatch[1].trim();
    } else {
      const oldMatch = cleanedText.match(/\*\*Two Students:\*\*([\s\S]*?)(?=\*\*Discussion Questions|$)/i);
      studentsText = oldMatch ? oldMatch[1].trim() : '';
    }
    
    if (discussionMatch) {
      discussionText = discussionMatch[1].trim();
    } else {
      const oldMatch = cleanedText.match(/\*\*Discussion Questions:\*\*([\s\S]*?)(?=These discussions|$)/i);
      discussionText = oldMatch ? oldMatch[1].trim() : '';
    }
    
    const conclusionMatch = cleanedText.match(/(These discussions[\s\S]*)/);
    
    return {
      rightonTools,
      learningCommonsTools,
      learningOutcomes: learningOutcomesText,
      students: studentsText,
      discussion: discussionText,
      conclusion: conclusionMatch ? conclusionMatch[1].trim() : '',
      fullText: cleanedText
    };
  };

  // Initialize with empty state
  const [outputTexts, setOutputTexts] = useState<string[]>([]);

  const convertToDisplay = (result: MCPParsedResult): MCPParsedResultDisplay => {
    const toolNames = result.toolCalls?.map(tc => tc.name) || [];
    const rightonTools = toolNames.filter(name => name !== 'getLearningScienceDatabyCCSS');
    const learningCommonsTools = toolNames.filter(name => name === 'getLearningScienceDatabyCCSS');
    
    return {
      rightonTools,
      learningCommonsTools,
      learningOutcomes: result.learningOutcomes || '',
      students: result.students || [],
      discussionQuestions: result.discussionQuestions || [],
      toolCalls: result.toolCalls || []
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Cleanup any existing subscription before starting a new one
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    
    const responseId = uuidv4();
    const queryPayload = { 
      query: promptText.trim(), 
      isRightOnEnabled: rightonSwitch,
      isCZIEnabled: cziSwitch,
      responseId,
    };
    const queryString = JSON.stringify(queryPayload);
    
    try {
      // Start up subscription so when MCP host writes response to table, we receive it
      subscriptionRef.current = subscribeToResponse(responseId, (result: MCPParsedResult) => {
        console.log('Received result:', result);
        
        if (result.status === 'complete' && result.learningOutcomes) {
          const displayData = convertToDisplay(result);
          setOutputTexts([JSON.stringify(displayData)]);
          setLoading(false);
        } else if (result.status === 'error') {
          setOutputTexts([`Error: ${result.error || 'Unknown error occurred'}`]);
          setLoading(false);
          // Cleanup subscription after receiving error response
          if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
          }
        }
      });
      
      // Send the query to MCP Host
      await fetch('https://co3csj97wd.execute-api.us-east-1.amazonaws.com/mcp/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: queryString }),
      });
      
    } catch (error) {
      setOutputTexts([`Error: ${error instanceof Error ? error.message : 'Failed to connect'}`]);
      setLoading(false);
      
      // Cleanup subscription on error
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    }
  };

  return (
    <CreateGameMainContainer>
      <CreateGameBackground />
      <Container sx={{ 
        zIndex: 1, 
        height: '100%',
        overflowY: 'auto',
        paddingTop: '48px',
        paddingRight: '24px',
        paddingBottom: '200px',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '48px' }}>
        <Box sx={{ 
          width: '100%', 
          textAlign: 'center',
          padding: '0px',
        }}>
          <Typography sx={{ 
            fontFamily: 'Poppins',
            fontWeight: '800',
            fontSize: '36px',
            color: (theme) => theme.palette.primary.darkBlue,
            letterSpacing: '0.5px',
            marginBottom: '16px',
          }}>
            RightOn! + Learning Commons
          </Typography>
          <Typography sx={{ 
            fontFamily: 'Rubik',
            fontWeight: '400',
            fontSize: '20px',
            color: (theme) => theme.palette.primary.darkBlue,
            opacity: 0.7,
            letterSpacing: '0.3px',
          }}>
            MCP Integration Demo
          </Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
          <Typography sx={{ 
            fontFamily: 'Poppins',
            fontWeight: '700',
            fontSize: '20px',
            color: (theme) => theme.palette.primary.darkBlue,
            marginBottom: '4px',
          }}>
            Input
          </Typography>
          <Paper
            sx={{
              width: '100%',
              minWidth: '600px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '24px',
              padding: '32px',
              boxSizing: 'border-box',
              borderRadius: '12px',
              boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
            }}
            elevation={4}
          >
        
            <StyledTextField
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: (theme) => theme.palette.primary.lightGrey,
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: (theme) => theme.palette.primary.blue,
                    borderWidth: '2px',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: (theme) => theme.palette.primary.blue,
                    borderWidth: '2px',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  paddingBottom: 1,
                  fontFamily: 'Rubik',
                  fontSize: '15px',
                },
              }}
              multiline
              rows={4}
              placeholder="Enter your prompt here..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            >
              <Typography>{promptText}</Typography>
            </StyledTextField>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography style={{ fontWeight: 700 }}>MCP Servers</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography style={{ fontWeight: 400 }}>
                      RightOn!
                    </Typography>
                    <StyledSwitch
                      checked={rightonSwitch}
                      onChange={(e) => setRightonSwitch(e.target.checked)}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography style={{ fontWeight: 400 }}>
                      Learning Commons
                    </Typography>
                    <StyledSwitch
                      checked={cziSwitch}
                      onChange={(e) => setCziSwitch(e.target.checked)}
                    />
                  </Box>
                </Box>
              </Box>
              <StyledButton 
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !promptText.trim()}
              >
                {loading ? 'Processing...' : 'Submit'}
              </StyledButton>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
          <StyledSubtitleText sx={{ width: '100%', textAlign: 'left' }}>
            Output
          </StyledSubtitleText>
          {loading && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                padding: '48px 0',
              }}
            >
              <Typography sx={{ 
                fontFamily: 'Poppins',
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: 700,
                textAlign: 'center',
                color: (theme) => theme.palette.primary.darkBlue,
              }}>
                Processing Query...
              </Typography>
              <CircularProgress size="40px" sx={{ color: (theme) => theme.palette.primary.darkBlue }} />
            </Box>
          )}
          {!loading && outputTexts.length === 0 && (
            <Paper
              sx={{
                width: '100%',
                minWidth: '600px',
                padding: '48px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
              }}
              elevation={4}
            >
              <Typography sx={{ 
                fontFamily: 'Rubik',
                fontSize: '16px',
                color: (theme) => theme.palette.primary.darkBlue,
                opacity: 0.6,
                textAlign: 'center',
              }}>
                Submit a query to see results
              </Typography>
            </Paper>
          )}
          {!loading && outputTexts.length > 0 && outputTexts.map((text) => {
            let parsed;
            try {
              parsed = JSON.parse(text);
            } catch {
              return (
                <Paper
                  key={text.substring(0, 50) || 'empty'}
                  sx={{
                    width: '100%',
                    minWidth: '600px',
                    padding: '24px',
                    boxSizing: 'border-box',
                    borderRadius: '8px',
                  }}
                  elevation={4}
                >
                  <Typography sx={{ whiteSpace: 'pre-wrap', textAlign: 'left', width: '100%' }}>
                    {text}
                  </Typography>
                </Paper>
              );
            }

            const formatText = (txt: string) => txt
              .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br />');

            return (
              <Box key={text.substring(0, 50)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* MCP Collaboration Header */}
                <Paper 
                  sx={{ 
                    width: '100%', 
                    padding: '24px', 
                    borderRadius: '8px',
                    background: (theme) => theme.palette.primary.darkBlueCardColor,
                    boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
                    boxSizing: 'border-box',
                  }} 
                  elevation={4}
                >
                  <Typography 
                    sx={{ 
                      fontFamily: 'Poppins',
                      fontWeight: '700',
                      fontSize: '20px',
                      color: '#FFFFFF',
                      marginBottom: '16px'
                    }}
                  >
                    MCP System Collaboration
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Rubik',
                      fontWeight: '400',
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '20px',
                      lineHeight: '20px'
                    }}
                  >
                    The LLM orchestrated both MCP servers in a single reasoning loop. Each tool was called to gather specific data that was then synthesized into the comprehensive analysis below.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {parsed.rightonTools && parsed.rightonTools.length > 0 && (
                      <Box 
                        sx={{ 
                          flex: 1, 
                          minWidth: '280px',
                          padding: '20px',
                          background: '#FFFFFF',
                          borderRadius: '8px',
                          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                          boxSizing: 'border-box',
                        }}
                      >
                        <Typography sx={{ color: (theme) => theme.palette.primary.darkBlue, fontWeight: 700, fontSize: '18px', marginBottom: '8px', fontFamily: 'Poppins' }}>
                          RightOn! MCP
                        </Typography>
                        <Typography sx={{ color: (theme) => theme.palette.primary.darkBlue, fontSize: '13px', marginBottom: '16px', fontFamily: 'Rubik', opacity: 0.7 }}>
                          Student performance & game data
                        </Typography>
                        <Box component="ul" sx={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {parsed.rightonTools.map((tool: string) => (
                            <Typography 
                              component="li"
                              key={`rt-${tool}-${Math.random()}`} 
                              sx={{ 
                                color: (theme) => theme.palette.primary.darkBlue,
                                fontSize: '14px', 
                                fontFamily: 'Rubik',
                                fontWeight: '400',
                                lineHeight: '20px',
                              }}
                            >
                              {tool}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}
                    {parsed.learningCommonsTools && parsed.learningCommonsTools.length > 0 && (
                      <Box 
                        sx={{ 
                          flex: 1, 
                          minWidth: '280px',
                          padding: '20px',
                          background: (theme) => theme.palette.primary.altHighlightGradient,
                          borderRadius: '8px',
                          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                          boxSizing: 'border-box',
                        }}
                      >
                        <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '18px', marginBottom: '8px', fontFamily: 'Poppins' }}>
                          Learning Commons MCP
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', marginBottom: '16px', fontFamily: 'Rubik' }}>
                          Educational standards alignment
                        </Typography>
                        <Box component="ul" sx={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {parsed.learningCommonsTools.map((tool: string) => (
                            <Typography 
                              component="li"
                              key={`lc-${tool}-${Math.random()}`} 
                              sx={{ 
                                color: '#FFFFFF',
                                fontSize: '14px', 
                                fontFamily: 'Rubik',
                                fontWeight: '400',
                                lineHeight: '20px',
                              }}
                            >
                              {tool}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Paper>

                {/* Learning Outcomes */}
                {parsed.learningOutcomes && (
                  <Paper 
                    sx={{ 
                      width: '100%', 
                      padding: '24px', 
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
                      boxSizing: 'border-box',
                    }} 
                    elevation={3}
                  >
                    <Typography 
                      sx={{ 
                        fontFamily: 'Poppins',
                        fontWeight: '700',
                        fontSize: '18px',
                        color: (theme) => theme.palette.primary.darkBlue,
                        marginBottom: '16px'
                      }}
                    >
                      Classroom Performance Analysis
                    </Typography>
                    <Typography 
                      component="div"
                      sx={{ 
                        fontFamily: 'Rubik',
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: (theme) => theme.palette.primary.darkBlue,
                        '& strong': { fontWeight: 700 },
                        '& br + br': { display: 'block', content: '""', marginTop: '12px' }
                      }}
                      dangerouslySetInnerHTML={{ __html: formatText(parsed.learningOutcomes) }}
                    />
                  </Paper>
                )}

                {/* Student Analysis */}
                {parsed.students && (() => {
                  // Check if students is an array (new format) or string (old format)
                  const isStructured = Array.isArray(parsed.students);
                  let studentSections;
                  
                  if (isStructured) {
                    studentSections = parsed.students;
                  } else {
                    // Parse individual students from the text - support both old and new formats
                    studentSections = (parsed.students as string).split(/(?=\d+\.\s+\*\*Student)|(?=\d+\.\s+\*\*Student Who)/).filter((s: string) => s.trim());
                  }
                  
                  return (
                    <Paper 
                      sx={{ 
                        width: '100%', 
                        padding: '24px', 
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
                        boxSizing: 'border-box',
                      }} 
                      elevation={3}
                    >
                      <Typography 
                        sx={{ 
                          fontFamily: 'Poppins',
                          fontWeight: '700',
                          fontSize: '18px',
                          color: (theme) => theme.palette.primary.darkBlue,
                          marginBottom: '20px'
                        }}
                      >
                        Student Performance Analysis
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {studentSections.map((student: any) => {
                          let isExcelling: boolean;
                          let displayContent: string;
                          let studentKey: string;
                          
                          if (isStructured) {
                            // New structured format
                            isExcelling = student.performance === 'excelling';
                            displayContent = `**${student.name}**: ${student.justification}`;
                            studentKey = student.name;
                          } else {
                            // Old text format
                            if (!student.trim()) return null;
                            isExcelling = student.includes('Excels') || 
                                        student.includes('not struggling') || 
                                        student.includes('Successfully') ||
                                        student.includes('correctly');
                            displayContent = student.trim();
                            studentKey = student.substring(0, 30);
                          }
                          
                          return (
                          <Box 
                            key={`student-${studentKey}`}
                            sx={{
                              padding: '16px',
                              background: isExcelling
                                ? 'rgba(34, 174, 72, 0.15)'
                                : 'rgba(223, 167, 180, 0.3)',
                              borderRadius: '6px',
                            }}
                          >
                            <Typography 
                              component="div"
                              sx={{ 
                                fontFamily: 'Rubik',
                                fontSize: '15px',
                                lineHeight: '24px',
                                color: (theme) => theme.palette.primary.darkBlue,
                                '& strong': { fontWeight: 700, color: (theme) => theme.palette.primary.darkBlue }
                              }}
                              dangerouslySetInnerHTML={{ __html: formatText(displayContent) }}
                            />
                          </Box>
                          );
                        }).filter(Boolean)}
                      </Box>
                    </Paper>
                  );
                })()}

                {/* Discussion Questions */}
                {(parsed.discussionQuestions || parsed.discussion) && (() => {
                  // Check if using new structured format or old text format
                  const isStructured = Array.isArray(parsed.discussionQuestions);
                  let questions;
                  
                  if (isStructured) {
                    questions = parsed.discussionQuestions;
                  } else {
                    // Parse individual questions from text
                    questions = (parsed.discussion as string).split(/(?=-\s+For\s+\*\*)/).filter((q: string) => q.trim());
                  }
                  
                  return (
                    <Paper 
                      sx={{ 
                        width: '100%', 
                        padding: '24px', 
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
                        boxSizing: 'border-box',
                      }} 
                      elevation={3}
                    >
                      <Typography 
                        sx={{ 
                          fontFamily: 'Poppins',
                          fontWeight: '700',
                          fontSize: '18px',
                          color: (theme) => theme.palette.primary.darkBlue,
                          marginBottom: '20px'
                        }}
                      >
                        Recommended Discussion Questions
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {questions.map((question: any) => {
                          let displayContent: string;
                          let questionKey: string;
                          
                          if (isStructured) {
                            // New structured format: {studentName, question}
                            displayContent = `**For ${question.studentName}**: ${question.question}`;
                            questionKey = question.studentName;
                          } else {
                            // Old text format
                            displayContent = question.trim();
                            questionKey = question.substring(0, 40);
                          }
                          
                          return (
                          <Box 
                            key={`question-${questionKey}`}
                            sx={{
                              padding: '16px',
                              background: (theme) => theme.palette.primary.lightGrey,
                              borderRadius: '6px',
                            }}
                          >
                            <Typography 
                              component="div"
                              sx={{ 
                                fontFamily: 'Rubik',
                                fontSize: '15px',
                                lineHeight: '24px',
                                color: (theme) => theme.palette.primary.darkBlue,
                                '& strong': { fontWeight: 700 }
                              }}
                              dangerouslySetInnerHTML={{ __html: formatText(displayContent) }}
                            />
                          </Box>
                          );
                        })}
                      </Box>
                    </Paper>
                  );
                })()}

                {/* Conclusion */}
                {parsed.conclusion && (
                  <Paper 
                    sx={{ 
                      width: '100%', 
                      padding: '24px', 
                      borderRadius: '8px',
                      background: (theme) => theme.palette.primary.lightGrey,
                      boxShadow: 'none',
                      marginBottom: '24px',
                      boxSizing: 'border-box',
                    }} 
                    elevation={0}
                  >
                    <Typography 
                      component="div"
                      sx={{ 
                        fontFamily: 'Rubik',
                        fontSize: '15px',
                        lineHeight: '24px',
                        fontStyle: 'italic',
                        color: (theme) => theme.palette.primary.darkBlue,
                        opacity: 0.85,
                        '& strong': { fontWeight: 700 }
                      }}
                      dangerouslySetInnerHTML={{ __html: formatText(parsed.conclusion) }}
                    />
                  </Paper>
                )}
              </Box>
            );
          })}
        </Box>
        </Box>
      </Container>
    </CreateGameMainContainer>
  );
}
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<HomePage />} />
    ),
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
