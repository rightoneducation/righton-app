import React, { useState } from 'react';
import {
  Grid,
  Collapse,
  Select,
  Box,
  CircularProgress,
  useTheme,
  MenuItem,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createExplanation,
  regenerateWrongAnswerExplanation,
  saveDiscardedExplanation,
  compareEditedExplanation,
  evalTextComplexity,
  refineComplexity,
} from '../lib/API';
import { ExpandArrowContainer } from '../lib/styledcomponents/generator/StyledExplanationCardComponents';
import {
  CardHeaderTextStyled,
  ExplanationTextStyled,
  SavedTextStyled,
  EditStatusTextStyled,
} from '../lib/styledcomponents/generator/StyledTypography';
import { EditExplanationStyledTextField } from '../lib/styledcomponents/generator/StyledTextField';
import SelectArrow from '../img/SelectArrow.svg';
import {
  ButtonStyled,
  ButtonWrongAnswerStyled,
} from '../lib/styledcomponents/generator/StyledButtons';
import { ExplanationCardStyled } from '../lib/styledcomponents/generator/StyledCards';
import { SingleExplanationCardContainer } from '../lib/styledcomponents/generator/StyledContainers';
import { ExplanationRegenType } from '../lib/Constants';
import {
  IExplanationToSave,
  IDiscardedExplanationToSave,
  IDiscardedExplanationSaveInput,
} from '../lib/Models';
import RegenOptions from './regen/RegenOptions';

interface ExplanationCardProps {
  index: number;
  explanation: IExplanationToSave;
  handleUpdateExplanations: (
    explanation: IExplanationToSave,
    index: number,
  ) => void;
}

interface DiscardOptions {
  incorrectMath: boolean;
  toneClarity: boolean;
  other: {
    isEnabled: boolean;
    text: string;
  };
}

enum DiscardOptionsEnum {
  incorrectMath = 0,
  toneClarity = 1,
  other = 2,
}

export default function ExplanationCard({
  index,
  explanation,
  handleUpdateExplanations,
}: ExplanationCardProps) {
  const theme = useTheme();
  const buttonStyle = {
    margin: '5px',
  };
  const [isPromptEnabled, setIsPromptEnabled] = useState<boolean>(false);
  const [isRegenEnabled, setIsRegenEnabled] = useState<boolean>(false);
  const [regenPromptText, setRegenPromptText] = useState<string | null>(null);
  const [discardPromptText, setDiscardPromptText] = useState<string>('');
  const [discardOptions, setDiscardOptions] = useState<DiscardOptions>({
    incorrectMath: false,
    toneClarity: false,
    other: { isEnabled: false, text: '' },
  });
  const [regenType, setRegenType] = useState<ExplanationRegenType>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isDiscarded, setIsDiscarded] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [refinedExplanation, setRefinedExplanation] = useState<string>('');
  const [refinedComplexity, setRefinedComplexity] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState<boolean>(false);
  const [isAdjustComplexityExpanded, setIsAdjustComplexityExpanded] =
    useState<boolean>(false);

  const complexityMap = [
    'Slightly Complex',
    'Moderately Complex',
    'Very Complex',
    'Exceedingly Complex',
  ];
  const [selectedComplexity, setSelectedComplexity] = useState<string>(
    complexityMap[0],
  );

  const [isDebug, setIsDebug] = useState<boolean>(false);

  // editMode flips the explanation into a Textfield, so that a user can edit its contents
  const [isEditMode, setIsEditMode] = useState(false);
  // local state to store edited explanation
  const [editableExplanation, setEditableExplanation] = useState(
    explanation.genExplanation.editedExplanation
      ? explanation.genExplanation.editedExplanation
      : '',
  );
  
  const firstLineText =
    editableExplanation.length > 0
      ? editableExplanation.split('.')[0]
      : explanation.genExplanation.explanation.split('.')[0];
  const remainingText =
    editableExplanation.length > 0
      ? editableExplanation.split('.').slice(1).join('.')
      : explanation.genExplanation.explanation.split('.').slice(1).join('.');

  // answer: string; selectedExplanation: string; dismissedExplanations: string[]
  const handleUpdateExplanation = (
    index: number,
    action: ExplanationRegenType,
    explanation: IExplanationToSave,
    discardedExplanation?: IDiscardedExplanationToSave,
  ) => {
    const explanationCopy = { ...explanation };
    switch (action) {
      case ExplanationRegenType.ACCEPT_EDITED:
        compareEditedExplanation(
          explanation.genExplanation.explanation,
          editableExplanation,
        )
          .then((response: any) => {
            explanationCopy.genExplanation.editedExplanation =
              editableExplanation;
            explanationCopy.genExplanation.editReason = response.content;
          })
          .then(() => {
            handleUpdateExplanations(explanationCopy, index);
          });
        break;
      case ExplanationRegenType.REGEN:
        setIsRegenerating(true);
        regenerateWrongAnswerExplanation(explanationCopy).then(
          (response: any) => {
            explanationCopy.genExplanation.explanation = response.content;
            handleUpdateExplanations(explanationCopy, index);
            setIsRegenerating(false);
          },
        );
        if (discardedExplanation) {
          const discardedExplanationInput: IDiscardedExplanationSaveInput = {
            question: discardedExplanation.question,
            explanation: discardedExplanation.explanation,
            discardText: discardedExplanation.discardText,
            version: discardedExplanation.version,
          };
          if (discardedExplanation.reason)
            discardedExplanationInput.reason = JSON.stringify(
              discardedExplanation.reason,
            );

          saveDiscardedExplanation(discardedExplanationInput);
        }
        setIsRegenEnabled(false);
        break;
      case ExplanationRegenType.ACCEPT:
        createExplanation(explanationCopy);
        const savedExplanations = JSON.parse(
          localStorage.getItem('righton_saved_explanations') || '[]',
        );
        const explanationToSave = {
          question: explanationCopy.question,
          correctAnswer: explanationCopy.correctAnswer,
          wrongAnswer: explanationCopy.wrongAnswer,
          genExplanation: explanationCopy.genExplanation,
          discardedExplanations: explanationCopy.discardedExplanations,
          version: explanationCopy.version,
          date: new Date().toISOString(),
        };
        savedExplanations.push(explanationToSave);
        localStorage.setItem(
          'righton_saved_explanations',
          JSON.stringify(savedExplanations),
        );
        setIsSaved(true);
        break;
    }
    setIsEditMode(false);
    setRegenType(action);
    setIsPromptEnabled(false);
    setIsRegenEnabled(false);
    setRegenPromptText(null);
    setDiscardPromptText('');
  };

  const handleEditModeClick = () => {
    setEditableExplanation(
      editableExplanation.length > 0
        ? editableExplanation
        : explanation.genExplanation.explanation,
    );
    setIsEditMode(true);
  };

  const handleAnalyzeClick = () => {
    setIsAnalyzing(true);
    evalTextComplexity(explanation.genExplanation.explanation).then((response: any) => {
      setAnalysisResult(response);
      setSelectedComplexity(response.answer);
      setIsAnalyzing(false);
    });
  };

  const handleDebugClick = () => {
    setIsDebug(true);
  };

  const handleDebugCloseClick = () => {
    setIsDebug(false);
  };

  const handleRefineClick = () => {
    setIsRefining(true);
    const reasoning = JSON.parse(analysisResult).reasoning; 
    refineComplexity(explanation.genExplanation.explanation, selectedComplexity, reasoning).then((response: any) => {
      const responseObj = JSON.parse(response);
      console.log(responseObj);
      setRefinedExplanation(responseObj.refinedText);
      setRefinedComplexity(responseObj.newComplexity);
      setIsRefining(false);
    });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isDebug ? (
          <motion.div
            key="debug"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <SingleExplanationCardContainer
              style={{
                position: 'relative',
                width: '100%',
              }}
              sx={{
                gap:
                  editableExplanation.length > 0 &&
                  !isEditMode &&
                  !isRegenEnabled
                    ? `${theme.sizing.smPadding}px`
                    : `${theme.sizing.mdPadding}px`,
              }}
            >
              <Box
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  paddingRight: '12px',
                }}
              >
                <CardHeaderTextStyled>
                  {' '}
                  Debug Mode{' '}
                </CardHeaderTextStyled>
                <ExplanationTextStyled>
                  {explanation.genExplanation.explanation}
                </ExplanationTextStyled>
                <ButtonWrongAnswerStyled
                  onClick={handleDebugCloseClick}
                  style={{
                    fontWeight: 400,
                    width: 'fit-content',
                  }}
                >
                  Back to Explanation
                </ButtonWrongAnswerStyled>
              </Box>
            </SingleExplanationCardContainer>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <SingleExplanationCardContainer
              style={{
                position: 'relative',
                width: '100%',
              }}
              sx={{
                gap:
                  editableExplanation.length > 0 &&
                  !isEditMode &&
                  !isRegenEnabled
                    ? `${theme.sizing.smPadding}px`
                    : `${theme.sizing.mdPadding}px`,
              }}
            >
              {isSaved && (
                <Box
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 1,
                    zIndex: 5,
                  }}
                >
                  <SavedTextStyled> Saved! </SavedTextStyled>
                </Box>
              )}

              <ExplanationCardStyled key={index} isSaved={isSaved}>
                {isRegenerating || isRefining && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: -16,
                      left: -16,
                      width: 'calc(100% + 32px)',
                      height: 'calc(100% + 32px)',
                      opacity: 0.5,
                      zIndex: 15,
                      background: '#fff',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 0,
                    }}
                  >
                    <CircularProgress style={{ color: '#000' }} />
                  </Box>
                )}
                {isDiscarded ? (
                  <Box
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <CardHeaderTextStyled>
                      {' '}
                      Thanks for your feedback!{' '}
                    </CardHeaderTextStyled>
                  </Box>
                ) : (
                  <>
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <CardHeaderTextStyled>
                      Explanation for Wrong Answer #{index + 1}
                      </CardHeaderTextStyled>
                    </Box>
                    {!isEditMode ? (
                      <>
                        { refinedExplanation ?
                          <Box style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                            <CardHeaderTextStyled>
                              Refined Explanation:
                            </CardHeaderTextStyled>
                            <ExplanationTextStyled>
                              {refinedExplanation}
                            </ExplanationTextStyled>
                            <Box style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                              <CardHeaderTextStyled>
                                New Complexity:
                              </CardHeaderTextStyled>
                              <CardHeaderTextStyled style={{color: refinedComplexity === selectedComplexity ? 'green' : 'red'}}>
                                {refinedComplexity}
                              </CardHeaderTextStyled>
                            </Box>
                          </Box>
                        :
                        <>
                        <ExplanationTextStyled>
                          {firstLineText}
                        </ExplanationTextStyled>
                        <ExplanationTextStyled>
                            {remainingText}
                          </ExplanationTextStyled>
                        </>
                        }
                      </>
                    ) : (
                      <>
                        <EditExplanationStyledTextField
                          value={editableExplanation}
                          onChange={(e) =>
                            setEditableExplanation(e.target.value)
                          }
                          multiline={true}
                          maxRows={5}
                        />
                      </>
                    )}
                  </>
                )}
              </ExplanationCardStyled>
              {isRegenEnabled ? (
                <RegenOptions
                  index={index}
                  explanation={explanation}
                  handleUpdateExplanation={handleUpdateExplanation}
                />
              ) : (
                !isSaved && (
                  <>
                    {editableExplanation.length > 0 && !isEditMode && (
                      <EditStatusTextStyled>
                        Your edits have been updated.
                      </EditStatusTextStyled>
                    )}
                    {/* CZI Implementation */}
                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        border: '1px solid #000',
                        borderRadius: '8px',
                        padding: '12px',
                        position: 'relative',
                        paddingTop: '20px',
                      }}
                    >
                      <Box
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          left: '12px',
                          padding: '0 6px',
                          backgroundColor: `rgba(249, 245, 242, 1)`,
                        }}
                      >
                        <CardHeaderTextStyled
                          style={{ fontSize: '12px', fontWeight: 500 }}
                        >
                          Analyze Text Complexity - Powered by Evaluators
                        </CardHeaderTextStyled>
                      </Box>
                      <Box
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingLeft: '12px',
                          paddingRight: '12px',
                        }}
                      >
                        {analysisResult ? (
                          <Box
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px',
                            }}
                          >
                            <Box
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <CardHeaderTextStyled>
                                Current: {JSON.parse(analysisResult).answer}
                              </CardHeaderTextStyled>
                              <ExpandArrowContainer
                                isAnalysisExpanded={isAnalysisExpanded}
                                onClick={() =>
                                  setIsAnalysisExpanded(!isAnalysisExpanded)
                                }
                              >
                                <img
                                  src={SelectArrow}
                                  alt="Select Arrow"
                                  style={{ cursor: 'pointer' }}
                                />
                              </ExpandArrowContainer>
                            </Box>
                            <Collapse in={isAnalysisExpanded} timeout={1000}>
                              <CardHeaderTextStyled style={{ fontWeight: 400 }}>
                                {JSON.parse(analysisResult).reasoning}
                              </CardHeaderTextStyled>
                            </Collapse>
                            <Box
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                              }}
                            >
                              <Box
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <CardHeaderTextStyled>
                                  Refine Complexity
                                </CardHeaderTextStyled>
                                <ExpandArrowContainer
                                  isAnalysisExpanded={
                                    isAdjustComplexityExpanded
                                  }
                                  onClick={() =>
                                    setIsAdjustComplexityExpanded(
                                      !isAdjustComplexityExpanded,
                                    )
                                  }
                                >
                                  <img
                                    src={SelectArrow}
                                    alt="Select Arrow"
                                    style={{ cursor: 'pointer' }}
                                  />
                                </ExpandArrowContainer>
                              </Box>
                              <Collapse
                                in={isAdjustComplexityExpanded}
                                timeout={1000}
                              >
                                <Box
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                  }}
                                >
                                  <Box
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      gap: '12px',
                                    }}
                                  >
                                    <CardHeaderTextStyled
                                      style={{ fontWeight: 400 }}
                                    >
                                      Target:
                                    </CardHeaderTextStyled>
                                    <Select
                                      value={selectedComplexity}
                                      onChange={(e) =>
                                        setSelectedComplexity(e.target.value)
                                      }
                                      style={{
                                        borderRadius: '8px',
                                        height: '38px',
                                        minWidth: '200px',
                                      }}
                                      sx={{
                                        border: 'none',
                                        outline: 'none',
                                        boxShadow: 'none',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          border: '1px solid #BDBDBD',
                                        },
                                        '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                                          { border: '1px solid #BDBDBD' },
                                        '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                                          { border: '1px solid #BDBDBD' },
                                        '& .MuiInput-underline:before': {
                                          borderBottom: '1px solid #BDBDBD',
                                        },
                                        '& .MuiInput-underline:after': {
                                          borderBottom: '1px solid #BDBDBD',
                                        },
                                        '& .MuiFilledInput-underline:before': {
                                          borderBottom: '1px solid #BDBDBD',
                                        },
                                        '& .MuiFilledInput-underline:after': {
                                          borderBottom: '1px solid #BDBDBD',
                                        },
                                      }}
                                      MenuProps={{
                                        PaperProps: {
                                          sx: {
                                            border: 'none',
                                            boxShadow: 'none',
                                          },
                                        },
                                      }}
                                    >
                                      {complexityMap
                                        .filter(
                                          (complexity) =>
                                            complexity !==
                                            JSON.parse(analysisResult).answer,
                                        )
                                        .map((complexity) => (
                                          <MenuItem value={complexity}>
                                            {complexity}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  </Box>
                                  <Box
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      paddingRight: '12px',
                                    }}
                                  >
                                    <ButtonStyled
                                      onClick={handleRefineClick}
                                      style={{
                                        fontWeight: 400,
                                        width: '100px',
                                        paddingLeft: '12px',
                                      }}
                                    >
                                      Refine
                                    </ButtonStyled>
                                  </Box>
                                </Box>
                              </Collapse>
                            </Box>
                          </Box>
                        ) : (
                          <>
                            {isAnalyzing ? (
                              <Box
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width: '100%',
                                  height: '100%',
                                }}
                              >
                                <CircularProgress
                                  style={{
                                    color: '#000',
                                    height: '30px',
                                    width: '30px',
                                  }}
                                />
                              </Box>
                            ) : (
                              <ButtonStyled
                                onClick={handleAnalyzeClick}
                                style={{ fontWeight: 400, width: '200px' }}
                              >
                                Analyze
                              </ButtonStyled>
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <Grid container spacing="8px">
                        {!isEditMode ? (
                          <>
                            <Grid
                              item
                              xs={4}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}
                            >
                              <ButtonWrongAnswerStyled
                                onClick={handleEditModeClick}
                                style={{ fontWeight: 400 }}
                              >
                                Edit
                              </ButtonWrongAnswerStyled>
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}
                            >
                              <ButtonWrongAnswerStyled
                                disabled={isRegenEnabled}
                                onClick={() => setIsRegenEnabled(true)}
                                style={{ fontWeight: 400 }}
                              >
                                Regenerate
                              </ButtonWrongAnswerStyled>
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}
                            >
                              <ButtonStyled
                                onClick={() =>
                                  handleUpdateExplanation(
                                    index,
                                    ExplanationRegenType.ACCEPT,
                                    explanation,
                                  )
                                }
                                style={{ fontWeight: 400 }}
                              >
                                Save
                              </ButtonStyled>
                            </Grid>
                          </>
                        ) : (
                          <Grid
                            item
                            xs={12}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            <ButtonStyled
                              onClick={() =>
                                handleUpdateExplanation(
                                  index,
                                  ExplanationRegenType.ACCEPT_EDITED,
                                  explanation,
                                )
                              }
                            >
                              Update
                            </ButtonStyled>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </>
                )
              )}
            </SingleExplanationCardContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
