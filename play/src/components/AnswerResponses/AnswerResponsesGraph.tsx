import React from 'react';
import { useTheme } from '@mui/material/styles';
import { VictoryChart, VictoryContainer, VictoryPie } from 'victory';
import { IHostTeamAnswersResponse, ITeam, isNullOrUndefined } from '@righton/networking';
import CustomLabel from './CustomLabel';

interface AnswerResponsesGraphProps {
  responses: IHostTeamAnswersResponse[];
  currentTeam: ITeam;
}

export default function AnswerResponsesGraph({
  responses,
  currentTeam
}: AnswerResponsesGraphProps) {
  console.log(responses);
  const theme = useTheme();
  const totalAnswers = responses.reduce((acc, response) => acc + response.count, 0) ?? 0;
  const assignColor = (response: IHostTeamAnswersResponse) => {
    console.log(currentTeam);
    console.log(response);
    if (response.isCorrect)
      return '#8DCD53';
    if (response.teams.find((team) => team === currentTeam.name)){
      return '#19BCFB';
    }
    if (response.multiChoiceCharacter === '–')
      return '#EAE5F5';
    return '#3400A8';
  };
  const data = responses.reduce<{ letterCode: string; count: string; fill: string }[]>((acc, response, index) => {
    if (response.count !== 0) {
      acc.push({
        letterCode: response.multiChoiceCharacter !== '–' ? response.multiChoiceCharacter : ' ',
        count: `${(response.count / totalAnswers) * 100}%`,
        fill: assignColor(response)
      });
    }
    return acc;
  }, []);
  console.log(data);
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