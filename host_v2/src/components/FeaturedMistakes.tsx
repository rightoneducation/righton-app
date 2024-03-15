import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { 
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  withStyles
} from '@mui/material';
import MistakeSelector from "./MistakeSelector";
import HostDefaultCardStyled from '../lib/styledcomponents/HostDefaultCardStyled';

interface ShortAnswerResponse {
  rawAnswer: string;
  count: number;
  isCorrect: boolean;
  isSelectedMistake?: boolean;
}

interface FeaturedMistakesProps {
  // numPlayers: number;
  shortAnswerResponses: ShortAnswerResponse[];
  totalAnswers: number;
  onSelectMistake: (answer: string, isSelected: boolean) => void;
}

interface Mistake {
  answer: string;
  percent: number;
  isSelected: boolean;
}

const BackgroundStyled = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
  padding: `16px`,
  backgroundColor: 'rgba(0,0,0,0)', 
  gap:16,
  border: '2px solid #333'
});

const TitleStyled = styled(Typography)({
  color: '#FFFFFF',
  fontFamily: 'Poppins',
  textAlign: 'left',
  fontSize: '24px',
  fontWeight: 700,
  width: '100%', 
  border: '2px solid #333'
});

const SubtitleStyled = styled(Typography)({
  color: '#FFFFFF',
  fontFamily: 'Rubik',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 400,
  border: '2px solid #333'
});

const RadioLabelStyled = styled(FormControlLabel)({
  color: '#FFFFFF',
  '& .MuiTypography-root': {
    color: '#FFFFFF',
  },
  border: '2px solid #333'
});

const RadioButtonStyled = styled(FormControlLabel)({
  color: 'rgba(255, 255, 255, 0.60)',
  '&.Mui-checked': {
    color: '#2196F3',
  },
});



export default function FeaturedMistakes({
  shortAnswerResponses,
  totalAnswers,
  onSelectMistake,
}: FeaturedMistakesProps) {
  // const classes = useStyles();
  const title = "Featured Mistakes";
  const subtitle = "Selected responses will be presented to players as options for popular incorrect answers.";
  const radioButtonText1 = "Use the top 3 answers by popularity";
  const radioButtonText2 = "Manually pick the options";
  const numOfPopularMistakes = 3;
  const [isPopularMode, setIsPopularMode] = useState<boolean>(true);
  const [sortedMistakes, setSortedMistakes] = useState<Mistake[]>([]);

  const resetMistakesToPopular = () => {
    const resetMistakes = sortedMistakes.map((mistake, index) => {
      if (index < numOfPopularMistakes) {
        onSelectMistake(mistake.answer, true);
        return { ...mistake, isSelected: true };
      }
      return { ...mistake, isSelected: false };
    });
    setSortedMistakes(resetMistakes);
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === 'A') {
      resetMistakesToPopular();
      setIsPopularMode(true);
    } else {
      setIsPopularMode(false);
    }
  };

  const handleSelectMistake = (index: number) => {
    onSelectMistake(sortedMistakes[index].answer, false);
    setSortedMistakes(prev => {
      const newMistakes = [...prev];
      newMistakes[index].isSelected = !newMistakes[index].isSelected;
      return newMistakes;
    });
  };

  // TODO: Review use of useEffect implementation.

  useEffect(() => {
    // const sortedMistake = sortMistakes(shortAnswerResponses, totalAnswers);
    console.log("Useffect shortanswer responses")
    console.log(shortAnswerResponses)
    const extractedMistakes: Mistake[] = shortAnswerResponses
      .filter(shortAnswerResponse => !shortAnswerResponse.isCorrect)
      .map(shortAnswerResponse => ({ 
        answer: shortAnswerResponse.rawAnswer, 
        percent: Math.round((shortAnswerResponse.count / totalAnswers) * 100), 
        isSelected: shortAnswerResponse.isSelectedMistake ?? false
      }));
    console.log("useeffect has run");
    // const orderedMistakes = extractedMistakes.sort((a, b) => b.percent - a.percent);
    // if (isPopularMode) {
    //   orderedMistakes.slice(0, numOfPopularMistakes).forEach(mistake => {
    //     // eslint-disable-next-line no-param-reassign
    //     mistake.isSelected = true;
    //     onSelectMistake(mistake.answer, true);
    //   });
    // }
    setSortedMistakes(extractedMistakes);
    console.log("extracted below")
    console.log(extractedMistakes);
    console.log("total below")
    console.log(totalAnswers)
  }, [shortAnswerResponses, totalAnswers]); // eslint-disable-line react-hooks/exhaustive-deps
  console.log("Shortanswerresponnses")
  console.log(shortAnswerResponses)
  return(
    <HostDefaultCardStyled elevation={10}>
      <BackgroundStyled elevation={0}>
        <TitleStyled>{title}</TitleStyled>
        <SubtitleStyled>{subtitle}</SubtitleStyled>
        <RadioGroup defaultValue="A" onChange={handleModeChange}>
          <RadioLabelStyled 
            value="A" 
            control={<Radio />} 
            label={radioButtonText1} 
          />
          <RadioLabelStyled 
            value="B" 
            control={<Radio />} 
            label={radioButtonText2} 
          />
        </RadioGroup>
        {sortedMistakes.length > 0 
          ? <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: "8px", width: '100%', border: '2px solid #333'}}>
              {sortedMistakes.map((mistake, index) => (
                <MistakeSelector 
                  key={mistake.answer} 
                  mistakeText={mistake.answer} 
                  mistakePercent={mistake.percent} 
                  isPopularMode={isPopularMode} 
                  isSelected={mistake.isSelected} 
                  mistakeIndex={index}
                  handleSelectMistake={handleSelectMistake} 
                  // style={{width:'100%'}}  
                />
              ))}
            </Box>
          : <Box sx={{width: '100%'}}>
              <SubtitleStyled style={{fontStyle: 'italic', textAlign: 'center'}}>
                Student responses will appear here
              </SubtitleStyled>
            </Box>
        }
      </BackgroundStyled>
    </HostDefaultCardStyled>
  );
}
