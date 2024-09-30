import React from 'react';
import { useTheme } from '@mui/material/styles';
import { VictoryChart, VictoryContainer, VictoryPie } from 'victory';
import { IHostTeamAnswersResponse, ITeam, isNullOrUndefined } from '@righton/networking';
import CustomLabel from './CustomLabel';

interface AnswerphaseOneResponsesGraphProps {
  phaseOneResponses: IHostTeamAnswersResponse[];
  phaseTwoResponses: IHostTeamAnswersResponse[];
  currentTeam: ITeam;
}

export default function AnswerphaseOneResponsesGraph({
  phaseOneResponses,
  phaseTwoResponses,
  currentTeam
}: AnswerphaseOneResponsesGraphProps) {
  const theme = useTheme();
  const totalAnswers = phaseOneResponses.reduce((acc, response) => acc + response.count, 0) ?? 0;
  const assignColor = (response: IHostTeamAnswersResponse | null) => {
    if (response){
      if (response.isCorrect)
        return '#6F9E3C';
      if (response.teams.find((team) => team === currentTeam.name)){
        return '#19BCFB';
      }
      if (response.multiChoiceCharacter === '–')
        return '#EAE5F5';
    }
    return '#3400A8';
  };
  const data = phaseOneResponses.reduce<{ letterCode: string; count: string; fill: string }[]>((acc, response, index) => {
    if (response.count !== 0) {
      acc.push({
        letterCode: response.multiChoiceCharacter !== '–' ? response.multiChoiceCharacter : ' ',
        count: `${Math.floor((response.count / totalAnswers) * 100)}%`,
        fill: assignColor(phaseTwoResponses.find((res) => res.rawAnswer === response.rawAnswer) ?? null)
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
      sortOrder="descending"
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