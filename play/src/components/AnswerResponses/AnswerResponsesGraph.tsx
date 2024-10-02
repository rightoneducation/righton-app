import React from 'react';
import { useTheme } from '@mui/material/styles';
import { VictoryChart, VictoryContainer, VictoryPie } from 'victory';
import { IHostTeamAnswers, IHostTeamAnswersResponse, ITeam, isNullOrUndefined } from '@righton/networking';
import CustomLabel from './CustomLabel';

interface AnswerPhaseOneResponsesGraphProps {
  phaseOneResponses: IHostTeamAnswersResponse[];
  phaseTwoResponses: IHostTeamAnswersResponse[];
  otherResponses: IHostTeamAnswersResponse[];
  currentTeam: ITeam;
  isShortAnswerEnabled: boolean;
}

export default function AnswerphaseOneResponsesGraph({
  phaseOneResponses,
  phaseTwoResponses,
  otherResponses,
  currentTeam,
  isShortAnswerEnabled
}: AnswerPhaseOneResponsesGraphProps) {
  console.log(phaseTwoResponses);
  const theme = useTheme();
  const possibleCharacters = ['A', 'B', 'C', 'D'];
  const currentCharacters = phaseTwoResponses.map((response) => response.multiChoiceCharacter);
  const missingCharacter = possibleCharacters.find((char) => !currentCharacters.includes(char));
  const otherResponsesTrimmed = otherResponses.filter((response) => !response.isCorrect);
  const totalAnswers = phaseOneResponses.reduce((acc, response) => acc + response.count, 0) ?? 0;
  const assignColor = (p1response: IHostTeamAnswersResponse, response: IHostTeamAnswersResponse | null) => {
    if (p1response){
      if (p1response.isCorrect)
        return '#6F9E3C';
      if(response){
        if (response.teams.find((team) => team === currentTeam.name)){
          return '#19BCFB';
        }
        if (response.multiChoiceCharacter === '–')
          return '#EAE5F5';
      }
    }
    return '#3400A8';
  };
  const assignLetterCode = (response: IHostTeamAnswersResponse, phase2Responses: IHostTeamAnswersResponse[]) => {
    if (response.isCorrect && isShortAnswerEnabled)
      return missingCharacter ?? '';
    return phaseTwoResponses?.find((response2) => response.rawAnswer === response2.rawAnswer)?.multiChoiceCharacter ?? '';
  }
  const adjustedResponses = isShortAnswerEnabled ? [...phaseOneResponses.filter((response) => response.isSelectedMistake || response.isCorrect), ...otherResponsesTrimmed] : phaseOneResponses;
  
  const data = adjustedResponses.reduce<{ letterCode: string; count: string; fill: string }[]>((acc, response, index) => {
    if (response.count !== 0) {
      acc.push({
        letterCode: assignLetterCode(response, phaseTwoResponses),
        count: `${Math.floor((response.count / totalAnswers) * 100)}%`,
        fill: (!isShortAnswerEnabled || (response.isSelectedMistake || response.isCorrect)) ? assignColor(response, phaseTwoResponses.find((res) => res.rawAnswer === response.rawAnswer) ?? null) : "#B5B5B5"
      });
    }
    return acc;
  }, []);
  return (
  
     <VictoryPie
      data={data}
      x="letterCode"
      y="count"
      labels={({ datum }) => `${datum.count}`}
      height={400}
      width={400}
      innerRadius={120}
      cornerRadius={4}
      padAngle={1}
      sortKey={(datum) => datum.letterCode}
      sortOrder="ascending"
      style={{
        data: {
          fill: ({ datum }) => datum.fill,
        },
        labels: {
          fontSize: 18, fill: "#384466"
        }
      }}
      labelComponent={
        <CustomLabel />
      }
      />
    
  )
}