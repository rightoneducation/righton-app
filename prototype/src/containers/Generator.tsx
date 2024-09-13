import React, {useEffect, useMemo} from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Switch, Radio } from '@mui/material';
import { generateWrongAnswerExplanations, regenerateWrongAnswerExplanation, createQuestion, saveDiscardedExplanation, getDiscardedExplanations } from '../lib/API';
import { IDiscardedExplanationToSave, IQuestionToSave, IRegenInput } from '../lib/Models';
import ShortAnswerTextFieldStyled from '../lib/ShortAnswerTextFieldStyled';
import ButtonSubmitQuestion from '../components/ButtonSubmitQuestion';
import ButtonSaveQuestion from '../components/ButtonSaveQuestion';
import { version, date, model, ExplanationRegenType } from '../lib/Constants';
import ExplanationCard from '../components/ExplanationCard';
import RightonLogo from '../img/RightonLogo.svg';
import OpenAI from '../img/OpenAI.svg';

export default function Generator() {
  const [formData, setFormData] = React.useState({
    question: '',
    correctAnswer: '',
    wrongAnswer1: '',
    wrongAnswer2: '',
    wrongAnswer3: '',
  });
  const [isFormComplete, setIsFormComplete] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState(false);
  const [isQuestionGenerating, setIsQuestionGenerating] = React.useState(false);
  const [isQuestionRegenerating, setIsQuestionRegenerating] = React.useState(false);
  const [isQuestionSaved, setIsQuestionSaved] = React.useState(false);
  const [isCustomQuestion, setIsCustomQuestion] = React.useState(true);
  const [selectedSampleQuestion, setSelectedSampleQuestion] = React.useState(0);
  const blankQuestion = {
    question: '',
    correctAnswer: '',
    wrongAnswers: [
      {
        answer: '',
        selectedExplanation: '',
        dismissedExplanations: [],
      },
      {
        answer: '',
        selectedExplanation: '',
        dismissedExplanations: [],
      },
      {
        answer: '',
        selectedExplanation: '',
        dismissedExplanations: [],
      }
    ],
    discardedExplanations: [],
    version
  }
  //const [wrongAnswerExplanations, setWrongAnswerExplanations] = React.useState<string[]>([]);
  const [questionToSave, setQuestionToSave] = React.useState<IQuestionToSave>(blankQuestion);
  const [discardedExplanations, setDiscardedExplanations] = React.useState<IDiscardedExplanationToSave[]>([]);
  
  const wrongAnswerExplanations = [
    'This is the wrong answer explanation for wrong answer 1',
    'This is the wrong answer explanation for wrong answer 2',
    'This is the wrong answer explanation for wrong answer 3',
  ];
  const [selectedCards, setSelectedCards] = React.useState(new Array(wrongAnswerExplanations.length).fill(false));

  const inputs = [
    { label: 'Question', name: 'question' },
    { label: 'Correct Answer', name: 'correctAnswer' },
    { label: 'Wrong Answer 1', name: 'wrongAnswer1' },
    { label: 'Wrong Answer 2', name: 'wrongAnswer2' },
    { label: 'Wrong Answer 3', name: 'wrongAnswer3' },
  ];

  const sampleQuestions = [
    {
      question: "A pair of shoes were 10% off last week. This week, there’s an additional sale, and you can get an extra 40% off the already discounted price from last week. What is the total percentage discount that you’d get if you buy the shoes this week?",
      correctAnswer: "46%", 
      incorrectAnswer1: "50%",
      incorrectAnswer2: "54%",
      incorrectAnswer3: "14%"
    },
    {
      question: "A child is raising a flag up a 20-foot flag pole. She starts pulling at a rate of 2 feet per second for 5 seconds, but she starts to get tired and decreases her rate to 1/2 foot per second for the remainder of the time. In total, how many seconds does it take her to raise the flag from the bottom to the top?",
      correctAnswer: "25", 
      incorrectAnswer1: "10",
      incorrectAnswer2: "20",
      incorrectAnswer3: "13.75"
    },
    {
      question: "If f(x) = x^2 + 2x + 3, what is the value of f(x), when x = 6?",
      correctAnswer: "51", 
      incorrectAnswer1: "27",
      incorrectAnswer2: "41",
      incorrectAnswer3: "65"
    }
  ]

  useEffect(() => {
    const formComplete = Object.values(formData).every(val => val.trim() !== '');
    setIsFormComplete(formComplete);
  }, [formData]);

  useEffect(()=>{
    const selected = selectedCards.some((isSelected) => isSelected);
    setIsSelected(selected);
  }, [selectedCards])

  useEffect(() => {
    const fetchDiscardedExplanations = async () => {
      const explanations = await getDiscardedExplanations(10);
      setDiscardedExplanations(explanations);
    };
  
    fetchDiscardedExplanations();
  }, []);

  const labelText = ['Question', 'Correct Answer', 'Wrong Answer 1', 'Wrong Answer 2', 'Wrong Answer 3'];
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsQuestionSaved(false);
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuestion = () => {
    setIsQuestionGenerating(true);
    if (!isCustomQuestion){
      formData.question = sampleQuestions[selectedSampleQuestion].question;
      formData.correctAnswer = sampleQuestions[selectedSampleQuestion].correctAnswer;
      formData.wrongAnswer1 = sampleQuestions[selectedSampleQuestion].incorrectAnswer1;
      formData.wrongAnswer2 = sampleQuestions[selectedSampleQuestion].incorrectAnswer2;
      formData.wrongAnswer3 = sampleQuestions[selectedSampleQuestion].incorrectAnswer3;
    }
    console.log(formData);
    generateWrongAnswerExplanations(formData, discardedExplanations).then((response) => {
      console.log(response);
      const explanations = JSON.parse(response?.content ?? '{}');
      const explanationsArray = explanations.map((obj:any) => Object.values(obj)[0]);
      const wrongAnswersArray =  explanationsArray.map((explanation: string, index: number) => {
        const adjustedIndex = index + 1;
        const answerKey = `wrongAnswer${adjustedIndex}` as keyof typeof formData;
        return (
          {
            answer: formData[answerKey],
            selectedExplanation: explanation,
            dismissedExplanations: [],
          }
        )
      });

      setQuestionToSave((prev) => ({
        ...prev,
        question: formData.question,
        correctAnswer: formData.correctAnswer,
        wrongAnswers: wrongAnswersArray,
        discardedExplanations: [],
        version
      }));
      setIsQuestionGenerating(false);
      setIsSubmitted(true);
    });
  };

  const handleSaveQuestion = () => {
    console.log('Question to save:', questionToSave);
    createQuestion(questionToSave).then((response) => {
      console.log(response);
      setQuestionToSave(blankQuestion);
      setFormData({
        question: '',
        correctAnswer: '',
        wrongAnswer1: '',
        wrongAnswer2: '',
        wrongAnswer3: '',
      });
      setIsSubmitted(false);
      setIsSelected(false);
      setIsQuestionSaved(true);
    });
  };

  const handleExplanationClick = (input: IRegenInput) => {
    // Toggle the selected state for the clicked card
    setSelectedCards((current) =>
      current.map((isSelected, idx) => (input.index === idx ? !isSelected : isSelected))
    );
    const fullInput = {
      ...input,
      discardedExplanations
    }
    switch (input.action){
      case (ExplanationRegenType.ACCEPT):
        console.log("accepted");
        break;
      case (ExplanationRegenType.DISCARD):
        setIsQuestionRegenerating(true);
        if (input){
          regenerateWrongAnswerExplanation(fullInput).then((response: any) => {
            const newExplanation = response.content;
            const oldExplanation = questionToSave.wrongAnswers[input.index ?? 0].selectedExplanation;
            setQuestionToSave((prev) => {
              const updatedWrongAnswers = [...prev.wrongAnswers];
              updatedWrongAnswers[input.index ?? 0].selectedExplanation = newExplanation;
              return {
                ...prev,
                wrongAnswers: updatedWrongAnswers,
              };
            })
            setSelectedCards((current) =>
              current.map((isSelected, idx) => (input.index === idx ? !isSelected : isSelected))
            );
            setIsQuestionRegenerating(false);
          }
        );
      }
      break;
    }
  };

  const saveDiscardExplanation = (question: string, discardedExplanation: string) => {
    const discardedQuestionInput: IDiscardedExplanationToSave = {
      question,
      explanation: discardedExplanation,
      discardText: "Math is incorrect",
      version
    }
    console.log(discardedQuestionInput);
    const result = saveDiscardedExplanation(discardedQuestionInput);
    console.log(result);
  }
  const premadeQuestion = [
    <>
          <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'start', paddingTop: '10px'}}>
            <Typography style={{ fontFamily: 'Poppins', maxHeight: '250px', fontWeight: '200', textAlign: 'left', fontSize: '15px', lineHeight: '30px', overflowY: 'scroll'}}>
              {sampleQuestions[0].question}
            </Typography>
            <Box style={{display: 'flex', alignItems: 'space-between', justifyContent: 'space-between', width: '280px'}}>
              <Typography style={{ fontFamily: 'Poppins', maxHeight: '193px', fontWeight: '400', textAlign: 'left', fontSize: '15px', lineHeight: '30px', overflowY: 'scroll'}}>
                Correct Answer: 
              </Typography>
              <Typography style={{ fontFamily: 'Poppins', maxHeight: '193px', fontWeight: '200', textAlign: 'left', fontSize: '15px', lineHeight: '30px', overflowY: 'scroll'}}>
                {sampleQuestions[0].correctAnswer}
              </Typography>
            </Box>
            <Box style={{display: 'flex', alignItems: 'space-between', justifyContent: 'space-between', width: '280px'}}>
              <Typography style={{ fontFamily: 'Poppins', maxHeight: '193px', fontWeight: '400', textAlign: 'left', fontSize: '15px', lineHeight: '30px', overflowY: 'scroll'}}>
                Incorrect Answer 1: 
              </Typography>
              <Typography style={{ fontFamily: 'Poppins', maxHeight: '193px', fontWeight: '200', textAlign: 'left', fontSize: '15px', lineHeight: '30px', overflowY: 'scroll'}}>
                {sampleQuestions[0].incorrectAnswer1}
              </Typography>
            </Box>
            <Box style={{display: 'flex',alignItems: 'space-between', justifyContent: 'space-between', width: '280px'}}>
              <Typography style={{ fontFamily: 'Poppins', maxHeight: '193px', fontWeight: '400', textAlign: 'left', fontSize: '15px', lineHeight: '30px', overflowY: 'scroll'}}>
                Incorrect Answer 2:  
              </Typography>
              <Typography style={{ fontFamily: 'Poppins', maxHeight: '193px', fontWeight: '200', textAlign: 'left', fontSize: '15px', lineHeight: '30px', overflowY: 'scroll'}}>
                {sampleQuestions[0].incorrectAnswer2}
              </Typography>
            </Box>
            <Box style={{display: 'flex', alignItems: 'space-between', justifyContent: 'space-between', width: '280px'}}>
              <Typography style={{ fontFamily: 'Poppins', maxHeight: '193px', fontWeight: '400', textAlign: 'left', fontSize: '15px', lineHeight: '30px', overflowY: 'scroll'}}>
                Incorrect Answer 3: 
              </Typography>
              <Typography style={{ fontFamily: 'Poppins', maxHeight: '193px', fontWeight: '200', textAlign: 'left', fontSize: '15px', lineHeight: '30px', overflowY: 'scroll'}}>
                {sampleQuestions[0].incorrectAnswer3}
              </Typography>
            </Box>
          </Box>
      <ButtonSubmitQuestion 
        isSubmitted={isSubmitted}
        isFormComplete={true}
        isQuestionGenerating={isQuestionGenerating}
        handleSubmitQuestion={handleSubmitQuestion}
      /> 
    </>
  ];
  const customQuestion = [
    <>
      {inputs.map((input, index) => {
          return (
            <React.Fragment key={input.name}>
            <Typography style={{ fontFamily: 'Poppins',  fontWeight: '600', textAlign: 'left', fontSize: '15px', lineHeight: '30px'}}>
              {labelText[index]}
              </Typography>
              <ShortAnswerTextFieldStyled
                fullWidth
                variant="filled"
                autoComplete="off"
                multiline
                minRows={2}
                maxRows={2}
                placeholder={`Enter ${input.label} here...`}
                onChange={handleInputChange}
                value={formData[input.name as keyof typeof formData]}
                name={input.name}
                disabled={isSubmitted}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    paddingTop: '9px',
                  },
                }}
              />
          </React.Fragment>
          )}
          )
        }
        <ButtonSubmitQuestion 
          isSubmitted={isSubmitted}
          isFormComplete={isFormComplete}
          isQuestionGenerating={isQuestionGenerating}
          handleSubmitQuestion={handleSubmitQuestion}
        /> 
    </>
  ]

  return (
    <div className="App" style={{height: '100vh', width: '100vw', background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

      <Box style={{position: 'absolute', top: '30px', left: '50%', transform: 'translate(-50%)'}}>
        <Typography style={{ fontFamily: 'Montserrat', fontSize: '40px', lineHeight: '40px', color: 'white'}} >
          AI-Generated
        </Typography>
        <Typography style={{ fontFamily: 'Montserrat', fontSize: '40px', lineHeight: '40px', color: 'white'}} >
          Wrong Answer Explanations
        </Typography>
      </Box>
      <Box style={{position: 'absolute', top: '10px', right: '10px'}}>
          <Typography style={{  fontFamily: 'Montserrat',  fontSize: '12px', color: 'white', textAlign: 'right'}} >
          Version {version}
          </Typography>
          <Typography style={{  fontFamily: 'Montserrat',  fontSize: '12px', color: 'white', textAlign: 'right'}} >
          Last updated: {date}
        </Typography>
        <Typography style={{   fontFamily: 'Montserrat', fontSize: '12px', color: 'white', textAlign: 'right'}} >
          Model: {model}
        </Typography>
      </Box>
   
      <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  height: '70vh'}}>
        <Grid container spacing={2} style={{ zIndex: 2, height: '100%', padding: '20px'}}>
          <Grid item xs={6} style={{display: 'flex', justifyContent:'flex-start', alignItems: 'flex-start', height: '70vh'}}>
            <Card style={{ width: '300px', borderRadius: '20px', padding: '20px'}}>
              <Box style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography style={{ fontFamily: 'Poppins',  fontWeight: '600', fontSize: '15px', color: 'black'}} >
                  {isCustomQuestion ? 'Create Your Own Question' : 'Sample Question'}
                </Typography>
              <Switch defaultChecked onChange={() => setIsCustomQuestion(!isCustomQuestion)}/>
              </Box>
              {isCustomQuestion ? customQuestion : premadeQuestion}  
            </Card>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', justifyContent:'flex-start', alignItems: 'center', height: '70vh', paddingLeft: '32px'}}>
            <Box style={{
                maxHeight: '70vh',
                overflow: 'scroll', 
                display: 'flex', 
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                flexDirection: 'column',
                gap: 20,  
                scrollbarWidth: 'none', 
              }}>
              { questionToSave.wrongAnswers.length > 0 && questionToSave.wrongAnswers.map((explanation, index) => {
                return (
                  <ExplanationCard
                    index={index}
                    questionToSave={questionToSave}
                    isSubmitted={isSubmitted}
                    explanation={explanation}
                    selectedCards={selectedCards}
                    setQuestionToSave={setQuestionToSave}
                    handleExplanationClick={handleExplanationClick}
                    saveDiscardExplanation={saveDiscardExplanation}
                    isQuestionSaved={isQuestionSaved}
                  />
                )
              })}
            </Box>
            <ButtonSaveQuestion
              isSubmitted={false}
              isQuestionRegenerating={isQuestionRegenerating}
              handleSaveQuestion={handleSaveQuestion}
            /> 
            {isQuestionSaved &&
              <Typography style={{  fontFamily: 'Poppins',  fontWeight: '600', fontSize: '14px', color: 'white', marginTop: '20px'}} >
              Question Saved!
            </Typography>
            }
          </Grid>
        </Grid>
        <img src={OpenAI} style={{position: 'absolute', bottom: 20, left: '50%', transform: 'translate(-50%)', maxHeight: '32px'}}/>
        <img src={RightonLogo} style={{position: 'absolute', right: 30, bottom: 30, transform: 'rotate(-10deg)', zIndex: 0}}/>
      </Box>
    </div>
  );
}